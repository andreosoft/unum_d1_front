<template>
  <div>
    <v-flex class="flex overflow-auto">
      <div v-for="(item, index) in anamnesisKeys" :key="index">
        <AnamnesisSection
          v-for="(value, key, index) in formA && formA.anamnesis[item]"
          :key="index"
          :array="value"
          :title="getTitle(key)"
        />
      </div>
    </v-flex>
  </div>
</template>

<script>
//import AnamnesisSectionItem from "./../AnamnesisSectionItem";
import AnamnesisSection from "./AnamnesisSection";

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
    titleArray: [],
    formA: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      anamnesisKeys: [
        "Complaints",
        "general_anamnesis",
        "life_anamnesis",
        "allergic_anamnesis",
        "other",
        //     "objectiveAnamnesis",
        //     "surveys",
      ],
    };
  },
  methods: {
    getTitle(title) {
      return (
        this.titleArray.find((el) => {
          return el.name.toLowerCase() === title.toLowerCase();
        })?.title || title
      );
    },
  },
  computed: {},
  mounted() {},
};
</script>

<style></style>
