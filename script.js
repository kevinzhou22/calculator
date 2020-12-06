/* Adds the focus outline effect if the user starts using tab */

document.body.addEventListener("mousedown", () => document.body.classList.add("using-mouse"));
document.body.addEventListener("keydown", (e) => {
    if(e.key === "Tab") {
        document.body.classList.remove("using-mouse");
    }
});

/* Manages the transition when buttons are clicked */
const buttons = document.querySelectorAll(".button-grid button");
buttons.forEach((button) => {
    button.addEventListener("click",(e) => e.currentTarget.classList.add("clicked-button"));
    button.addEventListener("transitionend", (e) => e.currentTarget.classList.remove("clicked-button"));
});






/* takes an operator and two numbers. Returns the outcome of the operation using the two numbers */
function operate(operator, a , b) {
    switch (operator) {
        case "+":
            return add(a,b);
            break;
        case "-":
            return subtract(a, b);
            break;
        case "*":
            return multiply(a,b);
            break;
        case "/":
            return divide(a,b);
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

function divide(a,b) {
    return a / b;
}