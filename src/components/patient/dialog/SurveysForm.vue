<template>
  <v-row>
    <v-col>
      <v-tabs vertical v-model="surveysTab">
        <v-tab v-for="(tab, i) in model" :key="i">
          <v-card-text>{{ getDoctorTranslation(tab.title) }}</v-card-text>
        </v-tab>
        <v-tab-item v-for="(tab, i) in model" :key="i">
          <v-col>
            <a-form-model
              v-model="data[tab.name]"
              :model="tab.fields"
              :parentEl="{ name: tab.name, tab: 'surveys' }"
              :errors="errors"
              @validate="$emit('validate', $event)"
            />
          </v-col>
        </v-tab-item>
      </v-tabs>
    </v-col>
  </v-row>
</template>

<script>
import { validate, validators, fillForm } from "./../../templates/mixings";
import { createNamespacedHelpers } from "vuex";

const { mapGetters: Getters_lang } = createNamespacedHelpers("lang");

export default {
  mixins: [validate, validators, fillForm],
  name: "SurveysForm",
  props: {
    value: Object,
    dialog: {
      type: Boolean,
      default: false,
    },
    model: Array,
  },
  data() {
    return {
      surveysTab: 0,
    };
  },
  computed: {
    ...Getters_lang(["getDoctorTranslation"]),
  },
  created() {
    this.fillForm();
  },
  methods: {
    fillForm() {
      this.data = Object.assign({}, this.data, this.value);
    },
  },
};
</script>

<style></style>
