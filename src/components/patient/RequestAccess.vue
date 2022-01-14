<template>
  <v-dialog :value="dialog" :max-width="600" @input="$emit('close')">
    <v-card class="pa-5">
      <v-card-title class="pa-0 mb-3">
        {{ getDoctorTranslation("Enter patient email") }}
      </v-card-title>
      <form @submit.prevent="sendEmail">
        <v-text-field
          v-model="patientEmail"
          outlined
          type="email"
          dense
          :label="getDoctorTranslation('Patient email')"
        >
        </v-text-field>
        <v-btn class="mr-3" @click="$emit('close')">
          {{ getCommonTranslation("Cancel") }}
        </v-btn>
        <v-btn type="submit">
          {{ getCommonTranslation("Send") }}
        </v-btn>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapGetters } = createNamespacedHelpers("lang");
const { mapActions: Action_alerts } = createNamespacedHelpers("alerts");
const { mapActions: Actions_patients } = createNamespacedHelpers("patients");
export default {
  name: "RequestAccess",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    patientEmail: "",
  }),
  computed: {
    ...mapGetters(["getDoctorTranslation", "getCommonTranslation"]),
  },
  methods: {
    ...Action_alerts(["addAlert"]),
    ...Actions_patients(["requestPatientCardAccess"]),
    sendEmail() {
      this.requestPatientCardAccess(this.patientEmail);
      this.$emit("close");
      this.patientEmail = "";
    },
  },
};
</script>

<style></style>
