<template>
  <div>
    <v-dialog
      :value="value"
      @input="$emit('input')"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click="$emit('input')">
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <v-toolbar-title @click="initialVisitDialog = true">
            {{ title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="submit">
              {{ $t("Save") }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-tabs v-model="newRecordTab" align-with-title>
          <v-tab v-for="tab in tabs">
            {{ $t(tab.title) }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="newRecordTab">
          <v-tab-item>
            <v-col>
              <v-divider class="mt-1 mb-3"></v-divider>

              <FormWithoutTabs
                v-model="data['info']"
                :model="info"
                :tabName="'info'"
                :history="{}"
                @validate="validate"
              />
            </v-col>
          </v-tab-item>
          <v-tab-item>
            <v-col>
              <v-divider class="mt-1 mb-3"></v-divider>
              <FormWithTabs
                v-model="data['anamnesis']"
                :model="anamnesis"
                :tabName="'anamnesis'"
                :history="fAnamnesis['anamnesis']"
                @validate="validate"
              />
            </v-col>
          </v-tab-item>
          <v-tab-item>
            <v-col>
              <v-divider class="mt-1 mb-3"></v-divider>
              <FormWithTabs
                v-model="data['surveys']"
                :model="surveys"
                :tabName="'surveys'"
                :history="fAnamnesis['surveys'] ? fAnamnesis['surveys'] : {}"
                @validate="validate"
              />
            </v-col>
          </v-tab-item>
          <v-tab-item>
            <v-col>
              <diagnosisForm
                v-model="data['diagnosis']"
                :model="diagnosis"
                @validate="validate"
              />
            </v-col>
          </v-tab-item>
          <v-tab-item>
            <v-col>
              <v-divider class="mt-1 mb-3"></v-divider>

              <FormWithoutTabs
                v-model="data['appointments']"
                :model="appointments"
                :tabName="'appointments'"
                :history="{}"
                @validate="validate"
              />
            </v-col>
          </v-tab-item>
          <v-tab-item>
            <v-col>
              <v-divider class="mt-1 mb-3"></v-divider>

              <FormWithoutTabs
                v-model="data['recomendations']"
                :model="recomendations"
                :tabName="'recomendations'"
                :history="{}"
                @validate="validate"
              />
            </v-col>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-dialog>

    <!-- выбор вторичного посещения для первичного -->
    <v-dialog
      v-model="initialVisitDialog"
      :max-width="600"
      persistent
      transition="dialog-right-transition"
    >
      <v-card :max-height="300" class="secondary-visit__card">
        <v-card-title>
          {{ $t("Choise type visit") }}
        </v-card-title>
        <v-card-text>
          <v-radio-group v-model="type_id" row>
            <v-radio
              v-for="i in 2"
              :key="i"
              :label="i === 1 ? $t('Initial visit') : $t('Secondary visit')"
              @click="
                () => {
                  if (i == 1) initialVisitDialog = false;
                }
              "
              :value="i"
            ></v-radio>
          </v-radio-group>
          <v-list v-show="type_id === 2">
            <v-list-item
              v-for="event in initialVisits"
              :key="event.id"
              @click="
                initialVisitId = event.id;
                initialVisitData = event.name;
                initialVisitDialog = false;
              "
            >
              {{ event.data | getDiagnos }} ({{ event.data | formatDate }})
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  required,
  minLength,
  sameAs,
  requiredIf,
} from "vuelidate/lib/validators";
import { createNamespacedHelpers } from "vuex";
//import AnamnesisForm from "./AnamnesisForm.vue";
import dayjs from "dayjs";
import { getForm, submitForm, fillForm } from "./../../templates/mixings";
import { modelAnamnesis, buildObjects } from "./../mixings";
const { mapState, mapActions } = createNamespacedHelpers("patients");

export default {
  mixins: [submitForm, fillForm, buildObjects],
  components: {
    AnamnesisForm: () => import("./AnamnesisForm.vue"),
    SurveysForm: () => import("./SurveysForm.vue"),
    DiagnosisForm: () => import("./DiagnosisForm.vue"),
    FormWithTabs: () => import("./FormWithTabs.vue"),
    FormWithoutTabs: () => import("./FormWithoutTabs.vue"),
  },
  name: "PatientNewVisitRecord",
  props: {
    value: Boolean,
    fAnamnesis: {},
  },
  data() {
    return {
      data: {},
      type_id: 0,
      initialVisitId: null,
      initialVisitData: null,
      initialVisitDialog: false,
      anamnesisTab: 0,
      newRecordTab: 1,
      //      modelAnamnesis: [],
      tabs: [
        {
          name: "PatientInfo",
          title: "Patient Info",
          active: false,
          disabled: true,
          history: false,
        },
        {
          name: "Anamnesis",
          title: "Anamnesis",
          active: true,
          disabled: false,
          history: false,
        },
        {
          name: "Surveys",
          title: "Surveys",
          active: false,
          disabled: false,
          history: false,
        },
        {
          name: "Diagnosis",
          title: "Diagnosis",
          active: false,
          disabled: false,
          history: false,
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
    };
  },
  /*validateions: {
    type_id: { required },
    initialVisitId: { required: requiredIf((prop) => prop.type_id == 2) },
  },*/
  created() {},
  mounted() {},
  filters: {
    formatDate(val) {
      const date = JSON.parse(val).createdAt;
      return dayjs(date).format("DD.MM.YYYY");
    },
    getDiagnos(val) {
      const diagnos = JSON.parse(val).diagnos;
      return diagnos;
    },
  },

  watch: {
    value() {
      if (this.value) {
        this.$nextTick(() => {
          this.initialVisitDialog = true;
        });
      } else {
        this.resetFrom();
      }
    },
    initialVisitDialog(v) {
      if (v) {
        this.type_id = 0;
        this.initialVisitId = null;
        this.initialVisitData = null;
      }
    },
  },
  computed: {
    ...mapState(["selectedPatientClinicalRecords"]),
    title() {
      let title = this.$t("Add clinical record ");
      if (this.type_id) {
        title =
          this.type_id == 1
            ? "Первичный прием пациента"
            : `Повторный прием по диагнозу
              ( ${this.initialVisitData ? this.initialVisitData : ""} )`;
      }
      return title;
    },
    initialVisits() {
      return (
        this.selectedPatientClinicalRecords &&
        this.selectedPatientClinicalRecords.filter(
          (record) =>
            record.type_id === 1 && !JSON.parse(record.data).initialVisitId
        )
      );
    },

    anamnesis() {
      let res = this.fillModelFields("anamnesis");
      return res;
    },
    surveys() {
      let res = this.fillModelFields("surveys");
      return res;
    },
    diagnosis() {
      let res = this.fillModelFields("diagnosis");
      return res;
    },
    info() {
      let res = this.fillModelFields("info");
      return res;
    },

    appointments() {
      let res = this.fillModelFields("appointments");
      return res;
    },
    recomendations() {
      let res = this.fillModelFields("recomendations");
      return res;
    },
  },

  methods: {
    ...mapActions(["addClinicalRecord", "uploadFile"]),
    validateOnSubmit() {
      console.log(this.type_id, this.data.diagnosis.diagnosis.code);
      if (this.type_id !== 1 && this.type_id !== 2)
        return "Не выбран тип приема";
      else if (this.type_id == 1 && !this.data.diagnosis.diagnosis.code)
        return "Не указан диагноз";
      else return "1";
    },

    recursiveReset(obj) {
      Object.keys(obj).map((key) => {
        // Test if it's an Object
        if (obj[key] === Object(obj[key])) {
          this.recursiveReset(obj[key]);
          return;
        } else obj[key] = undefined;
      });
    },
    resetFrom() {
      this.newRecordTab = 1;
      //this.type_id = null;
      this.type_id = 0;
      this.initialVisitId = null;
      this.initialVisitData = null;

      this.recursiveReset(this.data);
    },

    fillObject(obj) {
      let res = {};
      for (let key in obj) {
        if (obj[key] === Object(obj[key])) {
          if (obj[key] && obj[key] !== null && obj[key] !== undefined) {
            let d = this.fillObject(obj[key]);
            if (Object.keys(d).length !== 0) {
              res = Object.assign({}, res, { [key]: d });
            }
          }
        } else {
          if (obj[key] && obj[key].length && obj[key] !== undefined) {
            res = Object.assign({}, res, { [key]: obj[key] });
          }
        }
      }
      return res;
    },

    async submit() {
      let err = this.validateOnSubmit();
      if (!err) {
        await this.post();
        return true;
      }
      console.log("error", err);
      this.$root.addAlert({
        type: "error",
        text: err,
      });

      return false;
    },
    async post() {
      this.loading = true;
      let makeDiagnosis = this.fillObject(
        JSON.parse(JSON.stringify(this.data.diagnosis))
      ).diagnosis;
      let makeAnamnesis = this.fillObject(
        JSON.parse(JSON.stringify(this.data.anamnesis))
      );
      const payload = {
        patient_id: Number(this.$route.params.id),
        type_id: this.type_id,
        parent_id: this.initialVisitId,
        status_id: 1,
        data: JSON.stringify(makeDiagnosis),
        anamnesis: JSON.stringify(makeAnamnesis),
        //        treatmentFinished: this.treatmentFinished,
      };
      console.log("payload", makeDiagnosis, makeAnamnesis, payload);
      /*      this.$v.$touch(); //it will validate all fields
      console.log(this.$v);
      console.log(this.validators);
      if (!this.$v.$invalid) {
        //invalid, becomes true when a validations return false
        this.$root.addAlert({
          type: "error",
          text: this.$v.$error,
        });
        return false;
      }*/
      if (1) {
        this.$root.addAlert({
          type: "error",
          text: "Не правильно заполнена форма",
        });
        return false;
      }
      this.addClinicalRecord(payload);
      this.loading = false;
      this.$emit("input");
      //      this.afterSave(this.data, status);
    },

    getDefaultValue(el) {
      if (this.defaults && this.defaults[el.name] !== undefined)
        return this.defaults[el.name];
      if (el.default !== undefined) return el.default;
      return null;
    },
    fillForm() {
      this.data = Object.assign({}, this.data, {
        ["info"]: this.createObjectFormFromModel(this.info),
      });
      this.data = Object.assign({}, this.data, {
        ["anamnesis"]: this.createObjectFormFromModel(this.anamnesis),
      });
      this.data = Object.assign({}, this.data, {
        ["surveys"]: this.createObjectFormFromModel(this.surveys),
      });
      this.data = Object.assign({}, this.data, {
        ["diagnosis"]: this.createObjectFormFromModel(this.diagnosis),
      });
      this.data = Object.assign({}, this.data, {
        ["recomendations"]: this.createObjectFormFromModel(this.recomendations),
      });
      this.data = Object.assign({}, this.data, {
        ["appointments"]: this.createObjectFormFromModel(this.appointments),
      });
      //      this.data = Object.assign({}, this.data, {        ["anamnesis"]: this.createObjectFormFromModel(this.model),      });
      //  this.fillFormFromModel(this.model);
    },
  },
};
</script>

<style>
.secondary-visit__dialog {
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
.secondary-visit__card {
  overflow-y: auto;
  .v-card__title {
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 1;
  }
}
</style>
