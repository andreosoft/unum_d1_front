<template>
  <v-card class="pa-3 mb-1 d-flex flex-column" :elevation="0" rounded="0">
    <div class="d-flex mb-4 align-items-center">
      <v-avatar
        rounded="circle"
        size="36"
        class="mr-3"
        color="rgb(80, 49, 101)"
      >
        <v-img
          :src="
            selectedPatient && selectedPatient.photo
              ? imageSrc(selectedPatient.photo)
              : '/images/patient-placeholder.jpeg'
          "
        ></v-img>
      </v-avatar>
      <v-card-text class="pa-0 d-flex">
        {{
          (selectedPatient && selectedPatient.name) ||
            getCommonTranslation("Name")
        }}
        <br />
      </v-card-text>
    </div>

    <div class="d-flex patient-actions__list">
      <v-responsive
        style="overflow: unset; position: relative;"
        v-for="(icon, index) in patientActions"
        :key="icon"
        :aspect-ratio="2 / 1"
        :class="{ 'mr-1': index !== patientActions.length - 1 }"
      >
        <div class="py-1 rounded patient-actions__item">
          <v-icon size="17" v-text="icon" color="white"> </v-icon>
        </div>
        <div v-show="false" class="patient-notifications">
          <!-- notifications count -->
          <!-- :class="[
            notif.length < 2
              ? 'rounded-circle width-15'
              : 'rounded-pill width-content px-1',
          ]" -->
        </div>
      </v-responsive>
    </div>

    <slot></slot>

    <!-- <v-btn
      :ripple="false"
      class="mx-n3 expand-actions"
      tile
      @click="isAdditionalInfoShown = !isAdditionalInfoShown"
    >
      <v-icon class="mx-auto expand-icon">{{
        isAdditionalInfoShown ? "mdi-chevron-up" : "mdi-chevron-down"
      }}</v-icon>
    </v-btn> -->
  </v-card>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("patients");
const { mapActions: Actions_doctors } = createNamespacedHelpers("doctors");
const { mapGetters: Getters_lang } = createNamespacedHelpers("lang");

export default {
  name: "PatientAvatarAndName",
  data: () => ({
    patientActions: ["mdi-phone", "mdi-video", "mdi-message", "mdi-email"],
  }),
  computed: {
    ...mapState(["selectedPatient"]),
    ...Getters_lang(["getCommonTranslation", "getDoctorTranslation"]),
    ...Actions_doctors(["imageSrc"]),
  },
};
</script>

<style lang="scss" scoped>
.patient-actions__item {
  display: flex;
  justify-content: center;
  background-color: rgb(14, 98, 154);
}
.patient-notifications {
  color: #fff;
  text-align: center;
  position: absolute;
  height: 15px;
  top: 0;
  right: 0;
  background-color: red;
  font-size: 10px;
  line-height: 15px;
}
.width-15 {
  width: 15px;
}
.width-content {
  width: fit-content;
}
</style>
