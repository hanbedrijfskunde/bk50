import csv
import random
import pandas as pd
from ortools.sat.python import cp_model

def generate_sample_data(num_participants=38):
    """Genereert een CSV-bestand met dummy-voorkeuren voor testen."""
    themes = [
        "Ecosysteem-Architect",
        "Mens-AI Teamleider",
        "Toekomst-Verkenner",
        "Ethische Navigator",
        "Transformatie-Driver"
    ]
    header = ['voornaam', 'voorkeur1', 'voorkeur2', 'voorkeur3']
    
    file_path = 'voorkeuren.csv'
    with open(file_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        for i in range(1, num_participants + 1):
            voornaam = f"Docent_{i}"
            preferences = random.sample(themes, 3)
            writer.writerow([voornaam] + preferences)
    print(f"Voorbeeldbestand '{file_path}' met {num_participants} deelnemers is aangemaakt.")

def create_teams_from_csv(file_path='voorkeuren.csv'):
    """Leest een CSV, lost het groepsprobleem op en print de resultaten."""
    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"Fout: Bestand '{file_path}' niet gevonden. Zorg dat het bestand in dezelfde map staat.")
        return

    participants = df['voornaam'].tolist()
    num_participants = len(participants)
    print(f"\nAnalyse gestart voor {num_participants} deelnemers met teamgroottes van 4 of 5...")
    
    themes = [
        "Ecosysteem-Architect", "Mens-AI Teamleider", "Toekomst-Verkenner",
        "Ethische Navigator", "Transformatie-Driver"
    ]
    num_themes = len(themes)

    # Maak kostenmatrix op basis van voorkeuren
    cost_matrix = []
    for index, row in df.iterrows():
        costs = [10] * num_themes  # Hoge kosten voor niet-voorkeur
        for i, theme in enumerate(themes):
            if theme == row.get('voorkeur1'):
                costs[i] = 1
            elif theme == row.get('voorkeur2'):
                costs[i] = 2
            elif theme == row.get('voorkeur3'):
                costs[i] = 3
        cost_matrix.append(costs)

    # CP-SAT Model
    model = cp_model.CpModel()
    
    # Beslissingsvariabelen: x[p, t] = 1 als deelnemer p aan thema t wordt toegewezen
    x = {}
    for p in range(num_participants):
        for t in range(num_themes):
            x[p, t] = model.NewBoolVar(f'x_{p}_{t}')

    # Constraint: elke deelnemer wordt aan precies één thema toegewezen
    for p in range(num_participants):
        model.AddExactlyOne(x[p, t] for t in range(num_themes))
    
    # Tel hoeveel deelnemers aan elk thema zijn toegewezen
    theme_counts = []
    for t in range(num_themes):
        count = model.NewIntVar(0, num_participants, f'count_{t}')
        model.Add(count == sum(x[p, t] for p in range(num_participants)))
        theme_counts.append(count)
    
    # Constraint: elk thema moet minimaal 4 deelnemers hebben (minimaal 1 team)
    for t in range(num_themes):
        model.Add(theme_counts[t] >= 4)
    
    # Hulpvariabelen om het aantal teams per thema te berekenen
    # teams_4[t] = aantal teams van 4 voor thema t
    # teams_5[t] = aantal teams van 5 voor thema t
    teams_4 = []
    teams_5 = []
    for t in range(num_themes):
        # Maximum aantal teams per thema (worst case: alle deelnemers in één thema)
        max_teams = num_participants // 4
        
        teams_4_t = model.NewIntVar(0, max_teams, f'teams_4_{t}')
        teams_5_t = model.NewIntVar(0, max_teams, f'teams_5_{t}')
        
        teams_4.append(teams_4_t)
        teams_5.append(teams_5_t)
        
        # Het totaal aantal deelnemers voor thema t moet exact kloppen
        model.Add(theme_counts[t] == 4 * teams_4_t + 5 * teams_5_t)
    
    # Extra constraint: we moeten precies alle deelnemers gebruiken
    model.Add(sum(theme_counts) == num_participants)
    
    # Doelfunctie: minimaliseer totale kosten
    total_cost = sum(cost_matrix[p][t] * x[p, t] 
                    for p in range(num_participants) 
                    for t in range(num_themes))
    model.Minimize(total_cost)
    
    # Los het probleem op
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 30.0  # Maximaal 30 seconden zoeken
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        print("-" * 50)
        print("Optimale groepsindeling gevonden!")
        print(f"Totale voorkeurscore: {solver.ObjectiveValue()} (lager is beter)")
        print(f"Gemiddelde score per deelnemer: {solver.ObjectiveValue() / num_participants:.2f}")
        print("-" * 50)

        # Verzamel toewijzingen per thema
        theme_assignments = {theme: [] for theme in themes}
        participant_preferences = {}
        
        for p in range(num_participants):
            for t in range(num_themes):
                if solver.Value(x[p, t]) == 1:
                    theme = themes[t]
                    theme_assignments[theme].append(participants[p])
                    # Bepaal welke voorkeur dit was
                    pref_rank = "geen voorkeur"
                    if theme == df.iloc[p].get('voorkeur1'):
                        pref_rank = "1e voorkeur"
                    elif theme == df.iloc[p].get('voorkeur2'):
                        pref_rank = "2e voorkeur"
                    elif theme == df.iloc[p].get('voorkeur3'):
                        pref_rank = "3e voorkeur"
                    participant_preferences[participants[p]] = (theme, pref_rank)
        
        # Print resultaten per thema
        for t, theme in enumerate(themes):
            team_members = theme_assignments[theme]
            num_teams_4 = solver.Value(teams_4[t])
            num_teams_5 = solver.Value(teams_5[t])
            
            print(f"\nThema: {theme}")
            print(f"Totaal {len(team_members)} deelnemers in {num_teams_4 + num_teams_5} teams")
            print(f"  - {num_teams_4} teams van 4 personen")
            print(f"  - {num_teams_5} teams van 5 personen")
            
            # Verdeel de deelnemers in teams
            teams = []
            idx = 0
            
            # Maak eerst teams van 5
            for _ in range(num_teams_5):
                teams.append(team_members[idx:idx+5])
                idx += 5
            
            # Dan teams van 4
            for _ in range(num_teams_4):
                teams.append(team_members[idx:idx+4])
                idx += 4
            
            # Print de teams
            for i, team in enumerate(teams):
                print(f"\n  Team {i+1} ({len(team)} leden):")
                for member in sorted(team):
                    _, pref = participant_preferences[member]
                    print(f"    - {member} ({pref})")
        
        # Statistieken
        print("\n" + "=" * 50)
        print("STATISTIEKEN:")
        print(f"Totaal aantal deelnemers: {num_participants}")
        
        pref_counts = {"1e voorkeur": 0, "2e voorkeur": 0, "3e voorkeur": 0, "geen voorkeur": 0}
        for _, (_, pref) in participant_preferences.items():
            pref_counts[pref] += 1
        
        print("\nVerdeling voorkeuren:")
        for pref, count in pref_counts.items():
            percentage = (count / num_participants) * 100
            print(f"  {pref}: {count} deelnemers ({percentage:.1f}%)")
            
    else:
        print("Geen oplossing gevonden binnen de tijdslimiet.")
        print("\nMogelijke oorzaken:")
        print("1. Het aantal deelnemers kan niet verdeeld worden in teams van 4 of 5")
        print("2. De voorkeuren zijn te geconcentreerd op bepaalde thema's")
        print("\nTip: Probeer het aantal deelnemers aan te passen of de voorkeuren te variëren.")

# Hoofdprogramma
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "generate":
        # Genereer testdata
        n = int(sys.argv[2]) if len(sys.argv) > 2 else 38
        generate_sample_data(n)
    else:
        # Probeer teams te maken
        create_teams_from_csv()