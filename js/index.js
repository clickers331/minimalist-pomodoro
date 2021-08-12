
class TimeMode {
    constructor(_timeInSeconds ,_modalTitle, _modalDesc, _themeColor) {
        this.timeInSeconds = _timeInSeconds;
        this.modalTitle = _modalTitle;
        this.modalDesc = _modalDesc;
        this.themeColor = _themeColor;
    }

    get modalElement() { 
        return `
                <div class="modal" style = "background-color:${this.themeColor};">
                    <h2 class="modal-title">${this.modalTitle}</h2>
                    <p class="modal-desc">
                        ${this.modalDesc}
                    </p>
                </div>
                `
    }
}



//Initilaze the variables
const body = document.querySelector('body')
const title = document.querySelector('title')

const pomodoroBtn = document.querySelector('.pomodoro')  //Pomodoro selection
const shortBreakBtn = document.querySelector('.short-break') //Short Break selection
const longBreakBtn = document.querySelector('.long-break') //Long Break


const finishSound = new Audio('audio/sound.mp3');

const overlay = document.querySelector('.overlay')
const modal = document.querySelector('.modal') 
const modalTitle = document.querySelector('.modal-title') //Modal title selection
const modalDesc = document.querySelector('.modal-desc')

let timerEl = document.querySelector('.timer') //Timer display 
let timer = undefined //The timer interval made global to use it on "resetTimer()" function
let timeModes = { //The time modes object.
    pomodoro: new TimeMode( 1500 ,'Pomodoro Session is Over!', `It's time to take a break`,  'rgb(117, 18, 0)'),
    shortBreak: new TimeMode( 300 ,'Short Break is Over!', `It's time to start working!`,  'rgb(0, 80, 146)'),
    longBreak: new TimeMode( 900, 'Long Break is Over!', `It's time to start working!`,  'rgb(28, 99, 0)')
}
let currentTimeMode = 'pomodoro'; //Current time mode

/*
Reset timer method which makes the "startTimerBtn" appear, 
stops the timer and sets the timerEl's textContent to currentTimeMode
*/ 
function resetTimer() {
    clearInterval(timer)
    timerOn = false
    shortBreakBtn.style.display = 'inline-block';
    longBreakBtn.style.display = 'inline-block';
    pomodoroBtn.style.display = 'inline-block';
    shortBreakBtn.style.opacity = 1;
    longBreakBtn.style.opacity = 1;
    pomodoroBtn.style.opacity = 1;
    body.style.background = timeModes[currentTimeMode].themeColor
    title.textContent =  `Time left: ${Math.floor(timeModes[currentTimeMode].timeInSeconds / 60)}:${timeModes[currentTimeMode].timeInSeconds % 60 < 10 ? '0' + timeModes[currentTimeMode].timeInSeconds % 10 : timeModes[currentTimeMode].timeInSeconds % 10}` 
    timerEl.textContent =  `${Math.floor(timeModes[currentTimeMode].timeInSeconds / 60)}:${timeModes[currentTimeMode].timeInSeconds % 60 < 10 ? '0' + timeModes[currentTimeMode].timeInSeconds % 10 : timeModes[currentTimeMode].timeInSeconds % 10}` 
}

function startTimer(){
    timerOn = true
    let time = timeModes[currentTimeMode].timeInSeconds - 1
    console.log(`Time initalization: ${time}`)
    setTimeout(() => {
        shortBreakBtn.style.display = 'none';
        longBreakBtn.style.display = 'none';
        pomodoroBtn.style.display = 'none';
    }, 200)
    //Making all the selection buttons dissappear
    shortBreakBtn.style.opacity = 0;
    longBreakBtn.style.opacity = 0;
    pomodoroBtn.style.opacity = 0;
    
    //Start the timer
    timer = setInterval(() => {
        console.log(`Time changed` + time)
        timerEl.textContent = `${Math.floor(time / 60)}:${time % 60 < 10 ?  `0${time % 60}` : time % 60}`
        title.textContent = `${Math.floor(time / 60)}:${time % 60 < 10 ?  `0${time % 60}` : time % 60}`
        if(time + 1 == 0){
            finishSound.play();
            openModal()
            resetTimer()
        }
        time--;
    }, 1000)
}

function openModal(){
    overlay.style.display = "flex"
    overlay.innerHTML = timeModes[currentTimeMode].modalElement
    
    document.querySelector(".modal").addEventListener('click', () => {
        if(currentTimeMode == 'shortBreak' || currentTimeMode == 'longBreak'){
            currentTimeMode = 'pomodoro'
        } else if (currentTimeMode == 'pomodoro'){
            currentTimeMode = 'shortBreak'
        }
        overlay.style.display = "none"; //Close the modal
        resetTimer(); //resetTimer
    });
}

resetTimer();

//Add an event listener to the start button
timerEl.addEventListener('click', () => {
        if(!timerOn){
            startTimer();
        } else{
            resetTimer();
        }
})


//When the pomodoroBtn (selecting the pomodoro mode) is clicked, It is going to set the "currentTimeMode" to 0 (25:00 in timeModes object which is the pomodoro time) and reset the timer
pomodoroBtn.addEventListener('click', () => {
    currentTimeMode = 'pomodoro';
    resetTimer();
})

//When the shortBreakBtn (selecting the short break mode) is clicked,  
shortBreakBtn.addEventListener('click', () => {
    currentTimeMode = 'shortBreak'; //It is going to set the "currentTimeMode" to 1 (5:00 in timeModes object which is the short break mode)
    resetTimer(); //and reset the timer
});

longBreakBtn.addEventListener('click', () => {
    currentTimeMode = 'longBreak'
    resetTimer()
})
