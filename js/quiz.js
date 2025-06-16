// Globale variabelen specifiek voor de afsluitende quiz
let currentQuizQuestionIndex = 0;
let quizQuestionsData = []; // Zal vragen van afsluitquiz.json bevatten
let quizAnswers = []; // Zal antwoorden van de gebruiker bevatten

/**
 * Laadt de data voor de afsluitende quiz uit afsluitquiz.json
 * en start de eerste vraag.
 */
async function loadMCQuiz() {
    console.log('loadMCQuiz aangeroepen');
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) {
        console.warn('Quiz container #quiz-container niet gevonden. Poging tot dynamisch aanmaken.');
        const section8Content = document.querySelector('#section8 .section-content');
        if (section8Content) {
            const newQuizContainer = document.createElement('div');
            newQuizContainer.id = 'quiz-container';
            const certSection = document.getElementById('certificaat-portfolio-container');
            section8Content.insertBefore(newQuizContainer, certSection);
             console.log('#quiz-container dynamisch aangemaakt voor certificaat sectie.');
        } else {
            console.error('Kritieke Fout: Sectie 8 content area niet gevonden.');
            return;
        }
    }
    document.getElementById('quiz-container').innerHTML = '<p>Quiz aan het laden...</p>';
    try {
        const res = await fetch('content/afsluitquiz.json');
        if (!res.ok) {
            throw new Error(`Afsluitquiz JSON niet gevonden (${res.status})`);
        }
        const loadedData = await res.json();
        if (!Array.isArray(loadedData) || loadedData.length === 0) {
             console.warn('Afsluitquiz JSON is leeg of ongeldig formaat.');
             document.getElementById('quiz-container').innerHTML = '<p style="color:red;">Fout: Quizdata is leeg of ongeldig.</p>';
             return;
        }
        quizQuestionsData = loadedData;
        let storedAnswers = JSON.parse(localStorage.getItem('mc_quiz_answers')) || [];
        quizAnswers = storedAnswers.filter(ans => quizQuestionsData.some(q => q.id === ans.id));
        localStorage.setItem('mc_quiz_answers', JSON.stringify(quizAnswers));

        currentQuizQuestionIndex = 0; 
        renderCurrentQuizQuestion();
    } catch (e) {
        console.error('Fout bij laden afsluitquiz:', e);
        if(document.getElementById('quiz-container')) document.getElementById('quiz-container').innerHTML = `<p style="color:red;">Kon afsluitquiz niet laden: ${e.message}</p>`;
    }
}

/**
 * Rendert de huidige quizvraag op basis van `currentQuizQuestionIndex`.
 * Toont de vraag, opties, en navigatieknoppen.
 */
function renderCurrentQuizQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) { 
        console.error("renderCurrentQuizQuestion: quizContainer niet gevonden!");
        return;
    }
    if (quizQuestionsData.length === 0) {
        quizContainer.innerHTML = '<p>Geen vragen beschikbaar voor de quiz.</p>';
        return;
    }
    
    if (currentQuizQuestionIndex >= quizQuestionsData.length) {
        displayQuizResults();
        return;
    }

    const q = quizQuestionsData[currentQuizQuestionIndex];
    if (!q) {
        console.error(`Kon vraag data niet vinden voor index ${currentQuizQuestionIndex}`);
        quizContainer.innerHTML = `<p style=\"color:red;\">Fout: Kon vraag ${currentQuizQuestionIndex + 1} niet laden.</p>
                                   <button class=\"btn\" onclick=\"displayQuizResults()\">Toon Resultaten</button>`;
        return;
    }
    
    const existingAnswer = quizAnswers.find(a => a.id === q.id);
    const isAnswered = !!existingAnswer;

    // Shuffle opties per vraag, maar alleen als nog niet beantwoord
    let shuffledOptions, correctIndex;
    if (!isAnswered) {
        shuffledOptions = q.options.map((opt, idx) => ({ opt, idx: idx + 1 }));
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }
        q._shuffledOptions = shuffledOptions;
        correctIndex = shuffledOptions.findIndex(o => o.idx === q.correctAnswer) + 1;
        q._shuffledCorrectIndex = correctIndex;
    } else {
        shuffledOptions = q._shuffledOptions || q.options.map((opt, idx) => ({ opt, idx: idx + 1 }));
        correctIndex = q._shuffledCorrectIndex || q.correctAnswer;
    }

    const questionCounter = `<div class="question-counter">Vraag ${currentQuizQuestionIndex + 1} van ${quizQuestionsData.length}</div>`;
    const showOptionsBlockClass = !isAnswered ? 'initial-height' : '';

    let output = `
        <div class="mc-question afsluitquiz-vraag ${isAnswered ? 'answered' : ''}" id="quizq-${q.id}" data-question-index="${currentQuizQuestionIndex}">
            ${questionCounter}
            <h4>${q.title || `Vraag ${currentQuizQuestionIndex + 1}`}</h4>
            <p>${q.text}</p>
            <div id="show-options-block" class="${showOptionsBlockClass}">
                ${!isAnswered ? `<button class="btn btn-show-options" id="show-options-btn">Toon antwoordopties</button>
                <div class="show-options-explainer">Probeer eerst het antwoord uit je hoofd te bedenken. Lukt dat niet? Klik dan op de knop om de antwoordopties te zien. Dit helpt je beter te leren!</div>` : ''}
                <ul class="mc-options" id="mc-options-list" style="${!isAnswered ? 'display:none;' : ''}">
                    ${shuffledOptions.map((o, i) => {
                        let optionClasses = "mc-option";
                        if (isAnswered) {
                            optionClasses += " disabled"; 
                            if (existingAnswer.selected === (i + 1)) {
                                optionClasses += " selected";
                                optionClasses += existingAnswer.correct ? " correct" : " incorrect";
                            }
                        }
                        return `<li class="${optionClasses}" data-question-id="${q.id}" data-option-id="${i + 1}">${o.opt}</li>`;
                    }).join('')}
                </ul>
            </div>
            <div class="feedback" id="feedback-quizq-${q.id}">${isAnswered && existingAnswer.feedback ? existingAnswer.feedback : ''}</div>
        </div>
        <div class="quiz-navigation-buttons">
            <button class="btn btn-prev-quiz" ${currentQuizQuestionIndex === 0 ? 'disabled' : ''} onclick="prevQuizQuestion()">Vorige Vraag</button>
            <button class="btn btn-next-quiz" 
                ${(!isAnswered && currentQuizQuestionIndex < quizQuestionsData.length) ? 'disabled' : ''} 
                onclick="nextQuizQuestion()">
                ${(currentQuizQuestionIndex === quizQuestionsData.length - 1) ? 'Quiz voltooien' : 'Volgende Vraag'}
            </button>
        </div>
    `;
    quizContainer.innerHTML = output;

    if (!isAnswered) {
        const showOptionsBtn = quizContainer.querySelector('#show-options-btn');
        const explainerText = quizContainer.querySelector('.show-options-explainer');
        if (showOptionsBtn) {
            showOptionsBtn.addEventListener('click', function() {
                const optionsList = quizContainer.querySelector('#mc-options-list');
                if (optionsList) optionsList.style.display = '';
                showOptionsBtn.style.display = 'none';
                if (explainerText) explainerText.style.display = 'none';
                const showOptionsBlock = quizContainer.querySelector('#show-options-block');
                if (showOptionsBlock) showOptionsBlock.classList.remove('initial-height');
            });
        }
        
        const options = quizContainer.querySelectorAll('.mc-option:not(.disabled)');
        options.forEach(option => {
            option.addEventListener('click', handleQuizOptionClick);
        });
    } else {
        const feedbackEl = quizContainer.querySelector(`#feedback-quizq-${q.id}`);
        if (feedbackEl && existingAnswer) {
           feedbackEl.className = 'feedback ' + (existingAnswer.correct ? 'correct' : 'incorrect');
        }
        const nextButton = quizContainer.querySelector('.btn-next-quiz');
        if (nextButton) nextButton.disabled = false;
    }
}

/**
 * Verwerkt een klik op een quiz-optie.
 * Controleert het antwoord, geeft feedback, en slaat de score op.
 */
function handleQuizOptionClick() {
    const questionId = this.getAttribute('data-question-id');
    const optionId = parseInt(this.getAttribute('data-option-id'));
    const questionDiv = this.closest('.mc-question');
    const questionData = quizQuestionsData.find(q => q.id === questionId);

    if (questionDiv.classList.contains('answered') || !questionData) return;

    questionDiv.querySelectorAll('.mc-option').forEach(opt => {
        opt.removeEventListener('click', handleQuizOptionClick);
        opt.classList.add('disabled');
    });

    const correctIndex = questionData._shuffledCorrectIndex || questionData.correctAnswer;
    const isCorrect = optionId === correctIndex;
    this.classList.add('selected');
    this.classList.add(isCorrect ? 'correct' : 'incorrect');

    const feedbackEl = questionDiv.querySelector('.feedback');
    feedbackEl.textContent = questionData.feedback;
    feedbackEl.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
    
    questionDiv.classList.add('answered');
    
    let answerIndex = quizAnswers.findIndex(a => a.id === questionId);
    const answerObj = { 
        id: questionId, 
        selected: optionId, 
        correct: isCorrect, 
        feedback: questionData.feedback, 
        questionText: questionData.text, 
        options: (questionData._shuffledOptions || questionData.options.map(o => ({opt:o}))).map(o => o.opt),
        title: questionData.title 
    };
    if (answerIndex > -1) {
        quizAnswers[answerIndex] = answerObj;
    } else {
        quizAnswers.push(answerObj);
    }
    localStorage.setItem('mc_quiz_answers', JSON.stringify(quizAnswers));

    const nextButton = document.querySelector('.btn-next-quiz');
    if (nextButton) nextButton.disabled = false;
    
    if (typeof updateAllChapterProgress === 'function') {
        updateAllChapterProgress(); 
    }
}

/**
 * Navigeert naar de volgende quizvraag.
 */
function nextQuizQuestion() {
    const allQuestionsAnswered = quizQuestionsData.every(q => quizAnswers.some(a => a.id === q.id && typeof a.selected !== 'undefined'));
    if (currentQuizQuestionIndex < quizQuestionsData.length - 1) {
        currentQuizQuestionIndex++;
        renderCurrentQuizQuestion();
    } else if (allQuestionsAnswered || currentQuizQuestionIndex === quizQuestionsData.length - 1) {
        displayQuizResults();
    } else {
         console.warn("NextQuizQuestion called on last question, but not all answered. Showing results.");
         displayQuizResults();
    }
}

/**
 * Navigeert naar de vorige quizvraag.
 */
function prevQuizQuestion() {
    if (currentQuizQuestionIndex > 0) {
        currentQuizQuestionIndex--;
        renderCurrentQuizQuestion();
    }
}

/**
 * Toont de eindresultaten van de quiz.
 */
function displayQuizResults() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) { console.error("displayQuizResults: quizContainer niet gevonden!"); return; }

    let score = 0;
    quizAnswers.forEach(ans => {
        if (quizQuestionsData.some(q => q.id === ans.id) && ans.correct) {
            score++;
        }
    });
    const totalQuizQuestions = quizQuestionsData.length;
    const percentage = totalQuizQuestions > 0 ? (score / totalQuizQuestions) * 100 : 0;
    
    let feedbackMessage = '';
    let feedbackColor = '';
    let feedbackClass = '';
    
    if (percentage >= 80) {
        feedbackMessage = 'Fantastisch gedaan! Je hebt de stof uitstekend verwerkt.';
        feedbackColor = '#28a745';
        feedbackClass = 'results-excellent';
    } else if (percentage >= 65) {
        feedbackMessage = 'Goed gedaan! Je hebt een goed begrip van de stof.';
        feedbackColor = '#28a745';
        feedbackClass = 'results-passed';
    } else if (percentage >= 55) {
        feedbackMessage = 'Goed bezig! Je hebt de basis onder de knie, maar er is nog ruimte voor verbetering. Herhaal de quiz om je score nog verder te verhogen.';
        feedbackColor = '#28a745';
        feedbackClass = 'results-passed';
    } else if (percentage >= 40) {
        feedbackMessage = 'Bijna! Het is verstandig om de quiz te herhalen en de stof nog eens door te nemen.';
        feedbackColor = '#ffc107';
        feedbackClass = 'results-warning';
    } else {
        feedbackMessage = 'Het is aan te raden om de e-learning nog eens door te nemen en daarna de quiz te herhalen.';
        feedbackColor = '#dc3545';
        feedbackClass = 'results-failed';
    }

    let resultsHTML = `
        <div id="quiz-results-container" class="${feedbackClass}">
            <div class="results-header">
                <h2>Afsluitende Quiz - Resultaten</h2>
            </div>
            <div class="results-summary">
                <div class="score-text">
                    <p>Je hebt <strong>${score} van de ${totalQuizQuestions}</strong> vragen correct beantwoord.</p>
                    <p class="score-percentage" style="color: ${feedbackColor};">${percentage.toFixed(0)}%</p>
                    <p class="feedback-message" style="color: ${feedbackColor};">${feedbackMessage}</p>
                </div>
            </div>
            <div class="quiz-actions">
                <button class="btn btn-restart-quiz" onclick="restartQuiz()">
                    <img src="images/icons/restart-icon.svg" alt="" class="btn-icon"> Quiz Herstarten
                </button>
                ${totalQuizQuestions > 0 ? `<button class="btn btn-review-answers" onclick="reviewQuizQuestion(0)"><img src="images/icons/review-icon.svg" alt="" class="btn-icon">Antwoorden terugkijken</button>` : ''}
            </div>
        </div>
        <div id="quiz-review-details-container"></div>
    `;
    quizContainer.innerHTML = resultsHTML;
    if (typeof updateAllChapterProgress === 'function') {
        updateAllChapterProgress(); 
    }
}

/**
 * Herstart de quiz vanaf het begin.
 */
function restartQuiz() {
    quizAnswers = [];
    localStorage.removeItem('mc_quiz_answers'); 
    currentQuizQuestionIndex = 0;
    if (quizQuestionsData.length === 0) { 
        loadMCQuiz(); 
    } else {
        renderCurrentQuizQuestion();
    }
}

/**
 * Toont een specifieke vraag met het antwoord van de gebruiker om na te kijken.
 * @param {number} questionIndex - De index van de vraag die bekeken moet worden.
 */
function reviewQuizQuestion(questionIndex) {
    currentQuizQuestionIndex = questionIndex; 
    const quizContainer = document.getElementById('quiz-container'); 
    const reviewDetailContainer = document.getElementById('quiz-review-details-container');

    if (!reviewDetailContainer) { 
        console.error("reviewQuizQuestion: quiz-review-details-container niet gevonden!"); 
        if(quizContainer) quizContainer.innerHTML += "<p style='color:red'>Kan review details niet laden.</p>";
        return; 
    }

    if (!quizQuestionsData || questionIndex < 0 || questionIndex >= quizQuestionsData.length) {
        reviewDetailContainer.innerHTML = `<p>Kan deze vraag niet voor terugkijken laden.</p>`;
        return;
    }

    const q = quizQuestionsData[questionIndex];
    const userAnswer = quizAnswers.find(a => a.id === q.id);
    const isCorrect = userAnswer ? userAnswer.correct : false;

    let output = `
        <div class="mc-question afsluitquiz-vraag answered review-mode" id="review-quizq-${q.id}">
            <h4>Terugkijken: ${q.title || `Vraag ${questionIndex + 1}`} (van ${quizQuestionsData.length})</h4>
            <p><strong>Vraag:</strong> ${q.text}</p>
            <ul class="mc-options review-options">
                ${q.options.map((opt, i) => {
                    let classes = 'mc-option disabled'; 
                    const optionNum = i + 1;
                    let icon = '';

                    if (userAnswer && userAnswer.selected === optionNum) {
                        classes += ' selected';
                        classes += userAnswer.correct ? ' correct' : ' incorrect';
                        icon = userAnswer.correct ? '<img src="images/icons/check-circle.svg" class="option-icon correct-icon" alt="Correct">' : '<img src="images/icons/x-circle.svg" class="option-icon incorrect-icon" alt="Incorrect">' ;
                    } else if (q.correctAnswer === optionNum) {
                        classes += ' correct-unselected'; 
                        icon = '<img src="images/icons/check-circle-outline.svg" class="option-icon correct-icon-outline" alt="Correct Answer">';
                    }
                    return `<li class="${classes}">${icon} ${opt}</li>`;
                }).join('')}
            </ul>
            <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                <strong>Feedback:</strong> ${q.feedback || (userAnswer && userAnswer.feedback) || "Geen feedback beschikbaar."}
            </div>
        </div>
        <div class="quiz-navigation-buttons review-nav-buttons">
            <button class="btn" onclick="reviewQuizQuestion(${questionIndex - 1})" ${questionIndex === 0 ? 'disabled' : ''}>Vorige</button>
            <button class="btn" onclick="reviewQuizQuestion(${questionIndex + 1})" ${questionIndex === quizQuestionsData.length - 1 ? 'disabled' : ''}>Volgende</button>
        </div>
    `;
    reviewDetailContainer.innerHTML = output; 
} 