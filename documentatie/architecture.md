# E-learning AI basiskennis en vaardigheden - Architectuur

## Overzicht
Deze e-learning bestaat uit N reguliere hoofdstukken plus 1 afsluitend hoofdstuk. Het totaal aantal secties is configureerbaar.

## Bestandsstructuur

### Content bestanden
- `content/hoofdstuk1.json` t/m `content/hoofdstukN.json` - Reguliere hoofdstukken
- `content/hoofdstuk_afsluiting.json` - Speciaal afsluitend hoofdstuk (altijd de laatste sectie)
- `content/afsluitquiz.json` - Quiz vragen voor het afsluitende hoofdstuk
- `content/config.json` - Algemene configuratie

### Structuur van Content in Hoofdstukken

Naast de algemene `titel` (voor het hoofdstuk zelf) en de `interacties` array, kan het `content` object binnen elk `hoofdstukX.json` bestand verschillende geneste objecten bevatten om de tekstuele en visuele inhoud van het hoofdstuk te structureren. De rendering van deze elementen wordt afgehandeld door `js/dynamicContent.js`.

Enkele voorbeelden van gestructureerde content-elementen zijn:

- **Standaard tekstblokken**: Vaak een object met een eigen `titel` en `tekst` veld (bv. `content.welkom.titel`, `content.welkom.tekst`).
- **Lijsten met punten**: Objecten met een `titel`, inleidende `tekst`, en een `punten` array (bv. `content.leren_als_spiertraining.punten`).
- **Geneste informatieve blokken**: Soms wordt een `blokken` array gebruikt binnen een sectie om meerdere sub-elementen te groeperen, zoals statistieken of "fun facts" (bv. `content.waarom_nu_relevant.blokken`). Elk item in de `blokken` array heeft dan een `type` (bv. `"statistiek"`, `"fun_fact"`), een `titel` en relevante tekstvelden.

- **Specifieke content types (voorbeeld uit Hoofdstuk 1 - nieuwe structuur):**
    - `scenario_container`: Geïntroduceerd voor het weergeven van meerdere scenario's, bedoeld om visueel als "tegels" naast elkaar te kunnen worden gepresenteerd (afhankelijk van CSS/JS implementatie).
        - `titel`: Algemene titel voor de scenario-sectie (bv. "Stel je eens voor…").
        - `type`: Een string zoals `"scenario_container"` (kan gebruikt worden door JavaScript om specifieke rendering logica toe te passen).
        - `scenarios`: Een array van scenario-objecten. Elk scenario-object bevat doorgaans:
            - `titel`: Titel van het specifieke scenario.
            - `beschrijving`: Inleidende tekst voor het scenario.
            - `punten`: Een array van strings (elk een punt binnen het scenario).
            - `conclusie`: Een afsluitende tekst voor het scenario.

De frontend code (met name `dynamicContent.js`) is verantwoordelijk voor het parsen van deze JSON structuren en het genereren van de bijbehorende HTML. Bij het introduceren van nieuwe content-types of sterk afwijkende structuren, kan het nodig zijn `dynamicContent.js` aan te passen om deze correct weer te geven.

### Belangrijke conventies

#### Naamgeving hoofdstuk_afsluiting
Het laatste hoofdstuk heeft bewust een afwijkende naam (`hoofdstuk_afsluiting.json` i.p.v. `hoofdstuk[N+1].json`) omdat:
1. Het een fundamenteel andere structuur heeft (certificaat, portfolio info)
2. Het altijd het laatste hoofdstuk blijft, ongeacht het aantal reguliere hoofdstukken
3. Het semantisch duidelijk maakt dat dit het afsluitende deel is

#### Aanpassen aantal hoofdstukken
Bij het wijzigen van het aantal hoofdstukken:
1. Pas `totalSections` aan in `js/script.js` naar het nieuwe totaal (reguliere hoofdstukken + 1)
2. Voeg/verwijder hoofdstuk JSON bestanden
3. Pas de `chapters` array aan in `js/script.js`
4. Update de navigatie in `index.html`
5. `hoofdstuk_afsluiting.json` blijft altijd het laatste hoofdstuk

**Voorbeeld**: Voor 5 reguliere hoofdstukken:
- `totalSections = 6` (5 + 1 afsluiting)
- Hoofdstukken: `hoofdstuk1.json` t/m `hoofdstuk5.json`
- `hoofdstuk_afsluiting.json` wordt automatisch sectie 6

## Technische details

### Hoofdstuk laden
- Reguliere hoofdstukken: Laden via `content/hoofdstuk{nummer}.json`
- Laatste hoofdstuk: Laadt altijd `content/hoofdstuk_afsluiting.json`
- Check gebeurt via: `if (chapterNumber === totalSections)`

### Speciale behandeling laatste hoofdstuk
- Gebruikt `renderAfsluitingContent()` functie (flexibele functie voor het afsluitende hoofdstuk)
- Laadt ook `afsluitquiz.json` voor de eindtoets
- Bevat certificaat generatie functionaliteit
- Heeft afwijkende HTML structuur in `index.html`
- Ondersteunt een unieke JSON structuur met focus op certificaat en groei

### Structuur afsluitend hoofdstuk
Het afsluitende hoofdstuk heeft een speciale structuur die verschilt van reguliere hoofdstukken:
- **Geen interacties array** - De quiz wordt apart geladen uit `afsluitquiz.json`
- **Unieke secties**:
  - `titel` - Hoofdtitel (bijv. "Jouw Certificaat en Groeipad")
  - `introductie` - Algemene introductie
  - `overCertificaat` - Uitleg over het gebruik van het certificaat
  - `stimulansHerhalingLeren` - Motivatie voor herhaling en verdieping
  - `portfolioIntegratie` - Tips voor gebruik in eJournal/Portfolio
  - `vraakCriteria` - VRAAK criteria (weergegeven als accordion)
  - `verderKijkenDanCertificaten` - Suggesties voor verdere ontwikkeling

### Dynamische Voortgangslogica (Update 2025)
De voortgangslogica is volledig dynamisch gemaakt en schaalt automatisch mee met het aantal hoofdstukken:

#### Voortgang berekening (`updateAllChapterProgress`)
- `chaptersToUpdate` wordt dynamisch gegenereerd: `Array.from({length: totalSections - 1}, (_, i) => i + 1)`
- Afsluitend hoofdstuk gebruikt index: `totalSections - 1`
- `chapterMeta` wordt dynamisch gegenereerd: `Array.from({length: totalSections}, (_, i) => ({ section: i + 1 }))`

#### PDF Generatie
- Hoofdstukken loop is dynamisch: `for (let i = 1; i < totalSections; i++)`
- Alle hoofdstukken behalve het laatste worden automatisch meegenomen
- Geen hardcoded hoofdstuknummers meer

#### Migratie functies
- `migrateOldIdsToNewFormat()` gebruikt dynamische `chaptersToMigrate`
- `updateJsonFilesWithNewIds()` gebruikt dynamische `chaptersToUpdate`

#### Voordelen van deze aanpak
1. **Volledig schaalbaar**: Werkt voor elk aantal hoofdstukken
2. **Geen hardcoded waarden**: Alle arrays worden dynamisch gegenereerd
3. **Automatische PDF generatie**: Alle hoofdstukken worden automatisch meegenomen
4. **Consistente voortgang**: Bolletjes en percentages werken correct voor elk aantal hoofdstukken

## CSS Styling en Layout

### Algemene Styling (`css/styles.css`)
De hoofd-stylesheet `css/styles.css` bevat alle algemene stijlen voor de e-learning module, inclusief layout, typografie, kleuren en component-specifieke stijlen.

### Specifieke Component Styling

#### Scenario Kaarten (Hoofdstuk 1)
Voor de "Stel je eens voor..." scenario's in Hoofdstuk 1 is een specifieke layout met kaarten naast elkaar geïmplementeerd.
- **HTML Structuur (gegenereerd door `js/dynamicContent.js` - `renderChapter1Content`):**
  - Een container `div` met de class `.scenario-container-horizontal`.
  - Binnen deze container, voor elk scenario, een `div` met de classes `.info-card` en `.scenario-card`.
- **Styling (`css/custom-scenario-styles.css`):**
  - De stijlen voor `.scenario-container-horizontal` en `.scenario-card` zijn gedefinieerd in een apart stylesheet `css/custom-scenario-styles.css`.
  - Dit bestand moet handmatig gelinkt worden in `index.html` in de `<head>` sectie.
  - `.scenario-container-horizontal` gebruikt Flexbox om de kaarten naast elkaar te plaatsen en te laten "wrappen" op kleinere schermen.
  - `.scenario-card` erft basisstijlen van `.info-card` en voegt specifieke flex-eigenschappen en typografie toe.

#### Gestandaardiseerde Technologie/Platform Kaart (`tech-showcase`)
Om een consistente weergave van externe technologieën, platformen of tools te garanderen, is het gestandaardiseerde `tech-showcase` component geïntroduceerd. Dit component vervangt alle voorgaande, inconsistente varianten zoals `platform-card` en `resource-card`.

- **HTML Structuur:**
  - Container: `<div class="tech-showcase">`
  - Item: `<div class="tech-item">` (voor elke tool/platform)
    - Logo: `<div class="tech-logo"><img ...></div>`
    - Beschrijving: `<div class="tech-description"><h3>Titel</h3><p>...</p><a class="tech-link">...</a></div>`
    - Media: `<div class="tech-media">...</div>` (voor een video-embed of afbeelding)

- **Styling (`css/styles.css`):**
  - Gebruikt CSS Grid (`display: grid`) voor een responsive layout van de items.
  - Zorgt voor een uniforme uitlijning en styling, ongeacht of er een logo of media aanwezig is.

#### Video Componenten
Voor het embedden van video's zijn er specifieke, responsive componenten beschikbaar.

- **HTML Structuur (Basis):**
  - Wrapper: `<div class="video-wrapper">` (Deze zorgt voor de juiste 16:9 aspect ratio)
    - Iframe: `<iframe src="..."></iframe>`
  - Optionele titel: `<p class="video-title">...</p>`

- **Layouts:**
  1.  **Volledige Breedte**:
      - Container: `<div class="video-container-full-width">`
      - Bevat één `video-wrapper`.
  2.  **Grid (2 of 3 kolommen)**:
      - Container: `<div class="video-grid-container video-grid-container-2-col">` (of `-3-col`).
      - Bevat meerdere `div`'s, die elk een `video-wrapper` en optionele `video-title` bevatten.

- **Styling (`css/styles.css`):**
  - `.video-wrapper` gebruikt de "padding-top" truc (`padding-top: 56.25%`) om de 16:9 verhouding te behouden.
  - `.video-grid-container` gebruikt CSS Grid (`display: grid`) met `auto-fit` en `minmax()` voor een volledig responsive gedrag. De kolommen vallen automatisch terug naar een enkele kolom op smalle schermen.

## Clonen voor ander thema
Bij het aanpassen voor een ander thema:
1. Behoud de bestandsstructuur
2. Pas de inhoud van de JSON bestanden aan
3. `hoofdstuk_afsluiting.json` blijft het afsluitende hoofdstuk
4. Pas `config.json` aan voor thema-specifieke instellingen
5. Pas `totalSections` aan naar het gewenste aantal 
6. **Nieuw**: De voortgangslogica en PDF generatie schalen automatisch mee 

### Update 2024: Afsluitend hoofdstuk structuur
- Titel: 'Afsluiting - Afsluitquiz en Certificaat'
- Nieuwe sectie: 'afsluitQuizIntro' (paars info-card blok, met subtitel en tekst)
- VRAAK-criteria zijn nu onderdeel van portfolioIntegratie (als veld 'vraakCriteria'), en worden als accordion binnen het paarse vlak getoond
- Rendering in dynamicContent.js verwerkt deze structuur

**Voorbeeldstructuur:**
{
  "titel": "Afsluiting - Afsluitquiz en Certificaat",
  "afsluitQuizIntro": {
    "subtitel": "Afsluitende quiz",
    "tekst": "..."
  },
  ...
  "portfolioIntegratie": {
    ...
    "vraakCriteria": { ... }
  },
  ...
} 

## Zoekfunctionaliteit (`js/search.js`)

De zoekfunctionaliteit indexeert content uit de JSON-bestanden van de hoofdstukken. Belangrijke aspecten:

- **Configuratie (`content/search_config.json`):**
  - Bevat de `knownListKeys` array met JSON-sleutels die duiden op lijsten
  - Wordt asynchroon geladen bij het opstarten van de zoekfunctionaliteit
  - Heeft een ingebouwde fallback lijst voor als het bestand niet geladen kan worden
  - Maakt onderhoud van lijst-detectie eenvoudiger zonder code-aanpassingen

- **Data Preparatie (`prepareSearchableData`):**
  - Haalt tekstuele content uit hoofdstuk JSON-bestanden
  - Gebruikt de geladen `knownListKeys` voor identificatie van lijstitems
  - Voor correcte werking bij het scrollen naar lijstitems in zoekresultaten, moeten nieuwe lijst-sleutels worden toegevoegd aan `content/search_config.json` in plaats van de JavaScript code
  - Slaat feedback van interacties niet op in de doorzoekbare data

- **Zoeklogica (`handleSearchInput`):**
  - Filtert `searchableData` op basis van de gebruikersquery
  - Gebruikt tekst highlighting voor resultaten
  - Ondersteunt scrollen naar specifieke content elementen

- **Initialisatie**: Bij het laden van de pagina wordt de zoekfunctionaliteit automatisch geïnitialiseerd via `initializeSearch()`

- **Fallback mechanisme**: Als configuratiebestanden niet geladen kunnen worden, gebruikt het systeem ingebouwde standaardwaarden om functionaliteit te garanderen 