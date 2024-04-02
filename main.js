// Función para agregar caracteres al display
function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

// Función para limpiar el display
function clearDisplay() {
    document.getElementById('display').value = '';
}

// Función para calcular el resultado
function calculate() {
    var expression = document.getElementById('display').value;
    var interpreter = new Interpreter();
    var program = parseInput(expression, interpreter);
    var result = interpreter.runCode(program);
    document.getElementById('display').value = result;
}

// Event listener para permitir la entrada desde el teclado numérico
document.addEventListener('keydown', function(event) {
    var key = event.key;
    var validKeys = /^[0-9.+*/()-]$/; // Expresión regular para aceptar solo caracteres válidos

    // Si la tecla presionada es válida, agregarla al display
    if (validKeys.test(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter') { // Si se presiona Enter, calcular el resultado
        calculate();
    }
});
