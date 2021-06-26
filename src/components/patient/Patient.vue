<template>
  <v-container fluid class='patient-container'>
    <div
      v-show="$vuetify.breakpoint.smAndDown"
      class="mb-3"
      @click="drawer = true"
      style="cursor: pointer;"
    >
      <v-icon>
        mdi-account-box
      </v-icon>
      показать данные пациента
    </div>
    <v-row>
      <v-col v-show="$vuetify.breakpoint.mdAndUp" cols="3">
        <v-card
          class="pa-3 pb-0 mb-1 d-flex flex-column"
          :elevation="0"
          rounded="0"
        >
          <div class="d-flex mb-4 align-items-center">
            <v-avatar
              rounded="circle"
              size="36"
              class="mr-3"
              color="rgb(80, 49, 101)"
            >
              <v-img
                v-if="selectedPatient && selectedPatient.photo"
              ></v-img>
              <v-icon v-else color="white">mdi-account</v-icon>
            </v-avatar>
            <v-card-text class="pa-0 d-flex">
              {{ (selectedPatient && selectedPatient.name) || "Имя пациента" }}
              <br />
            </v-card-text>
          </div>

          <!-- <v-list class="pa-0 mb-4 user-actions__list d-flex">
            <v-list-item
              v-for="icon in patientActions"
              :key="icon"
              class="py-1 px-2 user-actions__item"
            >
              <v-icon size="17" v-text="icon" color="white"></v-icon>
            </v-list-item>
          </v-list> -->

          <v-btn
            :ripple="false"
            class="mx-n3 expand-actions"
            tile
            @click="patientLinksList = !patientLinksList"
          >
            <v-icon class="mx-auto expand-icon">{{
              patientLinksList ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
          </v-btn>
        </v-card>
        <v-list v-show="patientLinksList" class="patient-links__list pa-0">
          <v-list-item
            v-for="link in patientLinks"
            :key="link.id"
            :ripple="false"
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
        <v-card
          class="pa-3 pb-0 mb-1 d-flex flex-column"
          :elevation="0"
          rounded="0"
        >
          <div class="d-flex mb-4 align-items-center">
            <v-avatar
              rounded="circle"
              size="36"
              class="mr-3"
              color="rgb(80, 49, 101)"
            >
              <v-img
                v-if="selectedPatient && selectedPatient.photo"
              ></v-img>
              <v-icon v-else color="white">mdi-account</v-icon>
            </v-avatar>
            <v-card-text class="pa-0 d-flex">
              {{ (selectedPatient && selectedPatient.name) || "Имя пациента" }}
              <br />
            </v-card-text>
          </div>

          <!-- <v-list class="pa-0 mb-4 user-actions__list d-flex">
            <v-list-item
              v-for="icon in patientActions"
              :key="icon"
              class="py-1 px-2 user-actions__item"
            >
              <v-icon size="17" v-text="icon" color="white"></v-icon>
            </v-list-item>
          </v-list> -->

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
        </v-card>
      </v-navigation-drawer>
      <v-col cols="12" md="9">
        <v-card :elevation="0" rounded="0">
          <v-container>
            <v-row>
              <v-col v-show="getActiveLink === 'Анамнез'">
                <h3>Анамнез</h3>
                <v-divider class="mb-2"></v-divider>
                <div
                  v-if="
                    selectedPatient &&
                      selectedPatient.anamnesis.complaints.length
                  "
                  class="pb-3"
                >
                  <h4>Жалобы</h4>
                  <ul>
                    <li
                      v-for="(item, index) in showAllComplaints
                        ? selectedPatient.anamnesis.complaints
                        : selectedPatient.anamnesis.complaints.slice(0, 3)"
                      :key="index"
                    >
                      {{ item.body }}
                      <span style="white-space: nowrap;"
                        >({{ item.created }} - {{ item.doctor }})</span
                      >
                    </li>
                    <li
                      v-show="
                        selectedPatient.anamnesis.complaints.length >= 3 &&
                          !showAllComplaints
                      "
                      @click="showAllComplaints = true"
                      style="list-style: none; text-decoration: underline; cursor: pointer;"
                    >
                      показать ещё
                    </li>
                  </ul>
                  <v-divider class="mb-2"></v-divider>
                </div>
                <div
                  v-if="
                    selectedPatient &&
                      selectedPatient.anamnesis.drugs_taken.length
                  "
                  class="pb-3"
                >
                  <h4>
                    Принимаемые препараты
                  </h4>
                  <ul>
                    <li
                      v-for="(item, index) in showAllDrugsTaken
                        ? selectedPatient.anamnesis.drugs_taken
                        : selectedPatient.anamnesis.drugs_taken.slice(0, 3)"
                      :key="index"
                    >
                      {{ item.body }}
                      <span style="white-space: nowrap;"
                        >({{ item.created }} - {{ item.doctor }})</span
                      >
                    </li>
                    <li
                      v-show="
                        selectedPatient.anamnesis.drugs_taken.length >= 3 &&
                          !showAllDrugsTaken
                      "
                      @click="showAllDrugsTaken = true"
                      style="list-style: none; text-decoration: underline; cursor: pointer;"
                    >
                      показать ещё
                    </li>
                  </ul>
                  <v-divider class="mb-2"></v-divider>
                </div>
                <div
                  v-if="
                    selectedPatient &&
                      selectedPatient.anamnesis.allergies.length
                  "
                  class="pb-3"
                >
                  <h4>
                    Аллергии
                  </h4>
                  <ul>
                    <li
                      v-for="(item, index) in showAllAllergies
                        ? selectedPatient.anamnesis.allergies
                        : selectedPatient.anamnesis.allergies.slice(0, 3)"
                      :key="index"
                    >
                      {{ item.body }}
                      <span style="white-space: nowrap;"
                        >({{ item.created }} - {{ item.doctor }})</span
                      >
                    </li>
                    <li
                      v-show="
                        selectedPatient.anamnesis.allergies.length > 3 &&
                          !showAllAllergies
                      "
                      @click="showAllAllergies = true"
                      style="list-style: none; text-decoration: underline; cursor: pointer;"
                    >
                      показать ещё
                    </li>
                  </ul>
                </div>
              </v-col>
              <v-col v-show="getActiveLink === 'Документы'">
                <h3>Документы</h3>
              </v-col>
              <v-col v-show="getActiveLink === 'История посещений'">
                <h3>История посещений</h3>
                <v-divider class="mt-1 mb-3"></v-divider>
                <div class="records__list">
                  <v-card
                    v-for="event in selectedPatientClinicalRecords"
                    :key="event.id"
                    :ripple="false"
                    outlined
                  >
                    <v-simple-table>
                      <template v-slot:default>
                        <tbody>
                          <tr>
                            <td class="table-title">Запись №</td>
                            <td>{{ event.id }}</td>
                          </tr>
                          <tr>
                            <td class="table-title">Диагноз</td>
                            <td>{{ JSON.parse(event.data).diagnos }}</td>
                          </tr>
                          <tr>
                            <td class="table-title">Описание</td>
                            <td>
                              {{ JSON.parse(event.data).description }}
                            </td>
                          </tr>
                          <tr>
                            <td class="table-title">Рекомендации</td>
                            <td>
                              {{ JSON.parse(event.data).recomendations }}
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card>
                </div>
              </v-col>
              <v-col v-show="getActiveLink === 'Загруженные файлы'">
                <h3>Загруженные файлы</h3>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <v-card></v-card>
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
          <span>Добавить запись в историю посещения</span>
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
          <span>Дополнить анамнез</span>
        </v-tooltip>
      </v-speed-dial>
      <!-- дополнить анамнез -->
      <v-dialog v-model="addAnamnesisDialog" hide-overlay fullscreen>
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="addAnamnesisDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>
              Дополнить анамнез
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="addAnamnesisHandler">
                Сохранить
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <form @submit.prevent="addAnamnesisHandler" class="pa-5">
            <div class="mb-4">
              <p class="ma-0">Жалобы</p>
              <v-textarea
                no-resize
                auto-grow
                outlined
                rows="3"
                hide-details
                v-model="anamnesis.complaints"
              ></v-textarea>
            </div>
            <div class="mb-4">
              <p class="ma-0">Принимаемые препараты</p>
              <v-textarea
                no-resize
                auto-grow
                outlined
                rows="3"
                hide-details
                v-model="anamnesis.drugs_taken"
              ></v-textarea>
            </div>
            <div>
              <p class="ma-0">Аллергии</p>
              <v-textarea
                no-resize
                auto-grow
                outlined
                rows="3"
                hide-details
                v-model="anamnesis.allergies"
              ></v-textarea>
            </div>
          </form>
        </v-card>
      </v-dialog>

      <!-- добавить запись в историю посещений -->
      <v-dialog v-model="addClinicalRecordDialog" hide-overlay fullscreen>
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="addClinicalRecordDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>
              Добавить запись в историю посещений
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark text @click="addClinicalRecordHandler">
                Сохранить
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <form @submit.prevent="addClinicalRecordHandler" class="pa-5">
            <div class="mb-4">
              <p class="ma-0">Диагноз</p>
              <v-textarea
                no-resize
                auto-grow
                outlined
                rows="3"
                hide-details
                v-model="clinicalRecord.diagnos"
              ></v-textarea>
            </div>
            <div class="mb-4">
              <p class="ma-0">Описание</p>
              <v-textarea
                no-resize
                auto-grow
                outlined
                rows="3"
                hide-details
                v-model="clinicalRecord.description"
              ></v-textarea>
            </div>
            <div class="mb-4">
              <p class="ma-0">Рекомендации</p>
              <v-textarea
                no-resize
                auto-grow
                outlined
                rows="3"
                hide-details
                v-model="clinicalRecord.recomendations"
              ></v-textarea>
            </div>
            <v-radio-group v-model="clinicalRecord.type_id">
              <v-radio
                v-for="i in 2"
                :key="i"
                :label="i === 1 ? 'Первичное посещение' : 'Вторичное посещение'"
                :value="i"
              ></v-radio>
            </v-radio-group>
            <v-checkbox
              v-model="treatmentFinished"
              label="Лечение по диагнозу завершено"
            ></v-checkbox>
          </form>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import dayjs from "dayjs";
const { mapState, mapActions } = createNamespacedHelpers("patients");
const { mapState: State_auth } = createNamespacedHelpers("auth");
export default {
  data() {
    return {
      patientActions: ["mdi-phone", "mdi-video", "mdi-message", "mdi-email"],
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
      patientLinksList: false,
      activeView: "",
      drawer: false,
      addAnamnesisDialog: false,
      anamnesis: {
        complaints: "",
        drugs_taken: "",
        allergies: "",
      },
      addClinicalRecordDialog: false,
      clinicalRecord: {
        type_id: 1,
        diagnos: "",
        description: "",
        recomendations: "",
      },
      fab: false,
      treatmentFinished: false,

      showAllComplaints: false,
      showAllDrugsTaken: false,
      showAllAllergies: false,
    };
  },
  computed: {
    ...mapState(["selectedPatient", "selectedPatientClinicalRecords"]),
    ...State_auth(["doctorProfile", "userProfile"]),
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
          if (event.doctor_id === event2.doctor_id) {
            event.second_appointments.push(event2);
          }
        });
        result_array.push(event);
      });
      return result_array;
    },
  },
  methods: {
    ...mapActions([
      "fetchSelectedPatient",
      "addAnamnesis",
      "addClinicalRecord",
      "fetchPatientClinicalRecordsById",
    ]),
    changeActiveView(id) {
      this.patientLinks.map((link) => {
        link.active = false;
        if (link.id === id) {
          link.active = true;
        }
      });
      this.drawer = false;
    },
    addAnamnesisHandler() {
      this.addAnamnesisDialog = false;
      const anamnesis = {
        complaints: [...this.selectedPatient.anamnesis.complaints],
        drugs_taken: [...this.selectedPatient.anamnesis.drugs_taken],
        allergies: [...this.selectedPatient.anamnesis.allergies],
      };
      if (this.anamnesis.complaints.length) {
        anamnesis.complaints.unshift({
          body: this.anamnesis.complaints,
          doctor: this.doctorProfile.name,
          doctor_id: this.userProfile.doctor_id,
          created: dayjs().format("DD-MM-YYYY"),
        });
      }

      if (this.anamnesis.drugs_taken.length) {
        anamnesis.drugs_taken.unshift({
          body: this.anamnesis.drugs_taken,
          doctor: this.doctorProfile.name,
          doctor_id: this.userProfile.doctor_id,
          created: dayjs().format("DD-MM-YYYY"),
        });
      }

      if (this.anamnesis.allergies.length) {
        anamnesis.allergies.unshift({
          body: this.anamnesis.allergies,
          doctor: this.doctorProfile.name,
          doctor_id: this.userProfile.doctor_id,
          created: dayjs().format("DD-MM-YYYY"),
        });
      }

      this.addAnamnesis({
        id: this.$route.params.id,
        anamnesis: JSON.stringify(anamnesis),
      });

      this.anamnesis.complaints = "";
      this.anamnesis.drugs_taken = "";
      this.anamnesis.allergies = "";
    },
    addClinicalRecordHandler() {
      this.addClinicalRecordDialog = false;
      const data = {
        diagnos: this.clinicalRecord.diagnos,
        description: this.clinicalRecord.description,
        recomendations: this.clinicalRecord.recomendations,
      };
      const payload = {
        patient_id: Number(this.$route.params.id),
        type_id: this.clinicalRecord.type_id,
        status_id: 1,
        data: JSON.stringify(data),
        treatmentFinished: this.treatmentFinished,
      };
      this.addClinicalRecord(payload);
      this.clinicalRecord.type_id = 1;
      this.clinicalRecord.diagnos = "";
      this.clinicalRecord.description = "";
      this.clinicalRecord.recomendations = "";
      this.treatmentFinished = false;
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

.user-actions__list {
  width: 85%;
  margin: 0 auto;
  justify-content: space-between;
}

.table-title {
  width: 20%;
}
.user-actions__item {
  &:not(:last-child) {
    margin-right: 10px;
  }
  border-radius: 5px;
  width: fit-content;
  flex: unset;
  min-height: unset;
  background-color: rgb(14, 98, 154);
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
</style>
