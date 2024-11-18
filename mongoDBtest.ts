import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";  

const client = new MongoClient();  
await client.connect("mongodb://localhost:27017");  

const db = client.database("cunix_api");  //cunix_api
const users = db.collection("users");  

// Crear un usuario  
await users.insertOne({ name: "Juan", age: 30 });  

// Leer usuarios  
const allUsers = await users.find().toArray();  
console.log(allUsers);  

// Actualizar un usuario  
await users.updateOne({ name: "Juan" }, { $set: { age: 31 } });  

// Eliminar un usuario  
await users.deleteOne({ name: "Juan" });