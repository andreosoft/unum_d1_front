<template>
  <v-dialog :value="dialog" :max-width="600" @click:outside="clickOutside">
    <v-card class="py-3 px-6">
      <v-card-title class="pa-0 pb-4 pt-3">
        {{ $t("New patient") }}
      </v-card-title>
      <form @submit.prevent="createNewPatientHandler">
        <v-text-field
          :label="$t('Surname')"
          outlined
          dense
          class="mb-2"
          v-model="newPatient.surname"
        >
        </v-text-field>
        <v-text-field
          :label="$t('Name')"
          outlined
          dense
          class="mb-2"
          v-model="newPatient.name"
        >
        </v-text-field>
        <v-text-field
          :label="$t('Middle name')"
          outlined
          dense
          class="mb-2"
          v-model="newPatient.middleName"
        >
        </v-text-field>
        <v-input
          dense
          class="
            v-input--is-label-active v-input--is-dirty
            v-text-field v-text-field--is-booted
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
                    {{ $t("Cancel") }}
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
          default-country-code="KG"
          v-model="phoneModel"
          @update="numberInput"
          show-code-on-list
          :translations="{
            countrySelectorLabel: $t('Country code'),
            phoneNumberLabel: $t('Phone'),
          }"
          class="mb-7"
          no-example
        />
        <v-text-field
          :label="$t('Email')"
          hide-details
          dense
          outlined
          class="mb-2"
          v-model="newPatient.email"
          type="email"
        >
        </v-text-field>

        <v-spacer class="mb-6"></v-spacer>
        <v-btn class="mr-3" @click="resetForm">
          {{ $t("Cancel") }}
        </v-btn>
        <v-btn type="submit" :disabled="isInvalid">
          {{ $t("Create") }}
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

export default {
  name: "NewPatientDialog",
  props: {
    dialog: {
      type: Boolean,
      default: true,
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
      phoneModel: "",
    };
  },
  computed: {
    ...mapState(["patients"]),
    ...State_auth(["userProfile"]),
    //...State_lang(["doctor", "common"]),
    isInvalid() {
      if (
        this.newPatient.name === "" ||
        this.newPatient.surname === "" ||
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
        phones: this.newPatient.phone,
        email: this.newPatient.email,
        info: null,
        anamnesis: null,
        createdby_id: this.userProfile.doctor_id,
      };
      this.createNewPatient(data);
      this.resetForm();
    },
    capitalizeString(str = "") {
      if (!str.length) return "";
      return str[0].toUpperCase() + str.slice(1);
    },
    onChange() {
      this.showBirthdayPicker = false;
    },
    numberInput(val) {
      this.newPatient.phone = val.formatInternational;
    },
    clickOutside() {
      this.$router.push({ name: "Patients" });
    },
    resetForm() {
      this.newPatient.name = "";
      this.newPatient.birthday = "";
      this.newPatient.phone = "";
      this.newPatient.email = "";
      this.newPatient.surname = "";
      this.newPatient.middleName = "";
      this.phoneModel = "";
      this.clickOutside();
    },
  },
};
</script>

<style></style>
