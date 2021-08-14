/*
 *TODO:
 * - [x] Use the whole mode-selector-container to change selection items displays(57-62, 76-78, 81-83)
 */


 class TimeMode {
	//TimeMode class that constructs a new time mode that contains following parameters.
	constructor(_timeInSeconds, _modalTitle, _modalDesc, _themeColor) {
		this.timeInSeconds = _timeInSeconds;
		this.modalTitle = _modalTitle;
		this.modalDesc = _modalDesc;
		this.themeColor = _themeColor;
	}

	//A getter method that returns the template literal of the new modal element.
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


const body = document.querySelector('body') //The body element
const title = document.querySelector('title') //The title element

const pomodoroBtn = document.querySelector('.pomodoro') //The pomodoro button
const shortBreakBtn = document.querySelector('.short-break') //The short break button
const longBreakBtn = document.querySelector('.long-break') //The long break button
const modeSelector = document.querySelector('.mode-selector-container') //The mode selector

const finishSound = new Audio('audio/sound.mp3'); //Sound to be played when session ends

const overlay = document.querySelector('.overlay') //Overlay of the modal

const timerEl = document.querySelector('.timer') //Timer display 
const timeModes = { //The time modes object containing, you guessed it, time modes.
	pomodoro: new TimeMode(1500, 'Pomodoro Session is Over!', `It's time to take a break`, '#e03a3c'),
	shortBreak: new TimeMode(300, 'Short Break is Over!', `It's time to start working!`, '#009ddc'),
	longBreak: new TimeMode(900, 'Long Break is Over!', `It's time to start working!`, '#62bb47')
}
let timer = undefined //Timer interval that is set globally because it is being used in the resetTimer() function
let currentTimeMode = 'pomodoro'; //Current time mode (pomodoro by default)
let timerOn = false; //timerOn boolean that triggers when the timer starts

// resetTimer() function that:
function resetTimer() { 
	clearInterval(timer) //Stops the interval timer
	timerOn = false //Sets the timerOn to false (since the timer is stopped)

	//Making option buttons reappear
	modeSelector.style.display = "flex"
	modeSelector.style.opacity = 1;

	body.style.background = timeModes[currentTimeMode].themeColor //Setting the background color to the current times theme color
	title.textContent = `Time left: ${Math.floor(timeModes[currentTimeMode].timeInSeconds / 60)}:${timeModes[currentTimeMode].timeInSeconds % 60 < 10 ? '0' + timeModes[currentTimeMode].timeInSeconds % 10 : timeModes[currentTimeMode].timeInSeconds % 10}` //Sets the title to the display so the user is able to see time left from tab data
	timerEl.textContent = `${Math.floor(timeModes[currentTimeMode].timeInSeconds / 60)}:${timeModes[currentTimeMode].timeInSeconds % 60 < 10 ? '0' + timeModes[currentTimeMode].timeInSeconds % 10 : timeModes[currentTimeMode].timeInSeconds % 10}` //Sets the timer display to the time so the user can see the time
}

//startTimer() function that:
function startTimer() {
	timerOn = true //Sets the timerOn to true
	let time = timeModes[currentTimeMode].timeInSeconds - 1 //Initializes the time variable to be set to one less of the current time modes timeInSeconds variable since the interval has a first delay
	console.log(`Time initalization: ${time}`)
	//Makes options dissappear after
	setTimeout(() => {
		modeSelector.style.display = 'none'
	}, 200)
	//Making all the selection buttons dissappear
	modeSelector.style.opacity = 0;

	//Start the timer
	timer = setInterval(() => {
		console.log(`Time changed` + time)
		timerEl.textContent = `${Math.floor(time / 60)}:${time % 60 < 10 ?  `0${time % 60}` : time % 60}`
		title.textContent = `${Math.floor(time / 60)}:${time % 60 < 10 ?  `0${time % 60}` : time % 60}`
		if (time + 1 == 0) {
			openModal()
		}
		time--;
	}, 1000)
}

/*
 * "openModal()" function that:
 * - Makes the overlay appear
 * - Sets the innerHTML of that overlay to the "currentTimeModes" "modalElement" getter that returns the template literal of the modal.
 */
function openModal() {
	overlay.style.display = "flex"
	overlay.innerHTML = timeModes[currentTimeMode].modalElement
	finishSound.play();
	document.querySelector(".modal").addEventListener('click', () => {
		if (currentTimeMode == 'shortBreak' || currentTimeMode == 'longBreak') {
			currentTimeMode = 'pomodoro'
		} else if (currentTimeMode == 'pomodoro') {
			currentTimeMode = 'shortBreak'
		}
		overlay.style.display = "none"; //Close the modal
		resetTimer(); //resetTimer
	});
}

resetTimer(); //Reset everything to get a starting point

//Add an event listener to the start button
timerEl.addEventListener('click', () => {
	if (!timerOn) {
		startTimer();
	} else {
		resetTimer();
	}
})


//When the pomodoroBtn (selecting the pomodoro mode) is clicked, It is going to set the "currentTimeMode" to 0 (25:00 in timeModes object which is the pomodoro time) and reset the timer
pomodoroBtn.addEventListener('click', () => {
	currentTimeMode = 'pomodoro';
	resetTimer();
})
//When the shortBreakBtn (selecting the short break mode) is clicked:
shortBreakBtn.addEventListener('click', () => {
	currentTimeMode = 'shortBreak'; //It is going to set the "currentTimeMode" to 1 (5:00 in timeModes object which is the short break mode)
	resetTimer(); //and reset the timer
});
//When the longBreakBtn (selecting the long break mode) is clicked:
longBreakBtn.addEventListener('click', () => {
	currentTimeMode = 'longBreak' //Set the current time mode to "longBreak"
	resetTimer() //Reset the timer to apply the changes
})