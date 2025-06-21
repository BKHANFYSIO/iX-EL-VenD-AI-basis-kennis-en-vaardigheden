# AI Prompts voor het beheren van de E-learning

Dit document bevat twee workflows voor het creëren van e-learning content met een AI-assistent.

1.  **Workflow A: Contentcreatie met Externe Chatbots (Aanbevolen)**
    Deze workflow is opgesplitst in drie stappen: van concept tot definitieve code. Het is de meest robuuste methode voor het genereren van hoogwaardige content met een externe AI zoals ChatGPT of Claude.

2.  **Workflow B: Snel Beheer met Cursor**
    Deze prompts zijn korter en bedoeld voor snelle, specifieke aanpassingen binnen de Cursor-omgeving, zoals het toevoegen van een enkele interactie.

---

## Workflow A: Contentcreatie met Externe Chatbots

### Stap 1: Cursusontwerp (Conceptfase)
**Doel:** Een compleet concept voor een nieuwe e-learning cursus genereren, inclusief titel, hoofdstukken en een korte inhoudsopgave.
**Prompt:**
```
**Rol:** Gedraag je als een ervaren Instructional Designer.

**Taak:** Ontwikkel een concept voor een complete e-learning cursus over het volgende onderwerp: "[ONDERWERP VAN DE CURSUS]". De doelgroep is "[BESCHRIJVING DOELGROEP, BIJV. HBO-V STUDENTEN]".

**Lever het volgende op:**
1.  Een pakkende en professionele **hoofdtitel** voor de e-learning.
2.  Een lijst van [AANTAL] **hoofdstuktitels** die een logische leerroute vormen.
3.  Voor elk hoofdstuk een **korte beschrijving** (2-3 zinnen) van de belangrijkste onderwerpen en leerdoelen die erin behandeld moeten worden.
```

---

### Stap 2: Iteratieve Content Creatie (Schrijf- en Verfijnfase)
**Doel:** Samen met de AI visueel aantrekkelijke en educatief sterke content schrijven voor één hoofdstuk. De focus ligt op het creëren van een boeiende leerervaring met de juiste mix van tekst, visuele elementen en interactieve componenten.

**Benodigde context voor de AI:** Zorg dat de AI toegang heeft tot de inhoud van `documentatie/stijlgids_voor_ai.md` (voor technische specificaties en hoofdstukstructuur).

**Prompt:**
```
**Rol:** Gedraag je als een ervaren E-learning Content Specialist en Visual Designer.

**Taak:** Laten we samen, stap voor stap, visueel aantrekkelijke en educatief sterke content ontwikkelen voor het volgende hoofdstuk. We gaan dit systematisch opbouwen tot een perfect afgewerkt hoofdstuk.

*   **Hoofdstuk:** "Hoofdstuk [NUMMER]: [TITEL VAN HET HOOFDSTUK]"
*   **Inhoudelijke briefing:** "[KOPIEER HIER DE KORTE BESCHRIJVING VAN DIT HOOFDSTUK UIT STAP 1]"

**Belangrijke regels voor het ontwerpproces:**

1.  **Schrijfstijl:** Toegankelijk en professioneel, direct en persoonlijk (spreek de lezer aan met 'je'), praktijkgericht en concreet, gestructureerd en duidelijk, activerend en motiverend.

2.  **Visuele Aantrekkelijkheid:** 
    - Maak actief gebruik van diverse visuele componenten uit de stijlgids
    - Zorg voor een goede balans tussen tekst en visuele elementen
    - Gebruik componenten zoals grids, kaarten, afbeeldingen, video's, statistieken en infoblokken
    - Denk aan variatie: vermijd lange lappen tekst, wissel af met visuele componenten

3.  **Multimedia Integratie:**
    - Stel voor waar afbeeldingen of video's de content kunnen versterken
    - Geef specifieke suggesties voor het type visueel materiaal
    - Zoek actief naar passende afbeeldingen en video's online en deel concrete links
    - Voor video's: bij voorkeur Nederlands, maar Engels is ook acceptabel als de inhoud waardevol is
    - Als je geen specifieke links vindt, beschrijf precies wat voor visueel materiaal nodig is zodat ik het zelf kan zoeken

4.  **Hoofdstukstructuur (Verplicht te volgen):**
    - Start altijd met een `info-card` als hoofdstuk opening
    - Elke sectie: `section-title` → `content-text` (context) → content componenten
    - Voor subsecties: gebruik `content-subtitle` tussen `section-title` en componenten
    - Gebruik `content-text` voor introductie en uitleg vóór complexe componenten
    - Plaats `divider` tussen meerdere componenten binnen een sectie (niet bij enkele component, niet aan sectie-einde)
    - **Passende omvang:** 2-6 hoofdsecties per hoofdstuk, afgestemd op inhoud (zie stijlgids voor details)

5.  **Stap-voor-stap Aanpak:**
    - Vraag mij eerst alle informatie die je nodig hebt voordat je begint
    - Maak eerst een globale structuur: welke secties moeten er komen met beknopte beschrijving van de inhoud per sectie
    - Vraag om goedkeuring van deze structuur voordat je verder gaat
    - Bouw daarna het hoofdstuk sectie voor sectie uit
    - Vraag na elke sectie om feedback voordat je verder gaat
    - Stel actief voor welke visuele componenten het beste passen

**BELANGRIJK: Begin door mij de volgende vragen te stellen:**
- Heb je al specifieke afbeeldingen, video's of andere visuele materialen die zeker gebruikt moeten worden?
- Zijn er specifieke voorbeelden, casussen of praktijksituaties die je wilt uitlichten?
- Welke visuele stijl past bij dit onderwerp (professioneel/speels, modern/klassiek, etc.)?
- Zijn er specifieke leerdoelen of praktische vaardigheden die extra nadruk moeten krijgen?
- Heb je een voorkeur voor bepaalde typen visuele componenten uit de stijlgids?

**Zodra ik deze vragen heb beantwoord, maak je eerst een globale structuur van het hoofdstuk met voorgestelde secties en beknopte beschrijvingen. Na mijn goedkeuring van deze structuur beginnen we met het sectie-voor-sectie uitwerken, startend met een visueel aantrekkelijke inleiding.**
```

---

### Stap 3: JSON Generatie (Conversiefase)
**Doel:** De definitieve tekst uit Stap 2 omzetten naar een foutloos, compleet JSON-codeblok.

**Benodigde context voor de AI:** Zorg dat de AI toegang heeft tot:
1.  `documentatie/stijlgids_voor_ai.md` (de technische specificatie)
2.  (Optioneel, maar aanbevolen) Een screenshot van `stijlgids.html` voor visuele context.

**Prompt:**
```
**Rol:** Gedraag je als een foutloze JSON Expert.

**Taak:** Converteer de volgende, definitieve tekst naar een **volledig en valide JSON-object**.

**Context en Strikte Regels:**
1.  Gebruik de exacte "type"-namen en JSON-structuren uit de bijgevoegde technische specificatie `documentatie/stijlgids_voor_ai.md`.
2.  Volg de hoofdstukstructuur: zorg dat er een logische opbouw is met info-card, section-titles, content-text en juiste divider plaatsing.
3.  Verander niets aan de inhoud van de tekst.
4.  Alleen de content array, geen interacties - die worden apart toegevoegd.
5.  Geen hoofdstuk titel bovenaan - code begint direct met `"content": [` (hoofdstuktitels worden automatisch gegenereerd vanuit config.json).
6.  Zorg ervoor dat de output alléén het JSON-codeblok is, zonder extra uitleg.

---
[HIER PLAATS JE DE DEFINITIEVE, GEFINALISEERDE TEKST UIT STAP 2]
---
```

---
---

## Workflow B: Snel Beheer met Cursor

Deze prompts zijn bedoeld voor snelle aanpassingen binnen de Cursor-omgeving.

### JSON Implementatie vanuit Workflow A
**Doel:** Het JSON-resultaat uit Workflow A Stap 3 daadwerkelijk implementeren in het juiste hoofdstukbestand.

**Prompt:**
```
Implementeer het volgende JSON-object in `content/hoofdstuk[NUMMER].json`. Vervang de volledige `content` array met onderstaande code:

---
[HIER PLAK JE HET COMPLETE JSON-OBJECT UIT WORKFLOW A STAP 3]
---

Zorg ervoor dat:
- De bestaande interacties array behouden blijft
- Alleen de content wordt vervangen
- De JSON syntax correct blijft
```

### Direct JSON Creatie vanuit Stap 2 (Alternatief)
**Doel:** Direct een JSON-bestand maken in Cursor vanuit het tekstresultaat van Workflow A Stap 2, zonder tussenliggende stap.

**Prompt:**
```
**Rol:** Gedraag je als een foutloze JSON Expert die werkt binnen Cursor.

**Taak:** Converteer de volgende tekst direct naar een valide JSON content array en implementeer deze in `content/hoofdstuk[NUMMER].json`.

**Strikte Regels:**
- Bekijk ALTIJD eerst `documentatie/stijlgids_voor_ai.md` en houd je hier precies aan
- Volg de hoofdstukstructuur: info-card opening → section-title → content-text → (content-subtitle voor subsecties) → componenten → dividers waar nodig
- Passende omvang: 2-6 hoofdsecties (section-titles) per hoofdstuk, afgestemd op inhoud voor optimale leesbaarheid
- Gebruik de juiste syntax ZONDER FOUTEN (bijvoorbeeld `content-text` niet `text`, `tekst` niet `content`)
- Als je twijfelt over welk content type te gebruiken, vraag het mij eerst met 1-2 concrete suggesties (bijv. "Moet dit een `concept-cards` of `icon-card-grid` worden? Een icon zou de uitleg kunnen versterken.")
- Alleen de content array, geen interacties
- Geen hoofdstuk titel bovenaan - code begint direct met `"content": [` (hoofdstuktitels worden automatisch gegenereerd vanuit config.json)
- Behoud de bestaande interacties array

**Te converteren tekst:**
---
[HIER PLAK JE DE GEFINALISEERDE TEKST UIT WORKFLOW A STAP 2]
---
```

### Interacties Toevoegen aan een Hoofdstuk
**Doel:** Snel een of meerdere interactieve elementen toevoegen aan een bestaand hoofdstuk.

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

### De Eindquiz Vullen
**Doel:** Snel de vragen en antwoorden van de afsluitende quiz definiëren of bijwerken.

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
(Herhaal het vraag-blok voor alle vragen die je wilt toevoegen)
``` 