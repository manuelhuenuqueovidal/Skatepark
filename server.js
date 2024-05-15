//Servidor Express. 
const express = require('express');
const app = express();
const pool = require("./configbd.js");
const path = require('path');
const jwt = require('jsonwebtoken');
const expressFileUpload = require("express-fileupload");
const { registrarSkater, autenticarSkater, consultar, obtenerSkaterPorId, editarSkater, eliminar, editarEstado } = require('./consultas.js');
//Clave secreta.
const secretKey = 'Mi Llave Ultra Secreta';
//Middleware para manejar la carga de archivos.
app.use(expressFileUpload());
//Activar el servidor.
app.listen(3000 , console.log("Servidor arriba. ✌️"))

app.use(express.json());
//Configurar Express para servir archivos estáticos desde el directorio 'public'
app.use(express.static('public'));
//Ruta por defecto.
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
//Ruta fromulario de registro.
app.get("/Registro.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/Registro.html"));
});
//Ruta fromulario de Login.
app.get("/Login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/Login.html"));
});
//Ruta fromulario de Datos.
app.get("/Datos.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/Datos.html"));
});
//Ruta fromulario Admin.
app.get("/Admin.html", (req, res) => {
    res.sendFile(path.join(__dirname, "/Admin.html"));
});

//Ruta para manejar el registro de skaters.
app.post("/registro", async (req, res) => {
    try {
        //Verificar si las contraseñas coinciden
        const { password, password2 } = req.body;
        if (password !== password2) {
            return res.status(400).send(`Las contraseñas no coinciden. <button onclick="window.location.href='http://localhost:3000/Registro.html'">Inténtalo nuevamente</button> <img style="width: 100%; color: white; background-color: black" src="/assets/img/accident.jpg" alt="Imagen de skate">`);
        }
        //Llamar a la función registrarSkater desde consultas.js
        const mensaje = await registrarSkater(req);
        //Devolver el mensaje como respuesta
        res.send(mensaje);
    } catch (error) {
        console.error("Error al registrar skater:", error.message);
        res.status(500).send(error.message);
    }
});


//Ruta login y generación de token.
app.get("/login", async (req, res) => {
    try {
        const { email, password } = req.query;
        const { skater, authenticated } = await autenticarSkater(email, password);

        if (authenticated) {
            //Aquí generas el token y rediriges al usuario a la ruta /datos con el token como parámetro de consulta.
            const token = jwt.sign({ userId: skater.id }, secretKey, { expiresIn: '2m' });
            res.redirect(`/datos?token=${token}`);
        } else {
            //Si la autenticación falla, envía un mensaje de error al cliente con el código de estado 401.
             res.status(401).send(`Has cometido un error al ingresar tus credenciales. <button onclick="window.location.href='http://localhost:3000/Login.html'">Ingresar nuevamente</button> <img style="width: 100%; color: white; background-color: black" src="/assets/img/accident.jpg" alt="Imagen de skate">`);
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        res.status(401).json({ error: 'Unauthorized', message: error.message });
    }
});

//Ruta de consultas de todos los skaters.
app.get("/skaters", async (req, res) => {
    try {
        const registros = await consultar();
        res.json(registros);
    } catch (error) {
        res.status(500).send("Algo salió mal 🙀")
    }
});

//Ruta Datos.
app.get('/datos', (req, res) => {
    // Asegurar que token sea válido
    jwt.verify(req.query.token, secretKey, (err, decoded) => {
        if (err) {
            // Control de errores.
            // res.status(401).send({
            //     error: '401 Unauthorized',
            //     message: err.message,
            // } );
        } else {
            //Adjuntar el ID de usuario al objeto req
            req.userId = decoded.userId;
            //Si todo va bien, mostrar página.
            res.sendFile(path.join(__dirname, "/Datos.html"));
        }
    });
});

//Ruta para obtener los datos del skater por el id.
app.get("/skater", async (req, res) => {
    try {
        //Obtener el token del encabezado de autorización
        const token = req.headers.authorization.split(' ')[1];        
        //Decodificar el token para obtener el ID de usuario
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userId;
        //Consultar los datos del skater usando el ID de usuario
        const skaterData = await obtenerSkaterPorId(userId);
        if (skaterData.length === 0) {
            throw new Error('Skater no encontrado');
        }
        const skater = skaterData[0];
         res.json(skater);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Ruta para editar datos.
app.put("/editardatos/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const resultado = await editarSkater(id, req);
      res.json(resultado); 
    } catch (error) {
      console.error("Error al editar skater:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
});

//Ruta para borrar datos.
app.delete("/eliminardatos", async (req, res) => {
    try {
        const { id } = req.query; 
        const respuesta = await eliminar(id);
        res.json(respuesta);
    } catch (error) {
        console.error("Error al borrar la cuenta del skater:", error);
        res.status(500).json({ error: "Error interno del servidor al eliminar la cuenta del skater" });
    }
});

//Ruta para actualizar el estado adicional del skater.
app.put("/actualizarEstado/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { estadoAdicional } = req.body;
       await editarEstado(id, estadoAdicional);
        res.status(200).send("Estado adicional del skater actualizado correctamente.");
        console.log("Estado adicional del skater actualizado correctamente.");
    } catch (error) {
        console.error("Error al actualizar el estado adicional del skater:", error.message);
        res.status(500).send("Error al actualizar el estado adicional del skater.");
    }
});