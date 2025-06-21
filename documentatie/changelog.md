# Changelog - AI basis kennis en vaardigheden

## [1.6.0] - 2025-06-07

### Toegevoegd
- **Nieuwe Video Componenten**:
    - Drie nieuwe, responsive video-componenten toegevoegd aan `styles.css` en de showcase:
        1.  `.video-container-full-width`: Voor een video over de volledige content-breedte.
        2.  `.video-grid-container-2-col`: Een grid voor twee video's naast elkaar.
        3.  `.video-grid-container-3-col`: Een grid voor drie video's naast elkaar.
- **Uitbreiding Showcase Interactieve Componenten**:
    - De showcase bevat nu ook visuele voorbeelden van `Multiple Choice`, `Drag & Drop`, `Flashcards` en `Kritische Analyse` om een completer overzicht te bieden.

## [1.5.0] - 2025-06-07

### Verbeterd
- **Componenten Showcase (Style Guide) volledig herzien**:
  - De showcase in de "Development Mode" is volledig opgeschoond en opnieuw opgebouwd.
  - Alle componenten zijn nu een 1-op-1 representatie van de styling in `styles.css`.
  - Verouderde, dubbele en incorrecte componenten (zoals `platform-card` en `resource-card`) zijn verwijderd.
  - De componenten zijn logisch gehergroepeerd in categorieën: "Layout & Structuur", "Informatieblokken", "Kaarten (Cards)", "Complexe Componenten" en "Interactieve Componenten".
  - Een nieuw, uniform component `icon-card-grid` vervangt de oude platform- en resourcekaarten voor een consistente weergave van externe tools, technologieën en andere content ondersteund door iconen.
  - De showcase is nu een betrouwbare en gebruiksvriendelijke bron voor ontwikkelaars en content creators.

## [Huidige Datum] - Versie X.X.X

### Toegevoegd
- Volledig nieuwe inhoud voor Hoofdstuk 1: "Introductie – AI: Jouw Toekomst, Jouw Kracht!", inclusief:
    - Nieuwe welkomsttekst en introductie.
    - Sectie "Stel je eens voor…" met twee uitgewerkte scenario's (Fysiotherapeut in 2027 & Student met AI-coach), gestructureerd voor weergave als naast elkaar geplaatste tegels.
    - Sectie "Waarom AI NU zo relevant is voor jou" met een "Eyeopener-statistiek" en een "Fun fact".
    - Sectie "Leren werken met AI: Net als spiertraining!" met metaforen over leren.
    - Sectie "Jouw Leerpad: Een Serie van Drie Modules" die het curriculum schetst.
    - Sectie "Wat levert dit jou op? Jouw Portfolio Booster!".
    - Nieuwe reflectie-opdracht "Mini-opdracht 1.1: Jouw AI Startpunt" (ID: `h1_reflection_1`).

### Gewijzigd
- **Visuele weergave Hoofdstuk 1 ("Stel je eens voor...")**: De scenario's worden nu weergegeven als twee kaarten naast elkaar voor een duidelijkere en aantrekkelijkere presentatie.
  - Hiervoor is `js/dynamicContent.js` (functie `renderChapter1Content`) aangepast.
  - Nieuwe CSS-stijlen zijn toegevoegd in `css/custom-scenario-styles.css` (dit bestand moet handmatig gelinkt worden in `index.html`).

## [1.2.2] - 2025-01-26

### Gewijzigd - Afsluitend Hoofdstuk Structuur
- **Nieuwe structuur geïmplementeerd voor `hoofdstuk_afsluiting.json`**:
  - Titel veranderd van "Afsluiting: Test je kennis & ontvang je certificaat" naar "Jouw Certificaat en Groeipad"
  - Focus verschoven van alleen certificaat naar groei en ontwikkeling
  - Nieuwe secties toegevoegd:
    - `stimulansHerhalingLeren`: Benadrukt het belang van herhaling en continu leren
    - `portfolioIntegratie`: Praktische tips voor gebruik in eJournal/Portfolio
    - `verderKijkenDanCertificaten`: Concrete suggesties voor verdere ontwikkeling
  - Uitgebreide VRAAK criteria beschrijvingen
- **`renderAfsluitingContent()` aangepast** voor nieuwe structuur:
  - Ondersteunt markdown opmaak in tekstvelden
  - VRAAK criteria als uitklapbare accordion
  - Betere structurering van content secties
- **Documentatie volledig bijgewerkt**:
  - `architecture.md`: Verwijzing naar `renderChapter8Content()` gecorrigeerd naar `renderAfsluitingContent()`
  - Toegevoegd: gedetailleerde beschrijving van de structuur van het afsluitende hoofdstuk
  - `Instructie_wijziging_inhoud.md`: Nieuwe sectie 18 toegevoegd met praktische stap-voor-stap instructies
  - Voorbeelden voor tekst formatting, markdown gebruik, en veelgemaakte aanpassingen

### Verbeterd
- Certificaat positionering als hulpmiddel voor groei in plaats van eindpunt
- Meer nadruk op praktische toepassing en portfolio-integratie
- Betere begeleiding voor studenten in hun leerproces
- Duidelijkere documentatie voor toekomstige aanpassingen aan het afsluitende hoofdstuk

## [1.2.1] - Huidige Datum (Vervang met DD-MM-JJJJ)

### Gewijzigd
- Hoofdstuk 6 ("Jij aan Zet - De Basis V-Competenties") en Hoofdstuk 7 ("Vinden van Zorgtechnologie - Waar begin je?") zijn van volgorde gewisseld. Alle bijbehorende bestandsnamen, interne ID's, JavaScript configuraties en HTML-verwijzingen zijn bijgewerkt om de nieuwe volgorde correct te reflecteren.
- Verwijdering van "Revalidatie AppStore" uit de bronnenlijst in Hoofdstuk 6.
- Introductietekst van Hoofdstuk 6 bijgewerkt voor meer context en een actievere toon.

### Toegevoegd
- Drag & drop interactie toegevoegd aan Hoofdstuk 6 om kennis over informatiebronnen te testen.

## [1.1.1] - 2025-01-25

### Verbeterd - PDF Generatie
- **PDF generatie volledig flexibel gemaakt**:
  - Hardcoded `hoofdstukken = [1,2,3,4,5,6,7]` vervangen door dynamische array
  - Hoofdstukken worden nu automatisch bepaald op basis van `totalSections`
  - PDF werkt nu automatisch met elk aantal hoofdstukken zonder code aanpassingen

## [1.1.0] - 2025-01-25

### Verbeterd - Technische Flexibiliteit
- **Verwijderd alle hardcoded hoofdstuknummers** uit JavaScript:
  - Switch statement (cases 1-8) vervangen door dynamische functie lookup
  - `renderChapter8Content` hernoemd naar `renderAfsluitingContent`
  - Sectie 8 checks vervangen door `totalSections` checks
- **Toegevoegd generieke hoofdstuk renderer**:
  - `renderGenericChapterContent()` voor hoofdstukken zonder specifieke renderer
  - Maakt het mogelijk om nieuwe hoofdstukken toe te voegen zonder nieuwe render functies
- **Verbeterde flexibiliteit**:
  - E-learning werkt nu automatisch met elk aantal hoofdstukken
  - Geen code aanpassingen nodig bij toevoegen/verwijderen hoofdstukken (behalve config)

### Opmerking
- HTML (`index.html`) bevat nog hardcoded sectienummers die handmatig aangepast moeten worden

## [1.0.3] - 2025-01-25

### Verbeterd
- Alle documentatie generiek gemaakt voor flexibel aantal hoofdstukken:
  - Verwijzingen naar "7 reguliere hoofdstukken" vervangen door "N hoofdstukken"
  - Concrete voorbeelden toegevoegd voor het aanpassen van aantal hoofdstukken
  - Documentatie nu bruikbaar voor e-learnings met elk aantal hoofdstukken
- Verduidelijkt dat `totalSections` = aantal reguliere hoofdstukken + 1

## [1.0.2] - 2025-01-25

### Verbeterd
- Documentatie `Instructie_wijziging_inhoud.md` uitgebreid met:
  - Technische architectuur details uit `architecture.md`
  - Volledige localStorage key documentatie
  - Gedetailleerde PDF/certificaat structuur uitleg
  - Drag & Drop correctCombinations structuur update (van object naar array)
  - Extra debugging tips en console commando's
  - Server start instructies toegevoegd

### Samengevoegd
- Inhoud van `architecture.md` geïntegreerd in hoofddocumentie voor betere vindbaarheid

## [1.0.1] - 2025-01-25

### Toegevoegd
- Documentatie map met `architecture.md` voor technische documentatie
- Uitgebreide uitleg over de naamgeving van `hoofdstuk_afsluiting.json`
- Instructies voor het clonen en aanpassen van de e-learning voor andere thema's

### Beslissingen
- Besloten om `hoofdstuk_afsluiting.json` NIET te hernoemen naar `hoofdstuk8.json`
- Reden: De afwijkende naam maakt de speciale functie van dit hoofdstuk duidelijk
- Dit maakt het makkelijker om het aantal reguliere hoofdstukken aan te passen zonder het afsluitende hoofdstuk te hoeven hernoemen

## [1.0.0] - 2024-03-20

### Initiële release
- Basis e-learning structuur met 8 hoofdstukken
- Interactieve elementen: reflecties, meerkeuze vragen, drag & drop, zelfevaluatie
- Certificaat generatie functionaliteit
- Responsive design voor desktop, tablet en mobiel

## [1.1.2] - 2025-01-26

### Toegevoegd
- Een waarschuwingsbanner toegevoegd aan het begin van hoofdstuk 1. Deze banner informeert de gebruiker dat de voortgang lokaal wordt opgeslagen en verloren kan gaan bij het wissen van browsergegevens of het gebruik van een andere computer/apparaat. 

## [1.1.3] - 2025-01-26

### Verbeterd
- Knoptekst van "Opslaan" naar "Opgeslagen" gewijzigd voor de kritische analyse interactie nadat deze is opgeslagen. De knop wordt ook disabled. 

## [1.1.4] - 2025-01-26

### Verbeterd
- Poging tot correctie van de "Opslaan"-knop bij de zelfevaluatie, zodat deze "Opgeslagen" toont en disabled wordt na opslaan. Dubbele functie-definitie van `saveSelfAssessment` verwijderd. 

## [1.2.0] - 2025-01-26

### Verbeterd - Volledig Dynamische Voortgangslogica
- **Hardcoded arrays vervangen door dynamische generatie**:
  - `chaptersToUpdate` in `updateAllChapterProgress()` nu dynamisch: `Array.from({length: totalSections - 1}, (_, i) => i + 1)`
  - `chapterMeta` nu dynamisch: `Array.from({length: totalSections}, (_, i) => ({ section: i + 1 }))`
  - `chaptersToMigrate` en `chaptersToUpdate` in migratie functies nu dynamisch
- **PDF generatie volledig schaalbaar**:
  - Hoofdstukken loop in PDF generatie nu dynamisch op basis van `totalSections`
  - Alle hoofdstukken worden automatisch meegenomen in certificaat
- **Root cause opgelost**:
  - Voortgang van nieuwe hoofdstukken wordt nu correct bijgehouden in bolletjes
  - Geen hardcoded hoofdstuknummers meer in voortgangslogica
- **Architectuur documentatie bijgewerkt** met details over dynamische voortgangslogica

### Impact
- E-learning is nu volledig schaalbaar voor elk aantal hoofdstukken
- Toevoegen van hoofdstukken vereist alleen aanpassing van `totalSections` en content bestanden
- Voortgang, PDF generatie en migratie werken automatisch voor nieuwe hoofdstukken

## [1.1.4] - 2025-01-26

### Verbeterd
- Poging tot correctie van de "Opslaan"-knop bij de zelfevaluatie, zodat deze "Opgeslagen" toont en disabled wordt na opslaan. Dubbele functie-definitie van `saveSelfAssessment` verwijderd.

## [Datum] - Versie X.Y.Z

### Toegevoegd
- Reflectievraag in Hoofdstuk 6 bijgewerkt.

### Gewijzigd
- Verwijdering van "Revalidatie AppStore" uit de bronnenlijst in Hoofdstuk 6.
- Introductietekst van Hoofdstuk 6 bijgewerkt voor meer context en een actievere toon.

## [datum invullen] - Afsluitend hoofdstuk herzien
- Titel gewijzigd naar 'Afsluiting - Afsluitquiz en Certificaat'
- Quizintro als paars info-card blok met subtitel toegevoegd
- VRAAK-criteria nu als accordion binnen het paarse portfolio-blok
- Rendering in dynamicContent.js aangepast

## [1.1.0] - 2025-06-01
### Toegevoegd
- Zoekfunctionaliteit geïmplementeerd:
    - Zoekveld in de header.
    - Real-time zoeken (as-you-type) in alle hoofdstukcontent en interacties (m.u.v. de afsluitende quiz).
    - Resultaten worden getoond als een lijst met hoofdstuktitel en een snippet van de tekst.
    - Klikken op een resultaat navigeert naar de betreffende sectie.
    - Content wordt dynamisch geïndexeerd bij het laden van de pagina.

## [1.0.0] - Datum vorige versie
### Basisfunctionaliteit
- ... (vorige features)

## [Huidige Datum] - Verbeteringen Zoekfunctionaliteit

- De zoekfunctionaliteit is verbeterd zodat bij het klikken op een zoekresultaat dat verwijst naar een item in een lijst (bullet point, genummerde lijst, etc.) nu correct naar dit item wordt gescrolld en de tekst wordt gemarkeerd.
- De logica voor het identificeren van lijstitems is robuuster gemaakt door beter te kijken naar de structuur van de JSON data (via `knownListKeys` in `js/search.js`).
- Feedback-teksten van interacties (bijv. na een multiple-choice vraag) worden nu correct uitgesloten van de zoekresultaten.

## [1.4.1] - 2025-06-02
### Fixed
- Probleem opgelost waarbij de tooltip van het informatie-icoon bij de zoekbalk bij de eerste klik kort verscheen en direct weer verdween. De event handling in `js/search.js` is aangepast voor robuuster gedrag.
- Tekst van de zoekinformatie-tooltip in `index.html` verduidelijkt met informatie over de accuratesse en een tip voor het gebruik van Ctrl+F. De incorrecte vermelding dat interacties niet doorzoekbaar zijn is verwijderd.

## [1.4.0] - 2025-06-01
### Added
- **Extern configuratiebestand voor zoekfunctionaliteit**: Geïntroduceerd `content/search_config.json` voor het beheren van `knownListKeys`
  - Verplaatst zoek-configuratie van JavaScript code naar extern JSON-bestand
  - Maakt onderhoud van lijst-detectie toegankelijker voor contentbeheerders
  - Toegevoegd fallback mechanisme voor wanneer het configuratiebestand niet geladen kan worden
  - Asynchroon laden van configuratie bij initialisatie van zoekfunctionaliteit

### Changed
- **Zoekfunctionaliteit verbeterd**: `js/search.js` aangepast om externe configuratie te gebruiken
  - `prepareSearchableData()` is nu async en laadt hoofdstukken dynamisch
  - `loadSearchConfig()` functie toegevoegd voor het laden van search configuratie
  - `setupSearchEventListeners()` functie toegevoegd voor betere code organisatie
  - Fallback configuratie ingebouwd voor robuustheid

### Updated
- **Documentatie bijgewerkt**: 
  - `documentatie/Instructie_wijziging_inhoud.md` aangepast om te verwijzen naar het nieuwe configuratiebestand
  - `documentatie/architecture.md` bijgewerkt met informatie over het externe configuratiebestand
  - Instructies voor het toevoegen van nieuwe lijststructuren vereenvoudigd

### Benefits
- Eenvoudiger onderhoud zonder JavaScript-kennis vereist
- Betere scheiding tussen configuratie en code  
- Flexibeler voor gebruik in verschillende projecten
- Veiliger door fallback mechanisme

## [1.3.0] - 2025-05-01

## [1.4.2] - 2024-07-29 (Huidige Datum)

### Toegevoegd
- Content voor Hoofdstuk 2: "Wat is AI eigenlijk?" toegevoegd aan `content/hoofdstuk2.json`.
  - Inclusief definities, korte geschiedenis van AI, uitleg over Machine Learning en Deep Learning.
  - Sectie "AI in Actie" met voorbeelden zoals social media filters, streamingdiensten, zorg-wearables en navigatie-apps.
  - Reflectie-opdracht (`h2_reflection_1`) waarin studenten worden gevraagd AI-toepassingen in hun dagelijks leven te identificeren en te beschrijven.

## [v2.2.0] - 2024-08-16
### ✨ Features
- **Gestapelde Modulelijst Component**: Toevoeging van de `.modules-list-stacked` klasse voor een verticale weergave van `benefit-card` elementen. Dit biedt meer flexibiliteit in de layout van contentblokken. De component is ook toegevoegd aan de style guide.

## [v2.1.0] - 2024-08-15
// ... bestaande code ...

## [v2.3.0] - 2024-08-16
### ✨ Features
- **Witte Info Card Component**: Toevoeging van de `.info-card.white-bg` klasse voor een variant van de info-card met een witte achtergrond en een subtiele rand. Deze is ook toegevoegd aan de style guide.

### ♻️ Changed
- **Content Update**: De derde video in de sectie "Verder kijken" in hoofdstuk 2 is vervangen door een video van de Universiteit van Nederland over de werking van AI.

## [v2.2.0] - 2024-08-16
// ... bestaande code ...