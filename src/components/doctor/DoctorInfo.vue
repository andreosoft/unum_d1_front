<template>
  <div>
    <div
      v-show="$vuetify.breakpoint.smAndDown"
      class="mb-3 cursor-pointer"
      @click="$emit('openDrawer')"
    >
      <v-icon>
        mdi-account-box
      </v-icon>
      {{ getCommonTranslation("Show doctor info") }}
    </div>
    <h2 class="mb-3">
      {{ getCommonTranslation("Doctor information") }}
    </h2>
    <v-card>
      <v-list>
        <v-list-item class="mb-2"
          >{{ getCommonTranslation("Name") }} - {{ firstName }}</v-list-item
        >
        <v-list-item class="mb-2"
          >{{ getCommonTranslation("Surname") }} - {{ lastName }}</v-list-item
        >
        <v-list-item v-show="country" class="mb-2">
          {{ getCommonTranslation("Country") }} - {{ country }}
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item v-if="doctorSpecialty" class="mb-2">
          {{ getDoctorTranslation("Medical specialty") }} -
          {{ doctorSpecialty }}
        </v-list-item>
        <v-list-item v-if="doctorUniversity" class="mb-2">
          {{ getDoctorTranslation("Medical Education") }}
          -
          {{ doctorUniversity }}
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("lang");

export default {
  name: "DoctorInfo",
  props: {
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    doctorSpecialty: {
      type: String,
      default: "",
    },
    doctorUniversity: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters(["getCommonTranslation", "getDoctorTranslation"]),
  },
};
</script>

<style></style>
