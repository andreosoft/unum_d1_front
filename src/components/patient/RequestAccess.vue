<template>
  <v-dialog :value="dialog" :max-width="600" @input="$emit('close')">
    <v-card class="pa-3">
      <v-card-title class="pa-0 mb-3">
        {{ getDoctorTranslation("Enter patient email") }}
      </v-card-title>
      <form @submit.prevent="sendEmail">
        <v-text-field
          v-model="$v.patientEmail.$model"
          outlined
          :error="$v.patientEmail.$error"
          dense
          :label="getDoctorTranslation('Patient email')"
          :error-messages="
            patientEmailError && !$v.patientEmail.required
              ? getCommonTranslation('Field is required')
              : patientEmailError && !$v.patientEmail.emailValidation
              ? getCommonTranslation('Enter correct email')
              : ''
          "
          @input="$v.patientEmail.$reset"
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
import { required } from "vuelidate/lib/validators";

const { mapGetters } = createNamespacedHelpers("lang");
const { mapActions: Action_alerts } = createNamespacedHelpers("alerts");
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
    patientEmailError: false,
  }),
  validations: {
    patientEmail: {
      required,
      emailValidation: (email) => /.+@.+\..+/.test(email),
    },
  },
  computed: {
    ...mapGetters(["getDoctorTranslation", "getCommonTranslation"]),
  },
  methods: {
    ...Action_alerts(["addAlert"]),
    sendEmail() {
      this.$v.patientEmail.$touch();
      if (this.$v.patientEmail.$invalid) {
        this.patientEmailError = true;
        return;
      }
      window.open(
        `mailto:${this.patientEmail}?subject=${this.getDoctorTranslation(
          "Request access to patient card"
        )}`
      );
    },
  },
};
</script>

<style></style>
