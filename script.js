document.addEventListener('DOMContentLoaded', () => {
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
        history: ''
    };

    const updateDisplay = () => {
        const display = document.querySelector('.calculator-screen');
        const history = document.querySelector('.history');
        display.value = calculator.displayValue;
        history.textContent = calculator.history;
    };

    const handleDigit = (digit) => {
        const { displayValue, waitingForSecondOperand } = calculator;

        if (waitingForSecondOperand) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    };

    const handleOperator = (nextOperator) => {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);

        if (operator && calculator.waitingForSecondOperand) {
            calculator.operator = nextOperator;
            return;
        }

        if (firstOperand == null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
            calculator.history += ` ${operator} ${inputValue}`;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
        calculator.history += ` ${nextOperator}`;
    };

    const calculate = (firstOperand, secondOperand, operator) => {
        if (operator === '+') return firstOperand + secondOperand;
        if (operator === '-') return firstOperand - secondOperand;
        if (operator === '*') return firstOperand * secondOperand;
        if (operator === '/') return firstOperand / secondOperand;
        return secondOperand;
    };

    const handleDecimal = (dot) => {
        if (calculator.waitingForSecondOperand) return;

        if (!calculator.displayValue.includes(dot)) {
            calculator.displayValue += dot;
        }
    };

    const resetCalculator = () => {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
        calculator.history = '';
    };

    const keys = document.querySelector('.calculator-keys');
    keys.addEventListener('click', (event) => {
        const { target } = event;
        const { value } = target;
        if (!target.matches('button')) return;

        switch (value) {
            case '+':
            case '-':
            case '*':
            case '/':
                handleOperator(value);
                break;
            case '=':
                handleOperator(value);
                break;
            case '.':
                handleDecimal(value);
                break;
            case 'all-clear':
                resetCalculator();
                break;
            default:
                if (Number.isInteger(parseFloat(value))) {
                    handleDigit(value);
                }
        }
        updateDisplay();
    });

    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        if (key >= 0 && key <= 9) {
            handleDigit(key);
        } else if (key === '.') {
            handleDecimal(key);
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            handleOperator(key);
        } else if (key === 'Enter' || key === '=') {
            handleOperator('=');
        } else if (key === 'Backspace') {
            calculator.displayValue = calculator.displayValue.slice(0, -1) || '0';
        } else if (key === 'Escape') {
            resetCalculator();
        }
        updateDisplay();
    });

    updateDisplay();
});
