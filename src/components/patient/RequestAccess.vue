<template>
  <v-dialog :value="dialog" :max-width="600" @input="$emit('close')">
    <v-card class="pa-5">
      <v-card-title class="pa-0 mb-3">
        {{ $t("Enter patient email") }}
      </v-card-title>
      <form @submit.prevent="sendEmail">
        <v-text-field
          v-model="patientEmail"
          outlined
          type="email"
          dense
          :label="$t('Patient email')"
        >
        </v-text-field>
        <v-btn class="mr-3" @click="$emit('close')">
          {{ $t("Cancel") }}
        </v-btn>
        <v-btn type="submit">
          {{ $t("Send") }}
        </v-btn>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

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
  computed: {},
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
