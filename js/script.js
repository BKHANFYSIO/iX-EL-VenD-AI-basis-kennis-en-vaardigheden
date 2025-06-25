// Navigation and section handling
let currentSection = 1;
let totalSections = 0;

let chapters = [];

// Functie om de globale variabelen te initialiseren na het laden van de config
function initializeGlobals(config) {
    totalSections = config.hoofdstukken.length;
    chapters = config.hoofdstukken.map((hoofdstuk, index) => ({
        section: index + 1,
        title: hoofdstuk.titel,
        file: hoofdstuk.file
    }));
    devLog('Global variables initialized:', { totalSections, chapters });
}

function updateProgress() {
    const progressPercentage = ((currentSection - 1) / (totalSections - 1)) * 100;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${progressPercentage}%`;
    }
    const progressText = document.getElementById('progress-percentage');
    if (progressText) {
        progressText.textContent = `${Math.round(progressPercentage)}%`;
    }
    document.querySelectorAll('.chapter-point').forEach((point, index) => {
        point.classList.remove('completed', 'active');
        if (index + 1 < currentSection) {
            point.classList.add('completed');
        } else if (index + 1 === currentSection) {
            point.classList.add('active');
        }
    });
}

function showSection(sectionNumber) {
    window.scrollTo(0, 0);
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    const targetSection = document.querySelector(`section[data-section="${sectionNumber}"]`);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
        currentSection = sectionNumber;
        updateProgress();
        document.querySelectorAll('.sidebar-chapter').forEach(ch => ch.classList.remove('active'));
        const activeSidebar = document.querySelector(`.sidebar-chapter[data-section="${sectionNumber}"]`);
        if (activeSidebar) activeSidebar.classList.add('active');

        // Navigatieknoppen tonen/verbergen
        const navButtons = targetSection.querySelector('.nav-buttons');
        if (navButtons) {
            const prevBtn = navButtons.querySelector('.btn-prev');
            const nextBtn = navButtons.querySelector('.btn-next');
            if (prevBtn) prevBtn.style.display = sectionNumber === 1 ? 'none' : '';
            if (nextBtn) nextBtn.style.display = sectionNumber === totalSections ? 'none' : '';
        }

        // Load dynamic text content for the new section
        if (typeof loadContentForSection === 'function') {
            loadContentForSection(currentSection); // This loads hoofdstukN.json or hoofdstuk_afsluiting.json
        }

        // If the section being shown is the last section (afsluiting), also load the Afsluitquiz
        if (parseInt(sectionNumber) === totalSections) {
            if (typeof loadMCQuiz === 'function') {
                console.log("Afsluiting section activated, attempting to load Afsluitquiz.");
                loadMCQuiz(); // This loads afsluitquiz.json
            } else {
                console.error("loadMCQuiz function is not defined.");
            }
        }

        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            // initializeDragAndDrop() was here, but drag-drop init is now handled by dynamicContent.js
            // if (typeof initializeDragAndDrop === 'function') initializeDragAndDrop(); 
        }, 50);
    }
}

function nextSection() {
    if (currentSection < totalSections) {
        showSection(currentSection + 1);
    }
}

function prevSection() {
    if (currentSection > 1) {
        showSection(currentSection - 1);
    }
}

async function saveSelfAssessment(sectionNumber, selfAssessmentId) {
    const ids = ['veranderen', 'vinden', 'vertrouwen', 'vaardiggebruiken', 'vertellen'];
    let allAnswered = true;
    const assessmentData = {};

    ids.forEach(idName => {
        const selectElement = document.getElementById(`${idName}-${sectionNumber}-${selfAssessmentId}`);
        if (selectElement && selectElement.value) {
            assessmentData[idName] = selectElement.value;
        } else {
            allAnswered = false;
        }
    });

    const feedbackEl = document.getElementById(`feedback-${sectionNumber}-${selfAssessmentId}`);

    if (!allAnswered) {
        if (feedbackEl) {
            feedbackEl.textContent = 'Beoordeel alstublieft alle competenties.';
            feedbackEl.className = 'feedback-message incorrect';
        }
        return;
    }
    localStorage.setItem(`selfassessment_${sectionNumber}_${selfAssessmentId}_done`, JSON.stringify(assessmentData));
    
    // Re-render de component om de 'opgeslagen' staat te tonen
    const containerId = sectionNumber === 'dev' 
        ? `dev-${selfAssessmentId}` 
        : `hoofdstuk${sectionNumber}-${selfAssessmentId}`;
    const container = document.getElementById(containerId);

    if (container && typeof renderInteraction === 'function') {
        setTimeout(async () => {
            const chapterData = sectionNumber === 'dev' 
                ? window.devChapterData 
                : await fetchChapterData(sectionNumber);
            if (chapterData && chapterData.interacties) {
                const freshInteractionData = chapterData.interacties.find(i => i.id === selfAssessmentId);
                if (freshInteractionData) {
                    renderInteraction(freshInteractionData, sectionNumber, container);
                }
            }
        }, 100);
    }
    
    if (sectionNumber !== 'dev') {
        await updateAllChapterProgress();
    }
}

// Reinstated saveReflection
async function saveReflection(sectionNumber, reflectionId) {
    const reflectionInput = document.getElementById(`${reflectionId}-input`); 
    if (!reflectionInput) {
        console.error(`Reflection input field with ID ${reflectionId}-input not found.`);
        const feedbackEl = document.getElementById(`feedback-${sectionNumber}-${reflectionId}`);
        if (feedbackEl) {
            feedbackEl.textContent = 'Fout: reflectieveld niet gevonden.';
            feedbackEl.className = 'feedback-message incorrect';
        }
        return false;
    }
    const answer = reflectionInput.value.trim();
    
    const interactionData = await getInteractionData(sectionNumber, reflectionId);
    const minLength = interactionData && interactionData.minLength ? interactionData.minLength : 10;
    const feedbackEl = document.getElementById(`feedback-${sectionNumber}-${reflectionId}`);

    if (answer.length < minLength) {
        if (feedbackEl) {
            feedbackEl.textContent = `Je antwoord moet minimaal ${minLength} tekens bevatten.`;
            feedbackEl.className = 'feedback-message incorrect';
        }
        return false;
    }
    const storageKey = `reflection_${sectionNumber}_${reflectionId}_answered`; 
    localStorage.setItem(storageKey, answer);

    // Re-render de component om de 'opgeslagen' staat te tonen
    const containerId = sectionNumber === 'dev' 
        ? `dev-${reflectionId}` 
        : `hoofdstuk${sectionNumber}-${reflectionId}`;
    const container = document.getElementById(containerId);

    if (container && typeof renderInteraction === 'function') {
        setTimeout(async () => {
            const chapterData = sectionNumber === 'dev' 
                ? window.devChapterData 
                : await fetchChapterData(sectionNumber);
            if (chapterData && chapterData.interacties) {
                const freshInteractionData = chapterData.interacties.find(i => i.id === reflectionId);
                if (freshInteractionData) {
                    renderInteraction(freshInteractionData, sectionNumber, container);
                }
            }
        }, 100);
    }
    
    if (sectionNumber !== 'dev') {
        await updateAllChapterProgress();
    }
    return true;
}

function saveMCScore(questionNumber, correct, total) {
    localStorage.setItem(`mc${questionNumber}_correct`, correct);
    localStorage.setItem(`mc${questionNumber}_total`, total);
    // De updateAllChapterProgress voor de afsluitquiz (H8) checkt mc_quiz_answers.
}

async function updateAllChapterProgress() {
    devLog('updateAllChapterProgress gestart');
    // Dynamisch genereren van chaptersToUpdate op basis van totalSections
    // Alle hoofdstukken behalve het laatste (afsluitend hoofdstuk)
    const chaptersToUpdate = Array.from({length: totalSections - 1}, (_, i) => i + 1);
    let chapterProgress = JSON.parse(localStorage.getItem('chapterProgress')) || Array(totalSections).fill(0);

    for (let i = 0; i < chaptersToUpdate.length; i++) {
        let h = chaptersToUpdate[i];
        let ingevuld = 0;
        let totaal = 0;
        try {
            const res = await fetch(`content/hoofdstuk${h}.json`);
            if (!res.ok) {
                console.warn(`Hoofdstuk ${h} JSON niet gevonden (${res.status})`);
                chapterProgress[h - 1] = 0;
                continue;
            }
            const data = await res.json();
            if (!data.interacties || data.interacties.length === 0) {
                chapterProgress[h - 1] = 1; 
                devLog(`Hoofdstuk ${h} heeft geen interacties, gemarkeerd als voltooid.`);
                continue;
            }
            totaal = data.interacties.length;
            for (const interactie of data.interacties) {
                if (interactie.type === 'reflection') {
                    if (localStorage.getItem(`reflection_${h}_${interactie.id}_answered`)) ingevuld++;
                } else if (interactie.type === 'mc') {
                    if (localStorage.getItem(`mc_${h}_${interactie.id}_answered`)) ingevuld++;
                } else if (interactie.type === 'dragdrop') {
                    if (localStorage.getItem(`dragdrop_${h}_${interactie.id}_correct`)) ingevuld++;
                } else if (interactie.type === 'selfassessment') {
                    if (localStorage.getItem(`selfassessment_${h}_${interactie.id}_done`)) ingevuld++;
                } else if (interactie.type === 'critical_analysis') {
                    if (localStorage.getItem(`critical_analysis_${h}_${interactie.id}_answered`)) ingevuld++;
                } else if (interactie.type === 'flashcard') {
                    if (localStorage.getItem(`flashcard_${h}_${interactie.id}_done`)) ingevuld++;
                }
            }
            if (totaal > 0) {
                if (ingevuld === totaal) chapterProgress[h - 1] = 1;
                else if (ingevuld > 0) chapterProgress[h - 1] = 0.5;
                else chapterProgress[h - 1] = 0;
            }
            devLog(`Hoofdstuk ${h}: Totaal Interacties: ${totaal}, Ingevuld: ${ingevuld}, Status: ${chapterProgress[h-1]}`);
        } catch (e) {
            console.error(`Fout bij verwerken voortgang H${h}:`, e);
            chapterProgress[h - 1] = 0;
        }
    }

    // Afsluitend hoofdstuk (laatste sectie): afsluitquiz
    let quizDone = false;
    try {
        const resQuiz = await fetch('content/afsluitquiz.json');
        if (resQuiz.ok) {
            const afsluitQuizData = await resQuiz.json();
            const quizAnswers = JSON.parse(localStorage.getItem('mc_quiz_answers') || '[]');
            if (Array.isArray(quizAnswers) && quizAnswers.length === afsluitQuizData.length && quizAnswers.every(a => a && typeof a.selected !== 'undefined')) {
                quizDone = true;
            }
        }
    } catch (e) { console.error('Fout bij verwerken afsluitquiz progress:', e); }
    chapterProgress[totalSections - 1] = quizDone ? 1 : 0; // Index voor laatste hoofdstuk
    devLog(`Hoofdstuk ${totalSections} (Afsluitquiz) Status: ${chapterProgress[totalSections - 1]}`);

    localStorage.setItem('chapterProgress', JSON.stringify(chapterProgress));
    devLog('Chapter progress opgeslagen:', chapterProgress);

    // Dynamisch genereren van chapterMeta op basis van totalSections
    const chapterMeta = Array.from({length: totalSections}, (_, i) => ({ section: i + 1 }));
    chapterMeta.forEach((ch, idx) => {
        const circle = document.getElementById(`circle-${ch.section}`);
        if (!circle) return;
        circle.classList.remove('completed', 'half');
        if (chapterProgress[idx] === 1) {
            circle.classList.add('completed');
        } else if (chapterProgress[idx] === 0.5) {
            circle.classList.add('half');
        }
    });

    let completed = chapterProgress.filter(p => p === 1).length;
    let half = chapterProgress.filter(p => p === 0.5).length;
    let percent = Math.round((completed + 0.5 * half) / totalSections * 100);
    const visual = document.getElementById('sidebarProgressVisual');
    if (visual) {
        visual.style.background = `conic-gradient(var(--primary-purple) 0% ${percent}%, var(--medium-gray) ${percent}% 100%)`;
    }
    const text = document.getElementById('sidebarProgressText');
    if (text) text.textContent = percent + '%';
    devLog('Sidebar progress UI geüpdatet.');
}

function setupSidebarNavigation() {
    console.log('Setting up sidebar navigation...');
    const sidebarChapters = document.querySelectorAll('.sidebar-chapter');
    sidebarChapters.forEach(chapter => {
        chapter.addEventListener('click', function () {
            const sectionNumber = parseInt(this.getAttribute('data-section'));
            if (sectionNumber !== currentSection) {
                showSection(sectionNumber);
            }
            // Sidebar sluiten op mobiel na klik op hoofdstuk
            const sidebar = document.getElementById('sidebarNav');
            const floatingHamburger = document.getElementById('floatingHamburger');
            if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                document.body.classList.remove('sidebar-open');
                if (floatingHamburger) floatingHamburger.classList.remove('active');
            }
        });
    });
}

function setupSidebarHamburger() {
    console.log('Setting up sidebar hamburger...');
    const sidebarHamburger = document.getElementById('sidebarHamburger');
    const floatingHamburger = document.getElementById('floatingHamburger');
    const sidebar = document.getElementById('sidebarNav');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    function toggleSidebar(event) {
        if (event) event.stopPropagation();
        sidebar.classList.toggle('open');
        document.body.classList.toggle('sidebar-open');
    }

    if (sidebarHamburger) sidebarHamburger.addEventListener('click', toggleSidebar);
    if (floatingHamburger) floatingHamburger.addEventListener('click', toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

    document.addEventListener('click', function (event) {
        if (sidebar && sidebar.classList.contains('open')) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnFloatingHamburger = floatingHamburger && floatingHamburger.contains(event.target);
            if (!isClickInsideSidebar && !isClickOnFloatingHamburger) {
                toggleSidebar();
            }
        }
    });
}

// De rest van de DOMContentLoaded logica verhuist naar een nieuwe functie
function runApplicationLogic() {
    // Initialiseer de zoekmodule nu de hoofdstukken bekend zijn
    if (typeof initSearchModule === 'function') {
        initSearchModule();
    } else {
        console.error("Zoekmodule kon niet worden geïnitialiseerd omdat de functie niet gevonden is.");
    }
    
    setupSidebarNavigation();
    setupSidebarHamburger();
    
    showSection(currentSection);

    updateAllChapterProgress();

    // Event handler voor Wis Alle Voortgang knop
    const clearBtn = document.getElementById('clearProgressBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllProgress);
    }

    // Voer migratie uit voordat andere initialisatie
    // migrateOldIdsToNewFormat(); // Deze migratie is waarschijnlijk niet meer nodig, kan later worden verwijderd.
}

// New global function to handle MC answer checking
async function checkMCAnswer(interactionId, selectedAnswerIndex, correctAnswerIndex, sectionNumber, mcElement, allOptions) {
    if (!mcElement || mcElement.classList.contains('answered')) return;

    const isCorrect = selectedAnswerIndex === correctAnswerIndex;
    const feedbackEl = mcElement.querySelector(`#feedback-${interactionId}`);
    
    // Visuele feedback op de gekozen optie
    allOptions.forEach(opt => {
        const optIndex = parseInt(opt.getAttribute('data-id')) - 1;
        if (optIndex === selectedAnswerIndex) {
            opt.classList.add('selected', isCorrect ? 'correct' : 'incorrect');
        }
        opt.style.pointerEvents = 'none'; // Maak alle opties niet-klikbaar
    });

    mcElement.classList.add('answered');

    // Haal de volledige interactiedata op voor de feedbacktekst
    const fullInteractionData = await getInteractionData(sectionNumber, interactionId);

    if (feedbackEl && fullInteractionData) {
        let feedbackText = '';
        if (fullInteractionData.feedbackCorrect && fullInteractionData.feedbackIncorrect) {
            feedbackText = isCorrect ? fullInteractionData.feedbackCorrect : fullInteractionData.feedbackIncorrect;
        } else if (fullInteractionData.feedback) {
            // Fallback voor de oude structuur
            feedbackText = isCorrect ? 'Correct!' : (fullInteractionData.feedback || 'Incorrect.');
        }
        feedbackEl.textContent = feedbackText || (isCorrect ? 'Correct!' : 'Incorrect.');
        feedbackEl.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
    }

    localStorage.setItem(`mc_${sectionNumber}_${interactionId}_answered`, 'true');
    localStorage.setItem(`mc_${sectionNumber}_${interactionId}_correct`, isCorrect ? '1' : '0');
    localStorage.setItem(`mc_${sectionNumber}_${interactionId}_selected`, selectedAnswerIndex.toString());

    if (sectionNumber !== 'dev') {
        await updateAllChapterProgress();
    }
}

// Helper function to get interaction data (needed for feedback messages)
async function getInteractionData(sectionNumber, interactionId) {
    // Speciaal geval voor de dev/test-pagina
    if (sectionNumber === 'dev' && window.devChapterData) {
        return window.devChapterData.interacties.find(i => i.id === interactionId);
    }
    try {
        // Gebruik de globale 'chapters' array om het juiste bestand te vinden
        const chapterInfo = chapters.find(c => c.section == sectionNumber);
        if (!chapterInfo) {
            console.error(`Could not find chapter file for section ${sectionNumber}`);
            return null;
        }
        const res = await fetch(`content/${chapterInfo.file}`);
        if (!res.ok) return null;
        const chapterData = await res.json();
        return chapterData.interacties.find(i => i.id === interactionId);
    } catch (e) {
        console.error("Error fetching interaction data", e);
        return null;
    }
}

async function clearAllProgress() {
    if (confirm("Weet je zeker dat je alle voortgang wilt wissen? Dit kan niet ongedaan worden gemaakt.")) {
        devLog("Clearing all progress...");
        const keysToClear = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('reflection_') || 
                key.startsWith('mc') || 
                key.startsWith('dragdrop_') || 
                key.startsWith('selfassessment_') || 
                key.startsWith('flashcard_') || 
                key === 'chapterProgress' ||
                key.endsWith('_answered') || 
                key.endsWith('_correct') || 
                key.endsWith('_done')) {
                keysToClear.push(key);
            }
        }
        
        keysToClear.forEach(key => {
            devLog(`Removing item: ${key}`);
            localStorage.removeItem(key);
        });
        
        document.querySelectorAll('textarea.reflection-input').forEach(ta => ta.value = '');
        
        document.querySelectorAll('.mc-question').forEach(el => {
            if (!el.closest('#quiz-container')) {
                el.classList.remove('answered');
                el.querySelectorAll('.mc-option').forEach(opt => {
                    opt.classList.remove('selected', 'correct', 'incorrect', 'disabled');
                    opt.style.cursor = '';
                });
                const feedbackInMc = el.querySelector('.feedback');
                if (feedbackInMc) {
                    feedbackInMc.textContent = '';
                    feedbackInMc.className = 'feedback';
                }
            }
        });

        document.querySelectorAll('.interactive-exercise[data-dragdrop-id]').forEach(ddExercise => {
            const section = ddExercise.dataset.sectionNumber;
            const id = ddExercise.dataset.dragdropId;
            const containerId = `hoofdstuk${section}-${id}`;
            if (typeof resetDragDrop === 'function') {
                 // Call resetDragDrop to handle UI and specific localStorage for this d&d instance.
                 // resetDragDrop itself will call updateAllChapterProgress, or it should be called after the loop.
                 // For now, let resetDragDrop handle its own update. If progress becomes an issue, we'll revisit.
                 resetDragDrop(parseInt(section), id, containerId); 
            } else {
                const dragContainer = ddExercise.querySelector('.drag-container');
                const dropTargets = ddExercise.querySelectorAll('.drop-target .draggable');
                if (dragContainer && dropTargets) { // Add null checks
                    dropTargets.forEach(item => dragContainer.appendChild(item));
                }
                ddExercise.querySelectorAll('.draggable').forEach(item => item.classList.remove('correct', 'incorrect'));
                const ddFeedback = ddExercise.querySelector('.dragdrop-feedback');
                if(ddFeedback) {
                    ddFeedback.textContent = '';
                    ddFeedback.className = 'dragdrop-feedback';
                }
                const resetButton = ddExercise.querySelector('.btn-reset-dragdrop');
                if(resetButton) resetButton.style.display = 'none';
                const checkButton = ddExercise.querySelector('.btn-check-dragdrop');
                if(checkButton) checkButton.disabled = false;
            }
        });

        document.querySelectorAll('.assessment-select').forEach(sel => sel.value = '');
        
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            quizContainer.innerHTML = '<p>De quiz is gereset. Selecteer eventueel opnieuw de Afsluitende sectie om de quiz te starten.</p>';
            quizAnswers = []; 
            currentQuizQuestionIndex = 0;
        }

        devLog("All relevant localStorage items cleared and UI reset.");

        await updateAllChapterProgress(); 
        showSection(1); 
        alert("Alle voortgang is gewist.");
    }
}

// Reinstated Drag and Drop functions
function initializeSpecificDragDrop(containerSelector, sectionNumber, dragDropId, correctCombinations) {
    const container = document.getElementById(containerSelector);
    if (!container) {
        console.error(`DragDrop container #${containerSelector} not found in initializeSpecificDragDrop.`);
        return;
    }
    const draggables = container.querySelectorAll('.draggable');
    const dropTargets = container.querySelectorAll('.drop-target');
    
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
            setTimeout(() => this.classList.add('dragging'), 0);
        });
        draggable.addEventListener('dragend', function () {
            this.classList.remove('dragging');
        });
    });

    dropTargets.forEach(target => {
        target.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        target.addEventListener('dragleave', function () {
            this.classList.remove('dragover');
        });
        target.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggableElement = container.querySelector(`.draggable[data-id="${draggedId}"]`);
            
            // Zoek de specifieke container voor gesleepte items
            const droppedItemsContainer = this.querySelector('.dropped-items-container');
            if (draggableElement && droppedItemsContainer) {
                // Voeg het element toe aan de container, vervang niet
                droppedItemsContainer.appendChild(draggableElement);
            }
        });
    });
    
    const dragContainer = container.querySelector('.drag-container');
    if (dragContainer) {
        dragContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        dragContainer.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        dragContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const draggedId = e.dataTransfer.getData('text/plain');
            // Ensure we're only moving draggables that belong to this exercise
            const draggableElement = document.querySelector(`.draggable[data-id="${draggedId}"]`);
            if (draggableElement && draggableElement.closest('.interactive-exercise') === container.querySelector('.interactive-exercise')) {
                this.appendChild(draggableElement);
            }
        });
    }
}

async function checkDragDrop(containerTargetId, sectionNumber, dragDropId) {
    const container = document.getElementById(containerTargetId);
    if(!container) {
      console.error(`DragDrop container #${containerTargetId} not found in checkDragDrop.`);
      return;
    }
    
    // Gebruik getInteractionData om de data te krijgen, werkt ook voor 'dev' modus
    const ddData = await getInteractionData(sectionNumber, dragDropId);

    if (!ddData || !ddData.correctCombinations) {
        console.error(`Drag & drop data or correctCombinations not found for ${dragDropId}.`);
        return;
    }

    const correctCombinations = ddData.correctCombinations;

    let allCorrect = true;
    const interactiveExercise = container.querySelector('.interactive-exercise');
    const dropTargets = interactiveExercise.querySelectorAll('.drop-target');
    const allPlacedItems = new Set();

    // Valideer alle items in de drop targets
    dropTargets.forEach(target => {
        const targetId = target.getAttribute('data-id');
        const draggableElements = target.querySelectorAll('.draggable');
        
        draggableElements.forEach(item => {
            const itemId = item.getAttribute('data-id');
            allPlacedItems.add(itemId);
            
            // Vind de correcte combinatie voor dit item
            const correctCombination = correctCombinations.find(c => c.itemId === itemId);
            
            if (correctCombination && correctCombination.targetId === targetId) {
                item.classList.add('correct');
                item.classList.remove('incorrect');
            } else {
                allCorrect = false;
                item.classList.add('incorrect');
                item.classList.remove('correct');
            }
        });
    });

    // Controleer of alle items wel geplaatst zijn
    const initialItemsData = ddData.items || [];
    if (allPlacedItems.size !== initialItemsData.length) {
        allCorrect = false;
    }

    // Controleer of er geen items meer in de startcontainer zitten
    const itemsInDragContainer = interactiveExercise.querySelectorAll('.drag-container .draggable');
    if (itemsInDragContainer.length > 0) {
        allCorrect = false;
    }
    
    const feedbackEl = interactiveExercise.querySelector(`#feedback-${sectionNumber}-${dragDropId}`);
    const resetButton = interactiveExercise.querySelector('.btn-reset-dragdrop');
    const checkButton = interactiveExercise.querySelector('.btn-check-dragdrop');
    
    const storageKeyCorrect = `dragdrop_${sectionNumber}_${dragDropId}_correct`;
    const storageKeyState = `dragdrop_${sectionNumber}_${dragDropId}_state`;

    if (allCorrect) {
        if(feedbackEl) {
            feedbackEl.textContent = ddData.feedbackCorrect || 'Goed gedaan! Alles is correct.';
            feedbackEl.className = 'dragdrop-feedback correct';
        }
        localStorage.setItem(storageKeyCorrect, 'true');
        localStorage.setItem(storageKeyState, JSON.stringify(Array.from(allPlacedItems))); // Sla de succesvolle staat op
        if (resetButton) resetButton.style.display = 'none';
        if (checkButton) {
            checkButton.disabled = true;
            checkButton.textContent = 'Opgeslagen';
            checkButton.classList.add('btn-opgeslagen');
        }
        // Maak alle draggables en targets niet meer interactief
        interactiveExercise.querySelectorAll('.draggable').forEach(el => el.setAttribute('draggable', 'false'));
        // Event listeners moeten mogelijk ook worden verwijderd of gecontroleerd.
    } else {
        if(feedbackEl) {
            feedbackEl.textContent = ddData.feedbackIncorrect || 'Niet alle koppelingen zijn correct. Probeer het opnieuw.';
            feedbackEl.className = 'dragdrop-feedback incorrect';
        }
        localStorage.removeItem(storageKeyCorrect);
        localStorage.removeItem(storageKeyState); // Verwijder state als het niet correct is
        if (resetButton) resetButton.style.display = 'inline-block';
        if (checkButton) checkButton.disabled = false;
    }
    if (sectionNumber !== 'dev') {
        await updateAllChapterProgress();
    }
}

function resetDragDrop(sectionNumber, dragDropId, containerTargetId) {
    const container = document.getElementById(containerTargetId); // This is the placeholder div
    if (!container) {
        console.error(`DragDrop placeholder container #${containerTargetId} not found in resetDragDrop.`);
        return;
    }
    const interactiveExercise = container.querySelector('.interactive-exercise'); // Get the actual exercise div
    if (!interactiveExercise) {
        console.error(`DragDrop interactive exercise not found within #${containerTargetId}.`);
        return;
    }

    const dragContainer = interactiveExercise.querySelector('.drag-container');
    const dropTargets = interactiveExercise.querySelectorAll('.drop-target');
    const feedbackEl = interactiveExercise.querySelector(`#feedback-${sectionNumber}-${dragDropId}`);
    const resetButton = interactiveExercise.querySelector('.btn-reset-dragdrop');
    const checkButton = interactiveExercise.querySelector('.btn-check-dragdrop');
    
    if (!dragContainer) {
        console.error("Drag container not found in resetDragDrop for " + containerTargetId);
        return;
    }
    dragContainer.innerHTML = ''; // Clear it first

    // Clear items from drop targets by clearing their innerHTML for .dropped-items-container
    dropTargets.forEach(target => {
        const droppedItemsContainer = target.querySelector('.dropped-items-container');
        if (droppedItemsContainer) {
            droppedItemsContainer.innerHTML = '';
        }
    });
    
    const initialItemsString = interactiveExercise.dataset.initialItems;
    if (initialItemsString) {
        const initialItemsData = JSON.parse(initialItemsString);
        if(initialItemsData.length > 0) {
            initialItemsData.forEach(itemData => {
                const el = document.createElement('div');
                el.className = 'draggable';
                el.setAttribute('draggable', 'true');
                el.setAttribute('data-id', itemData.id);
                el.textContent = itemData.label;
                // Verwijder inline styles die door opslaan zijn toegevoegd
                el.style.pointerEvents = ''; 
                el.style.opacity = '';
                dragContainer.appendChild(el);
            });
            initializeSpecificDragDrop(container.id, sectionNumber, dragDropId, {}); 
        }
    } 
    // Fallback is niet meer echt nodig als dataset.initialItems goed gevuld wordt

    if (feedbackEl) {
        feedbackEl.textContent = '';
        feedbackEl.className = 'dragdrop-feedback';
    }
    if (resetButton) resetButton.style.display = 'none';
    if (checkButton) {
        checkButton.disabled = false;
    }

    localStorage.removeItem(`dragdrop_${sectionNumber}_${dragDropId}_correct`);
    localStorage.removeItem(`dragdrop_${sectionNumber}_${dragDropId}_state`); // Verwijder ook de state
    if (sectionNumber !== 'dev') {
        updateAllChapterProgress();
    }
}

// Migratie functie voor oude ID's naar nieuwe format
async function migrateOldIdsToNewFormat() {
    const oldToNewIdMap = {};
    // Dynamisch genereren van chaptersToMigrate op basis van totalSections
    // Alle hoofdstukken behalve het laatste (afsluitend hoofdstuk)
    const chaptersToMigrate = Array.from({length: totalSections - 1}, (_, i) => i + 1);

    // Verzamel alle oude ID's en maak nieuwe
    for (const h of chaptersToMigrate) {
        try {
            const res = await fetch(`content/hoofdstuk${h}.json`);
            if (!res.ok) continue;
            const data = await res.json();
            if (!data.interacties) continue;

            data.interacties.forEach((interactie, index) => {
                const oldId = interactie.id;
                const newId = `h${h}_${interactie.type}_${index + 1}`;
                oldToNewIdMap[oldId] = newId;
            });
        } catch (e) {
            console.error(`Fout bij migreren hoofdstuk ${h}:`, e);
        }
    }

    // Migreer localStorage items
    const keysToMigrate = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('reflection_') || 
            key.startsWith('mc_') || 
            key.startsWith('dragdrop_') || 
            key.startsWith('selfassessment_') || 
            key.startsWith('flashcard_')) {
            keysToMigrate.push(key);
        }
    }

    // Migreer elke key
    keysToMigrate.forEach(oldKey => {
        const value = localStorage.getItem(oldKey);
        if (!value) return;

        // Bepaal het type en hoofdstuk uit de key
        const [type, section, oldId] = oldKey.split('_');
        if (!oldId || !oldToNewIdMap[oldId]) return;

        // Maak nieuwe key met nieuw ID
        const newKey = `${type}_${section}_${oldToNewIdMap[oldId]}`;
        
        // Sla op met nieuwe key
        localStorage.setItem(newKey, value);
        
        // Verwijder oude key niet direct, voor veiligheid
        console.log(`Migrated ${oldKey} to ${newKey}`);
    });
}

// Function to initialize MC interactions (called from dynamicContent.js)
function initializeMCInteraction(containerId, interactionData, sectionNumber) {
    const mcContainer = document.getElementById(containerId);
    if (!mcContainer) {
        console.error(`MC container #${containerId} not found for initialization.`);
        return;
    }
    const options = mcContainer.querySelectorAll('li.mc-option');
    const mcElement = mcContainer.querySelector('.mc-interaction');

    options.forEach(option => {
        option.addEventListener('click', async function () {
            if (mcElement && mcElement.classList.contains('answered')) return;

            const selectedAnswerIndex = parseInt(this.getAttribute('data-id')) - 1; // Corrigeer naar 0-gebaseerd
            // Call checkMCAnswer with the correct 0-based index
            await checkMCAnswer(interactionData.id, selectedAnswerIndex, interactionData.correctAnswer, sectionNumber, mcElement, options);
        });
    });
}

async function saveCriticalAnalysis(sectionNumber, interactionId) {
    const select = document.getElementById('critical-analysis-select');
    const selectedTech = select ? select.value : '';
    const feedbackEl = document.getElementById(`feedback-${sectionNumber}-${interactionId}`);

    // Get interaction data to validate against
    const interactionDataForCritical = await getInteractionData(sectionNumber, interactionId);
    
    // Validate selectedTech - it might not be present if interactionData.dropdown is empty or not defined
    if (interactionDataForCritical?.dropdown?.length > 0 && !selectedTech) {
        if (feedbackEl) {
            feedbackEl.textContent = 'Selecteer een technologie.';
            feedbackEl.className = 'feedback-message incorrect';
        }
        return;
    }

    // Validate text areas based on interactionData.vragen
    let allQuestionsAnswered = true;
    const data = { technologie: selectedTech };

    if (interactionDataForCritical && interactionDataForCritical.vragen) {
        for (const vraag of interactionDataForCritical.vragen) {
            const inputElement = document.getElementById(`${vraag.id}-input`);
            const answer = inputElement ? inputElement.value.trim() : '';
            devLog(`Checking field ${vraag.id}-input:`, answer); // Debug log
            if (answer.length < 10) { // Assuming minLength 10 for all questions
                allQuestionsAnswered = false;
                devLog(`Field ${vraag.id} too short:`, answer.length); // Debug log
                break;
            }
            data[vraag.id] = answer;
        }
    }

    if (!allQuestionsAnswered) {
        if (feedbackEl) {
            feedbackEl.textContent = 'Beantwoord alle vragen (minimaal 10 tekens per antwoord).';
            feedbackEl.className = 'feedback-message incorrect';
        }
        return;
    }

    // Debug logging
    devLog('Saving critical analysis data:', data);
    devLog('Storage key:', `critical_analysis_${sectionNumber}_${interactionId}_answered`);

    localStorage.setItem(`critical_analysis_${sectionNumber}_${interactionId}_answered`, JSON.stringify(data));
    if (feedbackEl) {
        feedbackEl.textContent = 'Opgeslagen!';
        feedbackEl.className = 'feedback-message correct';
    }

    // De container ID is anders in de dev-modus
    const containerId = sectionNumber === 'dev' 
        ? `dev-${interactionId}` 
        : `hoofdstuk${sectionNumber}-${interactionId}`;
    const container = document.getElementById(containerId);

    if (container && typeof renderInteraction === 'function') {
        setTimeout(async () => {
             // Haal de juiste data op (uit window.devChapterData of via fetch)
            const chapterData = sectionNumber === 'dev' 
                ? window.devChapterData 
                : await fetchChapterData(sectionNumber);

            if (chapterData && chapterData.interacties) {
                const freshInteractionData = chapterData.interacties.find(i => i.id === interactionId);
                if (freshInteractionData) {
                    renderInteraction(freshInteractionData, sectionNumber, container);
                }
            }
        }, 600);
    }
    if (sectionNumber !== 'dev') {
        updateAllChapterProgress();
    }
}

/**
 * Wist alle voortgang die specifiek is voor de 'Interacties Testen' modus.
 */
function clearDevProgress() {
    if (!confirm("Weet je zeker dat je de voortgang van deze testpagina wilt wissen?")) {
        return;
    }

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Zoek naar keys die het '_dev_' patroon bevatten.
        if (key.includes('_dev_')) {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        devLog(`Removed dev key: ${key}`);
    });

    // Her-render de testpagina om de wijzigingen te tonen.
    const mainContainer = document.querySelector('main.container');
    if (window.devChapterData && mainContainer && typeof renderStandaloneChapter === 'function') {
        renderStandaloneChapter(window.devChapterData, mainContainer);
        alert("De voortgang van de testpagina is gewist.");
    } else {
        // Fallback als er iets misgaat
        window.location.reload();
    }
}



