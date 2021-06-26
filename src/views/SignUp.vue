<template>
  <div class="signup-wrap">
    <div class='pa-2'>
      <v-card :max-width="500" class="mb-4 pa-4">
        <form @submit.prevent="signUpHandler">
          <div v-show="step === 0">
            <h2 class="form__title">Контактная информация</h2>
            <v-text-field
              v-model="$v.email.$model"
              :error="$v.email.$error"
              :error-messages="
                userError && !$v.email.required
                  ? 'Поле обязательно'
                  : userError && !$v.email.emailValidation
                  ? 'Введите правильный Email'
                  : ''
              "
              dense
              outlined
              @input="$v.email.$reset"
              label="Email"
            >
            </v-text-field>
            <vue-phone-number-input
              v-model="phone"
              default-country-code="KG"
              show-code-on-list
              :translations="{
                countrySelectorLabel: 'Код страны',
                phoneNumberLabel: 'Номер телефона',
              }"
              no-example
              class="mb-7"
            />
            <v-text-field
              v-model="$v.password.$model"
              :error="$v.password.$error"
              :error-messages="
                userError && !$v.password.required
                  ? 'Поле обязательно'
                  : userError && !$v.password.minLength
                  ? 'Пароль должен содержать минимум 6 символов'
                  : ''
              "
              dense
              outlined
              @input="$v.password.$reset"
              label="Пароль"
              type="password"
            >
            </v-text-field>
            <v-text-field
              v-model="$v.passwordConfirmation.$model"
              :error="$v.passwordConfirmation.$error"
              :error-messages="
                userError && !$v.passwordConfirmation.sameAsPassword
                  ? 'Пароли должны совпадать'
                  : ''
              "
              dense
              outlined
              @input="$v.passwordConfirmation.$reset"
              label="Подтвердите пароль"
              type="password"
            >
            </v-text-field>
          </div>
          <div v-show="step === 1">
            <h2 class="form__title">Личная информация</h2>
            <v-text-field
              v-model="$v.name.$model"
              :error="$v.name.$error"
              :error-messages="
                personalInfoError && !$v.name.required ? 'Поле обязательно' : ''
              "
              @input="$v.name.$reset"
              label="Имя"
              dense
              outlined
            >
            </v-text-field>
            <v-text-field
              v-model="$v.surname.$model"
              :error="$v.surname.$error"
              :error-messages="
                personalInfoError && !$v.surname.required
                  ? 'Поле обязательно'
                  : ''
              "
              @input="$v.surname.$reset"
              label="Фамилия"
              dense
              outlined
            >
            </v-text-field>
            <v-text-field v-model="middleName" label="Отчество" dense outlined>
            </v-text-field>
            <v-file-input
              outlined
              dense
              solo
              accept="image/*"
              label="Ваша фотография"
              @change="onPhotoChange"
            ></v-file-input>
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
            <v-autocomplete
              ref="country"
              v-model="country"
              :items="countries"
              label="Страна"
              placeholder="Select..."
              dense
              outlined
            ></v-autocomplete>
            <v-autocomplete
              ref="language"
              v-model="language"
              :items="languages"
              label="Выберите язык для вашего личного кабинета"
              placeholder="Select..."
              dense
              outlined
            >
            </v-autocomplete>
          </div>
          <div v-show="step === 2">
            <h2 class="form__title">Медицинское образование</h2>
            <v-text-field
              v-model="medUniversity"
              label="Медицинский ВУЗ"
              dense
              outlined
            >
            </v-text-field>
            <v-text-field
              v-model="yearsOfEducation"
              label="Годы учебы"
              dense
              outlined
            >
            </v-text-field>
            <v-text-field
              v-model="medSpeciality"
              label="Факультет"
              dense
              outlined
            >
            </v-text-field>
            <v-text-field v-model="internship" label="Интернатура" dense outlined
              ></v-text-field
            >
            <v-text-field
              v-model="residency"
              label="Ординатура"
              dense
              outlined
            ></v-text-field>
            <v-text-field label="Пожалуйста, укажите двух ваших сокурсников" dense outlined>
            </v-text-field>
          </div>
          <v-btn
            v-show="step === 0"
            class="mr-3"
            @click="$router.push('/login')"
          >
            Отмена
          </v-btn>
          <v-btn v-show="step !== 0" class="mr-3" @click="step--">Назад</v-btn>
          <v-btn v-show="step !== 2" @click="validateStep">Далее</v-btn>
          <v-btn v-show="step === 2" type="submit">Регистрация</v-btn>
        </form>
      </v-card>
      <v-card style="width: 100%;" class="pa-4">
        <!-- Already have an account? <router-link to="/login">Login</router-link> -->
        Уже зарегистрированы? <router-link to="/login">Войти</router-link>
      </v-card>
    </div>
  </div>
</template>

<script>
import { required, minLength, sameAs } from "vuelidate/lib/validators";
import { createNamespacedHelpers } from "vuex";
import dayjs from 'dayjs'
const { mapActions } = createNamespacedHelpers("auth");
export default {
  data() {
    return {
      step: 0,
      showBirthdayPicker: false,
      currentDate: dayjs().format("YYYY-MM-DD"),

      userError: false,
      email: "",
      password: "",
      passwordConfirmation: "",
      phone: "",

      personalInfoError: false,
      name: "",
      surname: "",
      middleName: "",
      photo: "",
      dateOfBirth: "",
      country: null,
      language: "",

      educationInfoError: false,
      medUniversity: "",
      yearsOfEducation: "",
      medSpeciality: "",
      internship: "",
      residency: "",

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
      languages: ["English", "French", "German", "Spanish", "Russian"],
    };
  },
  validations: {
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
  },
  methods: {
    ...mapActions(["signUp"]),
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
        const requiredFields = ["name", "surname"];
        requiredFields.map((field) => {
          this.$v[field].$touch();
        });
        if (this.$v.name.$invalid || this.$v.surname.$invalid) {
          this.personalInfoError = true;
          return;
        }
      }
      this.step++;
    },
    signUpHandler() {
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
          photo: this.photo
        },
        doctor: {
          name: this.name,
          surname: this.surname,
          secondname: this.middleName,
          dateOfBirth: this.dateOfBirth
        },
      };
      this.signUp(data);
    },
    onPhotoChange(v) {
      const photo = v
      let formData = new FormData();
      formData.append("file", photo);
      this.photo = formData
    },
  },
};
</script>

<style lang="scss" scoped>
.signup-wrap {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
}
.form__title {
  font-size: 36px;
}
</style>
