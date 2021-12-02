<template>
  <div>
    <v-flex class="flex overflow-auto">
      <div v-for="(item, index) in anamnesisKeys" :key="index">
        <AnamnesisSection
          v-for="(value, key, index) in formA && formA.anamnesis[item]"
          :key="index"
          :array="value"
          :title="key"
        />
      </div>
    </v-flex>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
//import AnamnesisSectionItem from "./../AnamnesisSectionItem";
import AnamnesisSection from "./AnamnesisSection";

const { mapGetters } = createNamespacedHelpers("lang");

export default {
  name: "PatientTabAnamnesis",

  components: {
    AnamnesisSection,
  },
  props: {
    title: {
      type: String,
      default: "",
    },

    formA: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      anamnesisKeys: [
        "Complaints",
        "generalAnamnesis",
        "lifeAnamnesis",
        "allergicAnamnesis",
        "other",
        //     "objectiveAnamnesis",
        //     "surveys",
      ],
    };
  },
  computed: {
  },
  mounted() {},
};
</script>

<style></style>
