import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();
const port = 4444;

// Definir el endpoint POST en /api/post/
router.post("/api/post/", async (ctx) => {
  try {
    // Obtener el cuerpo de la solicitud en formato JSON
    const body = ctx.request.body();
    const data = await body.value; // Extraemos el JSON del cuerpo

    // Verificar el contenido recibido
    console.log("Datos recibidos en el POST:", data);

    // Responder con el JSON recibido
    ctx.response.status = 200;
    ctx.response.body = {
      message: "Datos recibidos correctamente",
      data: data,
    };
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error interno del servidor" };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Servidor escuchando en el puerto ${port}`);
await app.listen({ port });
