<template>
  <v-card class="patient__card" :elevation="hover ? 5 : 2">
    <v-responsive :aspect-ratio="4 / 3">
      <v-avatar tile class="patient__card-avatar">
        <img
          :src="
            patient && patient.photo
              ? imageSrc(patient.photo)
              : '/images/patient-placeholder.jpeg'
          "
        />
      </v-avatar>
    </v-responsive>
    <v-card-text>
      {{ patient.name }}
    </v-card-text>
  </v-card>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("doctors");
export default {
  name: "PatientCard",
  props: {
    patient: {
      type: Object,
      default: () => {},
    },
    hover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["imageSrc"]),
  },
};
</script>

<style lang="scss" scoped>
@import "~vuetify/src/styles/settings/_variables";
.patient__card {
  cursor: pointer;
  width: 100%;
  &-avatar {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
