window.onload = function() {
    const buttons = document.querySelectorAll('.operand');
    buttons.forEach(button =>
        button.addEventListener('click', operandHandler));
}

function operandHandler(event) {
    const operand = event.target.dataset.operand;
    const calc = new Calculator();
    let result = '';
    if (operand === 'getValue') {
        const polynomStr = document.getElementById('A').value.trim();
        const xStr = document.getElementById('xValue').value.trim();
        const polynomial = calc.getEntity(polynomStr);
        const xValue = calc.getEntity(xStr);
        result = polynomial.getValue(xValue).toString();
        document.getElementById('C').value = result;
        return;
    }
    const A = document.getElementById('A').value.trim();
    const B = document.getElementById('B').value.trim();
    result = calc[operand](calc.getEntity(A), calc.getEntity(B)).toString();
    document.getElementById('C').value = result;
}
