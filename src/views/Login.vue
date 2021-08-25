<template>
  <div class="login-wrap pa-2">
    <div style="position: absolute; top: 0; right: 0;">
      <v-btn
        v-for="lang in languages"
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
    <div class="login-wrap__container">
      <v-card style="width: 100%;" class="mb-4 pa-5">
        <form @submit.prevent="loginHandler">
          <p class="form__title">
            {{ getCommonTranslation("Sign in") }}
          </p>
          <v-text-field
            v-model="$v.email.$model"
            :error="$v.email.$error"
            :error-messages="
              validationError && !$v.email.required
                ? getCommonTranslation('Field is required')
                : validationError && !$v.email.emailValidation
                ? getCommonTranslation('Enter correct email')
                : ''
            "
            dense
            outlined
            @input="$v.email.$reset"
            :label="getCommonTranslation('Email')"
          >
          </v-text-field>

          <v-text-field
            v-model="$v.password.$model"
            :error="$v.password.$error"
            :error-messages="
              validationError && !$v.password.required
                ? getCommonTranslation('Field is required')
                : validationError && !$v.password.minLength
                ? getCommonTranslation('Password length error')
                : ''
            "
            dense
            outlined
            @input="$v.password.$reset"
            :label="getCommonTranslation('Password')"
            type="password"
          >
          </v-text-field>
          <v-btn type="submit">{{ getCommonTranslation("Sign in") }}</v-btn>
        </form>
      </v-card>
      <v-card style="width: 100%;">
        <v-card-text
          >{{ getCommonTranslation("Not registered yet") }}
          <router-link
            :to="{ name: 'Sign Up', params: { lang: $route.params.lang } }"
            >{{ getCommonTranslation("Registration") }}</router-link
          >
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("auth");
const {
  mapState: State_lang,
  mapGetters: Getters_lang,
  mapActions: Actions_lang,
} = createNamespacedHelpers("lang");

export default {
  data() {
    return {
      email: "",
      password: "",
      validationError: false,
      languages: [
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
    email: {
      required,
      emailValidation: (email) => /.+@.+\..+/.test(email),
    },
    password: {
      required,
      minLength: minLength(6),
    },
  },
  computed: {
    ...State_lang(["common"]),
    ...Getters_lang(["getCommonTranslation"]),
  },
  methods: {
    ...mapActions(["login"]),
    ...Actions_lang(["fetchLangItems"]),
    loginHandler() {
      const requiredFields = ["email", "password"];
      requiredFields.map((field) => {
        this.$v[field].$touch();
      });
      if (this.$v.email.$invalid || this.$v.password.$invalid) {
        this.validationError = true;
        return;
      }
      this.login({ login: this.email, password: this.password });
    },
    chooseLang(id) {
      let choosenLang = "";
      this.languages.map((lang) => {
        lang.isActive = false;
        if (lang.id === id) {
          lang.isActive = true;
          choosenLang = lang.title;
        }
      });

      this.$router.replace({ name: "Login", params: { lang: choosenLang } });

      this.fetchLangItems({ lang: choosenLang, type: "common" });
    },
  },
  async created() {
    this.languages.map((lang) =>
      lang.title === this.$route.params.lang ? (lang.isActive = true) : ""
    );

    await this.fetchLangItems({
      lang: this.$route.params.lang,
      type: "common",
    });
  },
};
</script>

<style lang="scss" scoped>
.login-wrap {
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
