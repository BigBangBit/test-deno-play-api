<template>
  <v-app>
    <v-container>
      <v-card>
        <v-card-title>Configuracion general del BOT</v-card-title>
        <v-card-text>
          <div v-if="!isAuthenticated">
            <v-text-field
              v-model="password"
              label="Contraseña"
              type="password"
              prepend-icon="mdi-lock"
              @input="checkAuthentication"
              centered
            ></v-text-field>
          </div>
        </v-card-text>
      </v-card>
      <div v-if="isAuthenticated">
        <v-container grid-list-lg>
          <v-row>
            <v-col cols="12" centered>
              <h1>Editor de Mensaje Global</h1>
              <MessageUpdater where="Novedades-0" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <h1>Comprador</h1>
              <MessageUpdater where="Novedades-1" />
              <h2>1.1 Certificacion</h2>
              <MessageUpdater where="Novedades-1.1" />
              <h2>1.2 Modalidades de Compra</h2>
              <MessageUpdater where="Novedades-1.2" />
              <h2>1.3 asistencia Técnica</h2>
              <MessageUpdater where="Novedades-1.3" />
              <h2>1.4 Consultas Frecuentes</h2>
              <MessageUpdater where="Novedades-1.4" />
            </v-col>
            <v-col cols="6">
              <h1>Proveedor</h1>
              <MessageUpdater where="Novedades-2" />
              <h2>2.1 Registro</h2>
              <MessageUpdater where="Novedades-2.1" />
              <h2>2.2 Modalidades de Compra</h2>
              <MessageUpdater where="Novedades-2.2" />
              <h2>2.3 asistencia Técnica</h2>
              <MessageUpdater where="Novedades-2.3" />
              <h2>2.4 Consultas Frecuentes</h2>
              <MessageUpdater where="Novedades-2.4" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" centered>
              <h1>Actualizacion de RUTs</h1>
              <UpdateRUTs />
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import MessageUpdater from "./components/MessageUpdater.vue"; // Import the component
import UpdateRUTs from './components/UpdateRUTs.vue';

export default {
  components: {
    MessageUpdater,
    UpdateRUTs,
  },
  data() {
    return {
      password: "",
      valid: true,
      isAuthenticated: false,
      snackbar: false,
      snackbarMessage: "",
    };
  },
  methods: {
    checkAuthentication() {
      // Nueva función
      this.isAuthenticated = this.password === "CUNiX2024";
    },
    async fetchMessage() {
      if (this.password !== "CUNiX2024") {
        this.snackbarMessage = "wrong password";
        this.snackbar = true;
        return;
      }
      try {
        const response = await axios.get("/api/getGlobalMsjs");
        this.message = response.data;
        this.isAuthenticated = true;
      } catch (error) {
        console.error("Error al obtener el mensaje:", error);
        this.snackbarMessage = "Error fetching message";
        this.snackbar = true;
      }
    },

    async updateMessage() {
      try {
        const response = await axios.post("/api/getGlobalMsjs", this.message);
        console.log("Mensaje actualizado:", response.data);
        this.snackbarMessage = "Mensaje Actualizado";
        this.snackbar = true;
      } catch (error) {
        console.error("Error al actualizar el mensaje:", error);
        this.snackbarMessage = "Error updating message";
        this.snackbar = true;
      }
    },
  },
};
</script>
