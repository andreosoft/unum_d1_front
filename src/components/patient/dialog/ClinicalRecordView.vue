<template>
  <v-dialog
    v-model="show"
    fullscreen
    content-class="clinical-record-view__dialog"
  >
    <v-toolbar dark color="primary">
      <v-toolbar-title>
        {{ $t("Clinical record view") }}
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
              <td>{{ $t("Therapist") }}</td>
              <td>
                {{ getDoctorName(record.doctor_id) }}
              </td>
            </tr>
            <tr>
              <td>
                {{ $t("Therapist specialty") }}
              </td>
              <td>
                {{ getDoctorSpecialty(record.doctor_id) }}
              </td>
            </tr>
            <tr v-show="selectedVisitCreatedDate">
              <td>
                {{ $t("Created date") }}
              </td>
              <td>{{ selectedVisitCreatedDate }}</td>
            </tr>
            <tr>
              <td>{{ $t("Diagnosis") }}</td>
              <td>{{ selectedVisitDiagonsis }}</td>
            </tr>
            <tr
              v-show="
                selectedVisitDescription && selectedVisitDescription.length
              "
            >
              <td>{{ $t("Description") }}</td>
              <td>{{ selectedVisitDescription }}</td>
            </tr>
            <tr
              v-show="
                selectedVisitRecommnedations &&
                selectedVisitRecommnedations.length
              "
            >
              <td>
                {{ $t("Recommendations") }}
              </td>
              <td>{{ selectedVisitRecommnedations }}</td>
            </tr>
            <tr
              v-for="(file, index) in JSON.parse(record.data).files"
              :key="index"
            >
              <td>
                <a :href="download(file.file)" target="_blank">
                  {{ $t("Download attached file") }}
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
const { mapGetters: Getters_doctors } = createNamespacedHelpers("doctors");

export default {
  name: "ClinicalRecordView",
  props: {
    value: Boolean,
    record: {
      type: Object,
      default: () => {},
    },titleArray: [],
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
    ...Getters_doctors(["getDoctorName", "getDoctorSpecialty"]),
    diagnosis() {
      let data = JSON.parse(this.record.data);
      
      if (data && data.diagnosis) return data.diagnosis;
      return data.diagnos;
    },
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    selectedVisitDiagonsis() {
      return this.diagnosis.diagnos;
    },
    selectedVisitDescription() {
      return this.diagnosis && this.diagnosis.description;
    },
    selectedVisitRecommnedations() {
      return this.diagnosis && this.diagnosis.recomendations;
    },
    selectedVisitCreatedDate() {
      return (
        this.diagnosis &&
        this.diagnosis.createdAt &&
        dayjs(this.diagnosis.createdAt).format("YYYY-DD-MM")
      );
    },
  },
};
</script>