<template>
  <v-dialog
    v-model="show"
    fullscreen
    content-class="clinical-record-view__dialog"
  >
    <v-toolbar dark color="primary">
      <v-toolbar-title>
        {{ getCommonTranslation("Clinical record view") }}
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn icon @click.stop="show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card class="pa-4 rounded-0" :elevation="0">
      <v-simple-table>
        <template #default>
          <tbody>
            <tr>
              <td>{{ getCommonTranslation("Therapist") }}</td>
              <td>
                {{ getDoctorName(record.doctor_id) }}
              </td>
            </tr>
            <tr>
              <td>
                {{ getCommonTranslation("Therapist specialty") }}
              </td>
              <td>
                {{ getDoctorSpecialty(record.doctor_id) }}
              </td>
            </tr>
            <tr v-show="selectedVisitCreatedDate">
              <td>
                {{ getCommonTranslation("Created date") }}
              </td>
              <td>{{ selectedVisitCreatedDate }}</td>
            </tr>
            <tr>
              <td>{{ getCommonTranslation("Diagnosis") }}</td>
              <td>{{ selectedVisitDiagonsis }}</td>
            </tr>
            <tr v-show="selectedVisitDescription.length">
              <td>{{ getCommonTranslation("Description") }}</td>
              <td>{{ selectedVisitDescription }}</td>
            </tr>
            <tr v-show="selectedVisitRecommnedations.length">
              <td>
                {{ getCommonTranslation("Recommendations") }}
              </td>
              <td>{{ selectedVisitRecommnedations }}</td>
            </tr>
            <tr
              v-for="(file, index) in JSON.parse(record.data).files"
              :key="index"
            >
              <td>
                <a :href="download(file.file)" target="_blank">
                  {{ getCommonTranslation("Download attached file") }}
                </a>
              </td>
              <td>{{ file.name }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-dialog>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import dayjs from "dayjs";
import { api } from "./../../../config/index";
const { mapGetters: Getters_lang, mapState: State_lang } =
  createNamespacedHelpers("lang");
const { mapGetters: Getters_doctors } = createNamespacedHelpers("doctors");

export default {
  name: "ClinicalRecordView",
  props: {
    value: Boolean,
    record: {
      type: Object,
      default: () => {},
    },
  },
  /*computed: {
    ...mapState(["selectedPatient", "selectedPatientClinicalRecords"]),
    ...Getters_doctors(["getDoctorName", "getDoctorSpecialty"]),
    ...Getters_lang(["getCommonTranslation", "getDoctorTranslation"]),
    ...State_lang(["common"]),
    getActiveLink() {
      const activeTab = this.patientLinks.find((link) => link.active);
      return activeTab.id;
    },  
    */
  methods: {
    download(id) {
      return `http://api.neomedy.com${api.getFile}/${id}`;
    },
  },
  computed: {
    ...Getters_lang(["getCommonTranslation", "getDoctorTranslation"]),
    ...Getters_doctors(["getDoctorName", "getDoctorSpecialty"]),

    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    selectedVisitDiagonsis() {
      return this.record && JSON.parse(this.record.data).diagnos;
    },
    selectedVisitDescription() {
      return this.record && JSON.parse(this.record.data).description;
    },
    selectedVisitRecommnedations() {
      return this.record && JSON.parse(this.record.data).recomendations;
    },
    selectedVisitCreatedDate() {
      return (
        this.record &&
        JSON.parse(this.record.data).createdAt &&
        dayjs(JSON.parse(this.record.data).createdAt).format("YYYY-DD-MM")
      );
    },
  },
};
</script>