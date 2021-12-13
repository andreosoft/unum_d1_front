<template>
  <div>
    <v-file-input
      outlined
      chips
      :color="color"
      :label="model.title"
      :error-messages="error"
      :disabled="disabled"
      type="file"
      @change="onChange"
      :multiple="config.multiple ? config.multiple : false"
    >
      <template v-slot:selection="{ text }">
        <v-chip small label color="primary">
          {{ text }}
        </v-chip>
      </template></v-file-input
    >
    <v-dialog v-model="loading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Пожалуста подождите
          <v-progress-linear
            :value="status"
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: [],
    model: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    config: Object,
    error: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      status: 0,
      color: null,
    };
  },

  methods: {
    async onChange(file) {
      if (file) {
        //this.uploadFile(file);
        let filesArray = [];
        for (let i = 0; i < file.length; i++) {
          let loadedfile = await this.uploadFile(file[i]);
          filesArray.push(loadedfile);
        }
        if (filesArray) {
          this.$emit("input", filesArray);
        }
      } else this.$emit("input", null);
    },
    uploadFile(file) {
      this.loading = true;
      this.status = 0;
      let formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      return this.$axios
        .post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            this.status = parseInt(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          },
        })
        .then((response) => {
          this.loading = false;
          //          let data = response.data.data.file;
          let data = response.data.data;
          //          this.$emit("input", data);
          return data;
        })
        .catch(function (error) {
          this.$root.$emit("show-info", {
            text: "Error: " + error,
          });
          return false;
        });
    },
  },
};
</script>