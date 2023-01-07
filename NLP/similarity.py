from flask import Flask, request, jsonify
import requests
import os

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

@app.route('/sentence-similarity', methods=['POST'])
def sentence_similarity():
    # Get the first sentence from the request body
    sentence1 = request.json['sentence1']

    # Get the second sentence from the request body
    sentence2 = request.json['sentence2']

    # Set the API endpoint and the API key
    endpoint = "https://api.dandelion.eu/datatxt/sim/v1/"
    api_key = os.environ['SIM']

    # Set the query parameters
    params = {
        "text1": sentence1,
        "text2": sentence2,
        "token": api_key,
    }

    # Send the GET request
    response = requests.get(endpoint, params=params)

    # Check the status code of the response
    if response.status_code == 200:
        # Get the JSON response from the API
        response_json = response.json()

        # Get the similarity score from the response
        similarity_score = response_json['similarity']

        # Check if the similarity score is above a certain threshold
        if similarity_score > 0.8:
            # The sentences are similar
            return jsonify({"result": "similar"})
        else:
            # The sentences are not similar
            return jsonify({"result": "not similar"})
    else:
        # There was an error calling the API
        return jsonify({"error": "API error"})


if __name__ == '__main__':
    app.run()
