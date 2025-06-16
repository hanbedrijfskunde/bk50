# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests # Zorg ervoor dat je 'requests' hebt geïnstalleerd: pip install requests

# Initialiseer de Flask app
app = Flask(__name__)

# Sta Cross-Origin Resource Sharing (CORS) toe. 
# Dit is essentieel zodat de HTML-pagina (vanaf een ander domein) 
# kan communiceren met deze API.
CORS(app)

# --- BASEROW CONFIGURATIE ---
# Vervang de placeholder hieronder met je echte Baserow database token.
BASEROW_API_KEY = "mYv2hg8y8yh2oPGnbPCkwWauK38Ycml7" 
BASEROW_TABLE_ID = "575946"

# Stel de API URL samen
BASEROW_API_URL = f"https://api.baserow.io/api/database/rows/table/{BASEROW_TABLE_ID}/?user_field_names=true"

@app.route('/submit_voorkeur', methods=['POST'])
def submit_voorkeur():
    """
    Dit endpoint ontvangt de thema-voorkeuren van een deelnemer,
    valideert de data, en stuurt deze door naar de Baserow database.
    """
    # Haal de JSON-data uit de POST request
    data = request.get_json()

    # Validatie om te checken of alle velden aanwezig zijn
    if not data or 'voornaam' not in data or 'voorkeur1' not in data:
        return jsonify({"status": "error", "message": "Missing data"}), 400

    # Haal de waarden uit de data
    voornaam = data.get('voornaam')
    voorkeur1 = data.get('voorkeur1')
    voorkeur2 = data.get('voorkeur2')
    voorkeur3 = data.get('voorkeur3')

    # Print de ontvangen data naar de console (voor debugging op de server)
    print("--- Nieuwe Voorkeur Ontvangen ---")
    print(f"Voornaam: {voornaam}")
    print(f"Voorkeur 1: {voorkeur1}")
    print(f"Voorkeur 2: {voorkeur2}")
    print(f"Voorkeur 3: {voorkeur3}")
    print("---------------------------------")
    
    # --- Data naar Baserow sturen ---
    headers = {
        "Authorization": f"Token {BASEROW_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Maak de payload met de juiste veldnamen zoals in Baserow
    # Veldnamen zijn: "Voornaam", "Voorkeur 1", "Voorkeur 2", "Voorkeur 3"
    payload = {
        "Voornaam": voornaam,
        "Voorkeur 1": voorkeur1,
        "Voorkeur 2": voorkeur2,
        "Voorkeur 3": voorkeur3
    }

    try:
        response = requests.post(BASEROW_API_URL, headers=headers, json=payload)
        # Controleer of de request naar Baserow succesvol was
        response.raise_for_status() 
    except requests.exceptions.RequestException as e:
        # Vang fouten af (bv. netwerkprobleem, foute API key, etc.)
        print(f"Fout bij het versturen naar Baserow: {e}")
        print(f"Baserow response: {response.text if 'response' in locals() else 'Geen response'}")
        return jsonify({"status": "error", "message": "Kon data niet opslaan in de database."}), 500

    # Stuur een succesbericht terug naar de website
    return jsonify({
        "status": "success",
        "message": f"Voorkeur voor {voornaam} succesvol verwerkt."
    })

if __name__ == '__main__':
    # Start de Flask development server
    # Voor productie op Digital Ocean gebruik je een productieserver zoals Gunicorn.
    # Voorbeeld: gunicorn --bind 0.0.0.0:5000 app:app
    app.run(host='0.0.0.0', port=5000, debug=True)
