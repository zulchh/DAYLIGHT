
const API_URL = 'http://localhost:3000/api';

// Obtener el formulario
const loginForm = document.getElementById('loginForm');

// Escuchar cuando el usuario intenta iniciar sesión
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obtener los datos del formulario
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value;

    try {
        // Enviar los datos al backend
        const respuesta = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo,
                password
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            alert(datos.message);
            return;
        }

        // Guardar el token y los datos del usuario
        localStorage.setItem('token', datos.token);
        localStorage.setItem('usuario', JSON.stringify(datos.usuario));

        alert(`¡Bienvenida a DAYLIGHT, ${datos.usuario.nombre}! ☀️`);

        // Más adelante redirigiremos al dashboard
        console.log('Inicio de sesión exitoso:', datos.usuario);

    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo conectar con el servidor.');
    }
});
