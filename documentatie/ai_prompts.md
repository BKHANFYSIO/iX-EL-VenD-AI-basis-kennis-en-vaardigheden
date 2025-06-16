# AI Prompts voor het beheren van de E-learning

Gebruik de onderstaande prompts om op een consistente en efficiënte manier met een AI-assistent (zoals Gemini in Cursor) te communiceren. Kopieer de volledige prompt, inclusief de `---` scheidingslijn, en plak de benodigde informatie op de daarvoor bestemde plek.

---

## Stap 1: Nieuwe Cursus Initialiseren

**Doel:** De basisstructuur van een nieuwe e-learning cursus opzetten.

**Prompt:**
```
Ik wil een nieuwe e-learning cursus opzetten. Voer de volgende stappen voor me uit:

1.  **Configuratie:** Pas `content/config.json` aan met de volgende gegevens:
    *   Titel: "[TITEL VAN DE CURSUS]"
    *   Organisatie: "[NAAM ORGANISATIE]"
    *   Logo pad: "images/[bestandsnaam_logo.ext]"
    *   Leerdoelen:
        * "[LEERDOEL 1]"
        * "[LEERDOEL 2]"
        * "[LEERDOEL 3]"
        * ... (voeg meer toe indien nodig)

2.  **Hoofdstukken:** Maak de JSON-bestanden aan voor de volgende hoofdstukken in de `content/` map. Maak ze leeg, op de titel na.
    *   hoofdstuk1.json (Titel: "[TITEL HOOFDSTUK 1]")
    *   hoofdstuk2.json (Titel: "[TITEL HOOFDSTUK 2]")
    *   hoofdstuk3.json (Titel: "[TITEL HOOFDSTUK 3]")
    *   ... (voeg meer toe indien nodig)

3.  **Navigatie:** Werk de navigatie in `index.html` bij zodat deze overeenkomt met de nieuwe hoofdstukken.

4.  **Script:** Update de `totalSections` en `chapters` variabelen in `js/script.js` om de nieuwe structuur te reflecteren.
```

---

## Stap 2: Hoofdstuk van Content Voorzien

**Doel:** Een specifiek hoofdstuk vullen met tekst en media, gebruikmakend van de gedefinieerde stijlgids.

**Prompt:**
```
Ik wil de content voor `content/hoofdstuk[NUMMER].json` aanmaken.

Gebruik de onderstaande tekst. Verwerk deze tekst naar de correcte HTML-structuur door de shortcodes uit `documentatie/stijlgids.md` toe te passen. Plaats het resultaat in het `content` object binnen het JSON-bestand.

---
[HIER PLAATS JE DE VOLLEDIGE TEKST VOOR HET HOOFDSTUK, INCLUSIEF DE SHORTCODES ZOALS BESCHREVEN IN DE STIJLGIDS]
---
```

---

## Stap 3: Interacties Toevoegen aan een Hoofdstuk

**Doel:** Interactieve elementen (zoals meerkeuzevragen of reflecties) toevoegen aan een hoofdstuk.

**Prompt:**
```
Voeg de volgende interactie(s) toe aan de `interacties` array in `content/hoofdstuk[NUMMER].json`. Zorg voor correcte en unieke ID's volgens de naamgevingsconventie `h{hoofdstuknummer}_{type}_{volgnummer}`.

---
**Type:** [mc / reflection / dragdrop / etc.]
**Vraag:** "[DE VRAAG DIE JE WILT STELLEN]"
**Details:**
[VOEG HIER DE SPECIFIEKE DETAILS TOE, BIJV. OPTIES VOOR EEN MC-VRAAG]
- Optie 1
- Optie 2
- Correct antwoord: 2
- Feedback: "Goed zo!"
---
(Herhaal bovenstaand blok voor elke interactie die je wilt toevoegen)
```

---

## Stap 4: De Eindquiz Vullen

**Doel:** De vragen en antwoorden van de afsluitende quiz definiëren.

**Prompt:**
```
Vervang de volledige inhoud van `content/afsluitquiz.json` met de onderstaande vragen. Zorg voor correcte en unieke ID's (`quiz_mc_{volgnummer}`).

---
**Vraag 1:** "[TEKST VAN DE EERSTE VRAAG]"
**Opties:**
1. [Optie 1]
2. [Optie 2]
3. [Optie 3]
4. [Optie 4]
**Correct antwoord:** [Nummer van het correcte antwoord]
**Feedback:** "[Feedback die na het antwoord wordt getoond]"
---
**Vraag 2:** "[TEKST VAN DE TWEEDE VRAAG]"
**Opties:**
1. [Optie 1]
2. [Optie 2]
3. [Optie 3]
4. [Optie 4]
**Correct antwoord:** [Nummer van het correcte antwoord]
**Feedback:** "[Feedback die na het antwoord wordt getoond]"
---
(Herhaal het vraag-blok voor alle vragen die je wilt toevoegen)
``` 