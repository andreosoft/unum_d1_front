<template>
  <v-card @click="testClick">
    <ul>
      <li
        v-for="el of infoModel"
        v-ctk-tooltip="el.data ? el.data : ''"
        v-if="el['value']"
        :key="el.title"
      >
        {{ el.title }}: {{ $t(el.value) }}
      </li>
    </ul>
  </v-card>
</template>

<script>
import { buildObjects } from "./mixings";

export default {
  //mixins: [buildObjects],
  name: "PatientInfo",
  props: {
    value: Object,
    dialog: {
      type: Boolean,
      default: false,
    },
    model: Array,
    fAnamnesis: {},
    patient1: {
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
      infoModel: [],
      info: [
        {
          name: "birthday",
          title: "Дата рождения",
        },
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
          title: "Вес",
        },
        {
          name: "blood",
          title: "гр.крови",
        },
        {
          name: "allergy",
          title: "Аллергия",
        },

        {
          name: "chronicDiseases",
          title: "Хронические заболевания",
        },
        {
          //          name: "pressure",
          name: "ad",
          title: "АД",
        },
        {
          //          name: "heartRate",
          name: "hr",
          title: "ЧСС",
        },
      ],
    };
  },
  computed: {
    indexInfo() {
      let res = [];
      this.infoModel.forEach((el, i) => {
        res[el.name] = i;
      });

      return res;
    },
    patient() {
      return this.$store.state.patients.selectedPatient;
    },
  },
  methods: {
    testClick() {
      let res = this.$store.getters["patients/patient"];
    },

    fillInfoPanel() {
      this.infoModel = JSON.parse(JSON.stringify(this.info));
      //      this.$log("selectedPatient", this.$store.getters.selectedPatient);
      let info = JSON.parse(this.patient.info);
      this.infoModel.forEach((el) => {
        el.value = info?.[el.name];
      });
      function getKeyByValue(object, k = "", res = []) {
        object &&
          Object.keys(object).forEach(function (key) {
            if (
              typeof object[key] === "object" &&
              !Array.isArray(object[key]) &&
              object[key] !== null
            ) {
              return getKeyByValue(object[key], k, res);
            }
            if (object[key] !== null && (!k || k == key.toLowerCase())) {
              //console.log("kk ", k, object[key]);
              res.unshift(object[key]);
            }

            //return Object.keys(object).find((key) => object[key] !== null);
          });
        return res;
      }
      //this.$log("use AnamnesisForm in patient info");
      let elData;

      // this.infoModel[this.indexInfo["sex"]].value = "male";
      elData = getKeyByValue(this.fAnamnesis.anamnesis.allergic_anamnesis);
      let elt = elData.map((el) => {
        return el[0].body + " <br> ";
      });
      this.infoModel[this.indexInfo["allergy"]].data = elt;
      if (elData && elData.length)
        this.infoModel[this.indexInfo["allergy"]].value =
          elData && elData.length ? `есть (${elData.length})` : "???";
      elData = getKeyByValue(this.fAnamnesis, "chronic_diseases");
      elt = elData.map((el) => {
        return el[0].body + " <br> ";
      });
      this.infoModel[this.indexInfo["chronicDiseases"]].data = elt;
      if (elData && elData.length)
        this.infoModel[this.indexInfo["chronicDiseases"]].value =
          elData && elData.length ? `есть (${elData.length})` : "???";
      this.infoModel[this.indexInfo["birthday"]].value = this.patient?.birthday;
    },
  },
  created() {
    this.fillInfoPanel();
  },
  mounted() {},
};
</script>

<style></style>
