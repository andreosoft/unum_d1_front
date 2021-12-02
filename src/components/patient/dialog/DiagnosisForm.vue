<template>
  <v-row>
    <v-col>
      <div class="mb-4">
        <p class="ma-0">{{ getDoctorTranslation("Поиск диагноза") }}</p>
        <v-text-field
          outlined
          dense
          hide-details
          v-model="diagnosis"
          @input.native="diagnosisOnInput"
          @focus="choiseVariant = 1"
        ></v-text-field>
      </div>
      <div class="mb-4">
        <p class="ma-0">{{ getDoctorTranslation("Diagnosis") }}</p>
        <v-text-field
          outlined
          dense
          disabled
          hide-details
          v-model="data['diagnosis']['diagnos']"
          @input="onInput($event, 'diagnos')"
        ></v-text-field>
      </div>
      <div class="mb-4">
        <p class="ma-0">{{ getDoctorTranslation("Diagnosis comments") }}</p>
        <v-textarea
          ref="diagnosComments"
          no-resize
          auto-grow
          outlined
          rows="6"
          hide-details
          v-model="data['diagnosis']['diagnosComments']"
          @focus="choiseVariant = 2"
          @input="onInput($event, 'diagnosComments')"
        ></v-textarea>
      </div>
    </v-col>
    <v-col>
      <div v-show="choiseVariant == 1">
        <v-list-item
          v-for="el of diagnosisItems"
          @click="
            data['diagnosis']['diagnos'] = el.name;
            data['diagnosis']['code'] = el.code;
          "
        >
          [{{ el.code }}] {{ el.name }}
        </v-list-item>
      </div>
      <div v-show="choiseVariant == 2">
        <v-chip v-for="el of fillVariants" @click.stop="fillVariantInsert(el)">
          {{ el }}
        </v-chip>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { validate, validators, fillForm } from "./../../templates/mixings";
import { createNamespacedHelpers } from "vuex";
const { mapActions: Actions_doctors } = createNamespacedHelpers("doctors");
const { mapGetters: Getters_lang } = createNamespacedHelpers("lang");

export default {
  //mixins: [fillForm],
  mixins: [validate, validators],
  name: "DiagnosisForm",
  props: {
    value: Object,

    model: Array,
  },
  data() {
    return {
      fillVariants: [
        "набор",
        "слов",
        "или фраз",
        "для быстрого ввода",
        "и даже целого текста",
        "и форматированного ввода \nимя:\n фамилия:\n ",
      ],
      choiseVariant: 0,
      diagnosisItems: [],
      diagnosis: "",
      parentEl: { tab: "diagnosis", name: "diagnos" },
      diagnos: "",
      diagnosComments: "",
      errors: {},
      validators: {},
    };
  },

  methods: {
    ...Actions_doctors([
      "fetchDiseaseByNameOnInput",
      "fetchDiseaseByCodeOnInput",
    ]),
    fillForm() {
      this.data = Object.assign({}, this.data, this.value);
    },
    fillVariantInsert(txt) {
      let src = this.$refs.diagnosComments;
      let el = this.$refs.diagnosComments.$el.querySelector("textarea");
      let cursorPos = el.selectionStart;
      let value = (value = src.value);
      let out =
        (value ? value.substring(0, cursorPos) : "") +
        txt +
        (value ? value.substring(cursorPos) : "");
      cursorPos += txt.length;
      //      console.log(out, this.data["diagnosis"]["diagnosComments"]);
      this.data["diagnosis"]["diagnosComments"] = out;
      //      this.$emit("change", out);
      this.$nextTick(() => el.setSelectionRange(cursorPos, cursorPos));
      el.focus();
    },
    diagnosisOnInput(e) {
      if (!e.target.value.length || e.target.value.length < 1) {
        this.diagnosisItems = [];
        return;
      }
      this.fetchDiseaseByNameOnInput(e.target.value).then((res) => {
        this.diagnosisItems = res;
      });
      //      console.log(this.diagnosisItems, "after each request");
      this.fetchDiseaseByCodeOnInput(e.target.value).then((res) => {
        this.diagnosisItems = res;
        console.log(this.diagnosisItems, "after each request");
      });
      // A16.0
    },

    async onInput(e, name) {
      let el = {
        tab: this.parentEl.tab,
        parent: this.parentEl.name,
        name: name,
      };

      this.$emit("validate", { e, el });
    },
  },
  created() {
    this.fillForm();
  },
  computed: {
    ...Getters_lang(["getDoctorTranslation"]),
    data: {
      set(v) {
        console.log("model emit input", v);
        this.$emit("input", v);
      },
      get() {
        return this.value;
      },
    },
  },
};
</script>

<style></style>
