<template>
  <v-row>
    <v-col>
    
      <v-tabs vertical v-model="tab">
        <v-tab v-for="(el, i) in model" :key="i">
          <v-card-text>{{ getDoctorTranslation(el.title) }}</v-card-text>
        </v-tab>
        <v-tab-item v-for="(el, i) in model" :key="i">
          <v-col>
            <a-form-model
              v-model="data[el.name]"
              :model="el.fields"
              :parentEl="{ name: el.name, tab: tabName }"
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
  //mixins: [fillForm],
  mixins: [validate, validators],
  name: "AnamnesisForm",
  props: {
    tabName: "",
    value: Object,
    valueData: Object,
    model: Array,
  },
  data() {
    return {
      tab: 0,
      errors: {},
      validators: {},
    };
  },

  methods: {
    fillForm() {
      console.log("Anamnesis Form Fill Form");
      this.data = Object.assign({}, this.data, this.value);
    },
  },
  created() {
    this.fillForm();
  },
  computed: {
    ...Getters_lang(["getDoctorTranslation"]),
    data: {
      set(v) {
        console.log("model emit input", v);
        this.$emit("input", v);
      },
      get() {
        return this.value;
      },
    },
  },
};
</script>

<style></style>
