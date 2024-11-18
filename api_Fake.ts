import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

const app = new Application();
const router = new Router();
const port = 3333;

// URL de conexión a MongoDB
const mongoURL = "mongodb://localhost:27017/";
const dbName = "cunix-api";
const collectionName = "user-data";

router.get("/api/user/:rut", async (ctx) => {
  const rutToSearch = ctx.params.rut;

  try {
    console.log("Buscando RUT:", rutToSearch);

    // Conexión a MongoDB
    const client = new MongoClient();
    console.log("Conectando a MongoDB...");
    await client.connect(mongoURL);
    console.log("Conexión exitosa a MongoDB");

    const db = client.database(dbName);
    console.log(`Conectado a la base de datos: ${dbName}`);

    const collection = db.collection(collectionName);
    console.log(`Usando colección: ${collectionName}`);

    // Buscar usuario por RUT
    const user = await collection.findOne({ "RUT_ideal": rutToSearch });
    console.log("Usuario encontrado:", user);

    if (true || user) {
      ctx.response.body = {
        rut_found: true,
        RUT_ideal: "10010248K",//user.RUT_ideal,
        NOMBRES_USUARIO: "KARINA", // user.NOMBRES_USUARIO,
        APELLIDOS_USUARIO: "ACEVEDO AUAD", //user.APELLIDOS_USUARIO,
        EMAIL_USUARIO: "kacevedo@desarrollosocial.gob.cl", //user.EMAIL_USUARIO,
        TELEFONO: "56-9-952186074", //user.TELEFONO,
        ID_TIPO: 2 , //user.ID_TIPO,
      };
    } else {
        // Si no se encuentra el usuario, intentamos buscar un documento cualquiera
        const anyDocument = await collection.findOne({});
        console.log("Documento de ejemplo:", anyDocument);
  
        ctx.response.body = { 
          rut_found: false,
          message: user ? "Usuario no encontrado" : "La colección está vacía",
          exampleDocument: anyDocument // Incluimos un documento de ejemplo si existe
        };
      }
    client.close();
    console.log("Conexión con MongoDB cerrada");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    ctx.response.status = 500;
    ctx.response.body = "Error interno del servidor";
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Servidor escuchando en el puerto ${port}`);
await app.listen({ port });
