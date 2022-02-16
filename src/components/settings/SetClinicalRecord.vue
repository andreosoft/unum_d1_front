<template>
  <v-container fluid pt-0 pa-2>
    <v-tabs v-model="tabSelected" show-arrows>
      <v-tab
        v-for="tab in tabs"
        :key="tab.name"
        :disabled="tab.disabled"
        class="ml-0 px-3"
      >
        {{ $t(tab.title) }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabSelected">
      <v-tab-item v-for="(t, i) in tabs" :key="i">
        <v-col class="pt-1 pa-2">
          <v-divider class="mt-1 mb-2"></v-divider>
          <v-row>
            <v-col>
              <SampleForm
                v-model="samples"
                :model="{ name: t.name, apply: genApplyList(t.name) }"
              ></SampleForm>
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
    SampleForm: () => import("./ClinicalRecord/SampleForm"),
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
    this.$store.dispatch("settings/fetchSamples");
    this.$route.params.desc = "Samples for clinical record";
  },
  computed: {
    samples() {
      return this.$store.state.settings.samples;
      //return this.$store.state.doctors.samples;

      //this.$store.state?.auth?.doctorProfile
    },
  },
  methods: {
    genApplyList(n) {
      //берем структуру модели из model.js
      let model = this["model" + upperFirst(n)];
      let res = [];
      if (!model) return [];
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