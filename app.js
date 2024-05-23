// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAL_sac3vL519K1gDOVbMq52_8h_K2qqE0",
    authDomain: "card-assignment-b3477.firebaseapp.com",
    databaseURL: "https://card-assignment-b3477-default-rtdb.firebaseio.com",
    projectId: "card-assignment-b3477",
    storageBucket: "card-assignment-b3477.appspot.com",
    messagingSenderId: "373095420041",
    appId: "1:373095420041:web:f0447f64001383e2593658"
  };
  
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

let $ = document

const time = $.querySelector('.time')
const questionBox = $.querySelector('.question')
const answerCotainer = $.querySelector('.answer-cotainer')
const firstQuez = $.querySelector('.first')
const lastQuez = $.querySelector('.last')
const nextQuestion = $.querySelector('.next-Question')
const statusTime = $.querySelector('.status-time')
const endQuez = $.querySelector('.end-Quez')
const restartQuez = $.querySelector('.restart-quez')
const resultRight = $.querySelector('.result-right')
const ofQuestion = $.querySelector('.of-question')
const containerQuestion = $.querySelector('.container')
const resultBox = $.querySelector('.result-box')
const cupImage = $.querySelector('.cup-image')
const message = $.querySelector('.message-text')

let firstQuezCount = 1
let lastQuezCount = 1
let rightQuez = 0
let wrongAttempts = []
let timer;
let index = 0
let timeCount = 20
let startTime = 0

function createTemplate(questions) {
    answerCotainer.innerHTML = ''
    questionBox.innerHTML = ''

    let quezTemplate = `<p>${questions[index].question}</p>`

    let answerOption = `<p class="answer">${questions[index].options[0]}</p>
    <p class="answer">${questions[index].options[1]}</p>
    <p class="answer">${questions[index].options[2]}</p>
    <p class="answer">${questions[index].options[3]}</p>`

    questionBox.insertAdjacentHTML('beforeend', quezTemplate)
    answerCotainer.insertAdjacentHTML('beforeend', answerOption)

    firstQuez.innerHTML = index + 1
    lastQuez.innerHTML = questions.length

    timerContHandler()
    let answer = $.querySelectorAll('.answer')

    for (let i = 0; i < answer.length; i++) {
        answer[i].setAttribute('onclick', 'checkAnswer(this)')
    }
}

function checkAnswer(answer) {
    clearInterval(timer)
    let answerClick = answer.innerHTML
    let answerMain = questions[index].answer
    let allAnswerChild = answerCotainer.children.length
    nextQuestion.classList.add('show-next')

    if (answerClick === answerMain) {
        answer.classList.add('rightAnswer')
        rightQuez++
        updateScore(rightQuez)
    } else {
        answer.classList.add('noAnswer')
        wrongAttempts.push({
            question: questions[index].question,
            wrongAnswer: answerClick,
            correctAnswer: answerMain
        });
        for (let i = 0; i < allAnswerChild; i++) {
            if (answerCotainer.children[i].innerHTML === answerMain) {
                answerCotainer.children[i].classList.add('rightAnswer')
            }
        }
    }
    for (let i = 0; i < allAnswerChild; i++) {
        answerCotainer.children[i].classList.add('disable')
    }
}

function timerContHandler() {
    timer = setInterval(function () {
        timeCount--
        time.innerHTML = timeCount

        if (timeCount < 10) {
            time.innerHTML = '0' + timeCount
        }
        if (timeCount == 0) {
            clearInterval(timer)
            statusTime.style.background = 'rgb(199, 36, 14 , .8)'
            nextQuestion.classList.add('show-next')

            let answerMain = questions[index].answer
            let allAnswerChild = answerCotainer.children.length

            for (let i = 0; i < allAnswerChild; i++) {
                if (answerCotainer.children[i].innerHTML === answerMain) {
                    answerCotainer.children[i].classList.add('rightAnswer')
                }
            }

            for (let i = 0; i < allAnswerChild; i++) {
                answerCotainer.children[i].classList.add('disable')
            }

        } else {
            statusTime.style.background = 'rgb(145, 53, 250)'
        }
    }, 1000)
}

function nextQuestionHandler() {
    index++
    timeCount = 20
    createTemplate(questions)
    setTimeout(timer, 1000)

    if (index == questions.length) {
        nextQuestion.classList.remove('show-next')
        endQuez.classList.add('show-end')
    } else {
        nextQuestion.classList.remove('show-next')
    }
}

function updateScore(right) {
    if (right > 6) {
        cupImage.setAttribute('src', 'images/gold.png')
        message.innerHTML = 'And congrats!'
    } else if (right <= 6 && right > 4) {
        cupImage.setAttribute('src', 'images/silver.png')
        message.innerHTML = 'And nice'
    } else if (right <= 4 && right >= 2) {
        cupImage.setAttribute('src', 'images/bronze.png')
        message.innerHTML = 'And passable'
    } else if (right == 1) {
        cupImage.setAttribute('src', 'images/emojy.png')
        message.innerHTML = 'And sorry'
    } else {
        cupImage.setAttribute('src', 'images/emojy.png')
        message.innerHTML = 'You did not get any points!'
    }

    resultRight.innerHTML = rightQuez
    ofQuestion.innerHTML = questions.length

    // Store the result in Firebase
    storeResultInFirebase(right, questions.length);
}

function storeResultInFirebase(correctAnswers, totalQuestions) {
    let newResultKey = database.ref().child('results').push().key;
    let resultData = {
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions,
        wrongAttempts: wrongAttempts,
        timeTaken: 20 * questions.length - timeCount,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    let updates = {};
    updates['/results/' + newResultKey] = resultData;

    return database.ref().update(updates);
}

function showResultQuez() {
    containerQuestion.classList.add('hide-question')
    resultBox.classList.add('show-result')
}

function restartQuezHandler() {
    location.reload()
}

// Store the questions and correct answers in Firebase
function storeQuestionsInFirebase() {
    questions.forEach((question, index) => {
        let newQuestionKey = database.ref().child('questions').push().key;
        let questionData = {
            question: question.question,
            correctAnswer: question.answer,
            options: question.options,
            index: index + 1
        };

        let updates = {};
        updates['/questions/' + newQuestionKey] = questionData;

        database.ref().update(updates);
    });
}

// Call storeQuestionsInFirebase when the script loads to store questions in Firebase
storeQuestionsInFirebase();

nextQuestion.addEventListener('click', nextQuestionHandler)
endQuez.addEventListener('click', showResultQuez)
restartQuez.addEventListener('click', restartQuezHandler)
createTemplate(questions)