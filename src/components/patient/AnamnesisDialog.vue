<template>
  <v-dialog :value="dialog" @input="anamnesisReset" hide-overlay fullscreen>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="anamnesisReset">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ getDoctorTranslation("Add anamnesis") }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="addAnamnesisHandler">
            {{ getCommonTranslation("Save") }}
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <div class="pa-5">
        <v-expansion-panels focusable>
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ getCommonTranslation("Complaints") }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-text-field
                :label="getCommonTranslation('Complaints')"
                v-model="generalAnamnesis['Complaints']"
              ></v-text-field>
              <v-text-field
                :label="getCommonTranslation('Drugs taken')"
                v-model="generalAnamnesis['Drugs taken']"
              ></v-text-field>
              <v-text-field
                :label="getCommonTranslation('Allergies')"
                v-model="generalAnamnesis['Allergies']"
              ></v-text-field>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ getCommonTranslation("Life anamnesis") }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-text-field
                :label="getCommonTranslation('Chronic diseases')"
                v-model="lifeAnamnesis['Chronic diseases']"
              ></v-text-field>
              <v-text-field
                :label="getCommonTranslation('Injuries')"
                v-model="lifeAnamnesis['Injuries']"
              ></v-text-field>
              <v-text-field
                :label="getCommonTranslation('Operations')"
                v-model="lifeAnamnesis['Operations']"
              ></v-text-field>
              <v-text-field
                :label="getCommonTranslation('Bad habits')"
                v-model="lifeAnamnesis['Bad habits']"
              ></v-text-field>
              <v-text-field
                :label="getCommonTranslation('Blood transfusion')"
                v-model="lifeAnamnesis['Blood transfusion']"
              ></v-text-field>
              <v-text-field
                :label="getCommonTranslation('Heredity')"
                v-model="lifeAnamnesis['Heredity']"
              ></v-text-field>
              <v-text-field
                :label="getCommonTranslation('Medications')"
                v-model="lifeAnamnesis['Medications']"
              ></v-text-field>
              <v-text-field
                :label="getCommonTranslation('Diet')"
                v-model="lifeAnamnesis['Diet']"
              ></v-text-field>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ getCommonTranslation("Allergic anamnesis") }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-text-field
                :label="
                  getCommonTranslation('Allergies to medicinal substances')
                "
                v-model="allergicAnamnesis['Allergies to medicinal substances']"
              ></v-text-field>
              <v-text-field
                :label="getCommonTranslation('Food allergy')"
                v-model="allergicAnamnesis['Food allergy']"
              ></v-text-field>
              <v-text-field
                :label="getCommonTranslation('Household allergies')"
                v-model="allergicAnamnesis['Household allergies']"
              ></v-text-field>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ getCommonTranslation("Objective anamnesis") }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-text-field
                :label="getCommonTranslation('General anamnesis')"
                v-model="objectiveAnamnesis['General anamnesis']"
              ></v-text-field>
              <v-text-field
                :label="getCommonTranslation('Local anamnesis')"
                v-model="objectiveAnamnesis['Local anamnesis']"
              ></v-text-field>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>{{
              getCommonTranslation("Surveys")
            }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-text-field
                :label="getCommonTranslation('Laboratory surveys')"
                v-model="surveys['Laboratory surveys']"
              ></v-text-field>
              <v-text-field
                :label="
                  getCommonTranslation('Hardware and instrumental surveys')
                "
                v-model="surveys['Hardware and instrumental surveys']"
              ></v-text-field>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import dayjs from "dayjs";

const { mapState, mapActions } = createNamespacedHelpers("patients");
const { mapState: State_auth } = createNamespacedHelpers("auth");
const { mapGetters: Getters_lang } = createNamespacedHelpers("lang");

export default {
  name: "AnamnesisDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      generalAnamnesis: {
        Complaints: "",
        "Drugs taken": "",
        Allergies: "",
      },
      lifeAnamnesis: {
        "Chronic diseases": "",
        Injuries: "",
        Operations: "",
        "Bad habits": "",
        "Blood transfusion": "",
        Heredity: "",
        Medications: "",
        Diet: "",
      },
      allergicAnamnesis: {
        "Allergies to medicinal substances": "",
        "Food allergy": "",
        "Household allergies": "",
      },
      objectiveAnamnesis: {
        "General anamnesis": "",
        "Local anamnesis": "",
      },
      surveys: {
        ["Laboratory surveys"]: "",
        ["Hardware and instrumental surveys"]: "",
      },
    };
  },
  computed: {
    ...mapState(["selectedPatient"]),
    ...State_auth(["doctorProfile", "userProfile"]),
    ...Getters_lang(["getDoctorTranslation", "getCommonTranslation"]),
    createGeneralAnamnesis() {
      const generalAnamnesis = {
        Complaints: [
          ...this.selectedPatient.anamnesis.generalAnamnesis["Complaints"],
        ],
        "Drugs taken": [
          ...this.selectedPatient.anamnesis.generalAnamnesis["Drugs taken"],
        ],
        Allergies: [
          ...this.selectedPatient.anamnesis.generalAnamnesis["Allergies"],
        ],
      };
      this.fillResultObject(this.generalAnamnesis, generalAnamnesis);
      return generalAnamnesis;
    },
    createLifeAnamnesis() {
      const lifeAnamnesis = {
        "Chronic diseases": [
          ...this.selectedPatient.anamnesis.lifeAnamnesis["Chronic diseases"],
        ],
        Injuries: [...this.selectedPatient.anamnesis.lifeAnamnesis["Injuries"]],
        Operations: [
          ...this.selectedPatient.anamnesis.lifeAnamnesis["Operations"],
        ],
        "Bad habits": [
          ...this.selectedPatient.anamnesis.lifeAnamnesis["Bad habits"],
        ],
        "Blood transfusion": [
          ...this.selectedPatient.anamnesis.lifeAnamnesis["Blood transfusion"],
        ],
        Heredity: [...this.selectedPatient.anamnesis.lifeAnamnesis["Heredity"]],
        Medications: [
          ...this.selectedPatient.anamnesis.lifeAnamnesis["Medications"],
        ],
        Diet: [...this.selectedPatient.anamnesis.lifeAnamnesis["Diet"]],
      };
      this.fillResultObject(this.lifeAnamnesis, lifeAnamnesis);
      return lifeAnamnesis;
    },
    createAllergicAnamnesis() {
      const allergicAnamnesis = {
        "Allergies to medicinal substances": [
          ...this.selectedPatient.anamnesis.allergicAnamnesis[
            "Allergies to medicinal substances"
          ],
        ],
        "Food allergy": [
          ...this.selectedPatient.anamnesis.allergicAnamnesis["Food allergy"],
        ],
        "Household allergies": [
          ...this.selectedPatient.anamnesis.allergicAnamnesis[
            "Household allergies"
          ],
        ],
      };
      this.fillResultObject(this.allergicAnamnesis, allergicAnamnesis);
      return allergicAnamnesis;
    },
    createObjectiveAnamnesis() {
      const objectiveAnamnesis = {
        "General anamnesis": [
          ...this.selectedPatient.anamnesis.objectiveAnamnesis[
            "General anamnesis"
          ],
        ],
        "Local anamnesis": [
          ...this.selectedPatient.anamnesis.objectiveAnamnesis[
            "Local anamnesis"
          ],
        ],
      };
      this.fillResultObject(this.objectiveAnamnesis, objectiveAnamnesis);
      return objectiveAnamnesis;
    },
    createSurveys() {
      const surveys = {
        "Laboratory surveys": [
          ...this.selectedPatient.anamnesis.surveys["Laboratory surveys"],
        ],
        "Hardware and instrumental surveys": [
          ...this.selectedPatient.anamnesis.surveys[
            "Hardware and instrumental surveys"
          ],
        ],
      };
      this.fillResultObject(this.surveys, surveys);
      return surveys;
    },
  },
  methods: {
    ...mapActions(["addAnamnesis"]),

    addAnamnesisHandler() {
      const generalAnamnesis = this.createGeneralAnamnesis;

      const lifeAnamnesis = this.createLifeAnamnesis;

      const allergicAnamnesis = this.createAllergicAnamnesis;

      const objectiveAnamnesis = this.createObjectiveAnamnesis;

      const surveys = this.createSurveys;

      const anamnesis = {
        generalAnamnesis,
        lifeAnamnesis,
        allergicAnamnesis,
        objectiveAnamnesis,
        surveys,
      };
      this.addAnamnesis({
        id: this.$route.params.id,
        anamnesis: JSON.stringify(anamnesis),
      });
      this.anamnesisReset();
    },
    anamnesisReset() {
      this.$emit("anamnesisReset");
      const anamnesisSections = {
        generalAnamnesis: this.generalAnamnesis,
        lifeAnamnesis: this.lifeAnamnesis,
        allergicAnamnesis: this.allergicAnamnesis,
        objectiveAnamnesis: this.objectiveAnamnesis,
        surveys: this.surveys,
      };

      for (let key in anamnesisSections) {
        for (let innerKey in anamnesisSections[key]) {
          anamnesisSections[key][innerKey] = "";
        }
      }
    },
    fillResultObject(modelObject, resultObject) {
      for (let key in modelObject) {
        if (modelObject[key].length) {
          resultObject[key].unshift({
            body: modelObject[key],
            doctor: this.doctorProfile.name,
            doctor_id: this.userProfile.doctor_id,
            created: dayjs().format("DD.MM.YYYY"),
          });
        }
      }
    },
  },
};
</script>

<style></style>
