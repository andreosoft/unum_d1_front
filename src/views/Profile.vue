<template>
  <div class="pa-3">
    <h1>{{ getCommonTranslation("My profile") }}</h1>
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
              :label="getCommonTranslation('Name')"
              readonly
            ></v-text-field>

            <v-input
              dense
              class="v-input--is-label-active v-input--is-dirty v-text-field v-text-field--is-booted"
            >
              <template v-slot:default>
                <v-label :value="true" :absolute="true">
                  {{ getCommonTranslation("Date of birth") }}
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
                        {{ getCommonTranslation("Cancel") }}
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
              :label="getCommonTranslation('Country')"
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
              :label="getCommonTranslation('Email')"
            ></v-text-field>
            <v-text-field
              v-model="getSetInternship"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="getDoctorTranslation('Internship')"
            ></v-text-field>
            <v-text-field
              v-model="getSetMedicalSpecialty"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="getDoctorTranslation('Medical specialty')"
            ></v-text-field>
            <v-text-field
              v-model="getSetDoctorSpecialty"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="getDoctorTranslation('Doctor specialty')"
            ></v-text-field>
            <v-text-field
              v-model="getSetMedicalUniversity"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="getDoctorTranslation('Medical University')"
            ></v-text-field>
            <v-text-field
              v-model="getSetPhone"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="getCommonTranslation('Phone')"
            ></v-text-field>
            <v-file-input
              hide-details
              outlined
              dense
              class="mb-2"
              accept="image/*"
              :label="getCommonTranslation('Your photo')"
              @change="onPhotoChange"
              placeholder="asdasdas"
            ></v-file-input>
            <v-text-field
              v-model="getSetResidency"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="getDoctorTranslation('Residency')"
            ></v-text-field>
            <v-text-field
              v-model="getSetYearsOfEducation"
              hide-details
              outlined
              dense
              class="mb-2"
              :label="getCommonTranslation('Years of education')"
            ></v-text-field>
          </div>
          <v-text-field
            v-model="getSetVisitDuration"
            hide-details
            outlined
            dense
            class="mb-2"
            type="number"
            :label="getDoctorTranslation('Visit duration')"
          ></v-text-field>
          <v-select
            v-model="getSetLanguages"
            persistent-hint
            :hint="getCommonTranslation('Service languages')"
            :items="languagesList"
            multiple
            dense
            outlined
          ></v-select>
          <div>
            <p class="mb-2">{{ getDoctorTranslation("Fellow student") }}</p>
            <div>
              <v-text-field
                v-model="getSetFellowStudentName_1"
                outlined
                dense
                hide-details
                :label="getCommonTranslation('Name')"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="getSetFellowStudentSurname_1"
                outlined
                dense
                hide-details
                :label="getCommonTranslation('Surname')"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="getSetFellowStudentSocialLink_1"
                outlined
                dense
                hide-details
                :label="getCommonTranslation('Social link')"
              ></v-text-field>
            </div>
            <v-divider class="my-2"></v-divider>
            <div>
              <v-text-field
                v-model="getSetFellowStudentName_2"
                outlined
                dense
                hide-details
                :label="getCommonTranslation('Name')"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="getSetFellowStudentSurname_2"
                outlined
                dense
                hide-details
                :label="getCommonTranslation('Surname')"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="getSetFellowStudentSocialLink_2"
                outlined
                dense
                hide-details
                :label="getCommonTranslation('Social link')"
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
            :label="getCommonTranslation('Qualification')"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import dayjs from "dayjs";
const { mapState, mapMutations, mapActions } = createNamespacedHelpers("auth");
const { mapGetters: Getters_lang } = createNamespacedHelpers("lang");
export default {
  data() {
    return {
      file: "",
      languages: [],
      showBirthdayPicker: false,
      currentDate: dayjs().format("YYYY-MM-DD"),
      img: "",
      countries: [
        "Австралия",
        "Азербайджан",
        "Албания",
        "Армения",
        "Афганистан",
        "Белоруссия",
        "Болгария",
        "Бразилия",
        "Великобритания",
        "Венгрия",
        "Германия",
        "Греция",
        "Грузия",
        "Дания",
        "Египет",
        "Индия",
        "Ирак",
        "Ирландия",
        "Исландия",
        "Испания",
        "Италия",
        "Казахстан",
        "Китай",
        "Кыргызстан",
        "Латвия",
        "Литва",
        "Малайзия",
        "Мексика",
        "Молдавия",
        "Непал",
        "Нидерланды",
        "Норвегия",
        "ОАЭ",
        "Пакистан",
        "Польша",
        "Португалия",
        "Россия",
        "Румыния",
        "Сербия",
        "Сингапур",
        "Сирия",
        "Словакия",
        "Словения",
        "США",
        "Таджикистан",
        "Турция",
        "Узбекистан",
        "Украина",
        "Филиппины",
        "Финляндия",
        "Франция",
        "Хорватия",
        "Черногория",
        "Чехия",
        "Швейцария",
        "Швеция",
        "Эстония",
        "Япония",
      ],
      country: "",
    };
  },
  computed: {
    ...mapState(["doctorProfile", "userProfile"]),
    ...Getters_lang(["getCommonTranslation", "getDoctorTranslation"]),
    languagesList() {
      let english = this.getCommonTranslation("English"),
        french = this.getCommonTranslation("French"),
        german = this.getCommonTranslation("German"),
        spanish = this.getCommonTranslation("Spanish"),
        russian = this.getCommonTranslation("Russian");

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
    getSetDoctorSpecialty() {
      return this.doctorProfile && this.doctorProfile.info.doctor_specialty;
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
  methods: {
    ...mapActions(["updateDoctorProfile", "uploadDoctorImage"]),
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
      "SET_SERVICE_LANGUAGES",
      "SET_FELLOW_STUDENT",
      "SET_QUALIFICATION",
      "SET_FELLOW_STUDENT_NAME",
      "SET_FELLOW_STUDENT_SURNAME",
      "SET_FELLOW_STUDENT_SOCIAL_LINK",
      "SET_DOCTOR_TIME_INTERVAL",
    ]),
    photoAddHandle(e) {
      this.profileData.selectedPhoto = e;
    },
    onPhotoChange(v) {
      this.file = v;
      let formData = new FormData();
      formData.append("file", this.file);
      this.uploadDoctorImage(formData);
    },
  },
  mounted() {
    console.log(this.doctorProfile);
  },
};
</script>

<style lang="scss">
.profile-inputs .v-input__control {
  min-height: unset !important;
}
</style>
