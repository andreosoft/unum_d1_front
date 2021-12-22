<template>
  <v-container fluid>
    <v-tabs v-model="tabSelected" align-with-title>
      <v-tab v-for="tab in tabs" :disabled="tab.disabled">
        {{ $t(tab.title) }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabSelected">
      <v-tab-item v-for="(t, i) in tabs" :key="i">
        <v-col>
          <v-divider class="mt-1 mb-3"></v-divider>
          <v-row>
            <v-col>
              <SampleForm2
                v-model="samples"
                :model="{ name: t.name, apply: genApplyList(t.name) }"
              ></SampleForm2>
            </v-col>
          </v-row>
        </v-col>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { models, buildObjects } from "./../patient/mixings";
import upperFirst from "lodash/upperFirst";
export default {
  mixins: [models],
  name: "SetClinicalRecord",
  components: {
    SampleForm: () => import("./SampleForm"),
    SampleForm2: () => import("./SampleForm2"),
  },
  props: {
    back: "",
  },
  data() {
    return {
      tabs: [
        {
          name: "anamnesis",
          title: "Anamnesis",
          active: true,
          disabled: false,
        },
        {
          name: "Surveys",
          title: "Surveys",
          active: true,
          disabled: false,
        },
        {
          name: "Diagnosis",
          title: "Diagnosis",
          active: false,
          disabled: false,
        },

        {
          name: "Appointments",
          title: "Назначения",
          active: false,
          disabled: false,
        },
        {
          name: "Recomendations",
          title: "Рекомендации",
          active: false,
          disabled: false,
        },
      ],
      //  userSamples: [{ name: "test", apply: [], color: "", sample: "text" }],
      tabSelected: 0,
    };
  },
  mounted() {
    this.$store.dispatch("doctors/fetchSamples");
  },
  computed: {
    samples() {
      return this.$store.state.doctors.samples;
      //return this.$store.state.doctors.samples;

      //this.$store.state?.auth?.doctorProfile
    },
  },
  methods: {
    genApplyList(n) {
      let model = this["model" + upperFirst(n)];
      let res = [];
      if (!model) return [];
      //console.log("genApplyList", n);
      for (let [i, el] of model.entries()) {
        res.push({ name: el.name, title: el.title });
      }
      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>