<template>
  <div class="login-wrap">
    <div class='pa-2'>
      <v-card max-width="500" class="mb-4 pa-4">
        <form @submit.prevent="loginHandler">
          <h2 class="form__title">Войти</h2>
          <v-text-field
            v-model="$v.email.$model"
            :error="$v.email.$error"
            :error-messages="
              validationError && !$v.email.required
                ? 'Поле обязательно'
                : validationError && !$v.email.emailValidation
                ? 'Введите правильный Email'
                : ''
            "
            dense
            outlined
            @input="$v.email.$reset"
            label="Email"
          >
            email
          </v-text-field>

          <v-text-field
            v-model="$v.password.$model"
            :error="$v.password.$error"
            :error-messages="
              validationError && !$v.password.required
                ? 'Поле обязательно'
                : validationError && !$v.password.minLength
                ? 'Пароль должен содержать минимум 6 символов'
                : ''
            "
            dense
            outlined
            @input="$v.password.$reset"
            label="Пароль"
            type="password"
          >
            password
          </v-text-field>
          <v-btn type="submit">войти</v-btn>
        </form>
      </v-card>
      <v-card style="width: 100%;" class="pa-4">
        Ещё не зарегистрированы?
        <router-link to="/signup">Регистрация</router-link>
        <!-- haven't registered yet? <router-link to="/signup">Sign up</router-link> -->
      </v-card>
    </div>
  </div>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("auth");

export default {
  data() {
    return {
      email: "",
      password: "",
      validationError: false,
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
  methods: {
    ...mapActions(["login"]),
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
  },
};
</script>

<style scoped>
.login-wrap {
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
