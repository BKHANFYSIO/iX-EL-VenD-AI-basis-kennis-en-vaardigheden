# AI Prompts voor Content Generatie 🤖

*Collectie van beproefde prompts voor efficiënte e-learning content ontwikkeling*

## 🎯 Basis Content Prompts

### Hoofdstuk Structuur Generator
```
Rol: Ervaren instructional designer gespecialiseerd in e-learning voor [DOELGROEP]

Taak: Ontwikkel een gedetailleerde structuur voor hoofdstuk [X] over [ONDERWERP] voor [DOELGROEP]. 

Vereisten:
- 8-12 minuten leestijd
- 3-4 concrete leerdoelen
- Minimaal 2 interactieve elementen
- Praktische voorbeelden uit [VAKGEBIED]
- JSON content blocks structure
- Human-in-the-lead principe

Output:
1. Kernboodschap (1 zin)
2. Leerdoelen lijst
3. Content sectie breakdown
4. Suggesties voor interacties
5. Praktijkvoorbeelden
```

### Scenario Generator
```
Maak een realistisch scenario voor [DOELGROEP] waarin [AI CONCEPT] relevant wordt.

Context: [BESCHRIJF SITUATIE]
Criteria:
- Herkenbaar en relevant
- Niet te complex
- Met duidelijke AI toepassing
- Met "aha-moment" voor student
- In 50-100 woorden

Format als JSON content block type "scenario-container-horizontal"
```

### Interactie Vraag Generator
```
Genereer een meerkeuzevraag over [ONDERWERP] voor [DOELGROEP].

Criteria:
- Toets begrip van [KERNCONCEPTEN]
- Praktijkgerichte scenario
- 4 realistische antwoordopties
- 1 duidelijk beste antwoord
- Constructieve feedback bij elk antwoord

Include: Context, vraag, 4 opties, feedback correct/incorrect
```

## 📚 Specifieke Content Types

### Accent Blok (Statistiek)
```
Creëer een pakkende statistiek over [ONDERWERP] voor [DOELGROEP].

Vereisten:
- Recente data (2023-2024)
- Impactvolle cijfers
- Relevante bron
- Beknopte uitleg waarom relevant
- Optimistische maar realistische framing

Format als JSON "accent-blok" type "statistiek"
```

### Resource Grid Generator
```
Maak een resource grid met 3-4 relevante tools voor [TOEPASSING] voor [DOELGROEP].

Voor elke resource:
- Naam en korte beschrijving
- Waarom relevant voor doelgroep
- Link naar platform
- Logo/afbeelding suggestie

Format als JSON "resource-grid-container"
```

## 🔄 Review & Verfijning Prompts

### Content Quality Check
```
Review deze e-learning content voor [DOELGROEP]:

[PLAK CONTENT]

Evalueer op:
1. Tone of voice (peer-to-peer, niet schoolmeesterachtig)
2. Praktische relevantie voor doelgroep
3. Duidelijkheid van uitleg
4. Lengte en scanability
5. Interactieve elementen geschikt?

Geef specifieke verbetersuggestes met voorbeelden.
```

### Learning Objectives Alignment
```
Controleer of deze content aansluit bij de leerdoelen:

Leerdoelen: [LIJST LEERDOELEN]
Content: [PLAK CONTENT]

Analyseer:
- Welke leerdoelen worden gedekt?
- Welke missen nog?
- Is de diepgang passend?
- Suggesties voor betere alignment

Geef specifieke aanbevelingen.
```

## 🎨 Creativiteit Prompts

### Analogy Generator
```
Bedenk een creatieve analogie om [COMPLEX AI CONCEPT] uit te leggen aan [DOELGROEP].

De analogie moet:
- Aansluiten bij hun leefwereld/vakgebied
- Het concept helder maken
- Memorabel zijn
- Niet paternalistic overkomen

Geef 3-4 opties met uitwerking.
```

### JSON Structure Converter
```
Converteer deze content naar onze JSON content block structure:

[PLAK GESCHREVEN CONTENT]

Gebruik de juiste content block types:
- section-title voor headers
- content-text voor paragrafen
- info-card voor belangrijke concepten
- accent-blok voor highlights

Geef clean JSON output met proper escaping.
```

## 📊 Assessment Prompts

### Quiz Question Bank Generator
```
Genereer 15-20 quizvragen over [MODULE ONDERWERP] voor [DOELGROEP].

Mix van:
- 40% knowledge recall (feiten, begrippen)
- 40% application (scenario's, praktijkvoorbeelden)
- 20% analysis (vergelijken, beoordelen)

Elke vraag: 4 plausibele opties, constructieve feedback, praktijkcontext
Format als JSON array voor afsluitquiz.json
```

### Reflection Question Generator
```
Ontwikkel diepe reflection questions voor [HOOFDSTUK] voor [DOELGROEP].

Vragen moeten:
- Persoonlijke connectie stimuleren
- Transfer naar eigen situatie bevorderen
- Portfolio-waardige antwoorden uitlokken
- 100-200 woorden response stimuleren

Geef 3-4 opties met guidance voor student.
```

## 💡 Gebruik Tips

### Prompt Chaining
1. Start met structuur prompt
2. Gebruik output voor detail prompts
3. Review en verfijn met quality prompts
4. Convert naar JSON met technical prompts

### Context Building
Maak altijd duidelijk:
- Exacte doelgroep (leeftijd, achtergrond, niveau)
- Leercontext (studie fase, voorkennis)
- Gewenste tone (peer-to-peer, professioneel)
- Technical constraints (tijd, format, platform)

### Iterative Improvement
- Begin met basis prompt
- Verfijn op basis van output quality
- Documenteer wat werkt voor hergebruik
- Deel goede prompts met team 