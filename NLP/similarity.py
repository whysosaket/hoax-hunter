import spacy
from flask import Flask, request

app = Flask(__name__)

# Load the SpaCy model
nlp = spacy.load('en_core_web_md')

@app.route('/sentences', methods=['POST'])
def compare_sentences():
    # Get the two sentences from the request form data
    sentence1 = request.form['sentence1']
    sentence2 = request.form['sentence2']

    # Tokenize the sentences and calculate their similarity
    doc1 = nlp(sentence1)
    doc2 = nlp(sentence2)
    similarity = doc1.similarity(doc2)

    # Return "true" if the similarity is above the threshold, "false" otherwise
    if similarity > 0.5:
        return 'true'
    else:
        return 'false'

if __name__ == '__main__':
    app.run()
