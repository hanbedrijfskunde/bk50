# Stage 1: Gebruik een Nginx image als basis
FROM nginx:alpine

# Verwijder de standaard Nginx welkomstpagina
RUN rm /usr/share/nginx/html/*

# Kopieer je eigen index.html naar de Nginx web-directory
COPY ./index.html /usr/share/nginx/html/

# Expose poort 80 (de standaard HTTP poort)
EXPOSE 80

# Commando om Nginx te starten wanneer de container opstart
CMD ["nginx", "-g", "daemon off;"]
