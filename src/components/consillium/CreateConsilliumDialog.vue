<template>
  <v-dialog :value="dialog" @input="$emit('close')" hide-overlay fullscreen>
    <v-card tile style="overflow: hidden;">
      <v-toolbar color="#F5F5F5" :elevation="0" short>
        <v-toolbar-title>
          <v-icon color="#6A6A6A" @click="$emit('close')">mdi-close</v-icon>
          {{ $_lang_getDoctorTranslation("Create consillium") }}
        </v-toolbar-title>
      </v-toolbar>

      <v-container fluid class="pa-5">
        <v-textarea
          hide-details
          :label="$_lang_getDoctorTranslation('Consillium chat name')"
          dense
          auto-grow
          :rows="1"
          class="mt-0 mb-7"
          v-model="consilliumName"
        ></v-textarea>
        <v-row
          no-gutters
          :class="[
            $vuetify.breakpoint.smAndDown
              ? 'flex-column'
              : 'justify-content-between',
          ]"
          class="mb-7"
        >
          <v-col md="5">
            <v-autocomplete
              :search-input.sync="diagnosisSearch"
              @change="(e) => (provisionalDiagnosis = e)"
              :items="diagnosisItems"
              item-text="name"
              hide-details
              dense
              autocomplete="off"
              @input.native="diagnosisOnInput"
              :label="$_lang_getDoctorTranslation('Provisional diagnosis')"
              @blur="diagnosisItems = []"
              class="mt-0"
              :class="{ 'mb-7': $vuetify.breakpoint.smAndDown }"
            >
            </v-autocomplete>
          </v-col>
          <v-col md="5">
            <v-autocomplete
              prepend-inner-icon="mdi-magnify"
              :items="patients"
              v-model="selectedPatientId"
              item-text="name"
              item-value="id"
              hide-details
              :label="$_lang_getDoctorTranslation('Select a patient')"
              dense
              class="mt-0"
              autocomplete="off"
            >
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-textarea
          hide-details
          :label="$_lang_getDoctorTranslation('Problem description')"
          dense
          auto-grow
          :rows="1"
          class="mt-0 mb-7"
          v-model="problemDescription"
        ></v-textarea>
        <v-row no-gutters class="flex-column">
          <h3 class="ma-0 mb-4">
            {{ $_lang_getDoctorTranslation("Invite") }}
          </h3>

          <!-- 48 -->
          <v-col md="5" class="mb-7">
            <v-autocomplete
              prepend-inner-icon="mdi-magnify"
              :items="getDoctors"
              v-model="invitedPeople"
              item-text="name"
              item-value="user_id"
              hide-details
              :label="$_lang_getCommonTranslation('By name')"
              multiple
              dense
              class="mt-0"
              autocomplete="off"
            >
              <template #selection="data">
                <v-chip
                  v-bind="data.attrs"
                  :input-value="data.selected"
                  close
                  @click="data.select"
                  @click:close="remove(data.item)"
                  color="#406278"
                  dark
                  class="mb-2"
                >
                  <v-avatar left class="pa-0">
                    <v-img
                      :src="
                        data.item.photo
                          ? `${imageSrc(data.item.photo)}?width=100&height=100`
                          : '/images/doctor-placeholder.jpeg'
                      "
                    ></v-img>
                  </v-avatar>
                  {{ data.item.name }}
                </v-chip>
              </template>
              <template #item="data">
                <v-list-item-avatar>
                  <v-img
                    :src="
                      data.item.photo
                        ? `${imageSrc(data.item.photo)}?width=100&height=100`
                        : '/images/doctor-placeholder.jpeg'
                    "
                  ></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ data.item.name }}
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-col>

          <v-row
            no-gutters
            :class="
              $vuetify.breakpoint.smAndDown
                ? 'flex-column'
                : 'justify-content-between'
            "
            class="mb-7"
          >
            <!-- 48 -->
            <v-col md="5" :class="{ 'mb-7': $vuetify.breakpoint.smAndDown }">
              <v-autocomplete
                v-model="doctorsSpecialty"
                :items="specialtyItems"
                item-text="name"
                :label="$_lang_getCommonTranslation('By specialty')"
                dense
                :error-messages="noDoctorsBySpecialty ? $_lang_getCommonTranslation('No doctors with the specialty'): ''"
                class="mb-2"
                autocomplete="off"
                @input.native="doctorsSpecialtyOnInput"
                @blur="() => {
                  specialtyItems = []
                  noDoctorsBySpecialty = false
                }"
                @change="doctorsSpecialtyOnChange"
              >
            </v-autocomplete>
            </v-col>

            <!-- 48 -->
            <v-col md="5">
              <v-select
                hide-details
                :label="$_lang_getCommonTranslation('By language')"
                dense
                class="mt-0"
              ></v-select>
            </v-col>
          </v-row>

          <!-- 48 -->
          <v-col md="4">
            <span
              class="d-flex align-items-center justify-content-between mb-7"
            >
              {{ $_lang_getDoctorTranslation("Urgent consillium") }}
              <v-switch
                class="ml-3 ma-0 pa-0"
                color="#406278"
                :ripple="false"
                hide-details
                v-model="isConsilliumUrgent"
              ></v-switch>
            </span>
          </v-col>

          <!-- 48 -->
          <v-col md="5">
            <v-text-field
              dense
              class="mt-0"
              hide-details
              :label="$_lang_getCommonTranslation('Tags')"
              v-model="tags"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div>
            <v-btn
              class="mr-5 pa-0 px-5"
              text
              color="#406278"
              @click="$emit('close')"
            >
              {{ $_lang_getCommonTranslation("Cancel") }}
            </v-btn>
            <v-btn
              class="pa-0 px-5"
              :text="$vuetify.breakpoint.smAndDown"
              :color="$vuetify.breakpoint.smAndDown ? '#406278' : 'primary'"
              @click="createConsillium"
              :disabled="!consilliumName.length || !invitedPeople.length"
            >
              {{ $_lang_getCommonTranslation("Create") }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("chats");
const { mapActions: Actions_alerts } = createNamespacedHelpers("alerts");
const { mapActions: Actions_doctors } = createNamespacedHelpers("doctors");
const { mapState: State_patients } = createNamespacedHelpers("patients");
const {
  mapState: State_doctors,
  mapGetters: Getters_doctors,
} = createNamespacedHelpers("doctors");
const { mapState: State_auth } = createNamespacedHelpers("auth");
import { lang } from "./../../mixins/lang";
export default {
  mixins: [lang],
  name: "CreateConsilliumDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      invitedPeople: [],
      consilliumName: "",
      provisionalDiagnosis: "",
      problemDescription: "",
      selectedPatientId: null,
      tags: "",
      isConsilliumUrgent: "",
      diagnosisSearch: "",
      diagnosisItems: [],
      doctorsSpecialty: '',
      specialtyItems: [],
      noDoctorsBySpecialty: false
    };
  },
  computed: {
    ...State_doctors(["doctors"]),
    ...Getters_doctors(["imageSrc"]),
    ...State_auth(["userProfile"]),
    ...State_patients(["patients"]),
    getDoctors() {
      return (
        this.doctors &&
        this.doctors.filter((doc) => this.userProfile.id !== doc.user_id)
      );
    },
    computeSelectedPatient() {
      return (
        this.patients &&
        this.patients.find((p) => p.id === this.selectedPatientId)
      );
    },
  },
  methods: {
    ...mapActions([
      "createNewConsiliumChat",
      "addUserToGroupChat",
      "fetchChats",
    ]),
    ...Actions_alerts(["addAlert"]),
    ...Actions_doctors(["fetchDiseaseByNameOnInput", "fetchDocSpecialtiesOnInput"]),
    diagnosisOnInput() {
      if (!this.diagnosisSearch.length) {
        this.diagnosisItems = [];
        return;
      }
      this.fetchDiseaseByNameOnInput(this.diagnosisSearch).then((res) => {
        this.diagnosisItems = res;
      });
      return;
    },
    doctorsSpecialtyOnInput(e) {
      if (!e.target.value.length) {
        this.specialtyItems = [];
        return;
      }
      this.fetchDocSpecialtiesOnInput(e.target.value).then((res) => {
        this.specialtyItems = res;
      });
    },
    doctorsSpecialtyOnChange() {
      this.invitedPeople = []
      this.noDoctorsBySpecialty = false
      this.getDoctors.map(doc => {
        if (doc.info.doctor_specialty === this.doctorsSpecialty) {
          this.invitedPeople.push(doc.user_id)
        }
      })
      if (!this.invitedPeople.length) {
        this.noDoctorsBySpecialty = true
      }
    },
    remove(item) {
      this.invitedPeople.map((p, index) => {
        if (p === item.user_id) {
          this.invitedPeople.splice(index, 1)
        }
      })
    },
    async createConsillium() {
      const name = this.consilliumName;
      const data = {
        invitedPeople: this.invitedPeople,
        provisionalDiagnosis: this.provisionalDiagnosis,
        problemDescription: this.problemDescription,
        selectedPatient: this.computeSelectedPatient,
        tags: this.tags,
        isConsilliumUrgent: this.isConsilliumUrgent,
      };
      const chat_id = await this.createNewConsiliumChat({ data, name });
      for (let i = 0; i < this.invitedPeople.length; i++) {
        await this.addUserToGroupChat({
          chat_id,
          to_id: this.invitedPeople[i],
        });
      }
      this.fetchChats();
      this.addAlert({ type: "success", text: "consillium has been created" });
      this.invitedPeople = [];
      this.consilliumName = "";
      this.provisionalDiagnosis = "";
      this.problemDescription = "";
      this.selectedPatientId = null;
      this.tags = "";
      this.isConsilliumUrgent = false;
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped></style>
