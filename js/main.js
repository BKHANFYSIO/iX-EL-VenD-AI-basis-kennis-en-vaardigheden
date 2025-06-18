// Helper functie voor development logging
window.devLog = function(...args) {
    const isDevelopmentMode = document.body.classList.contains('development-mode');
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isDevelopmentMode || isLocalhost) {
        console.log(...args);
    }
}

// Wacht tot de DOM geladen is
document.addEventListener('DOMContentLoaded', function() {
    // Collapsible sections voor style-guide
    var coll = document.getElementsByClassName('collapsible');
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener('click', function() {
            this.classList.toggle('active');
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    }
});

async function initializeElearning() {
    try {
        const response = await fetch('content/config.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const config = await response.json();

        // Initialiseer globale variabelen voor andere scripts
        if (typeof initializeGlobals === 'function') {
            initializeGlobals(config);
        }

        // Bouw de UI
        populateUI(config);

        // Start de rest van de applicatie-logica (uit script.js)
        if (typeof runApplicationLogic === 'function') {
            runApplicationLogic();
        }

    } catch (error) {
        console.error('Fout bij het initialiseren van de e-learning:', error);
        // Toon een foutmelding aan de gebruiker
        const mainContainer = document.querySelector('.container');
        if (mainContainer) {
            mainContainer.innerHTML = '<p class="error-message">De e-learning kon niet worden geladen. Controleer de configuratie en probeer het opnieuw.</p>';
        }
    }
}

function populateUI(config) {
    const sidebarChaptersContainer = document.getElementById('sidebarChapters');
    const mainContainer = document.querySelector('main.container');
    const headerTitle = document.querySelector('.header-title');

    // Update de algemene e-learning titel in de header
    if (headerTitle && config.titel) {
        headerTitle.textContent = config.titel;
    }

    if (!sidebarChaptersContainer || !mainContainer) {
        console.error('Essentiële containers voor UI-populatie niet gevonden.');
        return;
    }

    // Leegmaken van de hardcoded content
    sidebarChaptersContainer.innerHTML = '';
    mainContainer.innerHTML = '';

    // Bouw de UI op basis van de config
    config.hoofdstukken.forEach((hoofdstuk, index) => {
        const sectionNumber = index + 1;

        // Bouw sidebar item
        const li = document.createElement('li');
        li.className = 'sidebar-chapter';
        li.setAttribute('data-section', sectionNumber);
        li.innerHTML = `
            <span class="chapter-circle" id="circle-${sectionNumber}">${sectionNumber}</span>
            <span class="chapter-title" title="${hoofdstuk.titel}">${hoofdstuk.titel}</span>
        `;
        sidebarChaptersContainer.appendChild(li);

        // Bouw content section - EENZELFDE STRUCTUUR VOOR ALLE SECTIES
        const section = document.createElement('section');
        section.id = `section${sectionNumber}`;
        section.className = 'section';

        // Voeg de .active class toe aan de eerste sectie
        if (sectionNumber === 1) {
            section.classList.add('active');
        }

        // Voeg een speciale class toe aan de laatste (afsluiting) sectie
        if (sectionNumber === config.hoofdstukken.length) {
            section.classList.add('afsluiting-section');
        }

        section.setAttribute('data-section', sectionNumber);

        const h2 = document.createElement('h2');
        h2.textContent = hoofdstuk.titel;
        h2.className = 'chapter-main-title';
        section.appendChild(h2);

        const contentContainer = document.createElement('div');
        contentContainer.className = 'section-content';
        contentContainer.id = `section${sectionNumber}-content-container`;
        section.appendChild(contentContainer);

        const errorContainer = document.createElement('div');
        errorContainer.id = `hoofdstuk${sectionNumber}-error`;
        section.appendChild(errorContainer);

        // Navigatie knoppen
        const navButtons = document.createElement('div');
        navButtons.className = 'nav-buttons';

        if (sectionNumber > 1) {
            const prevButton = document.createElement('button');
            prevButton.className = 'btn btn-prev';
            prevButton.textContent = 'Vorige';
            prevButton.onclick = () => prevSection();
            navButtons.appendChild(prevButton);
        }

        if (sectionNumber < config.hoofdstukken.length) {
            const nextButton = document.createElement('button');
            nextButton.className = 'btn btn-next';
            nextButton.textContent = 'Volgende';
            nextButton.onclick = () => nextSection();
            navButtons.appendChild(nextButton);
        }

        if (sectionNumber === 1) {
            navButtons.style.justifyContent = 'flex-end';
        } else if (sectionNumber === config.hoofdstukken.length) {
            navButtons.style.justifyContent = 'flex-start';
        }
        
        section.appendChild(navButtons);
        mainContainer.appendChild(section);
    });
}

document.addEventListener('DOMContentLoaded', initializeElearning); 