const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateElement = document.getElementById('date-picker');
const countdownElement = document.getElementById('countdown');
const countdownElementTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElement = document.querySelectorAll('span');
const completeEl = document.getElementById('complete');
const completeInfoElement = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');


let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input with Today's Date
const today = new Date().toISOString().split('T')[0];
dateElement.setAttribute('min', today);

// Populate Countdown
function updateDom() {
    countdownActive = setInterval(() => {

        const now = new Date().getTime();
        const distance = countdownValue - now;
        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);
        inputContainer.hidden = true;

        // If countdown has ended , show complete 
        if (distance < 0) {
            countdownElement.hidden = true;
            clearInterval(countdownActive);
            completeInfoElement.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            // Populate Countdown
            countdownElementTitle.textContent = `${countdownTitle}`;
            timeElement[0].textContent = `${days}`;
            timeElement[1].textContent = `${hours}`;
            timeElement[2].textContent = `${minutes}`;
            timeElement[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownElement.hidden = false;
        }
    }, second);
}

// Take value from Form
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));

    // Check for Valid Date
    if (countdownDate === '') {
        alert("Please select a date for the countdown");
    } else {
        // Get number version of current Date
        countdownValue = new Date(countdownDate).getTime();
        const IST = 5.5 * hour;
        countdownValue = countdownValue - IST;
        updateDom();
    }
}

// Reset all values
function reset() {
    // Hide countdown, Show Input
    countdownElement.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // Stop countdown
    clearInterval(countdownActive);
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown(){
    // Get countdown from local storage if available
    if(localStorage.getItem('countdown')){

        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate=savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDom();
        const IST = 5.5 * hour;
        countdownValue = countdownValue - IST;
    }
}

// Event Listener
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On load check local storage

restorePreviousCountdown();