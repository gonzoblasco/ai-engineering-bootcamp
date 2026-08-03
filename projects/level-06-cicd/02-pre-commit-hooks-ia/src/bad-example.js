/**
 * Ejemplo de código con problemas para probar el hook de pre-commit.
 */

// Uso de var (advertencia)
var myVariable = "Hello";

// Uso de console.log (advertencia)
console.log("This is a console log");

// Uso de eval (problema crítico)
eval('alert("Hello")');

// Password hardcodeado (problema crítico)
const password = "mysecretpassword";

// TODO sin resolver (advertencia)
// TODO: Implementar esta función

function myFunction() {
  // Comparación con null usando == (advertencia)
  if (myVariable == null) {
    return false;
  }

  return true;
}
