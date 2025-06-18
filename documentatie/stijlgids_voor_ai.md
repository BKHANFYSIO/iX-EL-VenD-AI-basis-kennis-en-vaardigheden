# Stijlgids voor AI - E-learning Content

Dit document is de handleiding voor het structureren van content naar een valide JSON-formaat voor onze e-learning. Gebruik dit document in combinatie met `documentatie/voorbeeld_hoofdstuk.json` om nieuwe hoofdstukken te genereren.

---

## Hoofdstukstructuur

Elk hoofdstuk volgt een vaste structuur:
1.  Het start met een **verplichte** `info-card` die als algemene inleiding dient.
2.  Daarna volgen een of meerdere `section-title` blokken.
3.  Onder elke `section-title` kunnen diverse content-componenten worden geplaatst.

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
- **JSON Structuur:**
  ```json
  {
    "type": "content-text",
    "tekst": "Dit is een alinea met uitleg."
  }
  ```

### 4. Info Card met Lijst
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

### 5. Tabel
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

### 6. Card Grid
- **Type:** `card-grid`
- **Gebruik:** Om items (voordelen, kenmerken, etc.) in een grid te presenteren.
- **JSON Structuur:**
  ```json
  {
    "type": "card-grid",
    "items": [{ "titel": "Kaart Titel", "beschrijving": "Beschrijving." }]
  }
  ```

### 7. Icon Card Grid
- **Type:** `icon-card-grid`
- **Gebruik:** Een grid van kaarten, elk ondersteund door een visueel icoon.
- **JSON Structuur:**
  ```json
  {
    "type": "icon-card-grid",
    "themes": [{ "icoon": "path/to/icon.svg", "titel": "Kaart Titel", "inhoud": "Beschrijving." }]
  }
  ```

### 8. Competentie Grid
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

### 9. Video Grid
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

### 10. Enkele Video
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

### 11. Afbeelding
- **Type:** `image-block`
- **Gebruik:** Voor het tonen van een standaard afbeelding.
- **Variaties:** Gebruik de `classes` property voor speciale opmaak: `img-polaroid`, `img-framed-responsive`.
- **JSON Structuur:**
  ```json
  {
    "type": "image-block",
    "classes": "img-polaroid",
    "src": "path/to/image.png",
    "alt": "Beschrijving van de afbeelding",
    "onderschrift": "Optioneel onderschrift."
  }
  ```

### 12. Resource Grid
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

### 13. Processtappen / Tijdlijn
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

### 14. Twee-koloms Blok
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

### 15. Afbeelding & Tekst (Gesplitst Scherm)
- **Type:** `split-screen-image-text`
- **Gebruik:** Om een afbeelding naast een blok tekst te plaatsen. Ideaal voor het uitdiepen van een visueel concept.
- **JSON Structuur:**
  ```json
  {
    "type": "split-screen-image-text",
    "afbeelding": {
      "src": "path/to/image.png",
      "alt": "Beschrijving van de afbeelding",
      "onderschrift": "Optioneel onderschrift"
    },
    "tekst_content": [
      "Eerste paragraaf van de tekst.",
      "Tweede paragraaf van de tekst."
    ]
  }
  ```

### 16. Afbeeldingen Grid
- **Type:** `image-grid`
- **Gebruik:** Om een reeks afbeeldingen netjes in een grid van 2 of 3 kolommen te tonen.
- **JSON Structuur:**
  ```json
  {
    "type": "image-grid",
    "kolommen": 3,
    "afbeeldingen": [
      { "src": "path/to/image1.png", "alt": "Afbeelding 1" },
      { "src": "path/to/image2.png", "alt": "Afbeelding 2", "onderschrift": "Optioneel" }
    ]
  }
  ```

### 17. Statistieken Grid
- **Type:** `stats-card-grid`
- **Gebruik:** Een opvallend grid om belangrijke statistieken, cijfers of KPI's te tonen.
- **JSON Structuur:**
  ```json
  {
    "type": "stats-card-grid",
    "kaarten": [
      { "titel": "Titel van de statistiek", "afbeelding": "path/to/icon.svg", "getal": "80%", "label": "Beschrijvend label onder het getal" }
    ]
  }
  ```

### 18. Uitgelichte Afbeelding met Kaarten (Complex)
- **Types:** Geen specifieke types meer nodig
- **Gebruik:** Voor complexe layouts kun je de bestaande componenten combineren met de 'doos-in-doos' structuur.
- **JSON Structuur:** Gebruik `info-card` met `content` array om componenten te nesten.

**Nota:** Voor het weergeven van modellen en diagrammen kun je de bestaande componenten combineren: gebruik `image-grid` voor de afbeelding en `info-card` met `card-grid` of `competency-grid` voor de uitleg. Dit geeft meer flexibiliteit en volgt de 'doos-in-doos' structuur. 