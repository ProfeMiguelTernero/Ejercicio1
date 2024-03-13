//Importamos los modulos instalados
const express = require('express');
const mysql = require('mysql2/promise');

//establecemos la conexion con la BD
const connection = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'toor',
    database: 'empresa',
});

//Definimos una funcion asincrona para ejecutar la consulta de la base de datos
const items = async () => {
    const [query] = await connection.execute('SELECT * FROM empresa.empleado inner join empresa.departamento on codDpto  = nroDpto');
    return query;

};

const empleados = async () => {
    const [query] = await connection.execute('SELECT * FROM empresa.empleado');
    return query;

};

const departamentos = async () => {
    const [query] = await connection.execute('SELECT * FROM empresa.departamento');
    return query;

};

//configuracion de la aplicacion express:
const app = express();
app.use(express.json());
app.use(express.static('frontend')); // Directorio donde se encuentran los archivos estáticos


//definimos un puerto
const PORT = 80;
//ponemos en marcha el servidor
app.listen(80, ()=> {console.log(`Funcionando en el puerto ${PORT}`)});

//definimos la ruta para manejar las solicitudes get a la raiz /
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});

app.get('/empleados', async (req, res) => {
    const query = await empleados();
    return res.status(201).json(query);
});

app.get('/departamentos', async (req, res) => {
    const query = await departamentos();
    return res.status(201).json(query);
});



app.get('/empleados/:clave', async (req, res) => {
    const { clave } = req.params;
    console.log(req.params);
    console.log(clave);
    const [empleado] = await connection.execute('SELECT * FROM empresa.empleado WHERE codEmp = ?', [clave]);
    if (empleado.length === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    return res.status(200).json(empleado[0]);
});

app.post('/empleados', async (req, res) => {
    const { codEmp,nomEmp, sexEmp,fecNac,fecIncorporacion, salEmp,comisionE,cargoE,nroDpto } = req.body;
    if ( !codEmp || !nomEmp || !sexEmp || !fecIncorporacion || !fecNac || !salEmp || !comisionE || !cargoE || !nroDpto  ) {
        return res.status(400).json({ message: 'Se requieren codEmp, nomEmp, sexEmp, fecIncorporacion,fecNac,salEmp,comisionE,cargoE y nroDpto' });
    }
    try {
        await connection.execute('INSERT INTO empresa.empleado (codEmp, nomEmp, sexEmp, fecNac, fecIncorporacion, salEmp, comisionE, cargoE, nroDpto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [codEmp,nomEmp, sexEmp,fecNac,fecIncorporacion,salEmp,comisionE,cargoE,nroDpto]);
        return res.status(201).json({ message: 'Empleado insertado correctamente' });
    } catch (error) {
        console.error('Error al insertar empleado:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});