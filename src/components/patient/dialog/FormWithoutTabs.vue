<template>
  <v-row>
    <v-col :cols="8">
      <a-form-model
        v-model="data[model[0].name]"
        :model="model[0].fields"
        :parentEl="{ name: model[0].name, tab: tabName }"
        :errors="errors"
        @validate="$emit('validate', $event)"
      />
    </v-col>
  </v-row>
</template>

<script>
import { validate, validators } from "./../../templates/mixings";

export default {
  mixins: [validate, validators],
  name: "FormWithoutTabs",
  props: {
    value: Object,
    //valueData: Object,
    tabName: "",
    model: Array,
    history: {},
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
      console.log(this.tabName + " Form Fill Form", this.value);
      this.data = Object.assign({}, this.data, this.value);
    },
  },
  created() {
    this.fillForm();
  },
  computed: {
    data: {
      set(v) {
        //  console.log("model emit input", v);
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
