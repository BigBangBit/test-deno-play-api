import { Application, Router, Context } from  "https://deno.land/x/oak@v12.4.0/mod.ts" ; //"https://deno.land/x/oak/mod.ts";
import { MongoClient, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
// Importa oak_cors en lugar de cors
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const app = new Application();
const router = new Router();
const port = 3333;

// URL de conexión a MongoDB
const mongoURL = "mongodb://127.0.0.1:27017/";
const dbName = "cunix_api";
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

    if (user) {
      ctx.response.body = {
        rut_found: true,
        RUT_ideal: user.RUT_ideal,
        NOMBRES_USUARIO: user.NOMBRES_USUARIO,
        stopFlow: user.APELLIDOS_USUARIO,
        EMAIL_USUARIO: user.EMAIL_USUARIO,
        TELEFONO: user.TELEFONO,
        ID_TIPO: user.ID_TIPO,
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

////

router.get("/api/getGlobalMsjs/:where", async (ctx) => {
  const whereToSearch = ctx.params.where;

  try {
    console.log("Mensajes globales");

    // Conexión a MongoDB
    const client = new MongoClient();
    console.log("Conectando a MongoDB...");
    await client.connect(mongoURL);
    console.log("Conexión exitosa a MongoDB");

    const db = client.database(dbName);
    console.log(`Conectado a la base de datos: ${dbName}`);

    const collection = db.collection("GlobalMsjs");
    console.log(`Usando colección: "GlobalMsjs"`);

    // Buscar usuario por RUT
    const gMsj = await collection.findOne({"where": whereToSearch });
    console.log("hay msj :", gMsj);

    if (gMsj) {
      ctx.response.body = {
        where: gMsj.where,
        active: gMsj.active,
        msg: gMsj.msg,
        stopFlow: gMsj.stopFlow,
      };
    } else {
        // Si no se encuentra el usuario, intentamos buscar un documento cualquiera
        const anyDocument = await collection.findOne({});
        console.log("Documento de ejemplo:", anyDocument);
  
        ctx.response.body = { 
          message: gMsj ? "no hay msjglobales " : "La colección está vacía",
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
// Endpoint POST para actualizar el mensaje global
router.post("/api/getGlobalMsjs", async (ctx) => {
  try {
    // Obtener el cuerpo de la solicitud como JSON
    const body = await ctx.request.body(); // Obtener el objeto `body`
    const newMsg = await body.value; // Extraer el valor JSON del `body`

    // Verificar en consola el contenido de `newMsg`
    console.log("Contenido de newMsg:", newMsg);

    if (!newMsg) {
      ctx.response.status = 400;
      ctx.response.body = { message: "No se recibió un cuerpo JSON válido en la solicitud" };
      return;
    }

    // Conexión a MongoDB
    const client = new MongoClient();
    await client.connect(mongoURL);
    const db = client.database(dbName);
    const collection = db.collection("GlobalMsjs");

    // Buscar el primer documento en la colección
    const mmm = await collection.findOne({"where":newMsg.where});
    console.log("Documento encontrado:", mmm);

    // Verificamos si el documento existe
    console.log(mmm._id)
    if (!mmm || !mmm._id) {
      ctx.response.status = 404;
      ctx.response.body = { message: "No se encontró ningún mensaje global para actualizar" };
      client.close();
      return;
    }

    // Actualizar el documento en la colección usando el campo _id como filtro
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(mmm._id) }, // Usar ObjectId para garantizar el formato correcto
      { $set: newMsg }
    );
    console.log("Resultado de la actualización:", updateResult);

    // Verificar si la actualización fue exitosa
    if (updateResult.modifiedCount === 1) {
      ctx.response.body = { message: "Mensaje global actualizado correctamente" };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "No se encontró ningún mensaje global para actualizar" };
    }

    client.close();
  } catch (error) {
    console.error("Error al actualizar el mensaje global:", error);
    ctx.response.status = 500;
    ctx.response.body = "Error interno del servidor";
  }
});
///////// frontEnd


// api.ts (server-side code)
//import { Application, Router, Context } from "https://deno.land/x/oak@v12.4.0/mod.ts";
// ... other imports

router.post("/api/uploadRuts", async (ctx) => {
    try {
        const body = ctx.request.body({ type: "form-data" });
        const formData = await body.value.read();
        const fileContent = await Deno.readTextFile(formData.files[0].filename);

        const lines = fileContent.trim().split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
                obj[header.trim()] = values[index].trim();
                return obj;
            }, {});
        });


        const client = new MongoClient();
        await client.connect(mongoURL);
        const db = client.database(dbName);
        const collection = db.collection(collectionName);


        let insertedCount = 0;
        let updatedCount = 0;

         const results = await Promise.all(data.map(async item => {
                const rut = item.RUT_ideal
          const existingUser = await collection.findOne({ RUT_ideal: rut });

            if (existingUser) {
               const updateResult = await collection.updateOne({ RUT_ideal: rut }, { $set: item });
               if (updateResult.modifiedCount === 1) {
                    return "updated"; 
                } else{
                    console.error("Error updating user:", updateResult);
                }
            } else {
              const insertResult = await collection.insertOne(item);
              if (insertResult) {
                return "inserted"
              } else {
                 console.error("Error inserting user:", insertResult);
              }
            }
        }));


        insertedCount = results.filter(result => result === 'inserted').length;
        updatedCount = results.filter(result => result === 'updated').length;



        client.close();
        ctx.response.body = { insertedCount, updatedCount };


    } catch (error) {
        console.error("Error uploading RUTs:", error);
        ctx.response.status = 500;
        ctx.response.body = "Error interno del servidor";
    }

});


// ... other code








// Function to handle all other routes (the catch-all logic)
const allRoutes = async (ctx: Context) => { // Correct type annotation for ctx

  if (!ctx.request.url.pathname.startsWith("/api/")) { //Check if the path DOES NOT start with /api/
//dev    const frontendUrl = "http://localhost:3344" + ctx.request.url.pathname + ctx.request.url.search;
    const frontendUrl = "http://localhost:8000" + ctx.request.url.pathname + ctx.request.url.search;
    try {
        const response = await fetch(frontendUrl);
        const contentType = response.headers.get("content-type") || "text/html; charset=UTF-8";

        let body;
        if (contentType.includes("application/json")) {
          body = await response.json();
        } else if (contentType.includes("text")) {
          body = await response.text();
        } else {
          body = await response.arrayBuffer();
        }

        ctx.response.status = response.status;
        //ctx.response.headers.removeHeader('X-Frame-Options'); // Elimina encabezados conflictivos
        ctx.response.headers.set("Content-Type", contentType);
        ctx.response.body = body;

      } catch (error) {
        console.error("Proxy error:", error);
        ctx.response.status = 500;
        ctx.response.body = "Proxy error";
      }
    }

}


router.all("(.*)", allRoutes); // Correct catch-all route definition in Oak

/////////
app.use(oakCors({
  origin: "*", // <--  Permitir cualquier origen
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Servidor escuchando en el puerto ${port}`);
await app.listen({ port });
