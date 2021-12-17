<template>
  <v-row>

    <v-col>
      <v-tabs vertical v-model="tab">
        <v-tab v-for="(el, i) in model" :key="i">
          <v-card-text class="text-wrap">{{ $t(el.title) }}</v-card-text>
        </v-tab>
        <v-tab-item v-for="(el, i) in model" :key="i">
          <v-row>
            <v-col :cols="history[el.name] ? 8 : 0">
              <a-form-model2
                v-model="data[el.name]"
                :model="el.fields"
                :parentEl="{ name: el.name, tab: tabName }"
                :errors="errors"
                @validate="$emit('validate', $event)"
              />
            </v-col>
            <v-col cols="4" v-if="history[el.name]">
              <li
                v-for="(els, i) in history[el.name]"
                v-if="els && els !== null"
              >
                {{ $t(i) }}:
                <span v-for="el in els">{{ el.body }};<br /> </span>
              </li>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
    </v-col>
  </v-row>
</template>

<script>
import { validate, validators } from "./../../templates/mixings";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("patients");

export default {
  mixins: [validate, validators],
  name: "FormWithTabs",
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
    // ...mapActions(["addClinicalRecord", "uploadFile"]),

    fillForm() {
      //      console.log(this.tabName + " Form Fill Form");
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
