/***  INITIALIZATION ***/

const display = document.querySelector(".display");

let firstArgument = null;
let secondArgument = null;
let currentOperation = "";

const ADD_OPERATOR = "add";
const SUBSTRACT_OPERATOR = "substract";
const DIVIDE_OPERATOR = "divide";
const MULTIPLY_OPERATOR = "multiply";



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
const operatorButtons =document.querySelectorAll(".operator");
operatorButtons.forEach((button)=> button.addEventListener("click",enterOperator))
const equalsSignButton = document.querySelector(".equals-sign");
equalsSignButton.addEventListener("click",enterEqualsSign);
/* 
Callback function to update the display when a number button is clicked */
function enterNumber(e) {
    let displayNumber; 
    if (secondArgument === null) {
        displayNumber = e.currentTarget.value;
    } else {
        displayNumber = String(secondArgument) + e.currentTarget.value
    }

    secondArgument = +displayNumber;
    display.textContent = secondArgument;
}

/* Callback function to handle operator buttons being clicked */
function enterOperator(e) {
    if (firstArgument === null) {
        firstArgument = secondArgument;
        currentOperation = determineOperator(e.currentTarget);
        secondArgument = null;
    } else {
        firstArgument = operate(currentOperation,firstArgument,secondArgument);
        secondArgument = null;
        currentOperation = determineOperator(e.currentTarget);
        display.textContent = firstArgument;
    }
}

/* Callback function to handle equals sign being clicked */
function enterEqualsSign(e) {
    firstArgument = operate(currentOperation,firstArgument,secondArgument);
    secondArgument = null;
    currentOperation = "";
    display.textContent = firstArgument;
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



/* takes an operator and two numbers. Returns the outcome of the operation using the two numbers */
function operate(operator, a, b) {
    switch (operator) {
        case ADD_OPERATOR:
            return add(a, b);
            break;
        case SUBSTRACT_OPERATOR:
            return subtract(a, b);
            break;
        case MULTIPLY_OPERATOR:
            return multiply(a, b);
            break;
        case DIVIDE_OPERATOR:
            return divide(a, b);
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