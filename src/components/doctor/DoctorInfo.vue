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
    <h2 class="mb-3 section-title">
      {{ fullName }}
    </h2>
    <v-card :min-height="400">
      <v-list>
        <v-list-item>Специализация - {{ doctorSpecialty }}</v-list-item>
        <!-- <v-list-item
          >{{ getCommonTranslation("Surname") }} - {{ lastName }}</v-list-item
        > -->
        <!-- <v-list-item v-show="country">
          {{ getCommonTranslation("Country") }} - {{ country }}
        </v-list-item> -->
      </v-list>
      <v-list>
        <!-- <v-list-item v-if="doctorSpecialty">
          {{ getDoctorTranslation("Medical specialty") }} -
          {{ doctorSpecialty }}
        </v-list-item> -->
        <v-list-item v-if="doctorUniversity">
          {{ getDoctorTranslation("Medical Education") }}
          -
          {{ doctorUniversity }}
        </v-list-item>
        <v-list-item v-if="doctorUniversity">
          {{ getCommonTranslation("Years of education") }}
          -
          {{ yearsOfEducation }}
        </v-list-item>
      </v-list>
      <div v-show="qualification && qualification.length">
        <v-card-title class="section-title section-title--small pa-0 pl-4">
          {{ getCommonTranslation("Qualification") }}
        </v-card-title>
        <v-card-text style="white-space: pre;">{{ qualification }}</v-card-text>
      </div>
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
    fullName: {
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
    qualification: {
      type: String,
      default: "",
    },
    yearsOfEducation: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters(["getCommonTranslation", "getDoctorTranslation"]),
  },
};
</script>

<style lang="scss" scoped>
.section-title {
  font-size: 32px;
  font-weight: 500;
  margin-top: 20px;
  font-family: "Exo 2", sans-serif;
}
.section-title--small {
  font-size: 26px;
}
.v-list-item {
  min-height: unset;
  line-height: 28px;
}
</style>
