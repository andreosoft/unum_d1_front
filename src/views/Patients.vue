<template>
  <div>
    <div
      class="d-flex justify-content-between align-items-center pt-3 px-3"
      style="width: 100%;"
    >
      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs">Сортировать</v-btn>
        </template>
        <v-list>
          <v-list-item @click="sortPatientsBy('date')">По дате</v-list-item>
          <v-list-item @click="sortPatientsBy('alphabet')"
            >По имени</v-list-item
          >
        </v-list>
      </v-menu>
      <v-btn @click="newPatientDialog = true">новый пациент</v-btn>
    </div>
    <PatientCardList :patients="patients" />

    <v-dialog v-model="newPatientDialog" :max-width="600">
      <v-card class="py-3 px-6">
        <v-card-title class="pa-0 pt-3">
          НОВЫЙ ПАЦИЕНТ
        </v-card-title>
        <form @submit="createNewPatientHandler">
          <v-text-field
            label="Имя"
            outlined
            dense
            class="mb-2"
            v-model="newPatient.name"
          >
          </v-text-field>
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
                        {{ newPatient.birthday }}
                      </div>
                    </slot>
                  </template>
                  <v-date-picker
                    v-if="showBirthdayPicker"
                    v-model="newPatient.birthday"
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
                    <v-btn text color="blue darken-1" @click="onChange">
                      ок
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </div>
            </template>
          </v-input>
          <vue-phone-number-input
            v-model="newPatient.phone"
            default-country-code="KG"
            show-code-on-list
            :translations="{
              countrySelectorLabel: 'Код страны',
              phoneNumberLabel: 'Номер телефона',
            }"
            class='mb-7'
            no-example
          />
          <v-text-field
            label="Email"
            hide-details
            dense
            outlined
            class="mb-2"
            v-model="newPatient.email"
          >
          </v-text-field>

          <v-spacer class="mb-6"></v-spacer>
          <v-btn class="mr-3" @click="newPatientDialog = false">ОТМЕНИТЬ</v-btn>
          <v-btn type="submit" :disabled="isInvalid">СОЗДАТЬ</v-btn>
        </form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import PatientCardList from "./../components/patient/PatientCardList.vue";
import dayjs from "dayjs";

const { mapState, mapActions } = createNamespacedHelpers("patients");
const { mapState: State_auth } = createNamespacedHelpers("auth");
const { mapState: State_lang } = createNamespacedHelpers("lang");

export default {
  components: {
    PatientCardList,
  },
  data() {
    return {
      newPatientDialog: false,
      showBirthdayPicker: false,
      newPatient: {
        name: "",
        birthday: "",
        phone: "",
        email: "",
        info: "",
      },
      currentDate: dayjs().format("YYYY-MM-DD"),
    };
  },
  computed: {
    ...mapState(["patients"]),
    ...State_auth(["userProfile"]),
    ...State_lang(["doctor", "common"]),
    isInvalid() {
      if (
        this.newPatient.name === "" ||
        this.newPatient.birthday === "" ||
        this.newPatient.email === ""
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    ...mapActions(["createNewPatient", "sortPatientsBy"]),
    createNewPatientHandler() {
      const capitalizedName =
        this.newPatient.name[0].toUpperCase() + this.newPatient.name.slice(1);
      const data = {
        name: capitalizedName,
        birthday: this.newPatient.birthday,
        inn: null,
        doc_soc: null,
        doc_pass: null,
        phones: [this.newPatient.phone],
        email: this.newPatient.email,
        info: null,
        anamnesis: null,
        createdby_id: this.userProfile.doctor_id,
      };
      this.createNewPatient(data);
      this.newPatientDialog = false;
      this.newPatient.name = "";
      this.newPatient.birthday = "";
      this.newPatient.phone = "";
      this.newPatient.email = "";
    },
    getTranslation(item) {
      let result = "";
      switch (item) {
        case "name":
          result = this.common.Name;
          break;
        case "birthday":
          result = this.doctor["Date of birth"];
          break;
        case "phone":
          result = this.common.Phone;
          break;
        case "email":
          result = this.common.Email;
          break;
      }
      return result;
    },
    onChange() {
      this.showBirthdayPicker = false;
    },
  },
};
</script>

<style></style>
