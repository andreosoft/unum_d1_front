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

    <ContactButtons :phone="getPatientPhone" :email="getPatientEmail" />

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
import ContactButtons from "./../../components/ContactButtons.vue";
const { mapState } = createNamespacedHelpers("patients");
const { mapActions: Actions_doctors } = createNamespacedHelpers("doctors");
const { mapGetters: Getters_lang } = createNamespacedHelpers("lang");

export default {
  name: "PatientAvatarAndName",
  components: {
    ContactButtons,
  },
  computed: {
    ...mapState(["selectedPatient"]),
    ...Getters_lang(["getCommonTranslation", "getDoctorTranslation"]),
    ...Actions_doctors(["imageSrc"]),
    patientActions() {
      const actions = [
        {
          icon: "mdi-phone",
          href: `tel:${this.getPatientPhone}`,
          tooltip: this.getPatientPhone,
          id: 1,
        },
        {
          icon: "mdi-email",
          href: `mailto:${this.getPatientEmail}`,
          id: 2,
          tooltip: this.getPatientEmail,
        },
      ];
      return actions;
    },
    getPatientEmail() {
      return this.selectedPatient && this.selectedPatient.email;
    },
    getPatientPhone() {
      try {
        const phone =
          this.selectedPatient &&
          JSON.parse(this.selectedPatient.phones).join();
        return phone;
      } catch (error) {
        return this.selectedPatient.phones;
      }
    },
  },
};
</script>
