# Stijlgids voor AI - E-learning Content

Dit document is de handleiding voor het structureren van content naar een valide JSON-formaat voor onze e-learning. Gebruik dit document in combinatie met `documentatie/voorbeeld_hoofdstuk.json` om nieuwe hoofdstukken te genereren.

---

## Hoofdstukstructuur

Elk hoofdstuk volgt een vaste, gestructureerde opbouw:

### 1. Hoofdstuk Opening
- **Verplicht:** Start altijd met een `info-card` (vaak met `classes: "welcome-card"`) als algemene inleiding

### 2. Sectie Structuur
Elke sectie binnen een hoofdstuk volgt dit patroon:
- **`section-title`** - Naam van de nieuwe sectie
- **`content-text`** - Introductietekst die context geeft (sterk aanbevolen)
- **Content componenten** - Een of meerdere complexe componenten (grids, video's, tabellen, etc.)

### 3. Divider Regels (Visuele Scheiding)
Gebruik `{ "type": "divider" }` voor optimale visuele structuur:
- **Tussen meerdere componenten:** Plaats dividers TUSSEN content componenten binnen een sectie
- **Niet bij enkele component:** Als er maar één component na content-text staat, geen divider
- **Niet aan sectie-einde:** Geen divider na het laatste component van een sectie (de volgende section-title geeft al visuele scheiding)
- **Wel na complexe sequenties:** Als je meerdere gerelateerde componenten hebt, gebruik dividers voor duidelijkheid

### 4. Content-Text Gebruik
- **Voor introductie:** Gebruik `content-text` direct na `section-title` om context te geven
- **Voor uitleg:** Plaats `content-text` vóór complexe componenten (grids, video's) ter introductie
- **Voor tussentekst:** Gebruik `content-text` tussen componenten voor extra uitleg

### Voorbeeld Structuur:
```
info-card (hoofdstuk opening)
section-title (sectie 1)
content-text (intro sectie 1)
content-subtitle (subsectie A)
content-text (uitleg subsectie A)
component A (bijv. card-grid)
divider
content-subtitle (subsectie B)
content-text (uitleg subsectie B)
component B (bijv. video-grid)
section-title (sectie 2)
content-text (intro sectie 2)
component C (enige component, dus geen divider)
```

### 5. Hoofdstuk Omvang (Belangrijk)
**Doel:** Hoofdstukken beheersbaar en aantrekkelijk houden voor studenten.

**Richtlijnen:**
- **Flexibele sectie-indeling:** 2-6 hoofdsecties (section-titles) per hoofdstuk - aantal moet passen bij de inhoud
- **Indicatieve leestijd:** 5-12 minuten (huidige hoofdstukken ~5-6 min, max 2x langer mogelijk)
- **Eén hoofdthema:** Focus op één centraal onderwerp per hoofdstuk
- **Hapklare brokken:** Voorkom cognitieve overbelasting bij studenten

**Praktische toepassing:**
- Als een hoofdstuk te lang wordt, splits het op in meerdere hoofdstukken
- Gebruik de info-card opening om het hoofdthema helder te definiëren  
- Zorg dat elke sectie logisch bijdraagt aan het hoofdthema
- Denk aan de aandachtsspanne: liever 2 korte, krachtige hoofdstukken dan 1 lange

---

## Content Componenten (`content` array)

### 1. Info Card
- **Type:** `info-card`
- **Gebruik:** Voor uitgelichte informatie. Verplicht als eerste element. Ook voor samenvattingen of waarschuwingen.
- **Variaties:** Gebruik de `classes` property: `welcome-card`, `warning-card`, `purple-kader`.
- **JSON Structuur:**
  ```json
  {
    "type": "info-card",
    "classes": "welcome-card",
    "titel": "Titel van de kaart",
    "tekst": "De hoofdtekst van de kaart."
  }
  ```

### 2. Sectietitel
- **Type:** `section-title`
- **Gebruik:** Om een nieuw onderwerp aan te kondigen.
- **JSON Structuur:**
  ```json
  {
    "type": "section-title",
    "titel": "Titel van de Sectie"
  }
  ```

### 3. Tekstparagraaf
- **Type:** `content-text`
- **Gebruik:** Voor standaard, lopende tekst.
- **Tekstformattering:**
  - **Lijsten:** Gebruik altijd proper HTML `<ul><li>` in plaats van sterretjes (*). Bijvoorbeeld: `<ul><li><strong>Titel:</strong> beschrijving</li></ul>`
  - **Vetgedrukte tekst:** Gebruik `<strong>` tags in plaats van sterretjes rond woorden. Bijvoorbeeld: `<strong>Belangrijk punt</strong>`
- **JSON Structuur:**
  ```json
  {
    "type": "content-text",
    "tekst": "Dit is een alinea met uitleg."
  }
  ```

### 4. Subsectie Titel
- **Type:** `content-subtitle`
- **Gebruik:** Voor subsecties binnen een hoofdsectie. Zit qua hiërarchie tussen section-title en content-text in.
- **Visueel:** Paarse kleur, kleiner dan section-title, groter dan gewone tekst.
- **JSON Structuur:**
  ```json
  {
    "type": "content-subtitle",
    "titel": "Privacygevoeligheid & AVG"
  }
  ```

### 6. Info Card met Lijst
- **Type:** `info-card-list`
- **Gebruik:** Combineert een inleidende tekst met een gestructureerde lijst.
- **JSON Structuur:**
  ```json
  {
    "type": "info-card-list",
    "titel": "Titel",
    "inhoud": "Inleidende tekst.",
    "lijst": [{ "titel": "Punt 1", "tekst": "Beschrijving." }]
  }
  ```

### 7. Accordion (Uitklapbare Content)
- **Type:** `accordion`
- **Gebruik:** Voor uitklapbare content die veel ruimte inneemt, zoals criteria, FAQ's of gedetailleerde uitleg die gebruikers op verzoek kunnen bekijken.
- **Eigenschappen:** 
  - `titel`: De titel van de accordion (zichtbaar op de knop)
  - `introductie`: Optionele introductietekst die in de uitgeklapte content verschijnt
  - `content`: Array van items, elk met `titel`, `beschrijving` en optioneel `subpunten`
- **JSON Structuur:**
  ```json
  {
    "type": "accordion",
    "titel": "Klik om uit te klappen",
    "introductie": "Optionele introductie tekst die bovenaan in de accordion staat.",
    "content": [
      {
        "titel": "Item 1",
        "beschrijving": "Uitgebreide beschrijving van item 1.",
        "subpunten": ["Subpunt A", "Subpunt B", "Subpunt C"]
      },
      {
        "titel": "Item 2", 
        "beschrijving": "Beschrijving van item 2 zonder subpunten."
      }
    ]
  }
  ```

### 8. Tabel
- **Type:** `table-container-group`
- **Gebruik:** Voor het tonen van gestructureerde data in een of meerdere tabellen.
- **JSON Structuur:**
  ```json
  {
    "type": "table-container-group",
    "intro": "Optionele introductie.",
    "tables": [
      { "titel": "Tabel Titel", "headers": ["Header 1"], "rows": [["Cel 1"]] }
    ],
    "note": "Optionele notitie."
  }
  ```

### 9. Card Grid
- **Type:** `card-grid`
- **Gebruik:** Om items (voordelen, kenmerken, etc.) in een grid te presenteren.
- **JSON Structuur:**
  ```json
  {
    "type": "card-grid",
    "items": [{ "titel": "Kaart Titel", "beschrijving": "Beschrijving." }]
  }
  ```

### 10. Icon Card Grid
- **Type:** `icon-card-grid`
- **Gebruik:** Een grid van kaarten, elk ondersteund door een visueel icoon.
- **JSON Structuur:**
  ```json
  {
    "type": "icon-card-grid",
    "themes": [{ "icoon": "path/to/icon.svg", "titel": "Kaart Titel", "inhoud": "Beschrijving." }]
  }
  ```

### 11. Competentie Grid
- **Type:** `competency-grid`
- **Gebruik:** Voor het uitleggen van competenties of termen met een praktijkvoorbeeld.
- **JSON Structuur:**
  ```json
  {
    "type": "competency-grid",
    "titel": "Titel van het Grid",
    "intro": "Inleidende tekst.",
    "termen": [{ "term": "Term A", "uitleg": "Uitleg.", "praktisch": "Praktijkvoorbeeld." }]
  }
  ```

### 12. Video Grid
- **Type:** `video-grid`
- **Gebruik:** Voor het embedden van YouTube video's.
- **JSON Structuur:**
  ```json
  {
    "type": "video-grid",
    "titel": "Titel van Grid",
    "items": [{ "titel": "Video Titel", "beschrijving": "Beschrijving.", "bron": "YouTube", "duur": "5 min", "link": "https://..." }]
  }
  ```

### 13. Enkele Video
- **Type:** `video-full-width`
- **Gebruik:** Voor het tonen van één enkele, responsive video.
- **JSON Structuur:**
  ```json
  {
    "type": "video-full-width",
    "titel": "Optionele titel onder de video",
    "link": "https://youtube.com/watch?v=..."
  }
  ```

### 14. Afbeelding
- **Type:** `image-block`
- **Gebruik:** Voor het tonen van een standaard afbeelding.
- **Variaties:** Gebruik de `classes` property voor speciale opmaak: `img-polaroid`.
- **JSON Structuur:**
  ```json
  {
    "type": "image-block",
    "classes": "img-polaroid",
    "src": "path/to/image.png",
    "alt": "Beschrijving van de afbeelding",
    "onderschrift": "Optioneel onderschrift.",
    "bron": {
        "naam": "Naam van de bron",
        "url": "https://optionele-link.nl"
    }
  }
  ```

### 15. Resource Grid
- **Type:** `resource-grid-container`
- **Gebruik:** Een grid om te linken naar externe tools, bronnen of platforms, elk met een logo.
- **JSON Structuur:**
  ```json
  {
    "type": "resource-grid-container",
    "titel": "Titel van Grid",
    "items": [{ "logo": "path/to/logo.png", "titel": "Resource Naam", "beschrijving": "Beschrijving.", "link": "https://..." }]
  }
  ```

### 16. Processtappen / Tijdlijn
- **Type:** `process-flow`
- **Gebruik:** Om stappen in een proces of tijdlijn weer te geven.
- **JSON Structuur:**
  ```json
  {
    "type": "process-flow",
    "titel": "Titel van Proces",
    "items": [{ "stap": "Stap 1", "titel": "Fase 1", "beschrijving": "Beschrijving." }]
  }
  ```

### 17. Twee-koloms Blok
- **Type:** `dual-content-block`
- **Gebruik:** Voor het naast elkaar plaatsen van twee blokken, zoals een statistiek en een 'wist-je-dat'.
- **JSON Structuur:**
  ```json
  {
    "type": "dual-content-block",
    "blokken": [
      { "type": "statistiek", "titel": "Statistiek", "focus_tekst": "80%", "tekst_na_statistiek": "Uitleg." },
      { "type": "fun_fact", "titel": "Wist je dat?", "tekst": "Leuk feitje." }
    ]
  }
  ```

### 18. Accent Blok
- **Type:** `accent-blok`
- **Gebruik:** Een flexibel blok om tekst uit te lichten, zoals statistieken, weetjes of citaten.
- **Variaties:** Gebruik de `variant` property. Mogelijke waarden zijn `statistiek`, `weetje`, `citaat`, of `default`.
- **JSON Structuur:**
  ```json
  {
    "type": "accent-blok",
    "variant": "citaat",
    "titel": "Optionele Titel",
    "tekst": "De hoofdtekst van het accent blok.",
    "bron": {
      "naam": "Naam van de bron",
      "url": "https://optionele-link-naar-bron.nl"
    }
  }
  ```

### 19. Afbeelding & Tekst (Gesplitst Scherm)
- **Type:** `split-screen-image-text`
- **Gebruik:** Om een afbeelding naast een blok tekst te plaatsen. Ideaal voor het uitdiepen van een visueel concept.
- **JSON Structuur:**
  ```json
  {
    "type": "split-screen-image-text",
    "afbeelding": {
      "src": "path/to/image.png",
      "alt": "Beschrijving van de afbeelding",
      "onderschrift": "Optioneel onderschrift",
      "bron": {
        "naam": "Naam van de bron",
        "url": "https://optionele-link.nl"
      }
    },
    "tekst_content": [
      "Eerste paragraaf van de tekst.",
      "Tweede paragraaf van de tekst."
    ]
  }
  ```

### 20. Afbeeldingen Grid
- **Type:** `image-grid`
- **Gebruik:** Om een reeks afbeeldingen netjes in een grid van 2 of 3 kolommen te tonen.
- **JSON Structuur:**
  ```json
  {
    "type": "image-grid",
    "kolommen": 3,
    "afbeeldingen": [
      { 
        "src": "path/to/image1.png", 
        "alt": "Afbeelding 1",
        "onderschrift": "Optioneel onderschrift.",
        "bron": {
            "naam": "Naam van de bron",
            "url": "https://optionele-link.nl"
        }
      }
    ]
  }
  ```

### 21. Statistieken Grid
- **Type:** `stats-card-grid`
- **Gebruik:** Een opvallend grid om belangrijke statistieken, cijfers of KPI's te tonen. Elke kaart kan nu ook een bronvermelding bevatten.
- **JSON Structuur:**
  ```json
  {
    "type": "stats-card-grid",
    "kaarten": [
      { 
        "titel": "Titel van de statistiek", 
        "afbeelding": "path/to/icon.svg", 
        "getal": "80%", 
        "label": "Beschrijvend label onder het getal",
        "bron": {
            "naam": "Naam van de bron",
            "url": "https://optionele-link.nl"
        }
      }
    ]
  }
  ```

### 22. Ethische Reflectie Grid
- **Type:** `ethical-reflection-grid`
- **Gebruik:** Voor het presenteren van ethische dilemma's of reflectiepunten in een grid. Ideaal voor het aanzetten tot nadenken over complexe onderwerpen.
- **JSON Structuur:**
  ```json
  {
    "type": "ethical-reflection-grid",
    "kaarten": [
      { "titel": "Dilemma 1", "beschrijving": "Beschrijving van het dilemma." },
      { "titel": "Reflectiepunt 2", "beschrijving": "Uitleg van het reflectiepunt." }
    ]
  }
  ```

### 23. Horizontale Scenario Kaarten
- **Type:** `scenario-container-horizontal`
- **Gebruik:** Voor het tonen van meerdere "stel je voor..." of casus-scenario's naast elkaar.
- **JSON Structuur:**
  ```json
  {
    "type": "scenario-container-horizontal",
    "scenarios": [
        { "titel": "Scenario 1", "beschrijving": "Beschrijving...", "punten": ["Punt A", "Punt B"], "conclusie": "Conclusie van scenario."}
    ]
  }
  ```

### 24. Concept Cards
- **Type:** `concept-cards`
- **Gebruik:** Voor het uitleggen van specifieke begrippen of jargon, inclusief vertaling en voorbeeld.
- **JSON Structuur:**
  ```json
  {
    "type": "concept-cards",
    "items": [
      {
        "titel": "Hallucinatie",
        "nederlands": "Een 'verzinsel' van de AI",
        "uitleg": "Wanneer een AI feitelijk onjuiste of onzinnige informatie presenteert alsof het een feit is.",
        "voorbeeld": "Vraag: 'Wie was de eerste mens op Mars?' AI Antwoord: 'Neil Armstrong landde op Mars in 1978.'"
      }
    ]
  }
  ```

### 25. Divider (Visuele Scheiding)
- **Type:** `divider`
- **Gebruik:** Voor visuele scheiding tussen content componenten binnen een sectie. Zie hoofdstukstructuur voor exacte regels.
- **JSON Structuur:**
  ```json
  {
    "type": "divider"
  }
  ```

### 26. Uitgelichte Afbeelding met Kaarten (Complex)
- **Types:** Geen specifieke types meer nodig
- **Gebruik:** Voor complexe layouts kun je de bestaande componenten combineren met de 'doos-in-doos' structuur.
- **JSON Structuur:** Gebruik `info-card` met `content` array om componenten te nesten.

**Nota:** Voor het weergeven van modellen en diagrammen kun je de bestaande componenten combineren: gebruik `image-grid` voor de afbeelding en `info-card` met `card-grid` of `competency-grid` voor de uitleg. Dit geeft meer flexibiliteit en volgt de 'doos-in-doos' structuur. 