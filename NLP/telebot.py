import logging
import os
import pymongo
import pytesseract
import requests

from telegram.ext import Updater, CommandHandler, MessageHandler, Filters


from dotenv import load_dotenv
load_dotenv()

# Set the URL of the server you want to send the request to
url = "http://localhost:9000/api/news/addnews"


# Enable logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)

logger = logging.getLogger(__name__)


# Define a function to process the user input
def process_input(update, context):
    # Get the user input
    input_text = update.message.text
    input_type = update.message.document.mime_type if update.message.document is not None else 'text/plain'
    username = update.message.from_user.username

    print(input_type)

    # Convert the input to English if it is a text or image
    if input_type == 'text/plain':
        processed_text = input_text
    elif input_type == 'image/jpeg':
        # Use the Google Cloud Vision API to extract the text from the image
        print("images")
         # Download the image file
        image_file = update.message.document.get_file()
        image_file.download('image.jpg')

        # Extract the text from the image using Tesseract
        text = pytesseract.image_to_string('image.jpg')

        processed_text = text
    else:
        processed_text = 'Unsupported input type.'

    # Set the body information
    data = {'info': processed_text, 'username': username}

    # Set the headers
    headers = {"Content-Type": "application/json"}

    # Send the POST request
    response = requests.post(url, json=data, headers=headers, params={"username": username})

    # Check the status code of the response
    if response.status_code == 200:
        if response.json()['message'] == 'News already exists!':
            update.message.reply_text(response.json()['message'])

            if response.json()['open'] == True:
                update.message.reply_text("**This Thread is Already Open**")
            
            if response.json()['isTrue'] == True:
                update.message.reply_text("This is a \"CORRECT\" news with \nUPVOTES: "+str(response.json()['upvotes'])+"\nDOWNVOTES: "+str(response.json()['downvotes']))
            else:
                update.message.reply_text("This is a \"FAKE\" news with \nUPVOTES: "+str(response.json()['upvotes'])+"\nDOWNVOTES: "+str(response.json()['downvotes']))
        else:  
            update.message.reply_text(response.json()['message'])
        print("Success!")
    else:
        print("Error: " + str(response.status_code))

    # Send a message to the user with the processed text
    # update.message.reply_text("Your message has been processed: \n\"" + processed_text + "\" \nYou will be notified when the results are ready.")




# Define the command handler for the /start command
def start(update, context):
    update.message.reply_text('Hi! Send me a text or image.')

# Handles any errors in the Telegram Bot
def error(update, context):
    logger.warning('Update "%s" caused error "%s"', update, context.error)

# Handles similarity part
def similarity(sentence1, sentence2):
    url = 'http://127.0.0.1:5000//sentence-similarity'
    data = {'sentence1': sentence1, 'sentence2': sentence2}
    response = requests.post(url, json=data)
    return response.json()


# Define the main function
def main():
    # Create the Updater and pass it the bot's token
    updater = Updater(os.environ['TOKEN'], use_context=True)

    # Get the dispatcher to register handlers
    dp = updater.dispatcher

    # Add the command handler for the /start command
    dp.add_handler(CommandHandler('start', start))

    # Add the error handler
    dp.add_error_handler(error)

    # Add the message handler to process user input
    dp.add_handler(MessageHandler(Filters.text | Filters.document, process_input))

    # Start the bot
    updater.start_polling()

    # Run the bot until you press Ctrl-C or the process receives SIGINT, SIGTERM or SIGABRT
    updater.idle()


# Run the main function
if __name__ == '__main__':
    main()

