//Importaciónde base de datos. 
const pool = require("./configbd.js");

//Función para insertar skater.
const registrarSkater = async (req) => {
    try {
        const { email, nombre, password, anos_experiencia, especialidad } = req.body;
        const foto = req.files && req.files.foto; //Obtiene el archivo de la solicitud.
        
        if (!foto) {
            throw new Error('No se ha encontrado ningún archivo');
        }
        //Verificación de archivos recibidos desde el formulario.
        console.log('Archivos recibidos:', req.files);
        console.log('Datos del formulario:', req.body);
        console.log('Archivo recibido:', foto);

        const filePath = 'public/assets/img/' + foto.name; //Ruta donde se guarda la imagen.
        await foto.mv(filePath); //Método que mueve el archivo al servidor.

        //Se insertan los datos en la tabla skaters.
        const query = `
            INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado)
            VALUES ($1, $2, $3, $4, $5, $6, 'En revision')
            RETURNING *;`;
        
        const result = await pool.query(query, [email, nombre, password, anos_experiencia, especialidad, filePath]);
        //Registro exitoso del skater boy.
        console.log("Nuevo skater registrado:", result.rows[0]);
        return `Skater registrado exitosamente. <button onclick="window.location.href='http://localhost:3000/'">Ir a la página principal</button> <img style="width: 100%; color: white; background-color: black" src="/assets/img/skateboard-wallpaper-preview.jpg" alt="Imagen de skate">`;
    } catch (error) {
        console.error("Error al registrar skater:", error);
        throw new Error(`Error al registrar skater, vuelve a intentarlo. <button onclick="window.location.href='http://localhost:3000/Registro.html'">Inténtalo nuevamente</button> <img style="width: 100%; color: white; background-color: black" src="/assets/img/accident.jpg" alt="Imagen de skate">`);
    }
};

//Función para autenticar skater.
async function autenticarSkater(email, password) {
    try {
        const query = `
            SELECT * FROM skaters
            WHERE email = $1 AND password = $2;
        `;
        const result = await pool.query(query, [email, password]);
        if (result.rows.length === 0) {
            return { authenticated: false, error: "authentication_failed" };
        }
        //Devolver los datos del skater junto con el resultado de la autenticación
        return { skater: result.rows[0], authenticated: true };
    } catch (error) {
        throw new Error('Error al autenticar Skater: ' + error.message);
    }
};

//Función para obtener skater por ID.
async function obtenerSkaterPorId(userId) {
    try {        
        const query = `
            SELECT * FROM skaters
            WHERE id = $1;
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        console.error("Error al obtener skater por ID:", error);
    }
};

//Consulta de todos los skaters.
const consultar = async () => {
    try {
        const result = await pool.query("SELECT * FROM skaters");
        return result.rows;
    } catch (error) {
        console.error("Error al consultar skaters:", error);
    }

};

//Función para editar datos de skater.
const editarSkater = async (id, req) => {
    const { nombre, password, anos_experiencia, especialidad } = req.body;  
    const query = `UPDATE skaters SET nombre = $2, password = $3, anos_experiencia = $4, especialidad = $5 WHERE id = $1 RETURNING *`;
    try {
      const result = await pool.query(query, [
        id,
        nombre,
        password,
        anos_experiencia,
        especialidad,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error al editar skater:", error);
      throw new Error("Error al editar skater.");
    }
};


//Función para eliminar la cuenta del skater por ID.
const eliminar = async (id) => {
    try {
      const result = await pool.query(`DELETE FROM skaters WHERE id = $1`, [id]);
      return result.rows;
    } catch (error) {
      console.error("Error al eliminar skater:", error);
      throw new Error("Error al eliminar skater.");
    }
};

//Función para editar estado del skater.
const editarEstado = async (id, estado) => {
    try {
        const query = `UPDATE skaters SET estado = $2 WHERE id = $1 RETURNING *`;
        const result = await pool.query(query, [id, estado]);
        return result.rows[0];
    } catch (error) {
        console.error("Error al editar el estado:", error);
        throw new Error("Error al editar el estado.");
    }
};


//Exportar la función registrarSkater
module.exports = { registrarSkater, autenticarSkater, consultar, obtenerSkaterPorId, editarSkater, eliminar, editarEstado };
