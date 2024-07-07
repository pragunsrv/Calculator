document.addEventListener('DOMContentLoaded', () => {
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
        history: '',
        memory: 0
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
            calculator.history += ` ${firstOperand} ${operator} ${inputValue} = ${result}\n`;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
        highlightOperator(nextOperator);
    };

    const calculate = (firstOperand, secondOperand, operator) => {
        if (operator === '+') return firstOperand + secondOperand;
        if (operator === '-') return firstOperand - secondOperand;
        if (operator === '*') return firstOperand * secondOperand;
        if (operator === '/') return firstOperand / secondOperand;
        if (operator === 'exp') return Math.exp(secondOperand);
        if (operator === 'log') return Math.log(secondOperand);
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

    const handleMemory = (memoryOperation) => {
        const { displayValue, memory } = calculator;
        const inputValue = parseFloat(displayValue);

        switch (memoryOperation) {
            case 'mc':
                calculator.memory = 0;
                break;
            case 'mr':
                calculator.displayValue = memory.toString();
                break;
            case 'm+':
                calculator.memory += inputValue;
                break;
            case 'm-':
                calculator.memory -= inputValue;
                break;
        }
    };

    const handleScientific = (operation) => {
        const { displayValue } = calculator;
        const inputValue = parseFloat(displayValue);

        let result;
        switch (operation) {
            case 'square':
                result = Math.pow(inputValue, 2);
                break;
            case 'sqrt':
                result = Math.sqrt(inputValue);
                break;
            case 'sin':
                result = Math.sin(inputValue);
                break;
            case 'cos':
                result = Math.cos(inputValue);
                break;
            case 'tan':
                result = Math.tan(inputValue);
                break;
            case 'exp':
                result = Math.exp(inputValue);
                break;
            case 'log':
                result = Math.log(inputValue);
                break;
            default:
                return;
        }

        calculator.displayValue = result.toString();
        calculator.history += ` ${operation}(${inputValue}) = ${result}\n`;
    };

    const highlightOperator = (operator) => {
        const operatorButtons = document.querySelectorAll('.operator');
        operatorButtons.forEach(button => {
            button.style.backgroundColor = (button.value === operator) ? '#fbc02d' : '#f9a825';
        });
    };

    const keys = document.querySelector('.calculator-keys');
    keys.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) return;

        const { value } = target;

        switch (value) {
            case '+':
            case '-':
            case '*':
            case '/':
            case '=':
                handleOperator(value);
                break;
            case '.':
                handleDecimal(value);
                break;
            case 'all-clear':
                resetCalculator();
                break;
            case 'mc':
            case 'mr':
            case 'm+':
            case 'm-':
                handleMemory(value);
                break;
            case 'square':
            case 'sqrt':
            case 'sin':
            case 'cos':
            case 'tan':
            case 'exp':
            case 'log':
                handleScientific(value);
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
