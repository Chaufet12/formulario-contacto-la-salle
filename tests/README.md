# Actividad 8 - Pruebas del Formulario La Salle

Rama: `actividad8-pruebas`. Archivo: `tests/actividad8.test.js`.

## Ejecución
Desde la raíz del repositorio (Node.js 22):
```bash
node --test tests/actividad8.test.js
```
Las pruebas usan `node:test` y dobles de prueba para Express, SQLite y DOM; no requieren iniciar el servidor ni una base de datos real.

## Casos
- U01: obligatoriedad de nombre, HTTP 400.
- U02: formato inválido de correo, HTTP 400.
- I01: inserción válida simulada, HTTP 201.
- I02: error simulado de persistencia, HTTP 500.
- F01: envío válido simulado desde la lógica del navegador.
- F02: bloqueo de envío por nombre vacío.

## Alcance y límites
Se ejecutan los scripts reales del repositorio dentro de contextos aislados, pero **las dependencias, la base de datos y el DOM se simulan**. Por tanto, I01/I02 son pruebas de integración del controlador con un doble de base de datos, y F01/F02 son pruebas de lógica de interfaz con DOM simulado, **no** pruebas end-to-end en navegador real. Para cobertura de integración real se recomienda agregar pruebas con SQLite temporal y Playwright.

Los resultados obtenidos y las capturas se deben adjuntar tras ejecutar el comando. No se deben declarar pruebas aprobadas antes de su ejecución.
