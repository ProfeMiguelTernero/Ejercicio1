async function mostrarEmpleados() {
    try {
        const response = await fetch('/empleados');
        const empleados = await response.json();
        mostrarResultados(empleados);
    } catch (error) {
        console.error('Error al obtener empleados:', error);
    }
}

function mostrarResultados(empleados) {
    const empleadosList = document.getElementById('empleados-list');
    empleadosList.innerHTML = '';

    empleados.forEach(empleado => {
        const li = document.createElement('li');
        const enlace = document.createElement('a');
        enlace.textContent = `${empleado.codEmp}: ${empleado.nomEmp}`;
        // Agrega el enlace con el href que incluye el codEmp del empleado
        enlace.href = `oneEmple.html?clave=${empleado.codEmp}`;
        li.appendChild(enlace);
        empleadosList.appendChild(li);
    });
}

async function mostrarEmpleado(clave) {
    try {
        // Hacer una solicitud al backend para obtener los detalles del empleado
        const response = await fetch(`/empleados/${clave}`); // Ajusta la ruta según tu backend
        const empleado = await response.json();
        // Mostrar los detalles del empleado en el div empleado-info
        const empleadoInfo = document.getElementById('empleado-info');
        empleadoInfo.innerHTML = `
            <p>Código de Empleado: ${empleado.codEmp}</p>
            <p>Nombre: ${empleado.nomEmp}</p>
            <p>Sexo: ${empleado.sexEmp}</p>
            <p>Fecha de Nacimiento: ${empleado.fecNac}</p>
            <p>Fecha de Incorporación: ${empleado.fecIncorporacion}</p>
            <p>Salario: ${empleado.salEmp}</p>
            <p>Comisión: ${empleado.comisionE}</p>
            <p>Cargo: ${empleado.cargoE}</p>
            <p>Número de Departamento: ${empleado.nroDpto}</p>
        `;
    } catch (error) {
        console.error('Error al obtener el empleado:', error);
    }
}

async function insertarEmpleado() {
    const codEmp = prompt('Código del empleado:');
    const nomEmp = prompt('Nombre del empleado:');
    // Agregar lógica para obtener los demás campos del empleado

    try {
        const response = await fetch('/insertar-empleado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                codEmp,
                nomEmp,
                // Agregar los demás campos del empleado
            }),
        });

        const data = await response.json();
        alert(data.message); // Mensaje de éxito o error
    } catch (error) {
        console.error('Error al insertar empleado:', error);
    }
}
