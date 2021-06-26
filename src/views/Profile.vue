<template>
  <div class="pa-3">
    <h1>Мой профиль</h1>
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
              :label="common.Name"
              readonly
            ></v-text-field>

            <v-input
              dense
              class="v-input--is-label-active v-input--is-dirty v-text-field v-text-field--is-booted"
            >
              <template v-slot:default>
                <v-label :value="true" :absolute="true">Дата рождения</v-label>
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
                        отменить
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

            <v-text-field
              v-model="getSetCountry"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="common.Country"
            ></v-text-field>
            <v-text-field
              v-model="getSetEmail"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="common.Email"
            ></v-text-field>
            <v-text-field
              v-model="getSetInternship"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="doctor.Internship"
            ></v-text-field>
            <v-text-field
              v-model="getSetMedicalSpecialty"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="doctor['Medical specialty']"
            ></v-text-field>
            <v-text-field
              v-model="getSetMedicalUniversity"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="doctor['Medical University']"
            ></v-text-field>
            <v-text-field
              v-model="getSetPhone"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="common.Phone"
            ></v-text-field>
            <v-file-input
              hide-details
              outlined
              dense
              class="mb-2"
              accept="image/*"
              :label="common['Your photo']"
              @change="onPhotoChange"
            ></v-file-input>
            <v-text-field
              v-model="getSetResidency"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="doctor.Residency"
            ></v-text-field>
            <v-text-field
              v-model="getSetYearsOfEducation"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="common['Years of education']"
            ></v-text-field>
          </div>
          <v-select
            v-model="languages"
            persistent-hint
            hint="На каких языках можете принимать пациента"
            :items="languagesList"
            multiple
            dense
            outlined
            @change="onLangChange"
          ></v-select>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import dayjs from "dayjs";
const { mapState, mapMutations, mapActions } = createNamespacedHelpers("auth");
const { mapState: State_lang } = createNamespacedHelpers("lang");
export default {
  data() {
    return {
      languagesList: [
        "Английский",
        "Французский",
        "Немецкий",
        "Испанский",
        "Русский",
      ],
      file: "",
      languages: ["Английский", "Французский"],
      showBirthdayPicker: false,
      currentDate: dayjs().format("YYYY-MM-DD"),
    };
  },
  computed: {
    ...mapState(["doctorProfile"]),
    ...State_lang(["common", "doctor"]),
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
    getSetMedicalUniversity: {
      get() {
        return this.doctorProfile && this.doctorProfile.medical_university;
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
        return this.languages;
      },
    },
  },
  methods: {
    ...mapActions(["updateDoctorProfile"]),
    ...mapMutations([
      "SET_DOCTOR_NAME",
      "SET_DOCTOR_BIRTHDAY",
      "SET_DOCTOR_COUNTRY",
      "SET_DOCTOR_EMAIL",
      "SET_DOCTOR_INTERNSHIP",
      "SET_DOCTOR_MEDICAL_SPECIALTY",
      "SET_DOCTOR_MEDICAL_UNIVERSITY",
      "SET_DOCTOR_PHONE",
      "SET_DOCTOR_PHOTO",
      "SET_DOCTOR_RESIDENCY",
      "SET_DOCTOR_YEARS_OF_EDUCATION",
    ]),
    photoAddHandle(e) {
      this.profileData.selectedPhoto = e;
    },
    onLangChange(e) {
      this.languages = e;
    },
    onPhotoChange(v) {
      this.file = v;
      let formData = new FormData();
      formData.append("file", this.file);
      this.SET_DOCTOR_PHOTO(formData);
    },
  },
};
</script>

<style lang="scss">
.profile-inputs .v-input__control {
  min-height: unset !important;
}
</style>
