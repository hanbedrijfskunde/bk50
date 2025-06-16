### **Handleiding: Van Code naar Docker Hub voor Digital Ocean**

Deze tutorial leidt je door het proces van het containeriseren van je frontend- en backend-applicatie, en het publiceren van de images naar Docker Hub.

#### **Vereisten:**

1. **Docker Desktop geïnstalleerd:** Download en installeer het vanaf de [officiële Docker website](https://www.docker.com/products/docker-desktop/).  
2. **Docker Hub Account:** Maak een gratis account aan op [Docker Hub](https://hub.docker.com/).  
3. **Mappenstructuur:** Zorg dat je project is opgezet zoals hierboven beschreven.

#### **Stap 1: Inloggen bij Docker Hub**

Open je terminal (of PowerShell/CMD op Windows) en log in op je Docker Hub-account. Je wordt gevraagd om je gebruikersnaam en wachtwoord (of een access token).

docker login

#### **Stap 2: De Docker Images Lokaal Bouwen**

Navigeer in je terminal naar de hoofdmap van je project (de map waar docker-compose.yml staat). Gebruik docker-compose om beide images (frontend en backend) te bouwen.

docker-compose build

Dit commando leest de docker-compose.yml, vindt de build instructies voor zowel backend als frontend, en volgt de stappen in de bijbehorende Dockerfiles om de images te creëren.

*Tip: Je kunt docker-compose up draaien om de containers lokaal te starten en te testen. De frontend is dan bereikbaar op http://localhost:8080.*

#### **Stap 3: De Images Taggen voor Docker Hub**

Docker gebruikt een gebruikersnaam/repository:tag naamconventie voor images op Docker Hub. We moeten onze lokaal gebouwde images een nieuwe "tag" (naam) geven die hieraan voldoet.

1. **Vind de lokale image namen:** Draai docker images om een lijst van je lokale images te zien. Je zult iets zien als jouw-project-map\_backend en jouw-project-map\_frontend.  
2. Tag de backend image:  
   Vervang jouw-dockerhub-gebruikersnaam en jouw-project-map\_backend.  
   docker tag jouw-project-map\_backend jouw-dockerhub-gebruikersnaam/bk50-backend:latest

3. Tag de frontend image:  
   Vervang jouw-dockerhub-gebruikersnaam en jouw-project-map\_frontend.  
   docker tag jouw-project-map\_frontend jouw-dockerhub-gebruikersnaam/bk50-frontend:latest

   *De :latest tag is een standaardconventie voor de meest recente versie.*

#### **Stap 4: De Images naar Docker Hub Pushen**

Nu de images de juiste naam hebben, kun je ze naar je Docker Hub-repository pushen.

1. **Push de backend image:**  
   docker push jouw-dockerhub-gebruikersnaam/bk50-backend:latest

2. **Push de frontend image:**  
   docker push jouw-dockerhub-gebruikersnaam/bk50-frontend:latest

Als dit is voltooid, kun je inloggen op de Docker Hub website en zul je twee nieuwe repositories zien: bk50-backend en bk50-frontend.

#### **Stap 5: Verwijzing in Digital Ocean**

Je bent nu klaar om te deployen\! Wanneer je een nieuwe "App" aanmaakt in de Digital Ocean App Platform, kun je als bron (Source) kiezen voor **"Docker Hub"**.

1. Selecteer "Docker Hub" als bron.  
2. Voer de naam van je image in, bijvoorbeeld: jouw-dockerhub-gebruikersnaam/bk50-backend.  
3. Digital Ocean zal de :latest tag automatisch vinden.  
4. Configureer de poorten (bv. poort 5000 voor de backend) en eventuele omgevingsvariabelen (zoals je BASEROW\_API\_KEY).  
5. Herhaal dit proces voor de frontend-service met de bk50-frontend image.

Digital Ocean haalt nu jouw gepushte images op van Docker Hub en deployt ze als draaiende containers.