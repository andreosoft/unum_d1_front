<template>
  <v-dialog :value="dialog" :max-width="600" @input="$emit('close')">
    <v-card class="py-3 px-6">
      <v-card-title class="pa-0 pt-3">
        {{ getDoctorTranslation("New patient") }}
      </v-card-title>
      <form @submit.prevent="createNewPatientHandler">
        <v-text-field
          :label="getCommonTranslation('Surname')"
          outlined
          dense
          class="mb-2"
          v-model="newPatient.surname"
        >
        </v-text-field>
        <v-text-field
          :label="getCommonTranslation('Name')"
          outlined
          dense
          class="mb-2"
          v-model="newPatient.name"
        >
        </v-text-field>
        <v-text-field
          :label="getCommonTranslation('Middle name')"
          outlined
          dense
          class="mb-2"
          v-model="newPatient.middleName"
        >
        </v-text-field>
        <v-input
          dense
          class="v-input--is-label-active v-input--is-dirty v-text-field v-text-field--is-booted"
        >
          <template v-slot:default>
            <v-label :value="true" :absolute="true">{{
              getCommonTranslation("Date of birth")
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
                    {{ getCommonTranslation("Cancel") }}
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
            countrySelectorLabel: getCommonTranslation('Country code'),
            phoneNumberLabel: getCommonTranslation('Phone'),
          }"
          class="mb-7"
          no-example
        />
        <v-text-field
          :label="getCommonTranslation('Email')"
          hide-details
          dense
          outlined
          class="mb-2"
          v-model="newPatient.email"
          type="email"
        >
        </v-text-field>

        <v-spacer class="mb-6"></v-spacer>
        <v-btn class="mr-3" @click="$emit('close')">
          {{ getCommonTranslation("Cancel") }}
        </v-btn>
        <v-btn type="submit" :disabled="isInvalid">
          {{ getCommonTranslation("Create") }}
        </v-btn>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import dayjs from "dayjs";

const { mapState, mapActions } = createNamespacedHelpers("patients");
const { mapState: State_auth } = createNamespacedHelpers("auth");
const {
  mapState: State_lang,
  mapGetters: Getters_lang,
} = createNamespacedHelpers("lang");
export default {
  name: "NewPatientDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showBirthdayPicker: false,
      newPatient: {
        name: "",
        surname: "",
        middleName: "",
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
    ...Getters_lang(["getDoctorTranslation", "getCommonTranslation"]),
    isInvalid() {
      if (
        this.newPatient.name === "" ||
        this.newPatient.surname === "" ||
        this.newPatient.middleName === "" ||
        this.newPatient.birthday === ""
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    ...mapActions(["createNewPatient"]),
    createNewPatientHandler() {
      const capitalizedName = this.capitalizeString(this.newPatient.name);
      const capitalizedSurname = this.capitalizeString(this.newPatient.surname);
      const capitalizedMiddleName = this.capitalizeString(
        this.newPatient.middleName
      );
      const data = {
        name: `${capitalizedSurname} ${capitalizedName} ${capitalizedMiddleName}`,
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
      this.$emit("close");
      this.newPatient.name = "";
      this.newPatient.birthday = "";
      this.newPatient.phone = "";
      this.newPatient.email = "";
    },
    capitalizeString(str) {
      return str[0].toUpperCase() + str.slice(1);
    },
    onChange() {
      this.showBirthdayPicker = false;
    },
  },
};
</script>

<style></style>
