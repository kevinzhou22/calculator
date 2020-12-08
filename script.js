/***  INITIALIZATION ***/

const display = document.querySelector(".display");

let firstArgument = null;
let secondArgument = "0";
let currentOperation = "";

// represents whether the calcualtor display is showing the results of a previosu calculation
let inDisplayMode = false;

const ADD_OPERATOR = "add";
const SUBSTRACT_OPERATOR = "substract";
const DIVIDE_OPERATOR = "divide";
const MULTIPLY_OPERATOR = "multiply";
const MAXIMUM_LENGTH = 10;


/* Adds the focus outline effect if the user starts using tab */
document.body.addEventListener("mousedown", () => document.body.classList.add("using-mouse"));
document.body.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
        document.body.classList.remove("using-mouse");
    }
});

/* Manages the transition when buttons are clicked */
const buttons = document.querySelectorAll(".button-grid button");
buttons.forEach((button) => {
    button.addEventListener("click", (e) => e.currentTarget.classList.add("clicked-button"));
    button.addEventListener("transitionend", (e) => e.currentTarget.classList.remove("clicked-button"));
});


const numberButtons = document.querySelectorAll(".number");
numberButtons.forEach((button) => button.addEventListener("click", enterNumber));
const operatorButtons = document.querySelectorAll(".operator");
operatorButtons.forEach((button) => button.addEventListener("click", enterOperator))
const equalsSignButton = document.querySelector(".equals-sign");
equalsSignButton.addEventListener("click", enterEqualsSign);
const signModifierButton = document.querySelector(".sign-modifier");
signModifierButton.addEventListener("click", enterSignModifier);
const decimalPointButton = document.querySelector(".decimal-point");
decimalPointButton.addEventListener("click", enterDecimalPoint);
const backspaceButton = document.querySelector(".backspace");
backspaceButton.addEventListener("click", enterBackspace);
const allClearButton = document.querySelector(".all-clear");
allClearButton.addEventListener("click", enterAllClear);


/* 
Callback function to update the display when a number button is clicked */
function enterNumber(e) {
    let displayNumber;
    if (secondArgument !== null && secondArgument.replace(".", "").length >= MAXIMUM_LENGTH) return;
    if (secondArgument !== null && secondArgument.slice(secondArgument.indexOf(".")).length > 1) return;
    displayNumber = (secondArgument === null || secondArgument === "0") ? e.currentTarget.value : secondArgument + e.currentTarget.value;
    secondArgument = displayNumber;
    display.textContent = String(+secondArgument);
    inDisplayMode = false;
}

/* Callback function to handle operator buttons being clicked */
function enterOperator(e) {
    if (inDisplayMode) {
        currentOperation = determineOperator(e.currentTarget);
    } else if (firstArgument === null) {
        firstArgument = secondArgument;
        currentOperation = determineOperator(e.currentTarget);
        secondArgument = null;
        display.TextContent = "Error";
        inDisplayMode = true;
    } else if(firstArgument === "Error") {
        secondArgument = null;
        inDisplayMode = true;
    } else {
        firstArgument = operate(currentOperation, +firstArgument, +secondArgument);
        secondArgument = null;
        currentOperation = determineOperator(e.currentTarget);
        display.textContent = firstArgument;
        inDisplayMode = true;
    }
}

/* Callback function to handle equals sign being clicked */
function enterEqualsSign(e) {
    if (inDisplayMode) {
        firstArgument = operate(currentOperation,+firstArgument,+firstArgument);
        display.textContent = firstArgument;
    } else if (firstArgument === null) {
        secondArgument = 0;
        display.textContent = secondArgument;
    } else if (firstArgument === "Error") {
        secondArgument = null;
        display.textContent = "Error";
        inDisplayMode = true;
    } else {
        firstArgument = operate(currentOperation, +firstArgument, +secondArgument);
        secondArgument = null;
        display.textContent = firstArgument;
        inDisplayMode = true;
    }
}

/* callback function to handle signs modifier button being clicked */
function enterSignModifier(e) {
    if(inDisplayMode) {
       return
    }
    if (secondArgument.slice(0, 1) === "-") {
        secondArgument = secondArgument.slice(1);
    } else {
        secondArgument = "-" + secondArgument;
    }

    display.textContent = secondArgument;
}

/* callback function to handle decimal point button being clicked */
function enterDecimalPoint(e) {
    if(inDisplayMode) return;
    if (secondArgument === null) {
        secondArgument = "0."
    }
    if (!secondArgument.includes(".")) {
        secondArgument += ".";
    }

    display.textContent = secondArgument;
}

/* callback function to handle backspace button being clicked */
function enterBackspace(e) {
    if(inDisplayMode) return;
    if (secondArgument === null || secondArgument === "0") return;
    secondArgument = secondArgument.slice(0, secondArgument.length - 1);
    if (secondArgument === "") secondArgument = "0";
    display.textContent = secondArgument;
}


/* callback function to handle all clear button being clicked */
function enterAllClear(e) {
    firstArgument = null;
    secondArgument = "0";
    display.textContent = secondArgument;
    currentOperator = "";
}


/* Takes one argument representing a button node and determines which operator it represents. */
function determineOperator(button) {
    let text = button.value;
    switch (text) {
        case "add":
            return ADD_OPERATOR;
            break;
        case "subtract":
            return SUBSTRACT_OPERATOR;
            break;
        case "multiply":
            return MULTIPLY_OPERATOR;
            break;
        case "divide":
            return DIVIDE_OPERATOR;
            break;
    }
}

/* takes a number and returns a string representing the number, rounded to fit the screen size. */
function shrinkNumber(number) {
    let returnStringNumber;
    const isNegative = number < 0;
    let stringNumber = isNegative ? number.toString().slice(1) : number.toString();

    if (stringNumber.includes("e")) {
        return (isNegative ? "-" : "") + roundNumberWithScientificNotation(stringNumber);
    }

    const containsDecimal = stringNumber.includes(".");
    if (stringNumber.replace(".", "").length <= MAXIMUM_LENGTH) {
        returnStringNumber = stringNumber;
    }

    const integerPortionOfStringNumber = containsDecimal ? stringNumber.slice(0, stringNumber.indexOf(".")) : stringNumber;

    if (integerPortionOfStringNumber.length > MAXIMUM_LENGTH) {
        let powerTen = "e+" + (integerPortionOfStringNumber.length - 1);
        let roundedIntegerPortion = roundNumber(+integerPortionOfStringNumber,
            -(integerPortionOfStringNumber.length - MAXIMUM_LENGTH + powerTen.length)).toString();
        returnStringNumber = +(roundedIntegerPortion.slice(0, 1) + "." + roundedIntegerPortion.slice(1)).toString() + powerTen;
    } else if (stringNumber.replace(".", "").length > MAXIMUM_LENGTH) {
        returnStringNumber = roundNumber(+stringNumber, MAXIMUM_LENGTH - integerPortionOfStringNumber.length).toString();
    }

    /* browser automatically formats numbers that are < 1e-6 into scientific notation. As such, small numbers are handled by the above code
    that deals with numbers written in scientific notation
    */

    return (isNegative ? "-" + returnStringNumber : returnStringNumber);
}


/* rounds the non-exponent part of a number represented as a string in scientific notation */
function roundNumberWithScientificNotation(stringNumber) {
    let numberPortion = stringNumber.slice(0, stringNumber.indexOf("e"));
    let exponentPortion = stringNumber.slice(stringNumber.indexOf("e"));
    return roundNumber(numberPortion, MAXIMUM_LENGTH - 1 - exponentPortion.length) + exponentPortion;
}

/* rounds a number to a given decimal place. Zero / negative decimal places start rounding integer digits (e.g., -1 rounds to the nearest ten) */
function roundNumber(number, decimalPlace) {
    if (decimalPlace > 0) {
        return +((Math.round(number + "e+" + decimalPlace)) + "e-" + decimalPlace);
    } else if (decimalPlace < 0) {
        return +((Math.round(number + "e" + (decimalPlace))) + "e+" + -(decimalPlace));
    } else {
        return number;
    }
}

/* takes an operator and two numbers. Returns the outcome of the operation using the two numbers, shrunk to fit the screen size. */
function operate(operator, a, b) {
    switch (operator) {
        case ADD_OPERATOR:
            return shrinkNumber(add(a, b));
            break;
        case SUBSTRACT_OPERATOR:
            return shrinkNumber(subtract(a, b));
            break;
        case MULTIPLY_OPERATOR:
            return shrinkNumber(multiply(a, b));
            break;
        case DIVIDE_OPERATOR:
            if (b === 0) {
                return "Error";
            }
            return shrinkNumber(divide(a, b));
            break;
    }
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}