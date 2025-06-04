const baseContentPath = 'content/hoofdstuk'; // Assuming your content folder is named 'content'

async function fetchChapterData(chapterNumber) {
    let filePath = `${baseContentPath}${chapterNumber}.json`;
    // Check if it's the last section, and if so, use the specific afsluiting.json filename
    if (chapterNumber === totalSections) { // totalSections is globally defined in script.js, ensure accessible here or pass it
        filePath = 'content/hoofdstuk_afsluiting.json';
        console.log(`Fetching final chapter content from: ${filePath}`);
    }

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for ${filePath}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching chapter data:', error);
        const errorContainer = document.getElementById(`hoofdstuk${chapterNumber}-error`);
        if (errorContainer) {
            errorContainer.innerHTML = `<p class="error-message">Kon hoofdstuk ${chapterNumber} data niet laden. Controleer het pad en de bestandsnaam: ${filePath}</p>`;
        }
        return null; // Return null or some indicator of failure
    }
}

function renderChapter(chapterNumber, data) {
    if (!data) {
        // If it's the final chapter and data is null, it might be because hoofdstuk_afsluiting.json is missing
        // or there was an issue fetching it. The error message in fetchChapterData should cover this.
        console.error(`No data provided for chapter ${chapterNumber}`);
        const mainContentContainer = document.getElementById(`section${chapterNumber}-content-container`);
        if (mainContentContainer) {
             mainContentContainer.innerHTML = `<p class="error-message">Inhoud voor dit hoofdstuk (section ${chapterNumber}) kon niet geladen worden. Controleer of het JSON-bestand (mogelijk hoofdstuk_afsluiting.json) bestaat en correct is.</p>`;
        }
        return;
    }

    const mainContentContainer = document.getElementById(`section${chapterNumber}-content-container`);
    if (!mainContentContainer) {
        console.error(`Main content container not found for section${chapterNumber}`);
        return;
    }
    mainContentContainer.innerHTML = ''; // Clear previous content

    // Update chapter title in the main section if it's part of JSON and not static
    // Example: const sectionTitleElement = document.querySelector(`#section${chapterNumber} > h2`);
    // if (sectionTitleElement && data.titel) { // Assuming 'titel' is the key in your JSON for the main chapter title
    //     sectionTitleElement.textContent = data.titel;
    // }

    let htmlContent = '';

    // Call chapter-specific rendering functions
    // Check if this is the last chapter (afsluiting)
    if (chapterNumber === totalSections) {
        // This is the afsluiting chapter, use special renderer
        htmlContent = renderAfsluitingContent(data);
    } else {
        // Try to find a specific renderer for this chapter
        const renderFunctionName = `renderChapter${chapterNumber}Content`;
        if (typeof window[renderFunctionName] === 'function') {
            // Voor hoofdstuk 2, geef het volledige data object mee, anders data.content
            if (renderFunctionName === 'renderChapter2Content') {
                htmlContent = window[renderFunctionName](data);
            } else {
                htmlContent = window[renderFunctionName](data.content);
            }
        } else {
            // Use generic renderer if no specific one exists
            console.warn(`No specific renderer for chapter ${chapterNumber}, using generic renderer`);
            htmlContent = renderGenericChapterContent(data.content, chapterNumber);
        }
    }
    // Only set innerHTML if htmlContent is not empty. 
    // This is important for renderers like renderChapter8Content that modify existing DOM directly.
    if (htmlContent && htmlContent.trim() !== '') {
        mainContentContainer.innerHTML = htmlContent;
    }

    // Render interactions
    const interactionsContainer = document.getElementById(`section${chapterNumber}-interactions-container`) || mainContentContainer; // Use a dedicated container or fallback to main

    if (data.interacties && Array.isArray(data.interacties)) {
        data.interacties.forEach(interaction => {
            // Create a unique container for each interaction if it doesn't exist
            let interactionElement = document.getElementById(`hoofdstuk${chapterNumber}-${interaction.id}`);
            if (!interactionElement) {
                interactionElement = document.createElement('div');
                interactionElement.id = `hoofdstuk${chapterNumber}-${interaction.id}`;
                interactionElement.className = `interaction-placeholder ${interaction.type}-interaction-placeholder`; // Add type-specific class
                interactionsContainer.appendChild(interactionElement);
            }
            // Pass chapterNumber to renderInteraction
            renderInteraction(interaction, chapterNumber, interactionElement);
        });
    }
}

// renderInteraction now accepts chapterNumber and the direct container element
function renderInteraction(interactionData, chapterNumber, container) {
    container.innerHTML = ''; // Clear existing content
    let interactionHTML = '';
    switch (interactionData.type) {
        case 'reflection':
            interactionHTML = renderReflectionInteraction(interactionData, chapterNumber);
            break;
        case 'mc':
            interactionHTML = renderMCInteraction(interactionData, chapterNumber);
            break;
        case 'dragdrop':
            interactionHTML = renderDragDropInteraction(interactionData, chapterNumber);
            break;
        case 'selfassessment':
            interactionHTML = renderSelfAssessmentInteraction(interactionData, chapterNumber);
            break;
        case 'critical_analysis':
            interactionHTML = renderCriticalAnalysisInteraction(interactionData, chapterNumber);
            break;
        case 'flashcard':
            interactionHTML = renderFlashcardContent(interactionData, chapterNumber);
            break;
        default:
            interactionHTML = `<p>Onbekend interactie type: ${interactionData.type}</p>`;
            console.warn(`Unknown interaction type: ${interactionData.type}`);
    }
    container.innerHTML = interactionHTML;

    // If the interaction was drag and drop, initialize it
    if (interactionData.type === 'dragdrop') {
        if (typeof initializeSpecificDragDrop === 'function') {
            initializeSpecificDragDrop(container.id, chapterNumber, interactionData.id, interactionData.correctCombinations || {});
        } else {
            console.error('initializeSpecificDragDrop function not found in js/script.js');
        }
    } else if (interactionData.type === 'mc') {
        // If the interaction was multiple choice, initialize its event listeners
        if (typeof initializeMCInteraction === 'function') {
            initializeMCInteraction(container.id, interactionData, chapterNumber);
        } else {
            console.error('initializeMCInteraction function not found in js/script.js');
        }
    } else if (interactionData.type === 'flashcard') {
        initializeFlashcardInteraction(interactionData, chapterNumber);
    }
}

// Pass chapterNumber to renderReflectionInteraction
function renderReflectionInteraction(interactionData, chapterNumber) {
    const minLength = interactionData.minLength || 10;
    const maxLength = interactionData.maxLength || 500;
    const placeholder = interactionData.placeholder || `Typ hier je antwoord (minimaal ${minLength}, maximaal ${maxLength} tekens)`;
    const iconSvg = '<svg viewBox="0 0 24 24" class="icon"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"></path></svg>';
    const blockTitle = "Reflectie";

    const storageKey = `reflection_${chapterNumber}_${interactionData.id}_answered`;
    const savedAnswer = localStorage.getItem(storageKey) || '';
    const isSaved = !!savedAnswer;

    return `
        <div class="interactive-block">
            <div class="interactive-block-header">
                ${iconSvg}
                <h4>${blockTitle}</h4>
            </div>
            <div class="interactive-block-content">
                <div class="reflection-container">
                    <p class="reflection-question">${interactionData.vraag || 'Geen vraag gespecificeerd.'}</p>
                    <textarea id="${interactionData.id}-input" 
                              class="reflection-input" 
                              minlength="${minLength}" 
                              maxlength="${maxLength}" 
                              placeholder="${placeholder}">${savedAnswer}</textarea>
                    <button class="btn btn-save-reflection left-align-btn${isSaved ? ' btn-opgeslagen' : ''}" onclick="saveReflection(${chapterNumber}, '${interactionData.id}')" ${isSaved ? 'disabled' : ''}>${isSaved ? 'Opgeslagen' : 'Opslaan'}</button>
                    <div id="feedback-${chapterNumber}-${interactionData.id}" class="feedback-message"></div>
                </div>
            </div>
        </div>
    `;
}

// Pass chapterNumber to renderMCInteraction
function renderMCInteraction(interactionData, chapterNumber) {
    let optionsHtml = '';
    const storageKey = `mc_${chapterNumber}_${interactionData.id}_answered`;
    const isSaved = localStorage.getItem(storageKey) === 'true';
    if (interactionData.options && Array.isArray(interactionData.options)) {
        optionsHtml = '<ul class="mc-options">';
        interactionData.options.forEach((option, index) => {
            optionsHtml += `<li class="mc-option${isSaved ? ' disabled' : ''}" data-id="${index + 1}"${isSaved ? ' style=\"pointer-events:none;opacity:0.6;\"' : ''}>${option}</li>`;
        });
        optionsHtml += '</ul>';
    }
    const iconSvg = '<svg viewBox="0 0 24 24" class="icon"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path></svg>';
    const blockTitle = "Meerkeuze Vraag";
    const specificQuestionTitle = interactionData.titel ? `<h5 class="interaction-title">${interactionData.titel}</h5>` : '';
    return `
        <div class="interactive-block">
            <div class="interactive-block-header">
                ${iconSvg}
                <h4>${blockTitle}</h4>
            </div>
            <div class="interactive-block-content">
                <div class="mc-interaction mc-question${isSaved ? ' answered' : ''}" id="mc-${interactionData.id}"> 
                    ${specificQuestionTitle}
                    <p class="interaction-question">${interactionData.vraag || 'Geen vraag gespecificeerd.'}</p>
                    ${optionsHtml}
                    <div id="feedback-${interactionData.id}" class="feedback"></div>
                </div>
            </div>
        </div>
    `;
}

// Pass chapterNumber to renderDragDropInteraction
function renderDragDropInteraction(interactionData, chapterNumber) {
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }
    const storageKeyCorrect = `dragdrop_${chapterNumber}_${interactionData.id}_correct`;
    const storageKeyState = `dragdrop_${chapterNumber}_${interactionData.id}_state`;
    const isSavedCorrectly = localStorage.getItem(storageKeyCorrect) === 'true';
    let savedState = null;
    if (isSavedCorrectly) {
        try {
            savedState = JSON.parse(localStorage.getItem(storageKeyState));
        } catch (e) {
            console.error('Error parsing saved drag & drop state:', e);
            localStorage.removeItem(storageKeyCorrect);
            localStorage.removeItem(storageKeyState);
        }
    }

    let itemsHtml = '<div class="drag-container">';
    let items = interactionData.items && Array.isArray(interactionData.items) ? [...interactionData.items] : [];
    
    if (!savedState) {
        items = shuffle(items);
        items.forEach(item => {
            itemsHtml += `<div class="draggable" draggable="true" data-id="${item.id}"${isSavedCorrectly ? ' style="pointer-events:none;opacity:0.6;"' : ''}>${item.label}</div>`;
        });
    } else {
        const placedItemIds = savedState.map(s => s.itemId);
        items.filter(item => !placedItemIds.includes(item.id)).forEach(item => {
             itemsHtml += `<div class="draggable" draggable="${!isSavedCorrectly}" data-id="${item.id}"${isSavedCorrectly ? ' style="pointer-events:none;opacity:0.6;"' : ''}>${item.label}</div>`;
        });
    }
    itemsHtml += '</div>';

    let targetsHtml = '<div class="drop-targets">';
    if (interactionData.targets && Array.isArray(interactionData.targets)) {
        interactionData.targets.forEach(target => {
            let droppedItemHtml = '';
            if (savedState) {
                const stateForItemInTarget = savedState.find(s => s.targetId === target.id);
                if (stateForItemInTarget) {
                    const itemData = interactionData.items.find(i => i.id === stateForItemInTarget.itemId);
                    if (itemData) {
                        droppedItemHtml = `<div class="draggable correct" draggable="false" data-id="${itemData.id}" style="pointer-events:none;opacity:0.6;">${itemData.label}</div>`;
                    }
                }
            }
            targetsHtml += `
                <div class="drop-target" data-id="${target.id}">
                    <h5>${target.label}</h5>
                    <div class="dropped-items-container">${droppedItemHtml}</div> 
                </div>`;
        });
    }
    targetsHtml += '</div>';

    const containerId = `hoofdstuk${chapterNumber}-${interactionData.id}`;
    const iconSvg = '<svg viewBox="0 0 24 24" class="icon"><path d="M16 6l4 4-4 4-4-4 4-4zm0 8l4 4-4 4-4-4 4-4zM8 6l4 4-4 4-4-4 4-4zm0 8l4 4-4 4-4-4 4-4z"></path></svg>';
    const blockTitle = "Drag & Drop";
    const specificQuestionTitle = interactionData.vraag ? `<h5 class="interaction-title">${interactionData.vraag}</h5>` : '<h5 class="interaction-title">Drag & Drop Opdracht</h5>';
    const feedbackText = isSavedCorrectly && interactionData && interactionData.feedbackCorrect ? interactionData.feedbackCorrect : '';
    const feedbackClass = isSavedCorrectly ? 'correct' : '';

    return `
        <div class="interactive-block">
            <div class="interactive-block-header">
                ${iconSvg}
                <h4>${blockTitle}</h4>
            </div>
            <div class="interactive-block-content">
                <div class="interactive-exercise${isSavedCorrectly ? ' answered' : ''}" data-dragdrop-id="${interactionData.id}" data-initial-items='${JSON.stringify(interactionData.items)}' data-section-number="${chapterNumber}">
                    ${specificQuestionTitle}
                    ${itemsHtml}
                    ${targetsHtml}
                    <div class="dragdrop-feedback ${feedbackClass}" id="feedback-${chapterNumber}-${interactionData.id}">${feedbackText}</div>
                    <div class="dragdrop-buttons">
                        <button class="btn btn-check-dragdrop${isSavedCorrectly ? ' btn-opgeslagen' : ''}" onclick="checkDragDrop('${containerId}', ${chapterNumber}, '${interactionData.id}')"${isSavedCorrectly ? ' disabled' : ''}>${isSavedCorrectly ? 'Opgeslagen' : 'Controleer'}</button>
                        <button class="btn btn-reset-dragdrop" onclick="resetDragDrop(${chapterNumber}, '${interactionData.id}', '${containerId}')" style="display:${isSavedCorrectly ? 'none' : 'none'};">Reset</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Pass chapterNumber to renderSelfAssessmentInteraction
function renderSelfAssessmentInteraction(interactionData, chapterNumber) {
    const selfAssessmentId = interactionData.id;
    const competences = ['Veranderen', 'Vinden', 'Vertrouwen', 'Vaardig gebruiken', 'Vertellen'];
    let competencesHtml = '';
    const storageKey = `selfassessment_${chapterNumber}_${selfAssessmentId}_done`;
    const isSaved = !!localStorage.getItem(storageKey);
    let savedData = {};
    if (isSaved) {
        try { savedData = JSON.parse(localStorage.getItem(storageKey)); } catch {}
    }
    competences.forEach(comp => {
        const selectId = `${comp.toLowerCase().replace(' ', '')}-${chapterNumber}-${selfAssessmentId}`;
        competencesHtml += `
        <div class="assessment-item">
          <label for="${selectId}">${comp}:</label>
          <select id="${selectId}" class="assessment-select"${isSaved ? ' disabled' : ''}>
            <option value="">Kies een niveau</option>
            <option value="1"${isSaved && savedData[comp.toLowerCase().replace(' ', '')]==='1' ? ' selected' : ''}>1 - Beginnend</option>
            <option value="2"${isSaved && savedData[comp.toLowerCase().replace(' ', '')]==='2' ? ' selected' : ''}>2 - In ontwikkeling</option>
            <option value="3"${isSaved && savedData[comp.toLowerCase().replace(' ', '')]==='3' ? ' selected' : ''}>3 - Bekwaam</option>
          </select>
        </div>`;
    });
    const iconSvg = '<svg viewBox="0 0 24 24" class="icon"><path d="M12 4a4 4 0 100 8 4 4 0 000-8zM8 8a4 4 0 118 0 4 4 0 01-8 0zm0 8c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm10-5h-4v2h4v-2zm0-4h-4v2h4V7zm0-4h-4v2h4V3z"></path></svg>';
    const blockTitle = "Zelfevaluatie";
    const specificQuestionTitle = interactionData.vraag ? `<h5 class="interaction-title">${interactionData.vraag}</h5>` : '<h5 class="interaction-title">Zelfevaluatie Digitale Competenties</h5>';
    return `
        <div class="interactive-block">
            <div class="interactive-block-header">
                ${iconSvg}
                <h4>${blockTitle}</h4>
            </div>
            <div class="interactive-block-content">
                <div class="competency-assessment selfassessment-interaction">
                    ${specificQuestionTitle}
                    <div class="assessment-scale">
                        <span>1 = Beginnend</span>
                        <span>2 = In ontwikkeling</span>
                        <span>3 = Bekwaam</span>
                    </div>
                    <div class="assessment-grid">
                        ${competencesHtml}
                    </div>
                    <button class="btn${isSaved ? ' btn-opgeslagen' : ''}" onclick="saveSelfAssessment(${chapterNumber}, '${selfAssessmentId}')"${isSaved ? ' disabled' : ''}>${isSaved ? 'Opgeslagen' : 'Opslaan'}</button>
                    <div id="feedback-${chapterNumber}-${selfAssessmentId}" class="feedback-message"></div>
                </div>
            </div>
        </div>
    `;
}

function renderCriticalAnalysisInteraction(interactionData, chapterNumber) {
    const storageKey = `critical_analysis_${chapterNumber}_${interactionData.id}_answered`;
    const isSaved = !!localStorage.getItem(storageKey);
    let savedData = {};
    if (isSaved) {
        try { 
            savedData = JSON.parse(localStorage.getItem(storageKey)); 
            console.log('Loading critical analysis data:', savedData);
            console.log('Storage key:', storageKey);
        } catch (e) {
            console.error('Error parsing saved critical analysis data:', e);
        }
    }
    const dropdownOptions = (interactionData.dropdown || []).map(opt => `<option value="${opt.replace(/"/g, '&quot;')}"${isSaved && savedData.technologie===opt ? ' selected' : ''}>${opt}</option>`).join('');
    const vragenHtml = (interactionData.vragen || []).map(v => {
        const savedValue = isSaved && savedData[v.id] ? savedData[v.id].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
        return `
      <div class="form-group">
        <label for="${v.id}-input">${v.vraag}</label>
        <textarea id="${v.id}-input" class="critical-analysis-input form-control" rows="3"${isSaved ? ' readonly' : ''}>${savedValue}</textarea>
      </div>
    `;
    }).join('');
    const iconSvg = '<svg viewBox="0 0 24 24" class="icon"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>';
    const blockTitle = "Kritische Analyse";
    const specificQuestionPrompt = interactionData.vraag ? `<p class="interaction-question">${interactionData.vraag}</p>` : '';
    return `
        <div class="interactive-block">
            <div class="interactive-block-header">
                ${iconSvg}
                <h4>${blockTitle}</h4>
            </div>
            <div class="interactive-block-content">
                <div class="critical-analysis-container">
                    ${specificQuestionPrompt}
                    <div class="form-group">
                        <label for="critical-analysis-select">Selecteer een technologie: (bekijk evt. Hoofdstuk 2 nog een keer)</label>
                        <select id="critical-analysis-select" class="form-control"${isSaved ? ' disabled' : ''}>
                          <option value="">-- Maak een keuze --</option>
                          ${dropdownOptions}
                        </select>
                    </div>
                    ${vragenHtml}
                    <button class="btn left-align-btn${isSaved ? ' btn-opgeslagen' : ''}" onclick="saveCriticalAnalysis(${chapterNumber}, '${interactionData.id}')" ${isSaved ? ' disabled' : ''}>${isSaved ? 'Opgeslagen' : (interactionData.opslaanLabel || 'Opslaan')}</button>
                    <div id="feedback-${chapterNumber}-${interactionData.id}" class="feedback-message"></div>
                </div>
            </div>
        </div>
    `;
}

// Global function to load content for the currently active section
// This function will be called by your existing navigation logic (nextSection, prevSection, sidebar click)
async function loadContentForSection(sectionNumber) {
    console.log(`Attempting to load content for section: ${sectionNumber}`);
    // Check if section number is valid (between 1 and totalSections)
    if (sectionNumber >= 1 && sectionNumber <= totalSections) {
        const data = await fetchChapterData(sectionNumber);
        if (data) {
            renderChapter(sectionNumber, data);
            // If your existing script.js has a function to initialize interactions after content load, call it here.
            // e.g., if (typeof initializeSectionInteractions === 'function') { initializeSectionInteractions(sectionNumber); }
        } else {
            console.log(`Failed to load data for section ${sectionNumber}`);
            const mainContentContainer = document.getElementById(`section${sectionNumber}-content-container`);
            if (mainContentContainer) {
                 mainContentContainer.innerHTML = `<p class="error-message">Inhoud voor dit hoofdstuk kon niet geladen worden.</p>`;
            }
        }
    }
}

// Example of how your script.js might call this:
// When a section becomes active:
// currentSection = newSectionNumber;
// loadContentForSection(currentSection);

// Initial load for the first active section (assuming section 1 is active on page load)
// This needs to be coordinated with how your existing script.js determines the initial active section.
// document.addEventListener('DOMContentLoaded', () => {
//     const initiallyActiveSection = document.querySelector('.section.active');
//     if (initiallyActiveSection) {
//         const sectionNumber = parseInt(initiallyActiveSection.dataset.section, 10);
//         if (!isNaN(sectionNumber)) {
//             loadContentForSection(sectionNumber);
//         }
//     }
// });

console.log('dynamicContent.js loaded');

// Generic chapter renderer for chapters without specific render functions
function renderGenericChapterContent(content, chapterNumber) {
    let html = '';
    if (!content || typeof content !== 'object') {
        return '<p>Geen content beschikbaar voor dit hoofdstuk.</p>';
    }

    // Helper to create a list from an array of strings or objects with a 'tekst' property
    const createListHtml = (itemsArray, listClass = 'points-list') => {
        if (!Array.isArray(itemsArray) || itemsArray.length === 0) return '';
        let listHtml = `<ul class="${listClass}">`;
        itemsArray.forEach(item => {
            if (typeof item === 'string') {
                listHtml += `<li>${item}</li>`;
            } else if (typeof item === 'object' && item.tekst) {
                listHtml += `<li>${item.tekst}</li>`;
            }
        });
        listHtml += '</ul>';
        return listHtml;
    };

    for (const key in content) {
        if (content.hasOwnProperty(key)) {
            const section = content[key];
            if (!section || typeof section !== 'object') continue; // Skip non-object sections

            html += `<div class="content-section content-section-${key}">`;

            if (section.titel && typeof section.titel === 'string') {
                html += `<h3 class="section-title">${section.titel}</h3>`;
            }

            if (section.tekst && typeof section.tekst === 'string') {
                html += `<p class="content-text">${section.tekst.replace(/\n/g, '<br>')}</p>`;
            }

            // Specifieke rendering voor 'stel_je_voor' (scenario_container)
            if (key === 'stel_je_voor' && section.type === 'scenario_container' && Array.isArray(section.scenarios)) {
                html += `<div class="scenario-container">`;
                section.scenarios.forEach(scenario => {
                    html += `<div class="scenario-tile info-card">`;
                    if (scenario.titel) {
                        html += `<h4 class="scenario-title">${scenario.titel}</h4>`;
                    }
                    if (scenario.beschrijving) {
                        html += `<p class="scenario-description">${scenario.beschrijving.replace(/\n/g, '<br>')}</p>`;
                    }
                    if (Array.isArray(scenario.punten)) {
                        html += createListHtml(scenario.punten);
                    }
                    if (scenario.conclusie) {
                        html += `<p class="scenario-conclusie">${scenario.conclusie.replace(/\n/g, '<br>')}</p>`;
                    }
                    html += `</div>`; // scenario-tile
                });
                html += `</div>`; // scenario-container
            }
            // Specifieke rendering voor 'waarom_nu_relevant' (blokken)
            else if (key === 'waarom_nu_relevant' && Array.isArray(section.blokken)) {
                section.blokken.forEach(blok => {
                    html += `<div class="content-block info-card ${blok.type}-block">`;
                    if (blok.titel) {
                        html += `<h4 class="block-title">${blok.titel}</h4>`;
                    }
                    if (blok.tekst_voor_statistiek) {
                        html += `<p>${blok.tekst_voor_statistiek}</p>`;
                    }
                    if (blok.focus_tekst) {
                        html += `<p class="focus-text"><strong>${blok.focus_tekst}</strong></p>`;
                    }
                    if (blok.tekst_na_statistiek) {
                        html += `<p>${blok.tekst_na_statistiek}</p>`;
                    }
                    if (blok.tekst && blok.type === 'fun_fact') {
                         html += `<p>${blok.tekst.replace(/\n/g, '<br>')}</p>`;
                    }
                    html += `</div>`; // content-block
                });
            }
            // Specifieke rendering voor 'leren_als_spiertraining' (punten array van objecten)
            else if (key === 'leren_als_spiertraining' && Array.isArray(section.punten)) {
                 section.punten.forEach(puntBlok => {
                    if (typeof puntBlok === 'object' && puntBlok.titel && puntBlok.tekst) {
                        html += `<div class="info-card sub-section">`;
                        html += `<h4>${puntBlok.titel}</h4>`;
                        html += `<p>${puntBlok.tekst.replace(/\n/g, '<br>')}</p>`;
                        html += `</div>`;
                    }
                });
            }
            // Specifieke rendering voor 'jouw_leerpad' (modules array & afsluiting)
            else if (key === 'jouw_leerpad' && Array.isArray(section.modules)) {
                html += `<div class="modules-list">`;
                section.modules.forEach(module => {
                    html += `<div class="module-item info-card">`;
                    html += `<h4>Module ${module.nummer}: ${module.naam}</h4>`;
                    if (module.beschrijving) {
                        html += `<p>${module.beschrijving.replace(/\n/g, '<br>')}</p>`;
                    }
                    html += `</div>`; // module-item
                });
                html += `</div>`; // modules-list
                if (section.afsluiting) {
                    html += `<p class="content-text">${section.afsluiting.replace(/\n/g, '<br>')}</p>`;
                }
            }
            // Generieke rendering voor een 'punten' array (lijst van strings)
            else if (Array.isArray(section.punten)) {
                html += createListHtml(section.punten);
            }
            // Generieke rendering voor een 'items' array (lijst van strings of objecten met 'tekst')
            // Dit is bijvoorbeeld voor de leerdoelen in de oude structuur, of vergelijkbaar.
            else if (Array.isArray(section.items)) {
                 html += createListHtml(section.items, 'items-list');
            }

            html += `</div>`; // content-section-${key}
        }
    }
    return html;
}

// Make render functions available globally so they can be called dynamically
window.renderChapter1Content = renderChapter1Content;
window.renderChapter2Content = renderChapter2Content;
window.renderChapter3Content = renderChapter3Content;
window.renderChapter4Content = renderChapter4Content;
window.renderChapter5Content = renderChapter5Content;
window.renderChapter6Content = renderChapter6Content;
window.renderChapter7Content = renderChapter7Content;

console.log('dynamicContent.js loaded');

function renderChapter1Content(content) {
    let html = '';

    // Helper to create a list from an array of strings or objects with a 'tekst' property
    const createListHtml = (itemsArray, listClass = 'points-list') => {
        if (!Array.isArray(itemsArray) || itemsArray.length === 0) return '';
        let listHtml = `<ul class="${listClass}">`;
        itemsArray.forEach(item => {
            if (typeof item === 'string') {
                listHtml += `<li>${item}</li>`;
            } else if (typeof item === 'object' && item.tekst) { // Specific for 'leren_als_spiertraining'
                listHtml += `<li><strong>${item.titel}:</strong> ${item.tekst}</li>`;
            }
        });
        listHtml += '</ul>';
        return listHtml;
    };

    if (content.welkom) {
        html += `
            <div class="info-card welcome-card">
                <h4>${content.welkom.titel || 'Welkom'}</h4>
                <p>${content.welkom.tekst ? content.welkom.tekst.replace(/\\n/g, '<br>') : ''}</p>
            </div>
        `;
    }

    if (content.stel_je_voor && content.stel_je_voor.scenarios && content.stel_je_voor.scenarios.length > 0) {
        html += `<div class="content-block">`; // Gebruik content-block voor consistente marges/padding
        html += `<h3 class="section-title">${content.stel_je_voor.titel || 'Stel je eens voor...'}</h3>`;
        html += `<div class="scenario-container-horizontal">`;
        content.stel_je_voor.scenarios.forEach(scenario => {
            html += `
                <div class="info-card scenario-card">
                    <h4>${scenario.titel || ''}</h4>
                    <p>${scenario.beschrijving ? scenario.beschrijving.replace(/\\n/g, '<br>') : ''}</p>`;
            if (scenario.punten && scenario.punten.length > 0) {
                html += `<ul>`;
                scenario.punten.forEach(punt => {
                    html += `<li>${punt}</li>`;
                });
                html += `</ul>`;
            }
            if (scenario.conclusie) {
                html += `<p class="conclusie"><strong>${scenario.conclusie.replace(/\\n/g, '<br>')}</strong></p>`;
            }
            html += `</div>`; // End scenario-card
        });
        html += `</div>`; // End scenario-container-horizontal
        html += `</div>`; // End content-block for stel_je_voor
    }

    if (content.waarom_nu_relevant) {
        const sectie = content.waarom_nu_relevant;
        html += `<div class="content-section content-section-waarom_nu_relevant">`;
        if (sectie.titel) {
            html += `<h3 class="section-title">${sectie.titel}</h3>`;
        }
        if (sectie.tekst) {
            html += `<p class="content-text">${sectie.tekst.replace(/\\n/g, '<br>')}</p>`;
        }
        if (Array.isArray(sectie.blokken)) {
            sectie.blokken.forEach(blok => {
                html += `<div class="content-block info-card ${blok.type}-block">`;
                if (blok.titel) {
                    html += `<h4 class="block-title">${blok.titel}</h4>`;
                }
                if (blok.tekst_voor_statistiek) {
                    html += `<p>${blok.tekst_voor_statistiek}</p>`;
                }
                if (blok.focus_tekst) {
                    html += `<p class="focus-text"><strong>${blok.focus_tekst}</strong></p>`;
                }
                if (blok.tekst_na_statistiek) {
                    html += `<p>${blok.tekst_na_statistiek}</p>`;
                }
                if (blok.tekst && blok.type === 'fun_fact') { // specifiek voor fun_fact
                     html += `<p>${blok.tekst.replace(/\\n/g, '<br>')}</p>`;
                }
                html += `</div>`;
            });
        }
        html += `</div>`;
    }

    if (content.leren_als_spiertraining) {
        const sectie = content.leren_als_spiertraining;
        html += `<div class="content-section content-section-leren_als_spiertraining">`;
        if (sectie.titel) {
            html += `<h3 class="section-title">${sectie.titel}</h3>`;
        }
        if (sectie.tekst) {
            html += `<p class="content-text">${sectie.tekst.replace(/\n/g, '<br>')}</p>`;
        }
        // Nieuw: render als ethical-reflection-grid als type dat is
        if (sectie.type === 'ethical_reflection_grid' && Array.isArray(sectie.kaarten)) {
            html += `<div class="ethical-reflection-grid">`;
            sectie.kaarten.forEach(kaart => {
                html += `<div class="ethical-card">`;
                if (kaart.titel) html += `<h4>${kaart.titel}</h4>`;
                if (kaart.beschrijving) html += `<p>${kaart.beschrijving.replace(/\n/g, '<br>')}</p>`;
                html += `</div>`;
            });
            html += `</div>`;
        }
        html += `</div>`;
    }

    if (content.jouw_leerpad) {
        const sectie = content.jouw_leerpad;
        html += `<div class="content-section content-section-jouw_leerpad">`;
        if (sectie.titel) {
            html += `<h3 class="section-title">${sectie.titel}</h3>`;
        }
        if (sectie.tekst) {
            html += `<p class="content-text">${sectie.tekst.replace(/\\n/g, '<br>')}</p>`;
        }
        if (Array.isArray(sectie.modules)) {
            html += `<div class="modules-list">`; // Deze class moet mogelijk gedefinieerd worden in CSS
            sectie.modules.forEach(module => {
                html += `<div class="module-item info-card">`;
                html += `<h4>Module ${module.nummer}: ${module.naam}</h4>`;
                if (module.beschrijving) {
                    html += `<p>${module.beschrijving.replace(/\\n/g, '<br>')}</p>`;
                }
                html += `</div>`;
            });
            html += `</div>`;
        }
        if (sectie.afsluiting) {
            html += `<p class="content-text">${sectie.afsluiting.replace(/\\n/g, '<br>')}</p>`;
        }
        html += `</div>`;
    }

    if (content.portfolio_booster) {
        const sectie = content.portfolio_booster;
        html += `
            <div class="info-card portfolio-booster-card">
                <h4>${sectie.titel || 'Portfolio Booster'}</h4>
                <p>${sectie.tekst ? sectie.tekst.replace(/\\n/g, '<br>') : ''}</p>
            </div>
        `;
    }

    if (content.klaar_voor_start) {
        html += `<div class="info-card encouragement-card"><p>${content.klaar_voor_start.tekst ? content.klaar_voor_start.tekst.replace(/\\n/g, '<br>') : ''}</p></div>`;
    }

    return html;
}

function renderChapter2Content(data) { // data is nu het volledige hoofdstuk object, niet data.content
    let html = '';

    // De titel van het hoofdstuk wordt al in index.html gezet of door een algemene functie
    // We focussen hier op het renderen van de secties.

    if (data.secties && Array.isArray(data.secties)) {
        data.secties.forEach(sectie => {
            if (sectie.type === 'tekst') {
                html += `
                    <div class="info-card">
                        ${sectie.titel ? `<h3 class=\"info-card-title\">${sectie.titel}</h3>` : ''}
                        <div class="info-card-content">
                            <p>${sectie.inhoud.replace(/\n/g, '<br>')}</p>
                        </div>
                    </div>
                `;
            } else if (sectie.type === 'infokaart') {
                html += `
                    <div class="info-card">
                        <h3 class="info-card-title">${sectie.titel}</h3>
                        <div class="info-card-content">
                `;
                if (sectie.items && Array.isArray(sectie.items)) {
                    html += '<ul class="list-style-bullets">'; // Gebruik een class voor styling als nodig
                    sectie.items.forEach(item => {
                        html += `<li><strong>${item.titel}:</strong> ${item.tekst}</li>`;
                    });
                    html += '</ul>';
                }
                html += '</div></div>';
            }
            // Voeg hier meer 'else if' blokken toe voor andere sectie types indien nodig
        });
    }

    return html;
}

function renderChapter3Content(content) {
    let html = '';

    // Intro
    if (content.intro) {
        html += `
            <div class="info-card">
                <h3 class="info-card-title">${content.intro.titel || 'Waarom Zorgtechnologie?'}</h3>
                <div class="info-card-content">
                    <p>${content.intro.tekst || ''}</p>
                </div>
            </div>
        `;
    }

    // Voordelen
    if (content.voordelen && content.voordelen.length > 0) {
        html += '<div class="benefits-grid">';
        content.voordelen.forEach(voordeel => {
            html += `
                <div class="benefit-card">
                    <h3>${voordeel.titel || ''}</h3>
                    <div class="benefit-content">
                        <p>${voordeel.beschrijving || ''}</p>
                        ${voordeel.voorbeeld ? `
                            <div class="example-box">
                                <h4>${voordeel.voorbeeld.titel || 'Praktijkvoorbeeld'}</h4>
                                <p>${voordeel.voorbeeld.tekst || ''} ${voordeel.voorbeeld.bron ? `<span class="source">(${voordeel.voorbeeld.bron})</span>` : ''}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }

    // Praktische toepassing
    if (content.praktische_toepassing) {
        html += `
            <div class="info-card">
                <h3 class="info-card-title">${content.praktische_toepassing.titel || 'Voordelen in de Praktijk Brengen'}</h3>
                <div class="info-card-content">
                    ${content.praktische_toepassing.tekst ? `<p>${content.praktische_toepassing.tekst}</p>` : ''}
        `;
        if (content.praktische_toepassing.tips && content.praktische_toepassing.tips.length > 0) {
            html += '<ul>';
            content.praktische_toepassing.tips.forEach(tip => {
                // Make the first part of the tip bold if it contains a colon
                const parts = tip.split(':');
                if (parts.length > 1) {
                    html += `<li><strong>${parts[0]}:</strong>${parts.slice(1).join(':')}</li>`;
                } else {
                    html += `<li>${tip}</li>`;
                }
            });
            html += '</ul>';
        }
        html += '</div></div>'; // Close info-card-content and info-card
    }

    return html;
}

function renderChapter4Content(content) {
    let html = '';

    // Intro
    if (content.intro) {
        html += `
            <div class="info-card">
                <h3 class="info-card-title">${content.intro.titel || 'Waarom Kritisch Kijken?'}</h3>
                <div class="info-card-content">
                    <p>${content.intro.tekst || ''}</p>
                    ${content.intro.note ? `<p class="note">${content.intro.note}</p>` : ''}
                </div>
            </div>
        `;
    }

    // Themas
    if (content.themas && content.themas.length > 0) {
        html += '<div class="critical-themes-grid">';
        content.themas.forEach(thema => {
            html += `
                <div class="critical-theme-card">
                    ${thema.icoon ? `<div class="theme-icon"><img src="${thema.icoon}" alt="${thema.titel || ''} icoon"></div>` : ''}
                    <h3>${thema.titel || ''}</h3>
                    <div class="theme-content">
                        ${thema.positief_voorbeeld ? `<p><strong>Positief voorbeeld:</strong> ${thema.positief_voorbeeld}</p>` : ''}
                        ${thema.uitdaging ? `<p><strong>Uitdaging:</strong> ${thema.uitdaging}</p>` : ''}
                        ${thema.reflectie_vraag ? `<div class="reflection-prompt"><p>${thema.reflectie_vraag}</p></div>` : ''}
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }

    return html;
}

function renderChapter5Content(content) {
    let html = '';

    // Intro - TAM Model
    if (content.intro) {
        html += `
            <div class="info-card">
                <h3 class="info-card-title">${content.intro.titel || 'Het Technology Acceptance Model (TAM)'}</h3>
                <div class="info-card-content">
                    <p>${content.intro.tekst || ''}</p>
                </div>
            </div>
        `;
    }

    // TAM Model details
    if (content.tam_model) {
        html += '<div class="tam-model">';
        if (content.tam_model.afbeelding) {
            html += `<img src="${content.tam_model.afbeelding}" alt="Technology Acceptance Model (TAM)" class="model-image">`;
        }
        html += '<div class="tam-explanation">';

        // Kernconcepten
        if (content.tam_model.kernconcepten && content.tam_model.kernconcepten.concepten && content.tam_model.kernconcepten.concepten.length > 0) {
            html += `
                <div class="info-card">
                    <h3 class="info-card-title">${content.tam_model.kernconcepten.titel || 'Kernconcepten van TAM'}</h3>
                    <div class="info-card-content">
                        <div class="concept-cards">
            `;
            content.tam_model.kernconcepten.concepten.forEach(concept => {
                html += `
                    <div class="concept-card">
                        <h4>${concept.titel || ''}</h4>
                        ${concept.nederlands ? `<p class="concept-dutch">Nederlands: ${concept.nederlands}</p>` : ''}
                        <p>${concept.beschrijving || ''}</p>
                        ${concept.voorbeeld ? `<p class="example">Voorbeeld: ${concept.voorbeeld}</p>` : ''}
                    </div>
                `;
            });
            html += '</div></div></div>'; // Close concept-cards, info-card-content, info-card
        }

        // Adoptieproces
        if (content.tam_model.adoptieproces) {
            html += `
                <div class="info-card">
                    <h3 class="info-card-title">${content.tam_model.adoptieproces.titel || 'Het Adoptieproces'}</h3>
                    <div class="info-card-content">
                        ${content.tam_model.adoptieproces.tekst ? `<p>${content.tam_model.adoptieproces.tekst}</p>` : ''}
            `;
            if (content.tam_model.adoptieproces.factoren && content.tam_model.adoptieproces.factoren.length > 0) {
                html += '<ul>';
                content.tam_model.adoptieproces.factoren.forEach(factor => {
                    html += `<li><strong>${factor.titel}:</strong> ${factor.beschrijving}</li>`;
                });
                html += '</ul>';
            }
            html += '</div></div>'; // Close info-card-content, info-card
        }
        html += '</div></div>'; // Close tam-explanation, tam-model
    }

    // Praktische toepassing
    if (content.praktische_toepassing) {
        html += `
            <div class="info-card">
                <h3 class="info-card-title">${content.praktische_toepassing.titel || 'Praktische Toepassing'}</h3>
                <div class="info-card-content">
                    ${content.praktische_toepassing.tekst ? `<p>${content.praktische_toepassing.tekst}</p>` : ''}
        `;
        if (content.praktische_toepassing.toepassingen && content.praktische_toepassing.toepassingen.length > 0) {
            html += '<ul>';
            content.praktische_toepassing.toepassingen.forEach(toepassing => {
                html += `<li>${toepassing}</li>`;
            });
            html += '</ul>';
        }
        html += '</div></div>'; // Close info-card-content, info-card
    }

    return html;
}

function renderChapter6Content(content) { // Wordt nu de implementatie van de OUDE renderChapter7Content
    let html = '';

    // Intro
    if (content.intro) {
        html += `
            <div class="info-card">
                <h3 class="info-card-title">${content.intro.titel || 'Van competenties naar concrete technologie'}</h3>
                <div class="info-card-content">
                    <p>${content.intro.tekst || ''}</p>
                    ${content.intro.subtekst ? `<p>${content.intro.subtekst}</p>` : ''}
                </div>
            </div>
        `;
    }

    // iXperium Health Catalogussen
    if (content.ixperium_catalogi) {
        html += `
            <div class="featured-ixperium">
                <h3>${content.ixperium_catalogi.titel || 'iXperium Health Catalogussen'}</h3>
                <div class="ixperium-catalogs">
        `;
        if (content.ixperium_catalogi.catalogi && content.ixperium_catalogi.catalogi.length > 0) {
            content.ixperium_catalogi.catalogi.forEach(catalog => {
                html += `
                    <div class="catalog-card">
                        ${catalog.logo ? `<img src="${catalog.logo}" alt="${catalog.titel || 'Catalogus'} Logo" class="catalog-logo">` : ''}
                        <h4>${catalog.titel || ''}</h4>
                        <p>${catalog.beschrijving || ''}</p>
                        ${catalog.qr_code ? `<img src="${catalog.qr_code}" alt="QR Code ${catalog.titel || ''}" class="qr-code">` : ''}
                        ${catalog.link ? `<a href="${catalog.link}" class="btn" target="_blank">Bekijk catalogus</a>` : ''}
                    </div>
                `;
            });
        }
        html += '</div></div>'; // Close ixperium-catalogs and featured-ixperium
    }

    // Nationale Platforms
    if (content.nationale_platforms) {
        html += `
            <div class="tech-resources">
                <h3>${content.nationale_platforms.titel || 'Nationale Platforms voor Zorgtechnologie'}</h3>
                <div class="resource-grid">
        `;
        if (content.nationale_platforms.platforms && content.nationale_platforms.platforms.length > 0) {
            content.nationale_platforms.platforms.forEach(platform => {
                html += `
                    <div class="resource-card">
                        ${platform.logo ? `<img src="${platform.logo}" alt="${platform.titel || 'Platform'} Logo" class="resource-logo">` : ''}
                        <h4>${platform.titel || ''}</h4>
                        <p>${platform.beschrijving || ''}</p>
                        ${platform.link ? `<a href="${platform.link}" class="btn" target="_blank">Bezoek platform</a>` : ''}
                    </div>
                `;
            });
        }
        html += '</div></div>'; // Close resource-grid and tech-resources
    }

    return html;
}

function renderChapter7Content(content) { // Wordt nu de implementatie van de OUDE renderChapter6Content (V-Model)
    let html = '';

    // Intro
    if (content.intro) {
        html += `
            <div class="info-card">
                <h3 class="info-card-title">${content.intro.titel || 'Jouw Ontwikkeling in Zorgtechnologie'}</h3>
                <div class="info-card-content">
                    <p>${content.intro.tekst || ''}</p>
                    ${content.intro.bron ? `<p class="source">Bron: ${content.intro.bron}</p>` : ''}
                </div>
            </div>
        `;
    }

    // V-Model
    if (content.v_model) {
        html += '<div class="v-model">';
        if (content.v_model.afbeelding) {
            html += `<img src="${content.v_model.afbeelding}" alt="V-model voor digitale competenties" class="model-image">`;
        }
        html += '<div class="v-model-explanation">';

        // Basis Competenties
        if (content.v_model.basis_competenties) {
            html += `
                <div class="competency-section basic">
                    <h3>${content.v_model.basis_competenties.titel || 'De Basis V-Competenties'}</h3>
                    ${content.v_model.basis_competenties.tekst ? `<p>${content.v_model.basis_competenties.tekst}</p>` : ''}
            `;
            if (content.v_model.basis_competenties.competenties && content.v_model.basis_competenties.competenties.length > 0) {
                html += '<div class="competency-grid">';
                content.v_model.basis_competenties.competenties.forEach(comp => {
                    html += `
                        <div class="competency-card">
                            <h4>${comp.titel || ''}</h4>
                            <p>${comp.beschrijving || ''}</p>
                            ${comp.voorbeeld ? `<div class="example-box"><p><strong>Voorbeeld:</strong> ${comp.voorbeeld}</p></div>` : ''}
                        </div>
                    `;
                });
                html += '</div>'; // Close competency-grid
            }
            html += '</div>'; // Close competency-section basic
        }

        // Ethische Reflectie
        if (content.v_model.ethische_reflectie) {
            html += `
                <div class="info-card">
                    <h3 class="info-card-title">${content.v_model.ethische_reflectie.titel || 'Ethische Reflectie'}</h3>
                    <div class="info-card-content">
                        <p>${content.v_model.ethische_reflectie.tekst || ''}</p>
            `;
            if (content.v_model.ethische_reflectie.aspecten && content.v_model.ethische_reflectie.aspecten.length > 0) {
                html += '<div class="ethical-reflection-grid">';
                content.v_model.ethische_reflectie.aspecten.forEach(aspect => {
                    html += `
                        <div class="ethical-card">
                            <h4>${aspect.titel || ''}</h4>
                            <p>${aspect.beschrijving || ''}</p>
                        </div>
                    `;
                });
                html += '</div>'; // Close ethical-reflection-grid
            }
            html += '</div></div>'; // Close info-card-content and info-card
        }

        // Verdiepende competenties
        if (content.v_model.verdiepende_competenties) {
            html += `
                <div class="note-box">
                    <h4>${content.v_model.verdiepende_competenties.titel || 'Verdiepende Competenties: Voor Later'}</h4>
                    <p>${content.v_model.verdiepende_competenties.tekst || ''}</p>
                </div>
            `;
        }

        // Ontwikkeling
        if (content.v_model.ontwikkeling) {
            html += `
                <div class="info-card">
                    <h3 class="info-card-title">${content.v_model.ontwikkeling.titel || 'Ontwikkeling van je Competenties'}</h3>
                    <div class="info-card-content">
                        ${content.v_model.ontwikkeling.tekst ? `<p>${content.v_model.ontwikkeling.tekst}</p>` : ''}
            `;
            if (content.v_model.ontwikkeling.manieren && content.v_model.ontwikkeling.manieren.length > 0) {
                html += '<ul>';
                content.v_model.ontwikkeling.manieren.forEach(manier => {
                    html += `<li>${manier}</li>`;
                });
                html += '</ul>';
            }
            html += '</div></div>'; // Close info-card-content and info-card
        }
        html += '</div></div>'; // Close v-model-explanation and v-model
    }
    return html;
}

// Renamed from renderChapter8Content to renderAfsluitingContent for flexibility
function renderAfsluitingContent(content) {
    console.log("Rendering Afsluiting content with data:", content);

    if (!content) {
        // Attempt to populate a generic error message in the main container if data is missing
        const errorContainer = document.getElementById(`section${totalSections}-content-container`);
        if (errorContainer) {
            errorContainer.innerHTML = '<p class="error-message">Content voor het afsluitende hoofdstuk kon niet geladen worden. Controleer <code>content/hoofdstuk_afsluiting.json</code>.</p>';
        }
        return; // Return empty or minimal HTML string if error was already set
    }

    // Update de hoofdtitel
    const titelEl = document.getElementById('afsluiting-titel');
    if (titelEl && content.titel) {
        titelEl.textContent = content.titel;
    }

    // Update de intro in de info-card
    const introEl = document.getElementById('afsluiting-intro');
    if (introEl && content.introductie) {
        // Split op dubbele newline en render elk deel als aparte paragraaf
        introEl.innerHTML = content.introductie.split(/\n\n/).map(par => `<p>${par}</p>`).join('');
    }

    // Quiz uitleg - nu via nieuwe sectie
    const uitlegEl = document.getElementById('afsluiting-uitleg');
    if (uitlegEl && content.afsluitQuizIntro) {
        uitlegEl.innerHTML = `
            <div class="info-card purple-kader">
                <h4 class="info-card-title">${content.afsluitQuizIntro.subtitel}</h4>
                <div class="info-card-content">${content.afsluitQuizIntro.tekst}</div>
            </div>
        `;
    }

    // Render de nieuwe structuur in certificaat-portfolio-container
    const certificaatPortfolioContainer = document.getElementById('certificaat-portfolio-container');
    if (certificaatPortfolioContainer) {
        let html = '<div class="certificaat-portfolio-wrapper">';

        // Nieuwe titel voor Certificaat en Portfolio
        html += '<h2 class="section-title">Certificaat en Portfolio</h2>';

        // Over Certificaat sectie
        if (content.overCertificaat) {
            html += `
                <div class="info-card purple-kader">
                    <h3 class="info-card-title">${content.overCertificaat.titel}</h3>
                    <div class="info-card-content">
                        ${content.overCertificaat.intro ? `<p>${content.overCertificaat.intro}</p>` : ''}
                        ${content.overCertificaat.punten && content.overCertificaat.punten.length > 0 ? `
                            <ul class="checklist">
                                ${content.overCertificaat.punten.map(punt => `<li><strong>${punt.kop}:</strong> ${punt.tekst}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        // Stimulans Herhaling Leren sectie
        if (content.stimulansHerhalingLeren) {
            html += `
                <div class="info-card">
                    <h3 class="info-card-title">${content.stimulansHerhalingLeren.titel}</h3>
                    <div class="info-card-content">
                        ${content.stimulansHerhalingLeren.tekst.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                    </div>
                </div>
            `;
        }

        // Portfolio Integratie sectie (nu met VRAAK-criteria als accordion binnen dit blok)
        if (content.portfolioIntegratie) {
            html += `
                <div class="info-card">
                    <h3 class="info-card-title">${content.portfolioIntegratie.titel}</h3>
                    <div class="info-card-content">
                        <p>${content.portfolioIntegratie.tip}</p>
                        <p>${content.portfolioIntegratie.vraakUitleg}</p>
                        ${content.portfolioIntegratie.vraakCriteria ? `
                        <div class="accordion">
                            <button class="accordion-toggle" id="vraak-accordion-toggle" aria-expanded="false">
                                <span class="triangle">&#9654;</span> ${content.portfolioIntegratie.vraakCriteria.titel}
                            </button>
                            <div class="accordion-content" id="vraak-accordion-content">
                                <p>${content.portfolioIntegratie.vraakCriteria.introductie}</p>
                                <ol class="vraak-criteria-lijst" style="margin-bottom: 0;">
                                    ${content.portfolioIntegratie.vraakCriteria.criteria.map(c => `
                                        <li style="margin-bottom: 1.2em;">
                                            <strong>${c.naam}:</strong> ${c.beschrijving}
                                            ${c.subpunten && c.subpunten.length > 0 ? `
                                                <ul class="vraak-subpunten" style="margin-top: 0.5em; margin-bottom: 0.5em; margin-left: 1.5em;">
                                                    ${c.subpunten.map(sub => `<li style="list-style-type: disc; margin-bottom: 0.2em;">${sub}</li>`).join('')}
                                                </ul>
                                            ` : ''}
                                        </li>
                                    `).join('')}
                                </ol>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }

        // Verder Kijken Dan Certificaten sectie
        if (content.verderKijkenDanCertificaten) {
            html += `
                <div class="info-card">
                    <h3 class="info-card-title">${content.verderKijkenDanCertificaten.titel}</h3>
                    <div class="info-card-content">
                        <p>${content.verderKijkenDanCertificaten.tekst}</p>
                        <div class="suggesties-grid">
            `;
            content.verderKijkenDanCertificaten.suggesties.forEach(s => {
                html += `
                    <div class="suggestie-tegel card">
                        <h4>${s.titel}</h4>
                        <p>${s.tekst}</p>
                    </div>
                `;
            });
            html += `
                        </div>
                    </div>
                </div>
            `;
        }

        html += '</div>'; // Close certificaat-portfolio-wrapper
        certificaatPortfolioContainer.innerHTML = html;

        // Accordion functionaliteit toevoegen
        const toggle = document.getElementById('vraak-accordion-toggle');
        const contentDiv = document.getElementById('vraak-accordion-content');
        if (toggle && contentDiv) {
            toggle.addEventListener('click', function() {
                const isOpen = contentDiv.classList.toggle('open');
                toggle.classList.toggle('open', isOpen);
                toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                // Draai driehoekje
                const triangle = toggle.querySelector('.triangle');
                if (triangle) {
                    triangle.innerHTML = isOpen ? '&#9660;' : '&#9654;';
                }
            });
        }
    }

    // Update certificaat uitleg
    const certificaatUitlegEl = document.getElementById('afsluiting-certificaat');
    if (certificaatUitlegEl) {
        certificaatUitlegEl.textContent = "Vul hieronder je naam in om een certificaat te genereren met je antwoorden en reflecties.";
    }

    // Update portfolio tip
    const portfolioTipEl = document.getElementById('afsluiting-portfolio-tip');
    if (portfolioTipEl && content.portfolioIntegratie) {
        portfolioTipEl.innerHTML = `<strong>Tip:</strong> ${content.portfolioIntegratie.tip}`;
    }

    return ''; // Return empty string as we are modifying existing DOM elements
}

function renderFlashcardContent(interactie, chapterNumber) {
    const baseId = `flashcard_${chapterNumber}_${interactie.id}`;
    // Herhalingen ophalen uit localStorage
    let herhalingen = JSON.parse(localStorage.getItem(`${baseId}_herhalingen`) || '{}');
    let run = parseInt(localStorage.getItem(`${baseId}_run`) || '1');
    let laatsteSet = JSON.parse(localStorage.getItem(`${baseId}_laatsteSet`) || '[]');
    let laatsteType = localStorage.getItem(`${baseId}_laatsteType`) || 'all';
    let setAfgerond = localStorage.getItem(`${baseId}_setAfgerond`) === 'true';

    // Info-uitleg HTML (standaard ingeklapt)
    const uitlegId = `${baseId}_uitleg`;
    const infoIcon = `<span class="flashcard-info-icon" id="${baseId}_infoicon" title="Uitleg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-purple)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="8"/></svg></span>`;
    const uitlegBlok = `<div class="info-card flashcard-uitleg" id="${uitlegId}" style="display:none; margin-bottom:12px;">
      <div class="info-card-content">
        De flashcards zijn bedoeld om je te helpen belangrijke begrippen actief te oefenen. Je kunt de set zo vaak herhalen als je wilt, net zolang tot je alles goed weet. Na elke ronde kun je kiezen om alleen de kaarten te herhalen die je nog niet wist, of om alles opnieuw te doen. Jouw voortgang en het aantal herhalingen worden automatisch opgeslagen en meegenomen in je certificaat. Het doel is niet om alles in één keer goed te hebben, maar om te leren door te herhalen!
      </div>
    </div>`;

    // UI opbouw
    let html = `<div class="interactive-block flashcard-container" id="${baseId}">
        <div class="interactive-block-header">
            <svg class="icon" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
            </svg>
            <h4 style="display:inline-block; margin-right:8px;">${interactie.titel}</h4>${infoIcon}
        </div>
        ${uitlegBlok}
        <div class="interactive-block-content flashcard-content" id="${baseId}_content">`;

    // Kaart X van Y rechtsboven
    html += `<div style="display:flex; justify-content: flex-end; align-items:center; margin-bottom: 8px;">
        <span id="${baseId}_kaartinfo" class="flashcard-kaartinfo"></span>
    </div>`;

    // Flashcard zelf
    html += `<div class="flashcard-stack" id="${baseId}_stack"></div>`;

    // Feedback
    html += `<div class="flashcard-feedback" id="${baseId}_feedback"></div>`;

    // Herhaal-knoppen (alleen tonen als set afgerond)
    html += `<div class="flashcard-repeat-controls" id="${baseId}_repeatcontrols" style="display:none; margin-top:1.5rem; gap:1rem;">
        <button class="btn btn-primary" id="${baseId}_repeat_incorrect">Herhaal alleen de vragen die ik niet wist</button>
        <button class="btn btn-secondary" id="${baseId}_repeat_all">Herhaal hele set</button>
    </div>`;

    html += `</div></div>`;
    return html;
}

function initializeFlashcardInteraction(interactie, chapterNumber) {
    const baseId = `flashcard_${chapterNumber}_${interactie.id}`;
    const total = interactie.cards.length;
    let herhalingen = JSON.parse(localStorage.getItem(`${baseId}_herhalingen`) || '{}');
    let run = parseInt(localStorage.getItem(`${baseId}_run`) || '1');
    let laatsteSet = JSON.parse(localStorage.getItem(`${baseId}_laatsteSet`) || '[]');
    let laatsteType = localStorage.getItem(`${baseId}_laatsteType`) || 'all';
    let setAfgerond = localStorage.getItem(`${baseId}_setAfgerond`) === 'true';
    let kaartenTeDoen = interactie.cards.map((c, i) => i);
    if (setAfgerond && laatsteType === 'incorrect' && laatsteSet.length > 0) {
        kaartenTeDoen = laatsteSet;
    }
    let huidigeKaart = 0;
    let incorrecteKaarten = [];
    let antwoordenDezeRun = [];

    const stack = document.getElementById(`${baseId}_stack`);
    const kaartinfo = document.getElementById(`${baseId}_kaartinfo`);
    const feedback = document.getElementById(`${baseId}_feedback`);
    const repeatControls = document.getElementById(`${baseId}_repeatcontrols`);
    const contentDiv = document.getElementById(`${baseId}_content`);

    function toonKaart(idx) {
        const kaartIndex = kaartenTeDoen[idx];
        const card = interactie.cards[kaartIndex];
        function getHerhalingLabel(n) {
            if (!n || n === 1) return '';
            if (n === 2) return '1e herhaling';
            if (n === 3) return '2e herhaling';
            return (n-1) + 'e herhaling';
        }
        const herhalingTekst = getHerhalingLabel(herhalingen[kaartIndex] ? herhalingen[kaartIndex] : 1);
        stack.innerHTML = `
            <div class="flashcard" id="${baseId}_card_${kaartIndex}">
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <p>${card.voorzijde}</p>
                    </div>
                    <div class="flashcard-back">
                        ${herhalingTekst ? `<div class=\"flashcard-repeat-label\">${herhalingTekst}</div>` : ''}
                        <p class="flashcard-answer-text">${card.achterzijde}</p>
                        <div class="flashcard-answer-buttons">
                            <button class="btn btn-success" data-flashcard-know="true">Ik wist het</button>
                            <button class="btn btn-danger" data-flashcard-know="false">Ik wist het niet</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        kaartinfo.textContent = `Kaart ${idx+1} van ${kaartenTeDoen.length}`;
        feedback.textContent = '';
        
        // Flip functionaliteit
        const cardDiv = document.getElementById(`${baseId}_card_${kaartIndex}`);
        if (cardDiv) {
            cardDiv.addEventListener('click', function(e) {
                if (!e.target.closest('.flashcard-answer-buttons')) {
                    this.classList.toggle('flipped');
                }
            });
        }
        
        // Antwoordknoppen
        const answerButtons = stack.querySelector('.flashcard-answer-buttons');
        if (answerButtons) {
            answerButtons.addEventListener('click', function(e) {
                const btn = e.target.closest('button[data-flashcard-know]');
                if (!btn) return;
                const wistHet = btn.getAttribute('data-flashcard-know') === 'true';
                // Herhalingen bijhouden
                herhalingen[kaartIndex] = (herhalingen[kaartIndex] || 1);
                antwoordenDezeRun.push({kaart: kaartIndex, correct: wistHet});
                if (!wistHet) incorrecteKaarten.push(kaartIndex);
                // Volgende kaart of set klaar
                huidigeKaart++;
                if (huidigeKaart < kaartenTeDoen.length) {
                    toonKaart(huidigeKaart);
                } else {
                    // Set afgerond
                    setAfgerond = true;
                    localStorage.setItem(`${baseId}_setAfgerond`, 'true');
                    laatsteSet = incorrecteKaarten;
                    laatsteType = 'incorrect';
                    localStorage.setItem(`${baseId}_laatsteSet`, JSON.stringify(incorrecteKaarten));
                    localStorage.setItem(`${baseId}_laatsteType`, 'incorrect');
                    // Herhalingen ophogen voor alle kaarten in deze run
                    antwoordenDezeRun.forEach(a => {
                        herhalingen[a.kaart] = (herhalingen[a.kaart] || 1) + 1;
                    });
                    localStorage.setItem(`${baseId}_herhalingen`, JSON.stringify(herhalingen));
                    localStorage.setItem(`${baseId}_run`, (run+1).toString());
                    // Voortgang: markeer als minimaal 1x gedaan
                    if (!localStorage.getItem(`${baseId}_done`)) {
                        localStorage.setItem(`${baseId}_done`, 'true');
                        if (typeof updateAllChapterProgress === 'function') updateAllChapterProgress();
                    }
                    feedback.textContent = 'Set afgerond! Kies een herhaaloptie.';
                    repeatControls.style.display = 'flex';
                }
            });
        }
    }

    // Herhaal alleen niet-wist
    document.getElementById(`${baseId}_repeat_incorrect`).onclick = function() {
        if (laatsteSet.length === 0) {
            feedback.textContent = 'Je hebt alle kaarten goed!';
            return;
        }
        kaartenTeDoen = laatsteSet;
        huidigeKaart = 0;
        incorrecteKaarten = [];
        antwoordenDezeRun = [];
        setAfgerond = false;
        localStorage.setItem(`${baseId}_setAfgerond`, 'false');
        localStorage.setItem(`${baseId}_laatsteType`, 'incorrect');
        repeatControls.style.display = 'none';
        toonKaart(huidigeKaart);
    };
    // Herhaal alles
    document.getElementById(`${baseId}_repeat_all`).onclick = function() {
        kaartenTeDoen = interactie.cards.map((c, i) => i);
        huidigeKaart = 0;
        incorrecteKaarten = [];
        antwoordenDezeRun = [];
        setAfgerond = false;
        localStorage.setItem(`${baseId}_setAfgerond`, 'false');
        localStorage.setItem(`${baseId}_laatsteType`, 'all');
        repeatControls.style.display = 'none';
        toonKaart(huidigeKaart);
    };

    // Init: als set niet afgerond, start bij juiste kaart
    if (!setAfgerond) {
        toonKaart(huidigeKaart);
    } else {
        repeatControls.style.display = 'flex';
        feedback.textContent = 'Set afgerond! Kies een herhaaloptie.';
    }

    // Info-uitleg toggling
    const infoIcon = document.getElementById(`${baseId}_infoicon`);
    const uitlegBlok = document.getElementById(`${baseId}_uitleg`);
    if (infoIcon && uitlegBlok) {
        infoIcon.style.cursor = 'pointer';
        infoIcon.addEventListener('click', function() {
            uitlegBlok.style.display = uitlegBlok.style.display === 'none' ? 'block' : 'none';
        });
    }
}

// Add to window object for onclick handlers
window.markCardAnswer = function(interactieId, cardIndex, isCorrect) {
    const interactie = document.getElementById(interactieId);
    const answeredCards = new Set(JSON.parse(localStorage.getItem(`${interactieId}_answered`) || '[]'));
    answeredCards.add(cardIndex);
    localStorage.setItem(`${interactieId}_answered`, JSON.stringify([...answeredCards]));
    
    // Check if all cards are answered correctly
    const allCorrect = [...answeredCards].length === interactie.cards.length;
    if (allCorrect) {
        const saveButton = document.getElementById(`${interactieId}_save`);
        saveButton.style.display = 'block';
        localStorage.setItem(`${interactieId}_completed`, 'true');
    }
};

// Verwijder de globale event delegation voor flashcard flip
// if (!window._flashcardFlipHandlerAdded) {
//   document.addEventListener('click', function(e) {
//     const card = e.target.closest('.flashcard');
//     if (card && !e.target.closest('.flashcard-answer-buttons')) {
//       card.classList.toggle('flipped');
//     }
//   });
//   window._flashcardFlipHandlerAdded = true;
// } 