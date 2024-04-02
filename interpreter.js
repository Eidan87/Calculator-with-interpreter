// interpreter.js

const STOP = 'STOP';
const ADD = 'ADD';
const SUBTRACT = 'SUBTRACT';
const MULTIPLY = 'MULTIPLY';
const DIVIDE = 'DIVIDE';
const POWER = 'POWER';
const SQRT = 'SQRT';
const SIN = 'SIN';
const COS = 'COS';
const TAN = 'TAN';
const ARCSIN = 'ARCSIN';
const ARCCOS = 'ARCCOS';
const ARCTAN = 'ARCTAN';
const LOG = 'LOG';
const LN = 'LN';
const SINH = 'SINH';
const COSH = 'COSH';
const TANH = 'TANH';
const PUSH = 'PUSH';

class Interpreter {
    constructor() {
        this.state = {
            programCounter: 0,
            stack: [],
            code: []
        }
    }

    runCode(code) {
        console.log("Ejecutando código:", code);
        this.state.code = code;
        this.state.programCounter = 0; // Reiniciamos el contador de programa
        while (this.state.programCounter < this.state.code.length) {
            try {
                const opCode = this.state.code[this.state.programCounter];
                console.log("OpCode actual:", opCode);
                switch (opCode) {
                    case STOP:
                        throw new Error('Execution complete');
                    case PUSH:
                        this.state.programCounter++;
                        const value = this.state.code[this.state.programCounter];
                        this.state.stack.push(value);
                        break;
                    case ADD:
                    case SUBTRACT:
                    case MULTIPLY:
                    case DIVIDE:
                    case POWER:
                        this.performOperation(opCode);
                        break;
                    case SQRT:
                    case SIN:
                    case COS:
                    case TAN:
                    case ARCSIN:
                    case ARCCOS:
                    case ARCTAN:
                    case LOG:
                    case LN:
                    case SINH:
                    case COSH:
                    case TANH:
                        this.performUnaryOperation(opCode);
                        break;
                    default:
                        break;
                }
                this.state.programCounter++;
            } catch (error) {
                console.error("Error:", error.message);
                console.log("Estado de la pila:", this.state.stack);
                return this.state.stack.length > 0 ? this.state.stack[this.state.stack.length - 1] : NaN;
            }
        }
        // Return the final result after executing the code
        return this.state.stack.length > 0 ? this.state.stack.pop() : NaN;
    }

    performOperation(operator) {
        let result;
        let a, b; // Declarar a y b una sola vez aquí
        switch (operator) {
            case MULTIPLY:
            case DIVIDE:
                if (this.state.stack.length < 2) {
                    throw new Error('Insufficient operands for operation');
                }
                b = this.state.stack.pop(); // Utilizar las variables a y b según sea necesario
                a = this.state.stack.pop();
                switch (operator) {
                    case MULTIPLY:
                        result = a * b;
                        break;
                    case DIVIDE:
                        result = a / b;
                        break;
                    default:
                        throw new Error('Invalid operator');
                }
                this.state.stack.push(result);
                break;
            case ADD:
            case SUBTRACT:
            case POWER:
                if (this.state.stack.length < 2) {
                    throw new Error('Insufficient operands for operation');
                }
                b = this.state.stack.pop(); // Utilizar las variables a y b según sea necesario
                a = this.state.stack.pop();
                switch (operator) {
                    case ADD:
                        result = a + b;
                        break;
                    case SUBTRACT:
                        result = a - b;
                        break;
                    case POWER:
                        result = Math.pow(a, b);
                        break;
                    default:
                        throw new Error('Invalid operator');
                }
                this.state.stack.push(result);
                break;
            default:
                throw new Error('Invalid operator');
        }
    }
    

    performUnaryOperation(operator) {
        const a = this.state.stack.pop();
        let result;
        switch (operator) {
            case SQRT:
                result = Math.sqrt(a);
                break;
            case SIN:
                result = Math.sin(a);
                break;
            case COS:
                result = Math.cos(a);
                break;
            case TAN:
                result = Math.tan(a);
                break;
            case ARCSIN:
                result = Math.asin(a);
                break;
            case ARCCOS:
                result = Math.acos(a);
                break;
            case ARCTAN:
                result = Math.atan(a);
                break;
            case LOG:
                result = Math.log10(a);
                break;
            case LN:
                result = Math.log(a);
                break;
            case SINH:
                result = Math.sinh(a);
                break;
            case COSH:
                result = Math.cosh(a);
                break;
            case TANH:
                result = Math.tanh(a);
                break;
            default:
                throw new Error('Invalid operator');
        }
        this.state.stack.push(result);
    }

    parseOperator(operator) {
        switch (operator) {
            case '+':
                return ADD;
            case '-':
                return SUBTRACT;
            case '*':
                return MULTIPLY;
            case '/':
                return DIVIDE;
            case '^':
                return POWER;
            case 'sqrt':
                return SQRT;
            case 'sin':
                return SIN;
            case 'cos':
                return COS;
            case 'tan':
                return TAN;
            case 'arcsin':
                return ARCSIN;
            case 'arccos':
                return ARCCOS;
            case 'arctan':
                return ARCTAN;
            case 'log':
                return LOG;
            case 'ln':
                return LN;
            case 'sinh':
                return SINH;
            case 'cosh':
                return COSH;
            case 'tanh':
                return TANH;
            default:
                throw new Error('Invalid operator');
        }
    }
}

function parseInput(input, interpreter) {
    const tokens = input.match(/\d+(\.\d+)?|\+|\-|\*|\/|\^|\(|\)|sqrt|sin|cos|tan|arcsin|arccos|arctan|log|ln|sinh|cosh|tanh|\s+/g);
    const program = [];
    const operatorStack = [];

    for (let token of tokens) {
        if (!isNaN(parseFloat(token))) {
            program.push(PUSH); // Push PUSH antes del número
            program.push(parseFloat(token)); // Push el número al programa
        } else if (token === '(' || token === '[' || token === '{') {
            operatorStack.push(token);
        } else if (token === ')' || token === ']' || token === '}') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(' && operatorStack[operatorStack.length - 1] !== '[' && operatorStack[operatorStack.length - 1] !== '{') {
                program.push(interpreter.parseOperator(operatorStack.pop()));
            }
            if (operatorStack.length === 0 || (token === ')' && operatorStack[operatorStack.length - 1] !== '(') || (token === ']' && operatorStack[operatorStack.length - 1] !== '[') || (token === '}' && operatorStack[operatorStack.length - 1] !== '{')) {
                throw new Error('Mismatched parentheses or brackets');
            }
            operatorStack.pop(); // Pop '(' o '[' o '{'
        } else {
            const currentOperator = interpreter.parseOperator(token);
            while (operatorStack.length > 0 && precedence(operatorStack[operatorStack.length - 1]) >= precedence(token)) {
                program.push(interpreter.parseOperator(operatorStack.pop()));
            }
            operatorStack.push(token);
        }
    }

    // Después de procesar todos los tokens, agregar operadores restantes al programa
    while (operatorStack.length > 0) {
        if (operatorStack[operatorStack.length - 1] === '(' || operatorStack[operatorStack.length - 1] === '[' || operatorStack[operatorStack.length - 1] === '{') {
            throw new Error('Mismatched parentheses or brackets');
        }
        program.push(interpreter.parseOperator(operatorStack.pop()));
    }

    return program; // No es necesario agregar STOP al final del programa
}


// Define operator precedence
function precedence(operator) {
    switch (operator) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
            return 2;
        case '^':
            return 3;
        case 'sqrt':
        case 'sin':
        case 'cos':
        case 'tan':
        case 'arcsin':
        case 'arccos':
        case 'arctan':
        case 'log':
        case 'ln':
        case 'sinh':
        case 'cosh':
        case 'tanh':
            return 4;
        default:
            return 0; // Parentheses or brackets
    }
}
