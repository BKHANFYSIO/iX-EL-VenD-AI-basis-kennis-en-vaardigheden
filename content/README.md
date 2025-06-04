# Content Bestanden - E-learning Zorgtechnologie

## Overzicht bestanden

### Hoofdstukken
De hoofdstukken zijn genummerd van 1 t/m N:
- `hoofdstuk1.json` - Eerste hoofdstuk
- `hoofdstuk2.json` - Tweede hoofdstuk
- ...
- `hoofdstukN.json` - Laatste reguliere hoofdstuk
- `hoofdstuk_afsluiting.json` - Afsluitend hoofdstuk (altijd de laatste sectie)

### Overige bestanden
- `config.json` - Algemene configuratie (titel, logo, metadata)
- `afsluitquiz.json` - Quiz vragen voor het afsluitende hoofdstuk

## Belangrijke opmerkingen

### Waarom heet het laatste hoofdstuk niet hoofdstuk[N+1].json?
Het laatste hoofdstuk heeft bewust een afwijkende naam omdat:
1. Het een speciale functie heeft (certificaat, portfolio tips)
2. Het altijd het laatste blijft, ook als je meer/minder hoofdstukken hebt
3. De naam maakt direct duidelijk dat dit het afsluitende deel is

### Hoofdstukken toevoegen/verwijderen
Als je het aantal hoofdstukken wilt aanpassen:
1. Voeg nieuwe `hoofdstukX.json` bestanden toe (X = nummer)
2. Pas `totalSections` aan in `/js/script.js` (aantal reguliere hoofdstukken + 1)
3. Update de `chapters` array in `/js/script.js`
4. Pas de navigatie aan in `/index.html`
5. `hoofdstuk_afsluiting.json` blijft altijd het laatste hoofdstuk

### Structuur hoofdstuk bestanden
Elk hoofdstuk bestand bevat:
- `content`: De inhoud van het hoofdstuk
- `interacties`: Array met interactieve elementen (quiz, reflectie, etc.)

Het afsluitende hoofdstuk heeft een afwijkende structuur met certificaat informatie.

### Huidige configuratie
In de huidige setup zijn er 7 reguliere hoofdstukken plus 1 afsluitend hoofdstuk (totaal 8 secties). 