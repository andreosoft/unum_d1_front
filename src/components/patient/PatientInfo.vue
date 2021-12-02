<template>
  <v-card @click="buildAnamnesisForm()">
    <ul>
      <li v-for="el of info">{{ el.title }}:{{ el.value }}</li>
    </ul>
  </v-card>
</template>

<script>

import { createNamespacedHelpers } from "vuex";

const { mapGetters: Getters_lang } = createNamespacedHelpers("lang");

export default {
  //  mixins: [validate, validators, fillForm],
  name: "PatientInfo",
  props: {
    value: Object,
    dialog: {
      type: Boolean,
      default: false,
    },
    model: Array,
    patient: {
      type: Object,
      default: () => {},
    },
    records: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      data: {},
      info: [
        {
          name: "sex",
          title: "пол",
        },
        {
          name: "height",
          title: "рост",
        },
        {
          name: "weight",
          title: "вес",
        },
        {
          name: "blood",
          title: "гр.крови",
        },
        {
          name: "allergy",
          title: "аллергия",
        },
        {
          name: "xz",
          title: "ХЗ",
        },
        {
          name: "pressure",
          title: "АД",
        },
        {
          name: "heartRate",
          title: "ЧСС",
        },
      ],
    };
  },
  computed: {
    ...Getters_lang(["getDoctorTranslation", "getCommonTranslation"]),
    indexInfo() {
      let res = [];
      this.info.forEach((el, i) => {
        res[el.name] = i;
      });

      return res;
    },
    allergy() {
      return "yes";
    },
    sex() {
      return "yes";
    },
  },
  created() {
    this.info[this.indexInfo["sex"]].value = "male";
    this.info[this.indexInfo["allergy"]].value = "male";
    //console.log(this.indexInfo);
  },
  methods: {
  },
};
</script>

<style></style>
