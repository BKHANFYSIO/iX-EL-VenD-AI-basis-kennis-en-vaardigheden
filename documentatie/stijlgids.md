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

### Technologie Showcase
Een gestandaardiseerde weergave voor tools, technologieën of externe platformen.

- **Shortcode-structuur:**
  ```
  [TECH-SHOWCASE]
  [TECH: Naam van de Tool, pad/naar/logo.png]
  Een beschrijving van de tool. Je kunt hier ook [hyperlinks](https://www.google.com) gebruiken.
  ---
  [TECH: Een Andere Tool, pad/naar/anderlogo.png]
  Een beschrijving van een andere tool.
  [/TECH-SHOWCASE]
  ```
- **Resultaat:** Een container (`.tech-showcase`) met daarin meerdere items (`.tech-item`).
- **Details:**
    - Omsluit de hele sectie met `[TECH-SHOWCASE]` en `[/TECH-SHOWCASE]`.
    - Begin elk item met `[TECH: Titel, pad/naar/logo]`.
    - Scheid de items van elkaar met `---` op een nieuwe regel.

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