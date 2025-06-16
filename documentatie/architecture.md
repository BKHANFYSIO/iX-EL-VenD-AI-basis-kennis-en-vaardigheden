# E-learning Architectuur

Dit document biedt een diepgaand technisch overzicht van de e-learning module. Voor een gebruikersgerichte handleiding over het opzetten van een nieuwe cursus, zie [Handleiding: Een nieuwe e-learning cursus opzetten](./Instructie_wijziging_inhoud.md).

## 1. Overzicht & Bestandsstructuur

De e-learning bestaat uit N reguliere hoofdstukken plus 1 afsluitend hoofdstuk. De belangrijkste bestanden voor de inhoud en configuratie bevinden zich in de `/content` map.

-   `/content/`
    -   `config.json`: Algemene configuratie (titel, leerdoelen, etc.).
    -   `hoofdstuk1.json` t/m `hoofdstukN.json`: Inhoud voor de reguliere hoofdstukken.
    -   `hoofdstuk_afsluiting.json`: De content voor het laatste, afsluitende hoofdstuk.
    -   `afsluitquiz.json`: De vragen voor de eindquiz.
    -   `search_config.json`: Configuratie voor de zoekfunctionaliteit.
-   `/js/`
    -   `script.js`: Hoofdscript voor de algemene logica, navigatie en initialisatie.
    -   `dynamicContent.js`: Verantwoordelijk voor het laden en renderen van de content uit de JSON-bestanden.
    -   `pdfGenerator.js`: Genereert het PDF-certificaat.
    -   `quiz.js`: Regelt de logica voor de eindquiz.
    -   `search.js`: Behandelt de zoekfunctionaliteit.
-   `/css/`
    -   `styles.css`: De hoofd-stylesheet met alle basisstijlen, variabelen en componenten.
    -   `/components/`: Map voor eventuele losse, complexere component-stylesheets.

---

## 2. Content Structuur & JSON Schema's

De content is volledig losgekoppeld van de code en wordt gedefinieerd in JSON-bestanden.

### `hoofdstukX.json`
Elk regulier hoofdstuk heeft de volgende basisstructuur:

```json
{
  "titel": "Titel van het Hoofdstuk",
  "content": {
    // HTML-content wordt hier geplaatst.
    // Dit wordt idealiter gegenereerd op basis van de stijlgids.
  },
  "interacties": [
    // Array met interactieve elementen, zie schema hieronder.
  ]
}
```

### Interactie-schema's
De `interacties` array bevat objecten die elk een interactief element representeren. Elk object vereist een unieke `id` en een `type`.

**ID-structuur:** `{hoofdstuknummer}_{type}_{volgnummer}` (bijv. `h1_mc_1`)

**Ondersteunde types:**

-   **`reflection` (Reflectie):**
    ```json
    {
      "id": "h1_reflection_1",
      "type": "reflection",
      "vraag": "Reflectiervraag hier",
      "minLength": 10,
      "maxLength": 500,
      "placeholder": "Typ hier je antwoord"
    }
    ```
-   **`mc` (Meerkeuzevraag):**
    ```json
    {
      "id": "h1_mc_1",
      "type": "mc",
      "titel": "Optionele titel",
      "vraag": "De vraag",
      "options": ["Optie 1", "Optie 2", "Optie 3"],
      "correctAnswer": 2,  // Let op: 1-based index!
      "feedback": "Feedback na beantwoording"
    }
    ```
-   **`dragdrop` (Sleepvraag):**
    ```json
    {
      "id": "h2_dragdrop_1",
      "type": "dragdrop",
      "vraag": "Sleep de items naar de juiste categorie",
      "items": [{"id": "item1", "label": "Item 1"}],
      "targets": [{"id": "target1", "label": "Categorie 1"}],
      "correctCombinations": [{"targetId": "target1", "itemId": "item1"}],
      "feedbackCorrect": "Goed gedaan!",
      "feedbackIncorrect": "Probeer het nog eens."
    }
    ```

### `hoofdstuk_afsluiting.json`
Dit bestand heeft een unieke structuur, gericht op het afronden van de cursus en het certificaat. Het bevat **geen** `interacties` array. De structuur is flexibel en de rendering wordt volledig afgehandeld door de `renderAfsluitingContent` functie in `dynamicContent.js`, die de objecten in dit bestand omzet naar HTML.

### `afsluitquiz.json`
Bevat een array met de vragen voor de eindquiz.

**ID-structuur:** `quiz_mc_{volgnummer}`

```json
[
  {
    "id": "quiz_mc_1",
    "text": "Wat is de hoofdstad van Nederland?",
    "options": ["Rotterdam", "Amsterdam", "Den Haag"],
    "correctAnswer": 2, // Let op: 1-based index!
    "feedback": "Amsterdam is de hoofdstad.",
    "title": "Afsluitquiz: Vraag 1"
  }
]
```

---

## 3. Laad- en Renderlogica

De e-learning is ontworpen om flexibel te zijn in het aantal hoofdstukken.

### Dynamisch Hoofdstukken Laden
-   In `js/script.js` bepalen de variabelen `totalSections` (aantal hoofdstukken + 1) en de `chapters` array de structuur van de cursus.
-   De functie `loadChapter(chapterNumber)` in `dynamicContent.js` laadt de content.
-   Het script detecteert het laatste hoofdstuk dynamisch via `if (chapterNumber === totalSections)` en laadt dan `hoofdstuk_afsluiting.json`.
-   Voor alle andere hoofdstukken wordt de content generiek gerenderd door `renderGenericChapterContent`, tenzij er een specifieke `renderChapterXContent` functie bestaat.

### Content Rendering
-   De content uit de JSON (`content` object) wordt direct als HTML in de pagina geplaatst. Het is de verantwoordelijkheid van de content creator (of de AI-assistent) om te zorgen dat deze HTML correct is opgemaakt volgens de [Stijlgids](./stijlgids.md).

---

## 4. Voortgang & Dataopslag (`localStorage`)

De voortgang en antwoorden van de gebruiker worden opgeslagen in `localStorage`. Dit stelt de gebruiker in staat om de cursus te verlaten en later terug te keren zonder de voortgang te verliezen.

-   **Voortgang per hoofdstuk:** De sleutel `chapterProgress` bevat een array die de status van elk hoofdstuk bijhoudt (0: niet gestart, 0.5: bezig, 1: voltooid).
-   **Antwoorden op interacties:** De antwoorden worden opgeslagen met een unieke sleutel die het type, hoofdstuknummer en interactie-ID combineert.
    -   `reflection_{id}_answered`: Tekst van het antwoord.
    -   `mc_{id}_answered`: Of de vraag beantwoord is.
    -   `mc_{id}_correct`: Of het antwoord correct was (1 of 0).
-   **Antwoorden op de eindquiz:** De sleutel `mc_quiz_answers` bevat een array met alle gegeven antwoorden op de quizvragen.

---

## 5. PDF Certificaat Generatie (`jsPDF`)

Het PDF-certificaat wordt volledig dynamisch gegenereerd door `pdfGenerator.js` met behulp van de jsPDF-bibliotheek. De generator haalt alle opgeslagen antwoorden uit `localStorage` op.

De PDF heeft de volgende opbouw:
1.  **Voorblad:** Met de titel van de cursus, naam van de student, organisatie, logo en datum.
2.  **Leerdoelen:** Een lijst van de leerdoelen uit `config.json`.
3.  **Resultaten Eindquiz:** Een overzicht van alle quizvragen, het gegeven antwoord (met kleurcodering voor goed/fout) en de feedback.
4.  **Portfolio per Hoofdstuk:** Voor elk hoofdstuk volgt een sectie met alle interacties en de door de gebruiker gegeven antwoorden.

Door deze dynamische opzet worden alle hoofdstukken en interacties automatisch meegenomen in het certificaat, ongeacht het aantal.

---

## 6. CSS Architectuur en Componenten

De styling is gecentraliseerd in `css/styles.css` en maakt gebruik van CSS-variabelen voor eenvoudige thematisering.

-   **:root Kleurenschema:**
    ```css
    :root {
      --primary-purple: #662483;
      --secondary-purple: #8A4A9E;
      /* ... en andere kleuren ... */
    }
    ```

-   **Belangrijkste herbruikbare componenten (klassen):**
    -   `.section`: De container voor een contentsectie.
    -   `.section-title`: De standaard titel voor een sectie.
    -   `.info-card`: Een uitgelicht blok met een paarse rand, voor quotes of belangrijke mededelingen.
    -   `.interactive-block`: De container voor een interactief element.
    -   `.modules-list` & `.benefit-card`: Voor een grid-layout met kaarten (voor voordelen, modules, etc.).
    -   `.tech-showcase` & `.tech-item`: Voor het gestandaardiseerd tonen van technologieën of tools.
    -   `.video-container-full-width` & `.video-wrapper`: Voor responsive video-embeds.

De bedoeling is om altijd deze bestaande klassen te gebruiken om een consistente look & feel te garanderen.

---

## 7. Development & Debugging

-   **Browser Console (F12):** De eerste plek om te kijken voor foutmeldingen.
-   **LocalStorage Inspecteren:** In de Developer Tools (F12), ga naar het `Application` (of `Opslag`) tabblad en selecteer `Local Storage` om alle opgeslagen data te bekijken.
-   **Voortgang Wissen:**
    -   Gebruik de "Wis alle voortgang" knop in de UI.
    -   Of voer `localStorage.clear()` uit in de console om direct alle opgeslagen data te verwijderen.
-   **Test Commando's in de Console:**
    ```javascript
    // Check de voortgangsarray
    console.log(JSON.parse(localStorage.getItem('chapterProgress')));

    // Check een specifiek antwoord
    console.log(localStorage.getItem('reflection_h1_reflection_1_answered'));
    ``` 