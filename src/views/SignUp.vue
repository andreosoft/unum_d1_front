<template>
  <div class="signup-wrap pa-2">
    <div style="position: absolute; top: 0; right: 0">
      <v-btn
        v-for="lang in systemLanguages"
        :key="lang.id"
        :color="lang.isActive ? 'primary' : ''"
        :text="!lang.isActive"
        dark
        :disabled="lang.disabled"
        @click="chooseLang(lang.id)"
      >
        {{ lang.title }}
      </v-btn>
    </div>
    <div class="signup-wrap__container">
      <v-card :max-width="500" class="mb-4 pa-5">
        <form @submit.prevent="signUpHandler">
          <div v-show="step === 0">
            <p class="form__title">
              {{ $t("Contact information") }}
            </p>
            <v-text-field
              v-model="$v.email.$model"
              :error="$v.email.$error"
              :error-messages="
                userError && !$v.email.required
                  ? $t('Field is required')
                  : userError && !$v.email.emailValidation
                  ? $t('Enter correct email')
                  : ''
              "
              dense
              outlined
              @input="$v.email.$reset"
              :label="$t('Email')"
            >
            </v-text-field>
            <vue-phone-number-input
              v-model="phone"
              :default-country-code="countryCode"
              show-code-on-list
              :translations="{
                countrySelectorLabel: $t('Country code'),
                phoneNumberLabel: $t('Phone'),
              }"
              no-example
              class="mb-7"
            />
            <v-text-field
              v-model="$v.password.$model"
              :error="$v.password.$error"
              :error-messages="
                userError && !$v.password.required
                  ? $t('Field is required')
                  : userError && !$v.password.minLength
                  ? $t('Password length error')
                  : ''
              "
              dense
              outlined
              @input="$v.password.$reset"
              :label="$t('Password')"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
            >
            </v-text-field>
            <v-text-field
              v-model="$v.passwordConfirmation.$model"
              :error="$v.passwordConfirmation.$error"
              :error-messages="
                userError && !$v.passwordConfirmation.sameAsPassword
                  ? $t('Password match error')
                  : ''
              "
              dense
              outlined
              @input="$v.passwordConfirmation.$reset"
              :label="$t('Password again')"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              :append-icon="
                showPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'
              "
              @click:append="
                showPasswordConfirmation = !showPasswordConfirmation
              "
            >
            </v-text-field>
          </div>
          <div v-show="step === 1">
            <p class="form__title">
              {{ $t("Personal Information") }}
            </p>
            <v-text-field
              v-model="$v.surname.$model"
              :error="$v.surname.$error"
              :error-messages="
                personalInfoError && !$v.surname.required
                  ? $t('Field is required')
                  : ''
              "
              @input="$v.surname.$reset"
              :label="$t('Surname')"
              dense
              outlined
            >
            </v-text-field>
            <v-text-field
              v-model="$v.name.$model"
              :error="$v.name.$error"
              :error-messages="
                personalInfoError && !$v.name.required
                  ? $t('Field is required')
                  : ''
              "
              @input="$v.name.$reset"
              :label="$t('Name')"
              dense
              outlined
            >
            </v-text-field>
            <v-text-field
              v-model="secondname"
              :label="$t('Middle name')"
              dense
              outlined
            >
            </v-text-field>
            <!-- <v-file-input
              outlined
              dense
              solo
              accept="image/*"
              :label="getCommonTranslation('Your photo')"
              @change="onPhotoChange"
              :error-messages="
                personalInfoError && !$v.photo.required
                  ? getCommonTranslation('Field is required')
                  : ''
              "
            ></v-file-input> -->
            <v-img
              v-if="photoPreview.length"
              :src="photoPreview"
              style="width: 40%"
              class="mb-3 rounded-lg"
            ></v-img>
            <v-file-input
              outlined
              dense
              solo
              accept="image/*"
              :label="$t('Your photo')"
              @change="onPhotoChange"
            ></v-file-input>
            <v-input
              dense
              class="
                v-input--is-label-active v-input--is-dirty
                v-text-field v-text-field--is-booted
              "
              :error-messages="
                personalInfoError && !$v.dateOfBirth.required
                  ? $t('Field is required')
                  : ''
              "
            >
              <template v-slot:default>
                <v-label :value="true" :absolute="true">{{
                  $t("Date of birth")
                }}</v-label>
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
                          {{ dateOfBirth }}
                        </div>
                      </slot>
                    </template>
                    <v-date-picker
                      v-if="showBirthdayPicker"
                      v-model="dateOfBirth"
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
              v-model="country"
              :items="countries"
              :label="$t('Country')"
              placeholder="Select..."
              dense
              outlined
              :error-messages="
                personalInfoError && !$v.country.required
                  ? $t('Field is required')
                  : ''
              "
            >
            </v-autocomplete>
            <v-autocomplete
              ref="language"
              v-model="language"
              :items="languages"
              :label="$t('Language notification')"
              placeholder="Select..."
              dense
              outlined
              :error-messages="
                personalInfoError && !$v.language.required
                  ? $t('Field is required')
                  : ''
              "
            >
            </v-autocomplete>
          </div>
          <div v-show="step === 2">
            <p class="form__title">
              {{ $t("Medical Education") }}
            </p>
            <v-autocomplete
              v-model="medUniversity"
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
              :error-messages="
                personalInfoError && !$v.medUniversity.required
                  ? $t('Field is required')
                  : ''
              "
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-title>
                    {{ $t("Start typing...") }}
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-autocomplete>
            <v-text-field
              v-model="yearsOfEducation"
              :label="$t('Years of education')"
              dense
              outlined
              hide-details
              class="mb-1"
            >
            </v-text-field>
            <v-text-field
              v-model="medSpecialty"
              :label="$t('Medical specialty')"
              dense
              outlined
              hide-details
              class="mb-1"
            >
            </v-text-field>
            <v-autocomplete
              v-model="docSpecialty"
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
              :error-messages="
                personalInfoError && !$v.docSpecialty.required
                  ? $t('Field is required')
                  : ''
              "
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-title>
                    {{ $t("Start typing...") }}
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-autocomplete>
            <v-text-field
              v-model="internship"
              :label="$t('Internship')"
              dense
              outlined
              hide-details
              class="mb-1"
            ></v-text-field>
            <v-text-field
              v-model="residency"
              :label="$t('Residency')"
              dense
              outlined
              hide-details
              class="mb-3"
            ></v-text-field>
          </div>
          <v-btn
            v-show="step === 0"
            class="mr-3"
            @click="$router.push('/login')"
          >
            {{ $t("Cancel") }}
          </v-btn>
          <v-btn v-show="step !== 0" class="mr-3" @click="step--">{{
            $t("Back")
          }}</v-btn>
          <v-btn v-show="step !== 2" @click="validateStep">{{
            $t("Next")
          }}</v-btn>
          <v-btn v-show="step === 2" type="submit">{{
            $t("Registration")
          }}</v-btn>
        </form>
      </v-card>
      <v-card style="width: 100%">
        <!-- уже зарегистрированы? -->
        <v-card-text>
          {{ $t("Registered already") }}
          <router-link
            :to="{ name: 'Login', params: { lang: $route.params.lang } }"
            >{{ $t("Sign in") }}</router-link
          >
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { required, minLength, sameAs } from "vuelidate/lib/validators";
import { createNamespacedHelpers } from "vuex";
import dayjs from "dayjs";
const { mapActions, mapMutations } = createNamespacedHelpers("auth");
const { mapActions: Actions_doctors } = createNamespacedHelpers("doctors");
const {
  mapState: State_lang,
  mapGetters: Getters_lang,
  mapActions: Actions_lang,
} = createNamespacedHelpers("lang");
export default {
  data() {
    return {
      countryCode: "KG",
      specialtyItems: [],
      univerItems: [],

      step: 0,
      showBirthdayPicker: false,
      currentDate: dayjs().format("YYYY-MM-DD"),

      userError: false,
      email: "",
      password: "",
      passwordConfirmation: "",
      phone: "",

      showPassword: false,
      showPasswordConfirmation: false,

      personalInfoError: false,
      name: "",
      surname: "",
      secondname: "",
      photo: "",
      photoPreview: "",
      dateOfBirth: "",
      country: null,
      language: "",

      educationInfoError: false,
      medUniversity: "",
      yearsOfEducation: "",
      medSpecialty: "",
      docSpecialty: "",
      internship: "",
      residency: "",
      fellowStudent1: {
        name: "",
        surname: "",
        socialLink: "",
      },
      fellowStudent2: {
        name: "",
        surname: "",
        socialLink: "",
      },

      countries1: [
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
      languages: ["English", "French", "German", "Spanish", "Russian"],
      systemLanguages: [
        {
          title: "en",
          isActive: false,
          id: 1,
          disabled: false,
        },
        {
          title: "ru",
          isActive: false,
          id: 2,
          disabled: false,
        },
        {
          title: "fr",
          isActive: false,
          id: 3,
          disabled: true,
        },
        {
          title: "es",
          isActive: false,
          id: 4,
          disabled: true,
        },
        {
          title: "de",
          isActive: false,
          id: 5,
          disabled: true,
        },
      ],
    };
  },
  validations: {
    medUniversity: { required },
    docSpecialty: { required },
    email: {
      required,
      emailValidation: (email) => /.+@.+\..+/.test(email),
    },
    password: {
      required,
      minLength: minLength(6),
    },
    passwordConfirmation: {
      sameAsPassword: sameAs("password"),
    },
    name: {
      required,
    },
    surname: {
      required,
    },
    // photo: {
    //   required,
    // },
    dateOfBirth: {
      required,
    },
    country: {
      required,
    },
    language: {
      required,
    },
  },
  computed: {
    countries() {
      return this.$store.state.countries;
    },
    ...State_lang(["common", "doctor"]),
    ...Getters_lang(["getCommonTranslation", "getDoctorTranslation"]),
  },
  methods: {
    ...mapActions(["signUp", "uploadDoctorImage", "getCountryCode"]),
    ...mapMutations([
      "SET_DOCTOR_MEDICAL_UNIVERSITY",
      "SET_DOCTOR_MEDICAL_SPECIALTY",
      "SET_DOCTOR_YEARS_OF_EDUCATION",
      "SET_DOCTOR_INTERNSHIP",
      "SET_DOCTOR_RESIDENCY",
      "SET_DOCTOR_PHONE",
      "SET_AUTH_STATUS",
    ]),
    ...Actions_lang(["fetchLangItems"]),
    ...Actions_doctors(["fetchDocSpecialtiesOnInput", "fetchUniversity"]),

    onMedUniversityInput(e) {
      if (!e.target.value.length) {
        this.univerItems = [];
        return;
      }
      this.fetchUniversity(e.target.value).then((res) => {
        this.univerItems = res;
      });
    },
    validateStep() {
      if (this.step === 0) {
        const requiredFields = ["email", "password", "passwordConfirmation"];
        requiredFields.map((field) => {
          this.$v[field].$touch();
        });

        if (
          this.$v.email.$invalid ||
          this.$v.password.$invalid ||
          this.$v.passwordConfirmation.$invalid
        ) {
          this.userError = true;
          return;
        }
      } else if (this.step === 1) {
        const requiredFields = [
          "name",
          "surname",
          // "photo",
          "dateOfBirth",
          "country",
          "language",
        ];
        requiredFields.map((field) => {
          this.$v[field].$touch();
        });
        if (
          this.$v.name.$invalid ||
          this.$v.surname.$invalid ||
          // this.$v.photo.$invalid ||
          this.$v.dateOfBirth.$invalid ||
          this.$v.country.$invalid ||
          this.$v.language.$invalid
        ) {
          this.personalInfoError = true;
          return;
        }
      }
      this.step++;
    },
    async signUpHandler() {
      if (this.step !== 2) {
        return;
      } else {
        const requiredFields = ["medUniversity", "docSpecialty"];
        requiredFields.map((field) => {
          this.$v[field].$touch();
        });
        if (this.$v.medUniversity.$invalid || this.$v.docSpecialty.$invalid) {
          this.personalInfoError = true;
          return;
        }
      }
      let langValue = "";
      switch (this.language) {
        case "English":
          langValue = "en";
          break;
        case "German":
          langValue = "de";
          break;
        case "French":
          langValue = "en";
          break;
        case "Spanish":
          langValue = "es";
          break;
        case "Russian":
          langValue = "ru";
          break;
      }
      const data = {
        user: {
          login: this.email,
          password: this.passwordConfirmation,
          phone: this.phone,
          lang: langValue,
          country: this.country,
          photo: this.photo,
        },
        doctor: {
          name: this.name,
          surname: this.surname,
          secondname: this.secondname,
          dateOfBirth: this.dateOfBirth,
        },
        education: {
          medical_university: this.medUniversity,
          medical_specialty: this.medSpecialty,
          doctor_specialty: this.docSpecialty,
          years_of_education: this.yearsOfEducation,
          internship: this.internship,
          residency: this.residency,
          fellowStudent1: this.fellowStudent1,
          fellowStudent2: this.fellowStudent2,
        },
      };
      this.signUp(data);
    },
    onPhotoChange(v) {
      this.photoPreview = URL.createObjectURL(v);
      const photo = v;
      let formData = new FormData();
      formData.append("file", photo);
      this.photo = formData;
    },
    chooseLang(id) {
      let choosenLang = "";
      this.systemLanguages.map((lang) => {
        lang.isActive = false;
        if (lang.id === id) {
          lang.isActive = true;
          choosenLang = lang.title;
        }
      });

      this.$router
        .replace({ name: "Sign Up", params: { lang: choosenLang } })
        .catch((err) => {});

      this.fetchLangItems({ lang: choosenLang, type: "common" });
      this.fetchLangItems({ lang: choosenLang, type: "doctor" });
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
  },
  async created() {
    this.systemLanguages.map((lang) =>
      lang.title === this.$route.params.lang ? (lang.isActive = true) : ""
    );

    this.fetchLangItems({
      lang: this.$route.params.lang,
      type: "common",
    });
    this.fetchLangItems({
      lang: this.$route.params.lang,
      type: "doctor",
    });
    this.countryCode = await this.getCountryCode();
  },
};
</script>

<style lang="scss" scoped>
.signup-wrap {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  &__container {
    width: 100%;
    max-width: 500px;
  }
}
</style>
