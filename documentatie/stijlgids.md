# Stijlgids voor E-learning Content

Dit document is een handleiding voor het creëren van content voor de e-learning. Het is bedoeld voor (AI-)assistenten en content creators. Gebruik de onderstaande "shortcodes" in je tekst om de content te structureren en te stylen volgens het design van de e-learning.

De AI-assistent die de uiteindelijke JSON-bestanden genereert, zal deze shortcodes omzetten naar de correcte HTML-structuur met de bijbehorende CSS-classes.

---

## 1. Basistekst

### Paragraaf
Gewone tekst wordt automatisch omgezet in een `<p>`-tag. Schrijf gewoon zoals je gewend bent.

### Titels
Gebruik Markdown-stijl headers voor titels.
- `## Hoofdtitel van een sectie` wordt een `<h2>`
- `### Subtitel` wordt een `<h3>`
- `#### Kleinere titel` wordt een `<h4>`

---

## 2. Componenten (met Shortcodes)

### Info Kaart (Quote/Mededeling)
Gebruik dit voor belangrijke mededelingen, quotes of om een stuk tekst uit te lichten.

- **Shortcode:** `> Jouw tekst hier.`
- **Resultaat:** Een paars omkaderd blok (`.info-card`).
- **Voorbeeld:**
  ```
  > Dit is een belangrijke mededeling die extra aandacht verdient.
  ```

### Afbeelding
Plaats een afbeelding in de content.

- **Shortcode:** `[AFBEELDING: pad/naar/afbeelding.png, alt: beschrijving van de afbeelding]`
- **Resultaat:** Een responsive afbeelding (`.content-image`) die netjes gecentreerd wordt.
- **Voorbeeld:**
  ```
  [AFBEELDING: images/human_in_the_loop.png, alt: Diagram van Human in the loop AI]
  ```

### Video
Sluit een YouTube-video in. Zorg dat je de 'embed' URL gebruikt.

- **Shortcode:** `[VIDEO: https://www.youtube.com/embed/jouw_video_id]`
- **Resultaat:** Een responsive video-speler die de volledige breedte benut (`.video-container-full-width`).
- **Voorbeeld:**
  ```
  [VIDEO: https://www.youtube.com/embed/dQw4w9WgXcQ]
  ```

### Voordelen- of Modulelijst
Gebruik dit om een lijst van voordelen, modules of andere gegroepeerde items weer te geven in losse kaarten.

- **Shortcode-structuur:**
  ```
  [VOORDELEN]
  ### Titel Kaart 1
  * Eerste punt op kaart 1.
  * Tweede punt op kaart 1.
  ---
  ### Titel Kaart 2
  Gewone tekst op kaart 2.
  [/VOORDELEN]
  ```
- **Resultaat:** Een container (`.modules-list`) met daarin meerdere kaarten (`.benefit-card`).
- **Details:**
    - Gebruik `[VOORDELEN]` en `[/VOORDELEN]` om de hele lijst te omsluiten.
    - Scheid de verschillende kaarten van elkaar met `---` op een nieuwe regel.
    - Gebruik `###` voor de titel van elke kaart.

### Icon Card Grid
Een flexibel grid voor het tonen van thema's, concepten of tools ondersteund door iconen. Ideaal voor het visueel groeperen van gerelateerde items.

- **Shortcode-structuur:**
  ```
  [ICON-GRID]
  [ITEM: Titel van het item, pad/naar/icoon.svg]
  Beschrijving van het item. Je kunt hier ook [hyperlinks](https://www.google.com) gebruiken.
  ---
  [ITEM: Ander item, pad/naar/ander-icoon.svg]
  Beschrijving van het andere item.
  [/ICON-GRID]
  ```
- **Resultaat:** Een grid container (`.icon-card-grid`) met daarin meerdere kaarten (`.icon-card`).
- **Details:**
    - Omsluit de hele sectie met `[ICON-GRID]` en `[/ICON-GRID]`.
    - Begin elk item met `[ITEM: Titel, pad/naar/icoon]`.
    - Scheid de items van elkaar met `---` op een nieuwe regel.
    - Geschikt voor tools, technologieën, concepten, thema's of elk ander onderwerp dat visueel ondersteund kan worden door een icoon.

### Scenario Kaarten
Voor het tonen van meerdere "stel je voor..." of casus-scenario's naast elkaar.

- **Shortcode-structuur:**
  ```
  [SCENARIOS]
  ### Titel Scenario 1
  Beschrijving van het eerste scenario. Dit kan meerdere alinea's bevatten.
  ---
  ### Titel Scenario 2
  Beschrijving van het tweede scenario.
  [/SCENARIOS]
  ```
- **Resultaat:** Een container (`.scenario-container-horizontal`) met daarin meerdere kaarten (`.scenario-card`).
- **Details:**
    - Omsluit de sectie met `[SCENARIOS]` en `[/SCENARIOS]`.
    - Gebruik `###` voor de titel van elk scenario.
    - Scheid de scenario's van elkaar met `---` op een nieuwe regel.

### Ethische Reflectie Grid
Gebruik dit voor het tonen van meerdere ethische dilemma's of reflectiepunten naast elkaar in een grid.

- **Shortcode-structuur:**
  ```
  [REFLECTIE-GRID]
  ### Titel van Dilemma 1
  Beschrijving van het dilemma.
  ---
  ### Titel van Reflectiepunt 2
  Beschrijving van het reflectiepunt.
  [/REFLECTIE-GRID]
  ```
- **Resultaat:** Een container (`.ethical-reflection-grid`) met daarin meerdere kaarten (`.ethical-card`).
- **Details:**
    - Omsluit de sectie met `[REFLECTIE-GRID]` en `[/REFLECTIE-GRID]`.
    - Gebruik `###` voor de titel van elke kaart.
    - Scheid de kaarten van elkaar met `---` op een nieuwe regel.

### Concept Kaarten (Woordenboek)
Gebruik dit voor het uitleggen van specifieke begrippen, jargon of termen.

- **Shortcode-structuur:**
  ```
  [CONCEPTEN]
  [CONCEPT: Hallucinatie, Een 'verzinsel' van de AI]
  Wanneer een AI feitelijk onjuiste of onzinnige informatie presenteert alsof het een feit is.
  *Voorbeeld:* Vraag: 'Wie was de eerste mens op Mars?' AI Antwoord: 'Neil Armstrong landde op Mars in 1978.'
  ---
  [CONCEPT: Bias, Vooringenomenheid]
  Systematische fouten in een AI-model die leiden tot oneerlijke of onjuiste uitkomsten voor bepaalde groepen.
  [/CONCEPTEN]
  ```
- **Resultaat:** Een set kaarten (`.concept-cards`) die ideaal zijn voor definities.
- **Details:**
    - Omsluit de hele sectie met `[CONCEPTEN]` en `[/CONCEPTEN]`.
    - Begin elke kaart met `[CONCEPT: Titel van het concept, Nederlandse vertaling]`.
    - De regel(s) eronder is de uitleg.
    - Een regel die start met `*Voorbeeld:*` wordt als voorbeeld weergegeven.
    - Scheid de kaarten van elkaar met `---` op een nieuwe regel. 