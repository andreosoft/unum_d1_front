<template>
  <v-row>
    <v-col>
      <div class="mb-4">
        <p class="ma-0">{{ $t("Поиск диагноза") }}</p>
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
        <p class="ma-0">{{ $t("Diagnosis") }}</p>
        <v-text-field
          outlined
          dense
          disabled
          hide-details
          v-model="fullDiagnos"
          @input="onInput($event, 'diagnos')"
        ></v-text-field>
      </div>
      <div class="mb-4">
        <p class="ma-0">{{ $t("Diagnosis comments") }}</p>
        <v-textarea
          ref="diagnosComments"
          no-resize
          auto-grow
          outlined
          rows="6"
          hide-details
          v-model="data['diagnosis']['diagnos_comments']"
          @focus="choiseVariant = 2"
          @input="onInput($event, 'diagnos_comments')"
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
        <div v-if="fillVar && fillVar.length">
          <v-chip
            v-for="(el, i) of fillVar"
            :key="i"
            @click.stop="fillVariantInsert(el)"
          >
            {{ el.name }}
          </v-chip>
        </div>
        <div v-else>{{ $t("No any setted samples") }}</div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { validate, validators, fillForm } from "./../../templates/mixings";
import { createNamespacedHelpers } from "vuex";
const { mapActions: Actions_doctors } = createNamespacedHelpers("doctors");

export default {
  //mixins: [fillForm],
  mixins: [validate, validators],
  name: "DiagnosisForm",
  props: {
    value: Object,
    tabName: "",
    model: Array,
  },
  data() {
    return {
      fillVariants: [],
      choiseVariant: 0,
      diagnosisItems: [],
      diagnosis: "",
      parentEl: { tab: "diagnosis", name: "diagnos" },
      diagnos: "",
      //diagnosComments: "",
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
      console.log("diagnosForm", this.data);
    },
    fillVariantInsert(txt) {
      let src = this.$refs.diagnosComments;
      let el = this.$refs.diagnosComments.$el.querySelector("textarea");
      let cursorPos = el.selectionStart;
      let value = (value = src.value);
      let out =
        (value ? value.substring(0, cursorPos) : "") +
        txt.sample +
        (value ? value.substring(cursorPos) : "");
      cursorPos += txt.sample.length;
      //      console.log(out, this.data["diagnosis"]["diagnosComments"]);
      this.data["diagnosis"]["diagnos_comments"] = out;
      //      this.$emit("change", out);
      this.$nextTick(() => el.setSelectionRange(cursorPos, cursorPos));
      el.focus();
    },
    diagnosisOnInput(e) {
      let list = [];
      if (!e.target.value.length || e.target.value.length < 1) {
        this.diagnosisItems = [];
        return;
      }
      this.fetchDiseaseByNameOnInput(e.target.value).then((res) => {
        this.diagnosisItems = res;
      });
      this.fetchDiseaseByCodeOnInput(e.target.value).then((res) => {
        this.diagnosisItems = this.diagnosisItems.concat(res);
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
    fillVar() {
      let res = this.$store.getters["settings/getSamples"](this.tabName);
      return res;
      return this.fillVariants;
    },

    fullDiagnos() {
      return (
        this.data["diagnosis"]["code"] + " " + this.data["diagnosis"]["diagnos"]
      );
    },
    data: {
      set(v) {
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
