
const API_URL = 'http://localhost:3000/api';

const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obtener los datos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value;

    try {
        // Enviar los datos al backend
        const respuesta = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                correo,
                password
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            alert(datos.message);
            return;
        }

        alert('¡Tu cuenta se creó correctamente! ☀️');

        // Regresar al inicio de sesión
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo conectar con el servidor.');
    }
});
