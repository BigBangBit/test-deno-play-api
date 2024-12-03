<template>
  <v-card>
    <v-card-title>Cargar RUTs</v-card-title>
    <v-card-text>
      <v-file-input
        accept=".csv"
        label="Archivo CSV"
        v-model="file"
      ></v-file-input>
      <v-btn @click="uploadRuts" :disabled="!file || uploading" :loading="uploading">
        Subir
      </v-btn>
      <v-progress-linear indeterminate v-if="uploading"></v-progress-linear>
      <div v-if="uploadResults">
        <p>Registros nuevos: {{ uploadResults.insertedCount }}</p>
        <p>Registros actualizados: {{ uploadResults.updatedCount }}</p>
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
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      uploading: false,
      uploadResults: null,
      snackbar: false,
      snackbarMessage: ''
    };
  },
  methods: {
    async uploadRuts() {
      this.uploading = true;
      try {
        const formData = new FormData();
        formData.append('file', this.file);

        const response = await axios.post('/api/uploadRuts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.uploadResults = response.data;
        this.snackbarMessage = 'Archivo subido y procesado con éxito.';
         this.snackbar = true;

      } catch (error) {
        console.error("Error uploading RUTs:", error);
         this.snackbarMessage = 'Error al subir el archivo.';
        this.snackbar = true;
      } finally {
        this.uploading = false;
      }
    }
  }
};
</script>
