import logging
import os
import pymongo

from google.cloud import translate
from google.cloud import vision
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters

# Enable logging
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)

logger = logging.getLogger(__name__)

# Set the Google Cloud credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '/path/to/credentials.json'

# Create a client for the Google Cloud Translation API
translate_client = translate.Client()

# Create a client for the Google Cloud Vision API
vision_client = vision.ImageAnnotatorClient()


# Define a function to process the user input
def process_input(update, context):
    # Get the user input
    input_text = update.message.text
    input_type = update.message.document.mime_type
    username = update.message.from_user.username

    # Convert the input to English if it is a text or image
    if input_type == 'text/plain':
        # Use the Google Translate API to translate the text to English
        result = translate_client.translate(input_text, target_language='en')
        translated_text = result['translatedText']
        processed_text = translated_text
    elif input_type == 'image/jpeg':
        # Use the Google Cloud Vision API to extract the text from the image
        image = vision.types.Image()
        image.source.image_uri = update.message.document.get_file().file_path
        response = vision_client.document_text_detection(image=image)
        text = response.full_text_annotation.text
        # Use the Google Translate API to translate the text to English
        result = translate_client.translate(text, target_language='en')
        translated_text = result['translatedText']
        processed_text = translated_text
    else:
        processed_text = 'Unsupported input type.'

    # Store the processed text in MONGODB

    # Create a client for the MongoDB database
    client = pymongo.MongoClient('mongodblink')
    # Get the database
    db = client['telegram']
    # Get the collection
    collection = db['News']
    # Create a document
    document = {'info': processed_text, 'username': username}
    # Insert the document into the collection
    collection.insert_one(document)

    # Send a message to the user with the processed text
    update.message.reply_text("Your message has been processed: " + processed_text + "You will be notified when the results are ready.")


# Define the command handler for the /start command
def start(update, context):
    update.message.reply_text('Hi! Send me a text or image.')


# Define the main function
def main():
    # Create the Updater and pass it the bot's token
    updater = Updater('YOUR_BOT_TOKEN', use_context=True)

    # Get the dispatcher to register handlers
    dp = updater.dispatcher

    # Add the command handler for the /start command
    dp.add_handler(CommandHandler('start', start))

    # Add the message handler to process user input
    dp.add_handler(MessageHandler(Filters.text | Filters.document, process_input))

    # Start the bot
    updater.start_polling()

    # Run the bot until you press Ctrl-C or the process receives SIGINT, SIGTERM or SIGABRT
    updater.idle()


# Run the main function
if __name__ == '__main__':
    main()

