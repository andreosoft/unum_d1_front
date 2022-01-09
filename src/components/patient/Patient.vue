<template>
  <v-container fluid class="patient-container">
    <div
      v-show="$vuetify.breakpoint.smAndDown"
      class="mb-3 cursor-pointer"
      @click="drawer = true"
    >
      <v-icon> mdi-account-box </v-icon>
      {{ $t("Show patient info") }}
    </div>
    <v-row>
      <v-col v-show="$vuetify.breakpoint.mdAndUp" cols="3">
        <PatientAvatarAndName />
        <PatientInfo
          v-if="!loading"
          :patient="patient"
          :records="records"
          :fAnamnesis="formAnamnesis"
        />
        <portal portal to="toolbar-action">
          <v-menu
            bottom
            offset-y
            transition="scale-transition"
            origin="center center"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon large v-bind="attrs" v-on="on">mdi-school-outline</v-icon>
            </template>
            <v-list>
              <v-list-item v-for="el in videoList" :key="el">
                <v-list-item-title> {{ el }} </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </portal>
      </v-col>

      <v-navigation-drawer
        v-if="$vuetify.breakpoint.smAndDown"
        v-model="drawer"
        app
      >
        <PatientAvatarAndName />
        <PatientInfo
          v-if="!loading"
          :patient="patient"
          :records="records"
          :fAnamnesis="formAnamnesis"
        />
        <v-btn @click="testClick">video</v-btn>
      </v-navigation-drawer>
      <v-col cols="12" md="9">
        <v-card :elevation="0" rounded="0">
          <v-container>
            <v-tabs v-model="tab" center-active>
              <v-tab v-for="tab in tabs" :key="tab.id" :disabled="tab.disabled">
                {{ $t(tab.title) }}
              </v-tab>
            </v-tabs>
            <v-layout
              column
              class="fill-height"
              style="height: 82vh !important"
            >
              <v-flex class="flex overflow-auto">
                <v-tabs-items v-model="tab">
                  <v-tab-item>
                    <v-card-text>
                      <v-divider class="mt-1 mb-3"></v-divider>
                      <PatientTabAnamnesis
                        :formA="formAnamnesis"
                        :titleArray="titleArray"
                      />
                    </v-card-text>
                  </v-tab-item>
                  <v-tab-item>
                    <v-col>
                      <v-divider class="mt-1 mb-3"></v-divider>
                      <PatientTabClinicalRecords
                        :records="formattedClinicalRecords2"
                        :titleArray="titleArray"
                      />
                    </v-col>
                  </v-tab-item>
                  <v-tab-item>
                    <v-col>
                      <v-divider class="mt-1 mb-3"></v-divider>
                    </v-col>
                  </v-tab-item>
                  <v-tab-item>
                    <v-col>
                      <PatientTabFiles
                        :records="records"
                        :titleArray="titleArray"
                      />
                    </v-col>
                  </v-tab-item>
                </v-tabs-items>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-col>

      <v-fab-transition>
        <v-btn
          v-if="!$vuetify.breakpoint.smAndDown"
          fab
          small
          dark
          color="green"
          bottom
          right
          class="v-btn--example"
          @click="NewVisitDialog = true"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
      <NewVisitRecord
        v-model="NewVisitDialog"
        v-if="NewVisitDialog"
        :fAnamnesis="formAnamnesis"
      />
      <portal to="v-main">
        <video-dialog
          v-if="showVideoDialog"
          v-model="showVideoDialog"
          :Id="idVideo"
        ></video-dialog>
      </portal>
    </v-row>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

//import ClinicalRecordDialog from "./ClinicalRecordDialog.vue";
import PatientTabAnamnesis from "./tab/PatientTabAnamnesis";
import PatientTabFiles from "./tab/PatientTabFiles";
import PatientTabClinicalRecords from "./tab/PatientTabClinicalRecords";
import PatientAvatarAndName from "./PatientAvatarAndName";
import NewVisitRecord from "./dialog/NewVisitRecord";
import { models, buildObjects } from "./mixings";
import VideoDialog from "../video/videoDialog.vue";
const { mapState, mapActions } = createNamespacedHelpers("patients");
const { mapGetters: Getters_doctors } = createNamespacedHelpers("doctors");
export default {
  mixins: [models, buildObjects],
  name: "Patient",
  components: {
    // ClinicalRecordDialog,
    PatientInfo: () => import("./PatientInfo.vue"),
    NewVisitRecord,
    PatientTabAnamnesis,
    PatientTabClinicalRecords,
    PatientTabFiles,
    PatientAvatarAndName,
    VideoDialog,
  },
  data() {
    return {
      showVideoDialog: false,
      videoList: [
        "Обучающее видео 1",
        "Обучающее видео 2",
        "Обучающее видео 3",
      ],
      idVideo: "",
      tab: 0,
      x: 0,
      y: 0,
      panels: null,
      tabs: [
        {
          name: "Anamnesis",
          title: "Anamnesis",
          active: true,
          id: 1,
          disabled: false,
        },
        {
          name: "ClinicalRecords",
          title: "Clinical records",
          active: false,
          id: 2,
          disabled: false,
        },
        {
          name: "Documents",
          title: "Documents",
          active: false,
          id: 3,
          disabled: true,
        },
        {
          name: "Files",
          title: "Uploaded files",
          active: false,
          id: 4,
          disabled: false,
        },
      ],
      drawer: false,
      NewVisitDialog: false,
      addAnamnesisDialog: false,
      addClinicalRecordDialog: false,

      fab: false,
      showAllComplaints: false,
      showAllDrugsTaken: false,
      showAllAllergies: false,
      loading: true,
    };
  },
  computed: {
    ...mapState(["selectedPatient", "selectedPatientClinicalRecords"]),
    ...Getters_doctors(["getDoctorName", "getDoctorSpecialty"]),

    getActiveLink() {
      const activeTab = this.tabs.find((tab) => tab.active);
      return activeTab.id;
    },
    patient() {
      return this.selectedPatient;
    },
    records() {
      return this.selectedPatientClinicalRecords;
    },
    formattedClinicalRecords2() {
      const first_appointments = [];
      const second_appointments = [];
      const result_array = [];
      this.records &&
        this.records.map((event) => {
          if (event.type_id === 1) {
            first_appointments.push(event);
          } else if (event.type_id === 2) {
            second_appointments.push(event);
          }
        });
      first_appointments.map((event) => {
        event.second_appointments = [];
        event.name =
          JSON.parse(event.data)?.diagnosis?.diagnos ||
          JSON.parse(event.data)?.diagnos ||
          "";
        event.children = [];
        second_appointments.map((event2) => {
          let parent_id = event2.parent_id;
          let objDiagnos = JSON.parse(event2.data);
          if (event.id === parent_id) {
            event2.name =
              objDiagnos?.diagnosis?.diagnos ||
              objDiagnos?.diagnos ||
              event.name;
            event.children.push(event2);
          }
        });
        result_array.push(event);
      });
      return result_array;
    },
    /*
    formAnamnesis() {
      console.log(this.selectedPatient);
      return true;
    },
*/
  },

  watch: {
    common: {
      immediate: true,
      handler(val) {
        this.tabs.map((tab) => {
          tab.title = this.$t(tab.title);
        });
      },
    },
  },
  methods: {
    ...mapActions(["fetchSelectedPatient", "fetchPatientClinicalRecordsById"]),
    testClick(e) {
      //this.$log("showVideoDialog = true", this.showVideoDialog);
      //      this.showVideoDialog = true;
    },

    /*    download(id) {
      return `http://api.neomedy.com/api${api.getFile}/${id}`;
    },
    */
  },
  created() {
    console.log("created patient");
    this.loading = true;

    this.fetchPatientClinicalRecordsById(this.$route.params.id);
    this.fetchSelectedPatient(this.$route.params.id);
  },
  mounted() {},
};
</script>
<style lang="scss">
.clinical-record-view__dialog {
  .v-toolbar__content {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
.new-visit-record__dialog {
  .v-toolbar__content {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
.v-btn--example {
  bottom: 0;
  position: fixed;
  margin: 0 0 16px 16px;
  right: 16px;
}
</style>
<style lang="scss" scoped>
.patient-container {
  background-color: rgb(224, 224, 224);
  height: 100%;
}
.records__list {
  //display: grid;
  //  grid-gap: 20px;
}

.records__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.table-title {
  width: 20%;
}

.patient-links__list {
  background-color: transparent;
}

.patient-links__item {
  &:not(:last-child) {
    margin-bottom: 5px;
  }
  background-color: #fff;
  &.active {
    background-color: rgba(155, 91, 19);
    position: relative;
    &:after {
      content: "";
      position: absolute;
      right: -5px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 24px 0 24px 5px;
      border-color: transparent transparent transparent rgba(155, 91, 19);
    }
  }
}

.expand-actions.v-btn {
  box-shadow: unset;
  height: unset !important;
  &:active {
    box-shadow: unset;
  }
}
.v-expansion-panel--disabled {
  button {
    color: #000;
  }
}
.v-expansion-panel-header > *:not(.v-expansion-panel-header__icon) {
  flex: unset;
}
.v-expansion-panel-header {
  span {
    text-decoration: underline;
  }
}
.v-card__title {
  span {
    font-weight: normal;
  }
}
.record__card {
  cursor: pointer;
  background-color: rgb(220, 220, 220);
}
</style>
