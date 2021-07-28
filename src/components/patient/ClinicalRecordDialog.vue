<template>
  <div>
    <v-dialog
      :value="dialog"
      @input="clinicalRecordReset"
      hide-overlay
      fullscreen
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="clinicalRecordReset">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ getDoctorTranslation("Add clinical record") }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              :disabled="isInvalid"
              dark
              text
              @click="addClinicalRecordHandler"
            >
              {{ getCommonTranslation("Save") }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <form @submit.prevent="addClinicalRecordHandler" class="pa-5">
          <div class="mb-4">
            <p class="ma-0">{{ getCommonTranslation("Diagnosis") }} *</p>
            <v-text-field
              outlined
              dense
              hide-details
              v-model="clinicalRecord.diagnos"
            ></v-text-field>
          </div>
          <div class="mb-4">
            <p class="ma-0">{{ getCommonTranslation("Description") }}</p>
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
            <p class="ma-0">{{ getCommonTranslation("Recommendations") }}</p>
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
              :label="
                i === 1
                  ? getCommonTranslation('Initial visit')
                  : getCommonTranslation('Secondary visit')
              "
              :value="i"
              :disabled="i === 2 && initialVisits && !initialVisits.length"
            ></v-radio>
          </v-radio-group>
          <v-checkbox
            v-model="treatmentFinished"
            :label="getDoctorTranslation('Treatment complete')"
          ></v-checkbox>
        </form>
      </v-card>
    </v-dialog>

    <!-- выбор вторичного посещения для первичного -->
    <v-dialog v-model="clinicalRecordDialog" persistent :max-width="600">
      <v-card :max-height="300">
        <v-card-title
          style="position: sticky; top: 0; background-color: #fff; z-index: 1;"
          >{{ getDoctorTranslation("Choose initial visit") }}</v-card-title
        >
        <v-list>
          <v-list-item
            v-for="event in initialVisits"
            :key="event.id"
            @click="
              clinicalRecord.initialVisitId = event.id;
              clinicalRecordDialog = false;
            "
          >
            {{ JSON.parse(event.data).diagnos }}
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("patients");
const { mapGetters: Getters_lang } = createNamespacedHelpers("lang");

export default {
  name: "ClinicalRecordDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      clinicalRecord: {
        type_id: 1,
        diagnos: "",
        description: "",
        recomendations: "",
        initialVisitId: null,
      },
      treatmentFinished: false,
      clinicalRecordDialog: false,
    };
  },
  computed: {
    ...mapState(["selectedPatientClinicalRecords"]),
    ...Getters_lang(["getDoctorTranslation", "getCommonTranslation"]),
    initialVisits() {
      return (
        this.selectedPatientClinicalRecords &&
        this.selectedPatientClinicalRecords.filter(
          (record) =>
            record.type_id === 1 && !JSON.parse(record.data).initialVisitId
        )
      );
    },
    isInvalid() {
      return !this.clinicalRecord.diagnos.length;
    },
  },
  watch: {
    "clinicalRecord.type_id"(val) {
      if (val === 2) {
        this.clinicalRecordDialog = true;
      } else {
        this.clinicalRecord.initialVisitId = null;
      }
    },
  },
  methods: {
    ...mapActions(["addClinicalRecord"]),
    addClinicalRecordHandler() {
      this.$emit("clinicalRecordReset");
      const data = {
        diagnos: this.clinicalRecord.diagnos,
        description: this.clinicalRecord.description,
        recomendations: this.clinicalRecord.recomendations,
      };
      if (this.clinicalRecord.type_id === 2) {
        data.initialVisitId = this.clinicalRecord.initialVisitId;
      }
      const payload = {
        patient_id: Number(this.$route.params.id),
        type_id: this.clinicalRecord.type_id,
        status_id: 1,
        data: JSON.stringify(data),
        treatmentFinished: this.treatmentFinished,
      };
      this.addClinicalRecord(payload);
      this.clinicalRecord.type_id = 1;
      this.clinicalRecord.initialVisitId = null;
      this.clinicalRecord.diagnos = "";
      this.clinicalRecord.description = "";
      this.clinicalRecord.recomendations = "";
      this.treatmentFinished = false;
    },
    clinicalRecordReset() {
      this.$emit("clinicalRecordReset");
      this.clinicalRecord.type_id = 1;
      this.clinicalRecord.diagnos = "";
      this.clinicalRecord.description = "";
      this.clinicalRecord.recomendations = "";
      this.clinicalRecord.initialVisitId = null;
    },
  },
};
</script>

<style></style>
