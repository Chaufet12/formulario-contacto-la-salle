const form = document.getElementById('contactForm');
const submitButton = document.getElementById('submitButton');
const formMessage = document.getElementById('formMessage');

const nombre = document.getElementById('nombre');
const correo = document.getElementById('correo');
const asunto = document.getElementById('asunto');
const mensaje = document.getElementById('mensaje');

function limpiarErrores() {
    document.getElementById('errorNombre').textContent = '';
    document.getElementById('errorCorreo').textContent = '';
    document.getElementById('errorAsunto').textContent = '';
    document.getElementById('errorMensaje').textContent = '';

    formMessage.textContent = '';
    formMessage.className = 'form-message';
}

function validarFormulario() {
    let valido = true;

    limpiarErrores();

    if (nombre.value.trim() === '') {
        document.getElementById('errorNombre').textContent =
            'El nombre es obligatorio.';
        valido = false;
    }

    if (correo.value.trim() === '') {
        document.getElementById('errorCorreo').textContent =
            'El correo electrónico es obligatorio.';
        valido = false;
    } else if (!correo.validity.valid) {
        document.getElementById('errorCorreo').textContent =
            'Ingresa un correo electrónico válido.';
        valido = false;
    }

    if (asunto.value.trim() === '') {
        document.getElementById('errorAsunto').textContent =
            'El asunto es obligatorio.';
        valido = false;
    }

    if (mensaje.value.trim() === '') {
        document.getElementById('errorMensaje').textContent =
            'El mensaje es obligatorio.';
        valido = false;
    }

    return valido;
}

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    const datos = {
        nombre: nombre.value,
        correo: correo.value,
        asunto: asunto.value,
        mensaje: mensaje.value
    };

    try {

        const response = await fetch('/api/contactos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(resultado.message);
        }

        formMessage.textContent = resultado.message;
        formMessage.className = 'form-message success';

        form.reset();

    } catch (error) {

        formMessage.textContent =
            error.message || 'Ocurrió un error al enviar el formulario.';

        formMessage.className = 'form-message error-message';

    } finally {

        submitButton.disabled = false;
        submitButton.textContent = 'Enviar mensaje';

    }
});