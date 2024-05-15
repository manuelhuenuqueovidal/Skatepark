# Aplicación de Registro y Gestión de Skaters

Este es un servidor Express diseñado para manejar la autenticación, registro, consulta, edición y eliminación de skaters. Proporciona una API para interactuar con una base de datos PostgreSQL.

## Requisitos previos

Asegúrate de tener instalado Node.js y PostgreSQL en tu sistema.

## Configuración

1. Instala las dependencias ejecutando `npm install`.
2. Crea base de datos y tablas desde el archivo "bd.sql"; la columna "estado" ha sido modificada de boolean a VARCHAR para simplificar su uso.
3. Configura la base de datos PostgreSQL. Puedes encontrar el esquema de la base de datos en `configbd.sql`.


## Ejecución

1. Ejecuta el servidor con `node server.js`.
2. El servidor estará disponible en `http://localhost:3000`.

## Endpoints

- `POST /registro`: Registra un nuevo skater en la base de datos.
- `GET /login`: Autentica al skater y genera un token JWT.
- `GET /skaters`: Obtiene la lista de todos los skaters registrados.
- `GET /skater`: Obtiene los datos de un skater específico por su ID.
- `PUT /editardatos/:id`: Edita los datos de un skater existente.
- `DELETE /eliminardatos`: Elimina la cuenta de un skater.
- `PUT /actualizarEstado/:id`: Actualiza el estado adicional de un skater.

## Estructura del Proyecto

- `server.js`: Archivo principal que configura el servidor Express y define las rutas.
- `consultas.js`: Contiene las funciones para interactuar con la base de datos.
- `configbd.js`: Configuración de la conexión a la base de datos.
- `public/`: Directorio que contiene archivos estáticos como HTML, CSS, e imágenes.

## Tecnologías Utilizadas

- Node.js
- Express.js
- PostgreSQL
- JWT para autenticación
- Express File Upload para manejo de archivos