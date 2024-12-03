<template>
  <v-card>
    <v-card-title>Actualizar Mensaje ({{ where }})</v-card-title>
    <v-card-text>
      <v-btn :loading="loading" @click="fetchMessage">
        <v-icon v-if="loading">mdi-loading</v-icon>
        Leer Mensaje
      </v-btn>

      <v-form>
        <v-textarea v-model="message.msg" label="Mensaje" outlined></v-textarea>

        <v-switch v-model="message.active" label="Activo"></v-switch>
        <v-switch v-model="message.stopFlow" label="Detener Flujo"></v-switch>

        <v-btn :disabled="loading" @click="updateMessage" color="success">
          Actualizar Mensaje
        </v-btn>
      </v-form>

      <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
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
</template>

<script>
import axios from "axios";

export default {
  props: {
    where: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      message: {
        active: false,
        msg: "",
        stopFlow: false,
        where: this.where, // Initialize with prop value
      },
      loading: false,
      snackbar: false,
      snackbarMessage: "",
    };
  },
  mounted() {
    this.fetchMessage(); // Call fetchMessage on component mount
  },
  methods: {
    async fetchMessage() {
      this.loading = true;
      try {
        const response = await axios.get(`/api/getGlobalMsjs/${this.where}`);
        this.message = response.data;
      } catch (error) {
        console.error("Error fetching message:", error);
        this.snackbarMessage = "Error fetching message";
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
    async updateMessage() {
      this.loading = true;
      try {
        const response = await axios.post("/api/getGlobalMsjs/", this.message); // Send the entire message object
        console.log("Mensaje actualizado:", response.data);
        this.snackbarMessage = "Mensaje Actualizado";
        this.snackbar = true;
        this.$emit("message-updated", this.message);
      } catch (error) {
        console.error("Error updating message:", error);
        this.snackbarMessage = "Error updating message";
        this.snackbar = true;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
