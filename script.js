let colors = [];
const SEQ_LENGTH = 10;
const ROWS = 5;
let ROW_COUNTER = 0;
let HINT_MODE = 0;

initialize();

//CHANGES BOX SIZE IF WINDOW SIZE CHANGES//
window.addEventListener('resize', calculateColorSize);

function initialize() {
    createGameContainers();
    //CREATE APPROPRIATE NUMBER OF COLUMNS BASED ON COLUMNS PER ROW INPUT
    document.querySelector('.game-container').style.gridTemplateColumns = `repeat(${SEQ_LENGTH + 2}, 1fr)`
    toggleNavButtons();
    startGame();
}

function createGameContainers() {
    let gameBox = document.querySelector('.game');

    //CREATE CORRECT ANSWERS BOX
    let correctBox = document.createElement('div');
    correctBox.classList.add('correct-display');
    gameBox.appendChild(correctBox);

    //CREATE GAME CONTAINER FOR COLORS
    let gameContainer = document.createElement('div');
    gameContainer.classList.add('game-container');
    gameBox.appendChild(gameContainer);

    //CREATE ERROR DISPLAY BOX
    let errorBox = document.createElement('div');
    errorBox.classList.add('error-display');
    gameBox.appendChild(errorBox);

}
function toggleNavButtons() {
    let restartBtn = document.querySelector('#restart');
    restartBtn.addEventListener('click', restartGame);
    
    let hintBtn = document.querySelector('#hint');
    hintBtn.addEventListener('click', hintButton);
    
}

function restartGame() {
    //CLEAR GAME BOX
    let gameBox = document.querySelector('.game');
    while (gameBox.children.length > 0) {
    gameBox.lastChild.remove();
    }

    //CLEAR color ARRAY
    colors = [];

    // //RESTART ROW COUNTER
    ROW_COUNTER = 0;
    HINT_MODE = 0;

    initialize();
}

function hintButton() {

    if (HINT_MODE === 0) {
        
        HINT_MODE = 1;
        displayErrors();
        return;
    }

    HINT_MODE = 0;
    hideErrors();    
}

function startGame() {
    let firstColor = new createKeyColors();
    let lastColor = new createKeyColors();
    calculateColorSize();
    createSequence(firstColor, lastColor, SEQ_LENGTH);
}

function calculateColorSize() {
    //COLOR SIZE BASED ON SCREEN HEIGHT DIVIDED BY NUMBER OF ROWS (WIDTH USUALLY ALWAYS LARGER THAN HEIGHT)
    let gameWidth = document.querySelector('.game').clientWidth;
    let gameHeight = document.querySelector('.game').clientHeight;
    let colorWidth = Math.floor((gameHeight*0.7)/ROWS);
    let boxesPerRow = SEQ_LENGTH+2;
    if (colorWidth*(boxesPerRow) > (gameWidth*0.9)) {
        colorWidth = Math.floor((gameWidth*0.85)/(boxesPerRow));
    }
    
    document.documentElement.style.setProperty('--color-box-width', `${colorWidth}px`);     
}

function createKeyColors() {
    let hue = randomNumber(359, 0);
    let saturation = randomNumber(100, 5);
    let lightness = randomNumber(96, 10);
    let hslValue = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    this.hue = hue;
    this.saturation = saturation;
    this.lightness = lightness;
    this.hslValue = hslValue;
}

function inbetweenColors(hue, saturation, lightness, index) {
    this.hue = hue;
    this.saturation = saturation;
    this.lightness = lightness;
    this.hslValue = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    this.index =  index;
}

function randomNumber(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function getIncrement(firstValue, secondValue, SEQ_LENGTH){
    //If hue difference is larger than 200,  this ensures increment goes loops around from red = 0 to red = 360 instead of going through entire color spectrum
    if (Math.abs(firstValue - secondValue) > 200){  
        if (firstValue - secondValue > 0){
           let posDifference = (360 - firstValue) + secondValue; //there are 360 total values for hue in HSL
           return Math.abs(posDifference / (SEQ_LENGTH+1))
        }

        let negDifference = firstValue + (360 - secondValue);
        return -Math.abs(negDifference / (SEQ_LENGTH+1));
        
    }

    return (secondValue - firstValue) / (SEQ_LENGTH+1);
}


function createSequence(startColor, endColor, SEQ_LENGTH) {
    let startHue = startColor.hue;
    let startSaturation = startColor.saturation;
    let startLightness = startColor.lightness;
    
    let hueIncrement = getIncrement(startColor.hue, endColor.hue, SEQ_LENGTH);
    let saturationIncrement = getIncrement(startColor.saturation, endColor.saturation, SEQ_LENGTH);
    let lightnessIncrement = getIncrement(startColor.lightness, endColor.lightness, SEQ_LENGTH);

    ROW_COUNTER++; // first row initialized

    // adding first color to array
    colors.push(startColor);
    colors[colors.length-1].index = colors.length-1;
    let currArrLength = colors.length-1; //used to make sure the indexes of colors line up for subsequent batches of colors

    for (let i = colors.length; i <= SEQ_LENGTH + currArrLength; i++) { //i starts at one for indexing the colors first and last colors in sequence not included
        startHue = startHue + hueIncrement;

        if ( Math.abs(startColor.hue - endColor.hue) < 200){ //////
            if (hueIncrement < 0 && startHue <= endColor.hue) { //stops hsl from surpassing the last color's hsl values
                startHue = endColor.hue;
            } else if (hueIncrement >= 0 && startHue >= endColor.hue) {
                startHue = endColor.hue;               
            }
        }///////
        startSaturation = startSaturation + saturationIncrement;
            if (saturationIncrement < 0 && startSaturation <= endColor.saturation) {
                startSaturation = endColor.saturation;
            } else if (saturationIncrement >= 0 && startSaturation >= endColor.saturation) {
                startSaturation = endColor.saturation;               
            }
        startLightness = startLightness + lightnessIncrement;
            if (lightnessIncrement < 0 && startLightness <= endColor.lightness) {
                startLightness = endColor.lightness;
            } else if (lightnessIncrement >= 0 && startLightness >= endColor.lightness) {
                startLightness = endColor.lightness;               
            }
        colors.push(new inbetweenColors(startHue, startSaturation, startLightness, i))
    }
    //adding last color to array
    colors.push(endColor);
    colors[colors.length-1].index = colors.length-1;

    
    if (ROW_COUNTER < ROWS){
        return startGame();
    }

    createColorContainers();

}

function createColorContainers() {
    let gameContainer = document.querySelector('.game-container');
    let numOfContainers = colors.length;

    for (let i=0; i < numOfContainers; i++) {
        let colorContainer = document.createElement('div');
        colorContainer.classList.add('color-container');
        colorContainer.dataset.boxNumber = i;
        
        let colorBox = document.createElement('div');
        colorBox.classList.add('color');
        colorContainer.appendChild(colorBox);

        gameContainer.appendChild(colorContainer);
    }

    displayColors();
    createHintBoxes();
    

}


function setGuideColors(shuffledArray, originalArray, ROW_COUNTER) {
    //CHOOSING RANDOM COLOR TO BE SET AS GUIDE COLOR//
    let guideColorAmount = ROWS; //one guide color per row;
    let rowLength = Math.floor((originalArray.length-1)/ROWS); //index must be between these values
    let minIndex = 0;
    let maxIndex = rowLength;
    let guideColors = [];
    let guideColorsIndex = [];
    
    for (let i = 0; i < guideColorAmount; i++) {
        let randIndex = randomNumber(maxIndex, minIndex);
        guideColors.push(originalArray[randIndex]);
        guideColorsIndex.push(randIndex);

        minIndex += rowLength + 1;
        maxIndex += rowLength;
    }
    
    for (let i = 0; i < guideColors.length; i++) {
        let fixedLocation = shuffledArray.findIndex(color => color.index === guideColorsIndex[i]);
        let temp = shuffledArray[guideColorsIndex[i]]; //storing old Value and fixed colors position

        shuffledArray[guideColorsIndex[i]] = guideColors[i]; // setting position of of fixed color
        shuffledArray[guideColorsIndex[i]].fixed = true;
        shuffledArray[fixedLocation] = temp; //replacing old fixed color position with temp value
    }

    return shuffledArray;
    
  
}

/////// TURN THE CHOSEN RANDOM FIXED COLORS INDEXES TO NOT MOVE??

function displayColors() {
    let shuffledArr = arrayShuffle(colors);
    let guideColors = setGuideColors(shuffledArr, colors, ROW_COUNTER);
    
    
    
    

    let containerElements = document.querySelectorAll('.color');

    for (let i = 0; i < containerElements.length; i++) {
        containerElements[i].style.background = shuffledArr[i].hslValue;
        containerElements[i].dataset.colorNumber = shuffledArr[i].index;
        if (shuffledArr[i].fixed){ // removing pointer events from guide colors
            containerElements[i].classList.add('fixed-color');
        }
    }

    //containerElements[randIndex].classList.add('fixed-color');

    containerElements.forEach( color => color.addEventListener('click', colorSwap));
}

function arrayShuffle(array) {
    //Durstenfeld Shuffle
    let arrayCopy = array.slice(0);
    
    for (let i = arrayCopy.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arrayCopy[i];
        arrayCopy[i] = arrayCopy[j];
        arrayCopy[j] = temp;
    }
    return arrayCopy;    
}


function colorSwap(color) {
    let currSelection = document.querySelector('[data-selected = "true"]');
    if (currSelection == null){
        color.target.dataset.selected = 'true';
        return;
    }

    let selectedParent = currSelection.parentNode;
    let currParent = color.target.parentNode;

    selectedParent.appendChild(color.target);
    currParent.appendChild(currSelection);

    currSelection.dataset.selected = "false";
    displayErrors();
    checkWin();
}

function createHintBoxes() {
    let correctDisplayBox = document.querySelector('.correct-display');
    let errorDisplayBox = document.querySelector('.error-display');
    
    for (let i=0; i < ROWS; i++) {
        //CONTAINS SYMBOL SHOWING CORRECT OR NOT
        let correctBox = document.createElement('div');
        correctBox.classList.add('correct-box');
        correctBox.dataset.rangeFirst = hintBoxRange(i, 'first');
        correctBox.dataset.rangeLast = hintBoxRange(i, 'last');

        //SYMBOL 'DOT' SHOWING IF ROW IS CORRECT
        let correctSymbol = document.createElement('div');
        correctSymbol.classList.add('correct-symbol');
        correctBox.appendChild(correctSymbol);

        correctDisplayBox.appendChild(correctBox);
        
        //ERROR BOXES TO SHOW NUMBER OF ERRORS IN EACH ROW
        let errorBox = document.createElement('div');
        errorBox.classList.add('error-box');
        errorBox.dataset.rangeFirst = hintBoxRange(i, 'first');
        errorBox.dataset.rangeLast = hintBoxRange(i, 'last');

        //RED SYMBOLS SHOWING MISTAKES - ONE FOR EACH COLOR IN ROW
        for (let j = 0; j < SEQ_LENGTH+2; j++) {
            let errorSymbol = document.createElement('div');
            errorBox.appendChild(errorSymbol);
        }
        errorDisplayBox.appendChild(errorBox);
    }
}

//ASSIGNS RANGE OF BOXES THE HINTS IN EACH ROW PERTAIN TO
function hintBoxRange(currBox, position) {
    let colorPerRow = SEQ_LENGTH+2;
    let firstIndex = currBox * colorPerRow
    let lastIndex = firstIndex + colorPerRow - 1
    return position === 'first' ? firstIndex : lastIndex;
}

//DISPLAYS HOW MANY ERRORS (WRONG PLACEMENTS) ARE ON EACH ROW ==> ON RIGHT SIDE OF ROW
function displayErrors() {
    let errorBoxes = document.querySelectorAll('.error-box');
    hideErrors(); //resets error
    errorBoxes.forEach( box => {
        let firstColor = parseInt(box.dataset.rangeFirst);
        let lastColor = parseInt(box.dataset.rangeLast); 
        let numberOfErrors = errorChecker(firstColor, lastColor);

       //DISPLAYS HINTS IF HINT MODE IS ON// 
       if (HINT_MODE === 1){
            for (let i = 0; i < numberOfErrors; i++){
                box.children[i].classList.add('error-symbol');
            }
        }
    })
}

function errorChecker(firstIndex, lastIndex) {
    let allBoxes = document.querySelectorAll('.color');
    let errorCount = 0;
    
    for (let i = firstIndex; i <= lastIndex; i++) {
    
        let colorNumber = parseInt(allBoxes[i].dataset.colorNumber);
        if (colorNumber !== i) {
            errorCount++
        }
    }

    if (errorCount === 0) {
        solvedRow(allBoxes, firstIndex, lastIndex);
    }
    
    return errorCount;
}

function hideErrors() {
    let errors = document.querySelectorAll('.error-symbol');
    errors.forEach(error => error.classList.remove('error-symbol'));
} 

//SHOWS ROW IS COMPLETED ON LEFT SIDE OF ROW WITH SYMBOL. DISABLES POINTER EVENTS FOR ROW;
function solvedRow(allColors, firstIndex, lastIndex) {
    
    //MARKS CORRECT WITH WHITE SYMBOL ON LEFT
    let correctBox = document.querySelector(`[data-range-first = "${firstIndex}"]`);
    console.log(correctBox);
    correctBox.children[0].classList.add('correct-row');
    correctBox.children[0].style.background = 'white';

    //REMOVE POINTER EVENTS FOR ROW
    for (let i = firstIndex; i <= lastIndex; i++) {
        allColors[i].style.pointerEvents = 'none';
    }

}


function checkWin() {
    let correctRows = document.querySelectorAll('.correct-row');

    if (correctRows.length === ROWS){
        hideElementsOnWin();
        winAnimation();
    }
    
    console.log("you win");
}

function hideElementsOnWin() {
    //HIDE GUIDE COLOR MARKING//
    document.querySelectorAll('.fixed-color').forEach(color => color.classList.remove('fixed-color'));
    //HIDE CORRECT ROW SYMBOLS
    document.querySelectorAll('.correct-box').forEach(box => box.lastChild.remove());
    
}

function winAnimation() {
    document.querySelectorAll('.color-container').forEach(function(color){
        color.style.margin = '0px 0px';
    })
}



//SOLVED ROW NEEDS TO FIXED WHITE CORRECT NOT SHOWING UP WITH CLASS ONLY WITH DIRECT INLINE ASSIGNMENT





