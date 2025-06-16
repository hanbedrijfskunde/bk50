# --- Dockerfile ---
# Dit is het Dockerfile voor de backend
# Gebruik een officiële Python runtime als basisimage
FROM python:3.9-slim

# Stel de werkdirectory in de container in
WORKDIR /app

# Kopieer het bestand met dependencies naar de werkdirectory
COPY requirements.txt .

# Installeer de benodigde packages
RUN pip install --no-cache-dir -r requirements.txt

# Kopieer de rest van de applicatiecode naar de werkdirectory
COPY . .

# Expose poort 5000, waarop de Flask app draait
EXPOSE 5000

# Definieer de omgevingsvariabele voor de Flask app
ENV FLASK_APP=app.py

# Commando om de applicatie te starten met Gunicorn (een productie-webserver voor Python)
# Gunicorn wordt automatisch geïnstalleerd als dependency van Flask in nieuwere versies.
# Mocht dat niet zo zijn, voeg 'gunicorn' toe aan requirements.txt
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]