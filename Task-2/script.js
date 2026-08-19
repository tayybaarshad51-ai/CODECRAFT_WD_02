let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;

const display = document.getElementById("display");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");

const lapsList = document.getElementById("lapsList");


// Format time
function formatTime(time) {

    const hours = Math.floor(time / (1000 * 60 * 60));

    const minutes = Math.floor(
        (time % (1000 * 60 * 60)) / (1000 * 60)
    );

    const seconds = Math.floor(
        (time % (1000 * 60)) / 1000
    );

    const milliseconds = time % 1000;

    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0") +
        "." +
        String(milliseconds).padStart(3, "0")
    );
}


// Update display
function updateDisplay() {

    const currentTime = Date.now();

    elapsedTime = currentTime - startTime;

    display.textContent = formatTime(elapsedTime);
}


// Start Stopwatch
function startStopwatch() {

    if (isRunning) {
        return;
    }

    startTime = Date.now() - elapsedTime;

    timerInterval = setInterval(updateDisplay, 10);

    isRunning = true;

    startBtn.textContent = "Running...";
}


// Pause Stopwatch
function pauseStopwatch() {

    if (!isRunning) {
        return;
    }

    clearInterval(timerInterval);

    isRunning = false;

    startBtn.textContent = "Start";
}


// Reset Stopwatch
function resetStopwatch() {

    clearInterval(timerInterval);

    startTime = 0;

    elapsedTime = 0;

    isRunning = false;

    display.textContent = "00:00:00.000";

    startBtn.textContent = "Start";

    lapsList.innerHTML = "";
}


// Add Lap
function addLap() {

    if (elapsedTime === 0) {
        return;
    }

    const lapItem = document.createElement("li");

    const lapNumber = lapsList.children.length + 1;

    lapItem.textContent =
        "Lap " + lapNumber + " — " + formatTime(elapsedTime);

    lapsList.appendChild(lapItem);
}


// Button Events
startBtn.addEventListener("click", startStopwatch);

pauseBtn.addEventListener("click", pauseStopwatch);

resetBtn.addEventListener("click", resetStopwatch);

lapBtn.addEventListener("click", addLap);