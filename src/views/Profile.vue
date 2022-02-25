<template>
  <div class="pa-3">
    <h1>{{ $t("My profile") }}</h1>
    <v-container class="pa-0">
      <v-row>
        <v-col cols="12" sm="8" md="6">
          <div>
            <v-text-field
              v-model="getSetName"
              hide-details
              outlined
              dense
              class="mb-6"
              :label="$t('Name')"
              readonly
            ></v-text-field>

            <v-input
              dense
              class="
                v-input--is-label-active v-input--is-dirty
                v-text-field v-text-field--is-booted
              "
            >
              <template v-slot:default>
                <v-label :value="true" :absolute="true">
                  {{ $t("Date of birth") }}
                </v-label>
                <div class="d-inline-block">
                  <v-dialog
                    ref="dialog"
                    v-model="showBirthdayPicker"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <slot>
                        <div v-bind="attrs" v-on="on">
                          <v-icon>mdi-calendar</v-icon>
                          {{ getSetBirthday }}
                        </div>
                      </slot>
                    </template>
                    <v-date-picker
                      v-if="showBirthdayPicker"
                      v-model="getSetBirthday"
                      full-width
                      :max="currentDate"
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="blue darken-1"
                        @click="showBirthdayPicker = false"
                      >
                        {{ $t("Cancel") }}
                      </v-btn>
                      <v-btn
                        text
                        color="blue darken-1"
                        @click="showBirthdayPicker = false"
                      >
                        ок
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </div>
              </template>
            </v-input>

            <v-autocomplete
              ref="country"
              v-model="getSetCountry"
              :items="countries"
              :label="$t('Country')"
              placeholder="Select..."
              dense
              outlined
              hide-details
              class="mb-2"
            ></v-autocomplete>
            <v-text-field
              v-model="getSetEmail"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="$t('Email')"
            ></v-text-field>
            <v-text-field
              v-model="getSetInternship"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="$t('Internship')"
            ></v-text-field>
            <v-text-field
              v-model="getSetMedicalSpecialty"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="$t('Medical specialty')"
            ></v-text-field>
            <v-autocomplete
              v-model="getSetDoctorSpecialty"
              :items="specialtyItems"
              item-text="name"
              hide-details
              :label="$t('Doctor specialty')"
              dense
              outlined
              class="mb-2"
              autocomplete="off"
              @input.native="docSpecialtyOnInput"
              @blur="specialtyItems = []"
            >
            </v-autocomplete>
            <v-autocomplete
              v-model="getSetMedicalUniversity"
              :items="univerItems"
              item-text="name"
              hide-details
              :label="$t('Medical University')"
              dense
              outlined
              class="mb-2"
              autocomplete="off"
              @input.native="onMedUniversityInput"
              @blur="univerItems = []"
            >
            </v-autocomplete>
            <v-text-field
              v-model="getSetPhone"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="$t('Phone')"
            ></v-text-field>
            <v-img
              v-if="img.length"
              style="width: 50%"
              class="mb-3 rounded-lg"
              :src="img"
            ></v-img>
            <v-file-input
              hide-details
              outlined
              dense
              class="mb-2"
              accept="image/*"
              :label="$t('Your photo')"
              @change="onPhotoChange"
            ></v-file-input>
            <v-text-field
              v-model="getSetResidency"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="$t('Residency')"
            ></v-text-field>
            <v-text-field
              v-model="getSetYearsOfEducation"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="$t('Years of education')"
            ></v-text-field>
          </div>

          <v-select
            v-model="getSetLanguages"
            persistent-hint
            :hint="$t('Service languages')"
            :items="languagesList"
            multiple
            dense
            outlined
          ></v-select>
          <div>
            <p class="mb-2">{{ $t("Fellow student") }}</p>
            <div>
              <v-text-field
                v-model="getSetFellowStudentName_1"
                outlined
                dense
                hide-details
                :label="$t('Name')"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="getSetFellowStudentSurname_1"
                outlined
                dense
                hide-details
                :label="$t('Surname')"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="getSetFellowStudentSocialLink_1"
                outlined
                dense
                hide-details
                :label="$t('Social link')"
              ></v-text-field>
            </div>
            <v-divider class="my-2"></v-divider>
            <div>
              <v-text-field
                v-model="getSetFellowStudentName_2"
                outlined
                dense
                hide-details
                :label="$t('Name')"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="getSetFellowStudentSurname_2"
                outlined
                dense
                hide-details
                :label="$t('Surname')"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="getSetFellowStudentSocialLink_2"
                outlined
                dense
                hide-details
                :label="$t('Social link')"
              ></v-text-field>
            </div>
          </div>
          <v-divider class="my-2"></v-divider>
          <v-textarea
            v-model="getSetQualification"
            :rows="10"
            hide-details
            dense
            no-resize
            outlined
            :label="$t('Qualification')"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-divider class="my-2"></v-divider>
      <s-btn-any
        :title="'Create clinic'"
        :icon1="'mdi-check'"
        @btnClick=""
        :disabled="true"
      />
    </v-container>
    <div v-if="isProfileUpdating" class="loader">
      <v-progress-circular
        indeterminate
        width="3"
        size="20"
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import dayjs from "dayjs";
const { mapState, mapMutations, mapActions } = createNamespacedHelpers("auth");
const { mapActions: Actions_alert } = createNamespacedHelpers("alerts");
const { mapActions: Actions_doctors } = createNamespacedHelpers("doctors");
export default {
  name: "Profile",
  data() {
    return {
      file: "",
      languages: [],
      showBirthdayPicker: false,
      currentDate: dayjs().format("YYYY-MM-DD"),
      img: "",

      country: "",
      specialtyItems: [],
      univerItems: [],
    };
  },
  computed: {
    countries() {
      return this.$store.state.countries;
    },
    ...mapState(["doctorProfile", "userProfile", "isProfileUpdating"]),
    languagesList() {
      let english = this.$t("English"),
        french = this.$t("French"),
        german = this.$t("German"),
        spanish = this.$t("Spanish"),
        russian = this.$t("Russian");

      return [english, french, german, spanish, russian];
    },
    getSetName: {
      get() {
        return this.doctorProfile && this.doctorProfile.name;
      },
      set(value) {
        this.SET_DOCTOR_NAME(value);
      },
    },
    getSetBirthday: {
      get() {
        return this.doctorProfile && this.doctorProfile.birthday;
      },
      set(value) {
        this.SET_DOCTOR_BIRTHDAY(value);
      },
    },
    getSetCountry: {
      get() {
        return this.doctorProfile && this.doctorProfile.country;
      },
      set(value) {
        this.SET_DOCTOR_COUNTRY(value);
      },
    },
    getSetEmail: {
      get() {
        return this.doctorProfile && this.doctorProfile.email;
      },
      set(value) {
        this.SET_DOCTOR_EMAIL(value);
      },
    },
    getSetInternship: {
      get() {
        return this.doctorProfile && this.doctorProfile.internship;
      },
      set(value) {
        this.SET_DOCTOR_INTERNSHIP(value);
      },
    },
    getSetMedicalSpecialty: {
      get() {
        return this.doctorProfile && this.doctorProfile.medical_specialty;
      },
      set(value) {
        this.SET_DOCTOR_MEDICAL_SPECIALTY(value);
      },
    },
    getSetDoctorSpecialty: {
      get() {
        let res =
          this.doctorProfile && this.doctorProfile.info.doctor_specialty;
        this.fetchDocSpecialtiesOnInput(res).then((r) => {
          this.specialtyItems = r;
        });
        return res;
      },
      set(val) {
        return this.SET_DOCTOR_DOCTOR_SPECIALTY(val);
      },
    },
    getSetMedicalUniversity: {
      get() {
        let res = this.doctorProfile && this.doctorProfile.medical_university;
        this.fetchUniversity(res).then((r) => {
          this.univerItems = r;
        });
        return res;
      },
      set(value) {
        this.SET_DOCTOR_MEDICAL_UNIVERSITY(value);
      },
    },
    getSetPhone: {
      get() {
        return this.doctorProfile && this.doctorProfile.phone;
      },
      set(value) {
        this.SET_DOCTOR_PHONE(value);
      },
    },
    getSetPhoto: {
      get() {
        return this.doctorProfile && this.doctorProfile.photo;
      },
      set(value) {
        this.SET_DOCTOR_PHOTO(value);
      },
    },
    getSetResidency: {
      get() {
        return this.doctorProfile && this.doctorProfile.residency;
      },
      set(value) {
        this.SET_DOCTOR_RESIDENCY(value);
      },
    },
    getSetYearsOfEducation: {
      get() {
        return this.doctorProfile && this.doctorProfile.years_of_education;
      },
      set(value) {
        this.SET_DOCTOR_YEARS_OF_EDUCATION(value);
      },
    },
    getSetLanguages: {
      get() {
        return (
          this.doctorProfile &&
          this.doctorProfile.info &&
          this.doctorProfile.info.serviceLanguages
        );
      },
      set(val) {
        this.SET_SERVICE_LANGUAGES(val);
      },
    },
    getSetQualification: {
      get() {
        return (
          this.doctorProfile &&
          this.doctorProfile.info &&
          this.doctorProfile.info.qualification
        );
      },
      set(val) {
        this.SET_QUALIFICATION(val);
      },
    },
    getSetFellowStudentName_1: {
      get() {
        return (
          this.doctorProfile &&
          this.doctorProfile.info &&
          this.doctorProfile.info.fellowStudent1.name
        );
      },
      set(value) {
        this.SET_FELLOW_STUDENT_NAME({ id: 1, value });
      },
    },
    getSetFellowStudentSurname_1: {
      get() {
        return (
          this.doctorProfile &&
          this.doctorProfile.info &&
          this.doctorProfile.info.fellowStudent1.surname
        );
      },
      set(value) {
        this.SET_FELLOW_STUDENT_SURNAME({ id: 1, value });
      },
    },
    getSetFellowStudentSocialLink_1: {
      get() {
        return (
          this.doctorProfile &&
          this.doctorProfile.info &&
          this.doctorProfile.info.fellowStudent1.socialLink
        );
      },
      set(value) {
        this.SET_FELLOW_STUDENT_SOCIAL_LINK({ id: 1, value });
      },
    },
    getSetFellowStudentName_2: {
      get() {
        return (
          this.doctorProfile &&
          this.doctorProfile.info &&
          this.doctorProfile.info.fellowStudent2.name
        );
      },
      set(value) {
        this.SET_FELLOW_STUDENT_NAME({ id: 2, value });
      },
    },
    getSetFellowStudentSurname_2: {
      get() {
        return (
          this.doctorProfile &&
          this.doctorProfile.info &&
          this.doctorProfile.info.fellowStudent2.surname
        );
      },
      set(value) {
        this.SET_FELLOW_STUDENT_SURNAME({ id: 2, value });
      },
    },
    getSetFellowStudentSocialLink_2: {
      get() {
        return (
          this.doctorProfile &&
          this.doctorProfile.info &&
          this.doctorProfile.info.fellowStudent2.socialLink
        );
      },
      set(value) {
        this.SET_FELLOW_STUDENT_SOCIAL_LINK({ id: 2, value });
      },
    },
    getSetVisitDuration: {
      get() {
        return this.doctorProfile && this.doctorProfile.time_interval;
      },
      set(val) {
        this.SET_DOCTOR_TIME_INTERVAL(val);
      },
    },
  },
  watch: {
    isProfileUpdating(val) {
      if (!val) {
        this.addAlert({ type: "success", text: "Profile updated" });
      }
    },
    /* getSetDoctorSpecialty: {
      immediate: true,
      handler(val) {
        this.specialtyItems.push(val);
      },
    },
    getSetMedicalUniversity: {
      immediate: true,
      handler(val) {
        this.univerItems.push(val);
      },
    }, */
  },
  methods: {
    ...mapActions(["updateDoctorProfile", "uploadDoctorImage"]),
    ...Actions_alert(["addAlert"]),
    ...Actions_doctors(["fetchDocSpecialtiesOnInput", "fetchUniversity"]),
    ...mapMutations([
      "SET_DOCTOR_NAME",
      "SET_DOCTOR_BIRTHDAY",
      "SET_DOCTOR_COUNTRY",
      "SET_DOCTOR_EMAIL",
      "SET_DOCTOR_INTERNSHIP",
      "SET_DOCTOR_MEDICAL_SPECIALTY",
      "SET_DOCTOR_DOCTOR_SPECIALTY",
      "SET_DOCTOR_MEDICAL_UNIVERSITY",
      "SET_DOCTOR_PHONE",
      "SET_DOCTOR_PHOTO",
      "SET_DOCTOR_RESIDENCY",
      "SET_DOCTOR_YEARS_OF_EDUCATION",
      "SET_SERVICE_LANGUAGES",
      "SET_FELLOW_STUDENT",
      "SET_QUALIFICATION",
      "SET_FELLOW_STUDENT_NAME",
      "SET_FELLOW_STUDENT_SURNAME",
      "SET_FELLOW_STUDENT_SOCIAL_LINK",
      "SET_DOCTOR_TIME_INTERVAL",
    ]),

    onMedUniversityInput(e) {
      if (!e.target.value.length) {
        this.univerItems = [];
        return;
      }
      this.fetchUniversity(e.target.value).then((res) => {
        this.univerItems = res;
      });
    },

    docSpecialtyOnInput(e) {
      if (!e.target.value.length) {
        this.specialtyItems = [];
        return;
      }
      this.fetchDocSpecialtiesOnInput(e.target.value).then((res) => {
        this.specialtyItems = res;
      });
    },

    photoAddHandle(e) {
      this.profileData.selectedPhoto = e;
    },
    onPhotoChange(v) {
      this.img = URL.createObjectURL(v);
      console.log(this.img);
      this.file = v;
      let formData = new FormData();
      formData.append("file", this.file);
      this.uploadDoctorImage(formData);
    },
  },
};
</script>
<style scoped>
.loader {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
<style lang="scss">
.profile-inputs .v-input__control {
  min-height: unset !important;
}
</style>
