const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3333;

// URL de conexión a MongoDB
const mongoURL = "mongodb://localhost:27017/";
const dbName = "cunix-api";
const collectionName = "user-data";

app.get('/api/user/:rut', async (req, res) => {
  const rutToSearch = req.params.rut;

  try {
    console.log("Buscando RUT:", rutToSearch);

    // Conexión a MongoDB
    const client = new MongoClient(mongoURL);
    console.log("Conectando a MongoDB...");
    await client.connect();
    console.log("Conexión exitosa a MongoDB");

    const db = client.db(dbName);
    console.log(`Conectado a la base de datos: ${dbName}`);

    const collection = db.collection(collectionName);
    console.log(`Usando colección: ${collectionName}`);

    // Buscar usuario por RUT
    const user = await collection.findOne({ "RUT_ideal": rutToSearch });
    console.log("Usuario encontrado:", user);

    if (user) {
      res.json({
        rut_found: true,
        RUT_ideal: user.RUT_ideal,
        NOMBRES_USUARIO: user.NOMBRES_USUARIO,
        APELLIDOS_USUARIO: user.APELLIDOS_USUARIO,
        EMAIL_USUARIO: user.EMAIL_USUARIO,
        TELEFONO: user.TELEFONO,
        ID_TIPO: user.ID_TIPO,
      });
    } else {
      // Si no se encuentra el usuario, intentamos buscar un documento cualquiera
      const anyDocument = await collection.findOne({});
      console.log("Documento de ejemplo:", anyDocument);

      res.json({
        rut_found: false,
        message: user ? "Usuario no encontrado" : "La colección está vacía",
        exampleDocument: anyDocument // Incluimos un documento de ejemplo si existe
      });
    }

    client.close();
    console.log("Conexión con MongoDB cerrada");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
