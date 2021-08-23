<template>
  <v-container fluid class="patient-container">
    <div
      v-show="$vuetify.breakpoint.smAndDown"
      class="mb-3 cursor-pointer"
      @click="drawer = true"
    >
      <v-icon>
        mdi-account-box
      </v-icon>
      {{ getCommonTranslation("Show patient info") }}
    </div>
    <v-row>
      <v-col v-show="$vuetify.breakpoint.mdAndUp" cols="3">
        <PatientAvatarAndName />

        <v-list class="patient-links__list pa-0">
          <v-list-item
            v-for="link in computedPatientLinks"
            :key="link.id"
            :ripple="false"
            :dark="link.active"
            :class="[
              {
                active: link.active,
                'd-flex justify-content-between': link.disabled,
              },
              'mb-1 patient-links__item',
            ]"
            @click="changeActiveView(link.id)"
            :disabled="link.disabled"
          >
            {{ link.title }}
          </v-list-item>
        </v-list>
      </v-col>

      <v-navigation-drawer
        v-if="$vuetify.breakpoint.smAndDown"
        v-model="drawer"
        app
      >
        <PatientAvatarAndName>
          <v-list class="patient-links__list pa-0">
            <v-list-item
              v-for="link in patientLinks"
              :key="link.id"
              :ripple="false"
              :dark="link.active"
              :class="[{ active: link.active }, 'mb-1 patient-links__item']"
              @click="changeActiveView(link.id)"
              :disabled="link.disabled"
            >
              {{ link.title }}
            </v-list-item>
          </v-list>
        </PatientAvatarAndName>
      </v-navigation-drawer>
      <v-col cols="12" md="9">
        <v-card :elevation="0" rounded="0">
          <v-container>
            <v-row>
              <v-col
                v-show="getActiveLink === getCommonTranslation('Anamnesis')"
              >
                <h3>
                  {{ getCommonTranslation("Anamnesis") }}
                </h3>
                <v-divider class="mb-2"></v-divider>
                <div v-for="(item, index) in anamnesisKeys" :key="index">
                  <AnamnesisSection
                    v-for="(value, key, index) in selectedPatient &&
                      selectedPatient.anamnesis[item]"
                    :key="index"
                    :array="value"
                    :title="key"
                  />
                </div>
              </v-col>
              <v-col
                v-show="
                  getActiveLink === getCommonTranslation('Clinical records')
                "
              >
                <h3>
                  {{ getCommonTranslation("Clinical records") }}
                </h3>
                <v-divider class="mt-1 mb-3"></v-divider>
                <div class="records__list">
                  <v-expansion-panels v-model="panels">
                    <v-expansion-panel
                      v-for="(record, index) in formattedClinicalRecords"
                      :key="record.id"
                      :disabled="!record.second_appointments.length"
                      style="position: relative;"
                    >
                      <div
                        v-show="!record.second_appointments.length"
                        @click="showVisitDialog(record)"
                        class="cursor-pointer records__overlay"
                      ></div>
                      <v-expansion-panel-header
                        >{{ JSON.parse(record.data).diagnos }} (
                        {{ getDoctorSpecialty(record.doctor_id) }}
                        {{ getDoctorName(record.doctor_id) }})&nbsp;
                        <span
                          v-show="index === panels"
                          @click="showVisitDialog(record)"
                          class="grey--text"
                          >(показать первичную запись)</span
                        >
                      </v-expansion-panel-header>
                      <v-expansion-panel-content
                        v-if="record.second_appointments.length"
                      >
                        <v-card>
                          <v-hover
                            v-for="(event, index) in record.second_appointments"
                            :key="index"
                          >
                            <template v-slot="{ hover }">
                              <div :class="{ record__card: hover }">
                                <v-card-text @click="showVisitDialog(event)">
                                  {{ JSON.parse(event.data).diagnos }}
                                </v-card-text>
                              </div>
                            </template>
                          </v-hover>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                  <v-dialog
                    v-if="selectedVisit"
                    v-model="visitDialog"
                    :max-width="600"
                  >
                    <v-card class="pa-4">
                      <v-card-title class="pa-0">
                        {{ getCommonTranslation("Therapist") }} -&nbsp;
                        <span>
                          {{ getDoctorName(selectedVisit.doctor_id) }}
                        </span>
                      </v-card-title>
                      <v-card-title class="pa-0">
                        {{ getCommonTranslation("Therapist specialty") }}
                        -&nbsp;
                        <span>
                          {{ getDoctorSpecialty(selectedVisit.doctor_id) }}
                        </span>
                      </v-card-title>
                      <v-card-title
                        v-show="selectedVisitCreatedDate"
                        class="pa-0"
                      >
                        {{ getCommonTranslation("Created date") }} -&nbsp;
                        <span>
                          {{ selectedVisitCreatedDate }}
                        </span>
                      </v-card-title>
                      <v-card-title class="pa-0">
                        {{ getCommonTranslation("Diagnosis") }} -&nbsp;
                        <span>{{ selectedVisitDiagonsis }}</span>
                      </v-card-title>
                      <v-card-title
                        v-show="selectedVisitDescription.length"
                        class="pa-0"
                      >
                        {{ getCommonTranslation("Description") }} -&nbsp;
                        <span>{{ selectedVisitDescription }}</span>
                      </v-card-title>
                      <v-card-title
                        v-show="selectedVisitRecommnedations.length"
                        class="pa-0"
                      >
                        {{ getCommonTranslation("Recommendations") }} -&nbsp;
                        <span>{{ selectedVisitRecommnedations }}</span>
                      </v-card-title>
                      <div
                        v-if="
                          JSON.parse(selectedVisit.data).files &&
                            JSON.parse(selectedVisit.data).files.length
                        "
                      >
                        <v-card-actions
                          v-for="(file, index) in JSON.parse(selectedVisit.data)
                            .files"
                          :key="index"
                          class="pa-0 d-flex justify-content-between"
                        >
                          <a :href="download(file.file)" target="_blank">
                            {{ getCommonTranslation("Download attached file") }}
                          </a>
                          {{ file.name }}
                        </v-card-actions>
                      </div>
                    </v-card>
                  </v-dialog>
                </div>
              </v-col>
              <v-col
                v-show="getActiveLink === getCommonTranslation('Documents')"
              >
                <h3>
                  {{ getCommonTranslation("Documents") }}
                </h3>
              </v-col>
              <v-col
                v-show="
                  getActiveLink === getCommonTranslation('Uploaded files')
                "
              >
                <h3>
                  {{ getCommonTranslation("Uploaded files") }}
                </h3>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-speed-dial
        v-model="fab"
        bottom
        right
        fixed
        direction="left"
        transition="scale-transition"
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="blue darken-2" dark fab>
            <v-icon v-if="fab">
              mdi-close
            </v-icon>
            <v-icon v-else>
              mdi-account-circle
            </v-icon>
          </v-btn>
        </template>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              fab
              dark
              small
              color="green"
              @click="addClinicalRecordDialog = true"
            >
              <v-icon>mdi-clipboard</v-icon>
            </v-btn>
          </template>
          <span>
            {{ getDoctorTranslation("Add clinical record") }}
          </span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              fab
              dark
              small
              color="indigo"
              @click="addAnamnesisDialog = true"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>
            {{ getDoctorTranslation("Add anamnesis") }}
          </span>
        </v-tooltip>
      </v-speed-dial>
      <!-- add anamnesis dialog -->
      <AnamnesisDialog
        :dialog="addAnamnesisDialog"
        @anamnesisReset="addAnamnesisDialog = false"
      />

      <!-- add clinical record dialog -->
      <ClinicalRecordDialog
        :dialog="addClinicalRecordDialog"
        @clinicalRecordReset="addClinicalRecordDialog = false"
      />
    </v-row>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import dayjs from "dayjs";
import { api } from "./../../config/index";

import AnamnesisDialog from "./AnamnesisDialog.vue";
import ClinicalRecordDialog from "./ClinicalRecordDialog.vue";
import AnamnesisSection from "./AnamnesisSection";
import AnamnesisSectionItem from "./AnamnesisSectionItem";
import PatientAvatarAndName from "./PatientAvatarAndName";
const { mapState, mapActions } = createNamespacedHelpers("patients");
const { mapGetters: Getters_doctors } = createNamespacedHelpers("doctors");
const { mapGetters: Getters_lang } = createNamespacedHelpers("lang");
export default {
  components: {
    AnamnesisDialog,
    ClinicalRecordDialog,
    AnamnesisSection,
    AnamnesisSectionItem,
    PatientAvatarAndName,
  },
  data() {
    return {
      panels: null,
      patientLinks: [
        {
          title: "Анамнез",
          active: true,
          id: 1,
          disabled: false,
        },
        {
          title: "История посещений",
          active: false,
          id: 3,
          disabled: false,
        },
        {
          title: "Документы",
          active: false,
          id: 2,
          disabled: true,
        },
        {
          title: "Загруженные файлы",
          active: false,
          id: 4,
          disabled: true,
        },
      ],

      drawer: false,

      addAnamnesisDialog: false,
      addClinicalRecordDialog: false,

      fab: false,

      showAllComplaints: false,
      showAllDrugsTaken: false,
      showAllAllergies: false,

      visitDialog: false,
      selectedVisit: null,

      anamnesisKeys: [
        "generalAnamnesis",
        "lifeAnamnesis",
        "allergicAnamnesis",
        "objectiveAnamnesis",
        "surveys",
      ],
    };
  },
  computed: {
    ...mapState(["selectedPatient", "selectedPatientClinicalRecords"]),
    ...Getters_doctors(["getDoctorName", "getDoctorSpecialty"]),
    ...Getters_lang(["getCommonTranslation", "getDoctorTranslation"]),
    getActiveLink() {
      const activeTab = this.patientLinks.find((link) => link.active);
      return activeTab.title;
    },
    formattedClinicalRecords() {
      const first_appointments = [];
      const second_appointments = [];
      this.selectedPatientClinicalRecords &&
        this.selectedPatientClinicalRecords.map((event) => {
          if (event.type_id === 1) {
            first_appointments.push(event);
          } else if (event.type_id === 2) {
            second_appointments.push(event);
          }
        });
      const result_array = [];
      first_appointments.map((event) => {
        event.second_appointments = [];
        second_appointments.map((event2) => {
          if (event.id === JSON.parse(event2.data).initialVisitId) {
            event.second_appointments.push(event2);
          }
        });
        result_array.push(event);
      });
      return result_array;
    },
    computedPatientLinks() {
      this.patientLinks.map((link) => {
        switch (link.title) {
          case "Анамнез":
            link.title = this.getCommonTranslation("Anamnesis");
            break;
          case "История посещений":
            link.title = this.getCommonTranslation("Clinical records");
            break;
          case "Документы":
            link.title = this.getCommonTranslation("Documents");
            break;
          case "Загруженные файлы":
            link.title = this.getCommonTranslation("Uploaded files");
            break;
        }
      });
      return this.patientLinks;
    },
    selectedVisitDiagonsis() {
      return this.selectedVisit && JSON.parse(this.selectedVisit.data).diagnos;
    },
    selectedVisitDescription() {
      return (
        this.selectedVisit && JSON.parse(this.selectedVisit.data).description
      );
    },
    selectedVisitRecommnedations() {
      return (
        this.selectedVisit && JSON.parse(this.selectedVisit.data).recomendations
      );
    },
    selectedVisitCreatedDate() {
      return (
        this.selectedVisit &&
        JSON.parse(this.selectedVisit.data).createdAt &&
        dayjs(JSON.parse(this.selectedVisit.data).createdAt).format(
          "YYYY-DD-MM"
        )
      );
    },
  },
  methods: {
    ...mapActions(["fetchSelectedPatient", "fetchPatientClinicalRecordsById"]),
    changeActiveView(id) {
      this.patientLinks.map((link) => {
        link.active = false;
        if (link.id === id) {
          link.active = true;
        }
      });
      this.drawer = false;
    },
    showVisitDialog(event) {
      this.visitDialog = true;
      this.selectedVisit = event;
    },
    download(id) {
      return `http://api.neomedy.com/api${api.getFile}/${id}`;
    },
  },
  created() {
    this.fetchSelectedPatient(this.$route.params.id);
    this.fetchPatientClinicalRecordsById(this.$route.params.id);
  },
};
</script>

<style lang="scss" scoped>
.patient-container {
  background-color: rgb(224, 224, 224);
  height: 100%;
}
.records__list {
  display: grid;
  grid-gap: 20px;
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
