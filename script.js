/**
 * Professional Calculator Application
 * Author: Taskeen Qaiser
 * Description: A modern, feature-rich calculator with enhanced functionality
 * Version: 2.0
 */

class ProfessionalCalculator {
    constructor() {
        this.display = document.getElementById('inputBox');
        this.history = document.getElementById('history');
        this.currentInput = '';
        this.previousInput = '';
        this.operator = null;
        this.waitingForNewNumber = false;
        this.calculationHistory = [];
        
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.addKeyboardSupport();
        this.updateDisplay();
    }

    attachEventListeners() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target);
            });
            
            // Add visual feedback
            button.addEventListener('mousedown', () => {
                button.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = '';
            });
        });
    }

    addKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            e.preventDefault();
            
            const key = e.key;
            
            // Numbers and decimal point
            if (/[0-9.]/.test(key)) {
                this.inputNumber(key);
            }
            // Operators
            else if (['+', '-', '*', '/', '%'].includes(key)) {
                let operator = key;
                if (key === '*') operator = '×';
                if (key === '/') operator = '÷';
                if (key === '-') operator = '−';
                this.inputOperator(operator);
            }
            // Enter or equals
            else if (key === 'Enter' || key === '=') {
                this.calculate();
            }
            // Backspace
            else if (key === 'Backspace') {
                this.delete();
            }
            // Escape or 'c' for clear
            else if (key === 'Escape' || key.toLowerCase() === 'c') {
                this.clear();
            }
        });
    }

    handleButtonClick(button) {
        const action = button.dataset.action;
        const value = button.dataset.value;

        if (action === 'clear') {
            this.clear();
        } else if (action === 'delete') {
            this.delete();
        } else if (action === 'calculate') {
            this.calculate();
        } else if (button.classList.contains('btn-number')) {
            this.inputNumber(value);
        } else if (button.classList.contains('btn-operator')) {
            this.inputOperator(value);
        }
    }

    inputNumber(num) {
        if (this.waitingForNewNumber) {
            this.currentInput = num;
            this.waitingForNewNumber = false;
        } else {
            if (num === '.' && this.currentInput.includes('.')) {
                return; // Prevent multiple decimal points
            }
            
            if (this.currentInput === '0' && num !== '.') {
                this.currentInput = num;
            } else {
                this.currentInput += num;
            }
        }
        this.updateDisplay();
    }

    inputOperator(op) {
        if (this.currentInput === '' && this.previousInput === '') {
            return;
        }

        if (this.previousInput !== '' && this.currentInput !== '' && this.operator) {
            this.calculate();
        }

        this.operator = op;
        this.previousInput = this.currentInput || this.previousInput;
        this.currentInput = '';
        this.waitingForNewNumber = false;
        this.updateHistoryDisplay();
    }

    calculate() {
        if (this.previousInput === '' || this.currentInput === '' || this.operator === null) {
            return;
        }

        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        let result;

        // Convert display operators to calculation operators
        let calcOperator = this.operator;
        if (this.operator === '×') calcOperator = '*';
        if (this.operator === '÷') calcOperator = '/';
        if (this.operator === '−') calcOperator = '-';

        try {
            switch (calcOperator) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        throw new Error('Division by zero');
                    }
                    result = prev / current;
                    break;
                case '%':
                    result = prev % current;
                    break;
                default:
                    return;
            }

            // Handle floating point precision issues
            result = Math.round((result + Number.EPSILON) * 1000000000) / 1000000000;

            // Save to history
            const calculation = `${this.previousInput} ${this.operator} ${this.currentInput} = ${result}`;
            this.calculationHistory.push(calculation);

            this.currentInput = result.toString();
            this.previousInput = '';
            this.operator = null;
            this.waitingForNewNumber = true;
            this.updateDisplay();
            this.updateHistoryDisplay();

        } catch (error) {
            this.currentInput = 'Error';
            this.updateDisplay();
            setTimeout(() => {
                this.clear();
            }, 2000);
        }
    }

    clear() {
        this.currentInput = '';
        this.previousInput = '';
        this.operator = null;
        this.waitingForNewNumber = false;
        this.updateDisplay();
        this.updateHistoryDisplay();
    }

    delete() {
        if (this.currentInput.length > 0) {
            this.currentInput = this.currentInput.slice(0, -1);
            this.updateDisplay();
        }
    }

    updateDisplay() {
        const displayValue = this.currentInput || '0';
        this.display.value = this.formatNumber(displayValue);
    }

    updateHistoryDisplay() {
        if (this.previousInput && this.operator) {
            this.history.textContent = `${this.formatNumber(this.previousInput)} ${this.operator}`;
        } else {
            this.history.textContent = '';
        }
    }

    formatNumber(num) {
        if (num === 'Error') return num;
        
        const number = parseFloat(num);
        if (isNaN(number)) return num;

        // Format large numbers with commas
        if (Math.abs(number) >= 1000) {
            return number.toLocaleString('en-US', { 
                maximumFractionDigits: 8,
                useGrouping: true 
            });
        }

        return num;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalCalculator();
    
    // Add some visual enhancements
    const calculator = document.querySelector('.calculator');
    
    // Add subtle animations on load
    setTimeout(() => {
        calculator.style.opacity = '1';
        calculator.style.transform = 'translateY(0)';
    }, 100);
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple effect styles dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);