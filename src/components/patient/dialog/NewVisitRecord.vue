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
          <v-tab v-for="tab in tabs" :disabled="tab.disabled">
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
                :history="
                  fAnamnesis && fAnamnesis['anamnesis']
                    ? fAnamnesis['anamnesis']
                    : {}
                "
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
                :history="
                  fAnamnesis && fAnamnesis['surveys']
                    ? fAnamnesis['surveys']
                    : {}
                "
                @validate="validate"
              />
            </v-col>
          </v-tab-item>
          <v-tab-item>
            <v-col>
              <diagnosisForm
                v-model="data['diagnosis']"
                :model="diagnosis"
                :tabName="'diagnosis'"
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

    <!-- выбор типа посещения  -->
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
              v-for="type in visitType"
              :key="type.id"
              :label="$t(type.name)"
              @click="
                () => {
                  if (type.id == 1) initialVisitDialog = false;
                }
              "
              :value="type.id"
              :disabled="type.disabled"
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
        <v-card-actions class="justify-end">
          <v-btn text @click="closeDialog">{{ $t("Close") }}</v-btn>
        </v-card-actions>
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
import { buildObjects } from "./../mixings";
import { api } from "@/config";
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
  name: "NewVisitRecord",
  props: {
    value: Boolean,
    fAnamnesis: {},
    recordId: 0,
    record: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      data: {},
      idVideo: "",
      type_id: 0,
      visitType: [
        { id: 1, name: "Initial visit", disabled: false },
        { id: 2, name: "Secondary visit", disabled: false },
        { id: 3, name: "Arhive", disabled: true },
      ],
      attachedfiles: null,
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
          disabled: this.recordId ? true : false,
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
  created() {
    this.$store.dispatch("doctors/fetchSamples");
  },
  mounted() {
    if (!this.recordId) {
      this.initialVisitDialog = true;
    } else {
      this.type_id = this.record.record.type_id;
    }
  },
  filters: {
    formatDate(val) {
      const date = JSON.parse(val).createdAt;
      return dayjs(date).format("DD.MM.YYYY");
    },
    getDiagnos(val) {
      const diagnos = JSON.parse(val)?.diagnosis?.diagnos;
      return diagnos;
    },
  },

  watch: {
    value() {
      if (this.value && !this.recordId) {
        this.$nextTick(() => {
          if (this.initialVisits.length) {
            this.initialVisitDialog = true;
          } else {
            this.type_id = 1;
          }
        });
      } else {
        this.resetFrom();
      }
    },
    initialVisitDialog(v) {
      if (v) {
        /* this.type_id = 0;
        this.initialVisitId = null;
        this.initialVisitData = null; */
      }
    },
  },
  computed: {
    ...mapState(["selectedPatientClinicalRecords"]),
    doctorProfile() {
      return this.$store.state?.auth?.doctorProfile;
    },
    title() {
      if (this.recordId) {
        return this.$t("Edit clinical record") + "  #" + this.recordId;
      }
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
  },

  methods: {
    ...mapActions(["addClinicalRecord", "uploadFile"]),
    closeDialog() {
      if (!this.type_id) {
        this.$emit("input");
      } else {
        this.initialVisitDialog = false;
      }
    },
    validateOnSubmit() {
      if (this.type_id !== 1 && this.type_id !== 2)
        return "Не выбран тип приема";
      else if (this.type_id == 1 && !this.data.diagnosis.diagnosis.code)
        return "Не указан диагноз";
      else return "";
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

    trimObject(obj) {
      /* пока нигде не использую */
      let res = {};
      console.log("retrim", obj);
      for (let key in obj) {
        if (obj[key] === Object(obj[key])) {
          if (obj[key] && obj[key] !== null && obj[key] !== undefined) {
            let d = this.trimObject(obj[key]);
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

    trimObjectFiles(obj = []) {
      let arr = [];
      if (!obj[0].hasOwnProperty("group_name")) {
        arr["group_name"] = null;
        arr["files"] = obj;
        obj = [{ group_name: "", files: obj }];
      }
      console.log("trim", obj);
      arr = [];
      obj.forEach((group) => {
        if (group.files) {
          let name;
          let idx;
          name = group.group_name ? group.group_name.trim() : (name = "");
          idx = arr.findIndex((el) => {
            return el.group_name === name;
          });
          if (idx >= 0) {
            arr[idx].files = group.files.concat(arr[idx].files);
          } else {
            arr.push({ group_name: group.group_name, files: group.files });
          }
        }
      });
      return arr;
    },

    trimFlatObject(obj) {
      let res = {};
      const fnParseObject = (obj) => {
        for (let key in obj) {
          if (obj[key] === Object(obj[key])) {
            if (key.length > 5 && key.substring(key.length - 5) === "_file") {
              //res=this.trimObject(obj[key])
              let k = key.toLowerCase();
              console.log("files object", obj[key]);
              let files = this.trimObjectFiles(
                JSON.parse(JSON.stringify(obj[key]))
              );
              if (files) {
                res = Object.assign({}, res, { [k]: true });
              }
              this.attachedFiles = Object.assign({}, this.attachedFiles, {
                [k]: files,
              });
            } else {
              if (obj[key] && obj[key] !== null && obj[key] !== undefined) {
                fnParseObject(obj[key]);
              }
            }
          } else {
            if (obj[key] && obj[key].length && obj[key] !== undefined) {
              let k = key.toLowerCase();
              res = Object.assign({}, res, { [k]: obj[key].trim() });
            }
          }
        }
      };
      fnParseObject(obj);

      return res;
    },

    async submit() {
      if (this.recordId) {
        if (
          !(
            this.doctorProfile &&
            this.doctorProfile.id == this.record?.record?.doctor_id
          )
        ) {
          this.$root.addAlert({
            type: "error",
            text: "Нельзя редактировать чужую запись",
          });
          return false;
        }
      }
      if (this.recordId && 10 == 1) {
        {
          this.$root.addAlert({
            type: "error",
            text: "Еще нельзя изменять данные",
          });
          return false;
        }
      }
      let err = this.validateOnSubmit();
      if (!err) {
        if (await this.post()) {
          this.resetFrom();
          return true;
        }
        return false;
      }
      this.$root.addAlert({
        type: "error",
        text: err,
      });

      return false;
    },
    async post() {
      this.loading = true;

      let makeDiagnosis = this.trimFlatObject(
        JSON.parse(JSON.stringify(this.data.diagnosis.diagnosis))
      );
      let makeAnamnesis = this.trimFlatObject(
        JSON.parse(JSON.stringify(this.data.anamnesis))
      );
      let makeSurveys = this.trimFlatObject(
        JSON.parse(JSON.stringify(this.data.surveys))
      );
      let makeRecomendations = this.trimFlatObject(
        JSON.parse(JSON.stringify(this.data.recomendations))
      );
      let makeAppointments = this.trimFlatObject(
        JSON.parse(JSON.stringify(this.data.appointments))
      );
      //console.log("attachedFiles", this.attachedFiles);
      //return false;
      if (
        !(
          (makeDiagnosis && Object.keys(makeDiagnosis).length !== 0) ||
          (makeSurveys && Object.keys(makeSurveys).length !== 0) ||
          (makeRecomendations && Object.keys(makeSurveys).length !== 0) ||
          (makeAppointments && Object.keys(makeSurveys).length !== 0) ||
          (makeAnamnesis && Object.keys(makeAnamnesis).length !== 0)
        )
      ) {
        this.$root.addAlert({
          type: "error",
          text: "Нет данных для сохранения",
        });
        return false;
      }
      let patient_id = Number(this.$route.params.id);
      const payload = {
        id: this.recordId,
        patient_id: patient_id,
        type_id: this.type_id,
        parent_id: this.initialVisitId,
        status_id: 1,
        files: this.attachedFiles ? JSON.stringify(this.attachedFiles) : null,
        data: JSON.stringify({
          diagnosis: makeDiagnosis,
          surveys: makeSurveys,
          appointments: makeAppointments,
          recomendations: makeRecomendations,
        }),
        anamnesis: JSON.stringify(makeAnamnesis),
        //        treatmentFinished: this.treatmentFinished,
      };
      let makeInfo = this.trimFlatObject(
        JSON.parse(JSON.stringify(this.data.info))
      );
      //console.log("payload", payload);
      //console.log(this.data.info.Info, makeInfo);
      if (0) {
        this.$root.addAlert({
          type: "error",
          text: "Не правильно заполнена форма",
        });
        return false;
      }
      if (makeInfo && makeInfo.length) {
        //console.log(makeInfo);
        this.$axios
          .post(api.updatePatient, {
            id: patient_id,
            info: JSON.stringify(makeInfo),
          })
          .then(() => {
            this.$root.addAlert({
              type: "info",
              text: "Данные о пациенте обновлены",
            });
          });
      }

      this.addClinicalRecord(payload);
      this.loading = false;
      this.$root.addAlert({
        type: "info",
        text: "Данные сохранены",
      });
      if (this.recordId) {
        this.$emit("forceRerender");
      }
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
        ["anamnesis"]: this.createObjectFormFromModel(
          this.anamnesis,
          null,
          this.record?.anamnesis
        ),
      });
      this.data = Object.assign({}, this.data, {
        ["surveys"]: this.createObjectFormFromModel(
          this.surveys,
          null,
          this.record?.surveys
        ),
      });
      this.data = Object.assign({}, this.data, {
        ["diagnosis"]: this.createObjectFormFromModel(
          this.diagnosis,
          null,
          this.record?.diagnosis
        ),
      });
      this.data = Object.assign({}, this.data, {
        ["recomendations"]: this.createObjectFormFromModel(
          this.recomendations,
          null,
          this.record?.recomendations
        ),
      });
      this.data = Object.assign({}, this.data, {
        ["appointments"]: this.createObjectFormFromModel(
          this.appointments,
          null,
          this.record?.appointments
        ),
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
