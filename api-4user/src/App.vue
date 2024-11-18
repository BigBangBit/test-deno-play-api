<template>
  <v-app>
    <v-container>
      <v-card>
        <v-card-title>Editor de Mensaje Global</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            prepend-icon="mdi-lock"
            @input="checkAuthentication" 
          ></v-text-field>

          <div v-if="isAuthenticated">
            <v-btn @click="fetchMessage">
              Leer Mensaje
            </v-btn>

            <v-form v-model="valid">
              <v-textarea
                v-model="message.msg"
                label="Mensaje"
                outlined
              ></v-textarea>

              <v-switch v-model="message.active" label="Activo"></v-switch>
              <v-switch v-model="message.stopFlow" label="Detener Flujo"></v-switch>

              <v-btn
                @click="updateMessage"
                :disabled="!valid"
                color="success"
              >
                Actualizar Mensaje
              </v-btn>
            </v-form>
          </div> 

          <v-snackbar v-model="snackbar">
            {{ snackbarMessage }}
            <template v-slot:action="{ attrs }">
              <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                Close
              </v-btn>
            </template>
          </v-snackbar>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      password: "",
      message: {
        active: false,
        msg: "",
        stopFlow: false,
      },
      valid: true,
      isAuthenticated: false,
      snackbar: false,
      snackbarMessage: ''
    };
  },
  methods: {
    checkAuthentication() {  // Nueva función
      this.isAuthenticated = this.password === "CUNiX2024";
    },
    async fetchMessage() {
        if (this.password!=="CUNiX2024") {this.snackbarMessage="wrong password"; this.snackbar=true;return;}
      try {
        const response = await axios.get("http://localhost:3333/api/getGlobalMsjs");
        this.message = response.data;
        this.isAuthenticated=true;
      } catch (error) {
        console.error("Error al obtener el mensaje:", error);
         this.snackbarMessage="Error fetching message"; this.snackbar=true;
      }
    },

    async updateMessage() {
      try {
        const response = await axios.post(
          "http://localhost:3333/api/getGlobalMsjs",
          this.message
        );
        console.log("Mensaje actualizado:", response.data);
        this.snackbarMessage = "Mensaje Actualizado"; this.snackbar=true;
      } catch (error) {
        console.error("Error al actualizar el mensaje:", error);
         this.snackbarMessage="Error updating message"; this.snackbar=true;
      }
    },
  },
};
</script>
