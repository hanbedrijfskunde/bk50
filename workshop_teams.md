# Workshop Team Indeling Tool

Een Python programma voor het automatisch indelen van workshop deelnemers in teams op basis van hun voorkeuren.

## Installatie

1. Zorg dat Python 3.8 of hoger is geïnstalleerd
2. Installeer de benodigde packages:
```bash
pip install -r requirements.txt
```

## Gebruik

### 1. Genereer testdata (optioneel)
```bash
# Genereer een CSV met 38 dummy deelnemers
python workshop_teams.py generate 38

# Of met een ander aantal deelnemers
python workshop_teams.py generate 35
```

### 2. Maak teams op basis van voorkeuren
```bash
python workshop_teams.py
```

Het programma verwacht een `voorkeuren.csv` bestand met de volgende structuur:
```csv
voornaam,voorkeur1,voorkeur2,voorkeur3
Jan,Ecosysteem-Architect,Mens-AI Teamleider,Toekomst-Verkenner
Marie,Ethische Navigator,Transformatie-Driver,Ecosysteem-Architect
...
```

## CSV Formaat

De CSV moet de volgende kolommen bevatten:
- `voornaam`: Naam van de deelnemer
- `voorkeur1`: Eerste voorkeur thema
- `voorkeur2`: Tweede voorkeur thema  
- `voorkeur3`: Derde voorkeur thema

### Beschikbare thema's:
1. Ecosysteem-Architect
2. Mens-AI Teamleider
3. Toekomst-Verkenner
4. Ethische Navigator
5. Transformatie-Driver

## Regels voor teamindeling

- Elk thema krijgt minimaal één team
- Teams bestaan uit 4 of 5 personen
- Het programma minimaliseert de gemiddelde voorkeurscore
  - 1e voorkeur = score 1
  - 2e voorkeur = score 2
  - 3e voorkeur = score 3
  - Geen voorkeur = score 10

## Output

Het programma toont:
- Totale en gemiddelde voorkeurscore
- Per thema: aantal teams en teamsamenstelling
- Per deelnemer: welke voorkeur ze hebben gekregen
- Statistieken over de verdeling van voorkeuren

## Troubleshooting

**"Geen oplossing gevonden"**
- Controleer of het aantal deelnemers te verdelen is in teams van 4 of 5
- Zorg dat de voorkeuren niet te geconcentreerd zijn op enkele thema's

**"Bestand niet gevonden"**
- Zorg dat `voorkeuren.csv` in dezelfde map staat als het Python script

## Technische details

Het programma gebruikt Google OR-Tools CP-SAT solver voor constraint programming optimalisatie.