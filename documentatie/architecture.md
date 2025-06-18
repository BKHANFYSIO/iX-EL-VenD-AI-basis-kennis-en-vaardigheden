# E-learning Architectuur

Dit document biedt een diepgaand technisch overzicht van de e-learning module.

## 1. Architectuur & Dataflow

Deze e-learning is gebouwd op een dynamische architectuur waarbij de content en structuur volledig zijn losgekoppeld van de weergave. De `config.json` fungeert als de "Single Source of Truth".

### Initialisatie-volgorde:
1.  **`js/main.js` (`initializeElearning`)** wordt als eerste uitgevoerd bij het laden van de pagina.
2.  Het script haalt **`content/config.json`** op.
3.  Op basis van de `hoofdstukken`-array in de config, worden de globale variabelen `chapters` en `totalSections` gevuld in `js/script.js`.
4.  Vervolgens wordt de HTML-structuur dynamisch opgebouwd:
    *   De navigatie-items in de sidebar worden gegenereerd.
    *   De `<section>`-elementen voor elk hoofdstuk worden in de hoofdpagina geplaatst.
5.  Tot slot wordt de overige applicatielogica in `js/script.js` uitgevoerd (event listeners, voortgangsberekening, etc.).

---

## 2. Bestandsstructuur & Rollen

-   `/content/`: Bevat alle content en de centrale configuratie.
    -   **`config.json`**: **Het belangrijkste configuratiebestand.** Definieert de algemene titel, leerdoelen, en de volledige structuur van de hoofdstukken (bestandsnamen en titels).
    -   `hoofdstuk1.json` t/m `hoofdstukN.json`: Inhoud voor de reguliere hoofdstukken.
    -   `hoofdstuk_afsluiting.json`: De content voor het laatste, afsluitende hoofdstuk, dat een unieke structuur heeft.
    -   `afsluitquiz.json`: De vragen voor de eindquiz.
    -   `search_config.json`: Configuratie voor de zoekfunctionaliteit.
-   `/js/`: Bevat de logica van de applicatie.
    -   **`main.js`**: De "orkestrator". Start de applicatie, leest de configuratie en bouwt de dynamische UI.
    -   **`script.js`**: Bevat de algemene logica voor de gebruikersinterface, zoals navigatie (volgende/vorige), voortgangsupdates en het afhandelen van interacties.
    -   **`dynamicContent.js`**: Verantwoordelijk voor het laden en renderen van de specifieke content van een hoofdstuk wanneer dit wordt geactiveerd.
    -   `pdfGenerator.js`: Genereert het PDF-certificaat.
    -   `quiz.js`: Regelt de logica voor de eindquiz.
    -   `search.js`: Behandelt de zoekfunctionaliteit.
-   `/css/`: Bevat alle styling.
-   `index.html`: Dient als een "schil" met lege containers die dynamisch worden gevuld door `js/main.js`.

---

## 3. Content Structuur & JSON Schema's

### `config.json`
Het hart van de e-learning. De `hoofdstukken`-array bepaalt de volgorde en titels.

```json
{
  "titel": "AI basiskennis en vaardigheden",
  "leerdoelen": [...],
  "hoofdstukken": [
    { "file": "hoofdstuk1.json", "titel": "Introductie" },
    { "file": "hoofdstuk2.json", "titel": "Wat is AI eigenlijk?" },
    // ...meer hoofdstukken...
    { "file": "hoofdstuk_afsluiting.json", "titel": "Afsluiting" }
  ],
  "organisatie": "iXperium Health",
  // ... rest van de config ...
}
```

### `hoofdstukX.json` en Interacties
De structuur van de hoofdstuk-JSON bestanden en de interactie-schema's blijven ongewijzigd.

**ID-structuur:** `{hoofdstuknummer}_{type}_{volgnummer}` (bijv. `h1_mc_1`)

---

## 4. Een Hoofdstuk Wijzigen, Toevoegen of Verwijderen

Dankzij de dynamische architectuur is het aanpassen van de structuur zeer eenvoudig:

1.  **Open `content/config.json`**.
2.  **Pas de `hoofdstukken`-array aan**:
    *   **Wijzigen**: Verander de `titel` van een object.
    *   **Toevoegen**: Voeg een nieuw object `{ "file": "nieuw_hoofdstuk.json", "titel": "Nieuwe Titel" }` toe op de gewenste positie. Maak het bijbehorende JSON-bestand aan in de `/content` map.
    *   **Verwijderen**: Verwijder een object uit de array.

De gehele applicatie (navigatie, secties, titels, voortgang) past zich automatisch aan. Er zijn **geen wijzigingen** in `index.html` of andere JavaScript-bestanden nodig.

---

## 5. Voortgang & Dataopslag (`localStorage`)

De voortgang en antwoorden van de gebruiker worden opgeslagen in `localStorage`. Dit stelt de gebruiker in staat om de cursus te verlaten en later terug te keren zonder de voortgang te verliezen.

-   **Voortgang per hoofdstuk:** De sleutel `chapterProgress` bevat een array die de status van elk hoofdstuk bijhoudt (0: niet gestart, 0.5: bezig, 1: voltooid).
-   **Antwoorden op interacties:** De antwoorden worden opgeslagen met een unieke sleutel die het type, hoofdstuknummer en interactie-ID combineert.
    -   `reflection_{id}_answered`: Tekst van het antwoord.
    -   `mc_{id}_answered`: Of de vraag beantwoord is.
    -   `mc_{id}_correct`: Of het antwoord correct was (1 of 0).
-   **Antwoorden op de eindquiz:** De sleutel `mc_quiz_answers` bevat een array met alle gegeven antwoorden op de quizvragen.

---

## 6. PDF Certificaat Generatie (`jsPDF`)

Het PDF-certificaat wordt volledig dynamisch gegenereerd door `pdfGenerator.js` met behulp van de jsPDF-bibliotheek. De generator haalt alle opgeslagen antwoorden uit `localStorage` op.

De PDF heeft de volgende opbouw:
1.  **Voorblad:** Met de titel van de cursus, naam van de student, organisatie, logo en datum.
2.  **Leerdoelen:** Een lijst van de leerdoelen uit `config.json`.
3.  **Resultaten Eindquiz:** Een overzicht van alle quizvragen, het gegeven antwoord (met kleurcodering voor goed/fout) en de feedback.
4.  **Portfolio per Hoofdstuk:** Voor elk hoofdstuk volgt een sectie met alle interacties en de door de gebruiker gegeven antwoorden.

Door deze dynamische opzet worden alle hoofdstukken en interacties automatisch meegenomen in het certificaat, ongeacht het aantal.

---

## 7. CSS Architectuur en Componenten

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
    -   `.accent-blok`: Een flexibel blok om tekst uit te lichten, zoals statistieken, weetjes of citaten. Kent varianten zoals `accent-blok--statistiek` en `accent-blok--weetje` die de styling aanpassen.
    -   `.modules-list` & `.benefit-card`: Voor een grid-layout met kaarten (voor voordelen, modules, etc.).
    -   `.video-container-full-width` & `.video-wrapper`: Voor responsive video-embeds.

De bedoeling is om altijd deze bestaande klassen te gebruiken om een consistente look & feel te garanderen.

---

## 8. Development & Debugging

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