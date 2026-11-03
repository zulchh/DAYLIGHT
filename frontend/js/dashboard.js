
const API_URL = 'http://localhost:3000/api';

const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

if (!token || !usuario) {
    window.location.href = 'index.html';
} else {

    // Mostrar nombre del usuario
    document.getElementById('userName').textContent =
        usuario.nombre.split(' ')[0];

    let tareas = [];
    let filtroActual = 'Todas';

    // =================================
    // CARGAR TAREAS
    // =================================

    async function cargarTareas() {
        try {
            const respuesta = await fetch(`${API_URL}/tasks`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                alert(datos.message);
                return;
            }

            tareas = datos;

            actualizarEstadisticas();
            mostrarTareas();

        } catch (error) {
            console.error(error);
            alert('No se pudieron cargar las tareas.');
        }
    }

    // =================================
    // ACTUALIZAR ESTADÍSTICAS
    // =================================

    function actualizarEstadisticas() {
        document.getElementById('totalTasks').textContent =
            tareas.length;

        document.getElementById('pendingTasks').textContent =
            tareas.filter(t => t.estado === 'Pendiente').length;

        document.getElementById('progressTasks').textContent =
            tareas.filter(t => t.estado === 'En progreso').length;

        document.getElementById('completedTasks').textContent =
            tareas.filter(t => t.estado === 'Completada').length;
    }

    // =================================
    // MOSTRAR TAREAS
    // =================================

    function mostrarTareas() {
        const taskList = document.getElementById('taskList');

        const tareasFiltradas = filtroActual === 'Todas'
            ? tareas
            : tareas.filter(t => t.estado === filtroActual);

        if (tareasFiltradas.length === 0) {
            taskList.innerHTML = `
                <p class="empty-message">
                    No hay tareas en esta categoría. ♡
                </p>
            `;
            return;
        }

        taskList.innerHTML = '';

        tareasFiltradas.forEach(tarea => {
            const tarjeta = document.createElement('article');
            tarjeta.className = 'task-item';

            const titulo = document.createElement('h4');
            titulo.textContent = tarea.titulo;

            const descripcion = document.createElement('p');
            descripcion.textContent =
                tarea.descripcion || 'Sin descripción';

            
const badges = document.createElement('div');
badges.className = 'task-badges';

// Etiqueta de prioridad
const prioridadBadge = document.createElement('span');
prioridadBadge.className = 'task-badge';

prioridadBadge.textContent = `Prioridad ${tarea.prioridad}`;
prioridadBadge.classList.add(
    `priority-${tarea.prioridad.toLowerCase()}`
);

// Etiqueta de estado
const estadoBadge = document.createElement('span');
estadoBadge.className = 'task-badge';

estadoBadge.textContent = tarea.estado;

const clasesEstado = {
    'Pendiente': 'status-pendiente',
    'En progreso': 'status-progreso',
    'Completada': 'status-completada'
};

estadoBadge.classList.add(clasesEstado[tarea.estado]);

badges.append(prioridadBadge, estadoBadge);


            const fecha = document.createElement('p');
            fecha.className = 'task-details';

            fecha.textContent = tarea.fecha_vencimiento
                ? `Vence: ${String(tarea.fecha_vencimiento).slice(0, 10)}`
                : 'Sin fecha de vencimiento';

            
// Selector para cambiar el estado
const selectorEstado = document.createElement('select');
selectorEstado.className = 'task-status';

['Pendiente', 'En progreso', 'Completada'].forEach(estado => {
    const opcion = document.createElement('option');
    opcion.value = estado;
    opcion.textContent = estado;

    if (estado === tarea.estado) {
        opcion.selected = true;
    }

    selectorEstado.appendChild(opcion);
});

// Botón para eliminar
const botonEliminar = document.createElement('button');
botonEliminar.textContent = 'Eliminar tarea';
botonEliminar.className = 'delete-task-button';

// Cambiar estado
selectorEstado.addEventListener('change', async () => {
    await actualizarEstado(tarea, selectorEstado.value);
});

// Eliminar tarea
botonEliminar.addEventListener('click', async () => {
    await eliminarTarea(tarea.id_tarea);
});

tarjeta.append(
    titulo,
    descripcion,
    badges,
    fecha,
    selectorEstado,
    botonEliminar
);

taskList.appendChild(tarjeta);

        });
    }

    // =================================
    // CREAR UNA TAREA
    // =================================

    const taskForm = document.getElementById('taskForm');

    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const titulo = document.getElementById('taskTitle').value.trim();
        const descripcion = document.getElementById('taskDescription').value.trim();
        const fecha_vencimiento = document.getElementById('taskDate').value;
        const prioridad = document.getElementById('taskPriority').value;

        try {
            const respuesta = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    titulo,
                    descripcion,
                    fecha_vencimiento: fecha_vencimiento || null,
                    prioridad
                })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                alert(datos.message || 'No se pudo crear la tarea.');
                return;
            }

            alert('¡Tu tarea se agregó correctamente! ☀️');

            taskForm.reset();

            await cargarTareas();

        } catch (error) {
            console.error(error);
            alert('No se pudo conectar con el servidor.');
        }
    });


    
// =================================
// ACTUALIZAR ESTADO DE UNA TAREA
// =================================

async function actualizarEstado(tarea, nuevoEstado) {
    try {
        const respuesta = await fetch(
            `${API_URL}/tasks/${tarea.id_tarea}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    titulo: tarea.titulo,
                    descripcion: tarea.descripcion,
                    fecha_vencimiento: tarea.fecha_vencimiento
                        ? String(tarea.fecha_vencimiento).slice(0, 10)
                        : null,
                    prioridad: tarea.prioridad,
                    estado: nuevoEstado
                })
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            alert(datos.message || 'No se pudo actualizar la tarea.');
            return;
        }

        await cargarTareas();

    } catch (error) {
        console.error(error);
        alert('Error al actualizar la tarea.');
    }
}

// =================================
// ELIMINAR UNA TAREA
// =================================

async function eliminarTarea(id) {

    const confirmar = confirm(
        '¿Estás segura de que deseas eliminar esta tarea?'
    );

    if (!confirmar) return;

    try {
        const respuesta = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            alert(datos.message || 'No se pudo eliminar la tarea.');
            return;
        }

        alert('¡Tarea eliminada correctamente!');

        await cargarTareas();

    } catch (error) {
        console.error(error);
        alert('Error al eliminar la tarea.');
    }
}

    // =================================
    // FILTRAR TAREAS
    // =================================

    document.querySelectorAll('.filter-button').forEach(boton => {
        boton.addEventListener('click', () => {

            document.querySelectorAll('.filter-button')
                .forEach(b => b.classList.remove('active'));

            boton.classList.add('active');

            filtroActual = boton.dataset.filter;

            mostrarTareas();
        });
    });

    // =================================
    // CERRAR SESIÓN
    // =================================

    document.getElementById('logoutButton')
        .addEventListener('click', () => {

            localStorage.removeItem('token');
            localStorage.removeItem('usuario');

            window.location.href = 'index.html';
        });

    // Cargar tareas al entrar
    cargarTareas();
}
