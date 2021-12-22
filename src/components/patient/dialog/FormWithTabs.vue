<template>
  <v-row>
    <v-col>
      <v-tabs vertical v-model="tab">
        <v-tab v-for="(el, i) in model" :key="i">
          <v-card-text class="text-wrap">{{ $t(el.title) }}</v-card-text>
        </v-tab>
        <v-tab-item v-for="(el, i) in model" :key="i">
          <v-row>
            <v-col :cols="8">
              <a-form-model2
                v-model="data[el.name]"
                :model="el.fields"
                :parentEl="{ name: el.name, tab: tabName }"
                :errors="errors"
                @onfocus="onFocus($event)"
                @validate="$emit('validate', $event)"
              />
            </v-col>
            <v-col cols="4">
              <v-btn-toggle v-model="toggleHistory" mandatory>
                <v-btn small>{{ $t("history") }} </v-btn>
                <v-btn small>{{ $t("samples") }} </v-btn>
              </v-btn-toggle>
              <div v-if="toggleHistory === 0">
                <li
                  v-for="(els, i) in history[el.name]"
                  v-if="els && els !== null"
                >
                  {{ $t(i) }}:
                  <span v-for="el in els">{{ el.body }};<br /> </span>
                </li>
              </div>
              <div v-else>
                <v-chip
                  class="ma-1"
                  v-for="(el, i) of fillVar"
                  :key="i"
                  @click.stop="fillVariantInsert(el)"
                >
                  {{ el.name }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
    </v-col>
  </v-row>
</template>

<script>
import { validate, validators } from "./../../templates/mixings";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("patients");

export default {
  mixins: [validate, validators],
  name: "FormWithTabs",
  props: {
    value: Object,
    //valueData: Object,
    tabName: "",
    model: Array,
    history: {},
  },
  data() {
    return {
      tab: 0,
      errors: {},
      validators: {},
      toggleHistory: 0,
      focusedEl: null,
      focusedName: null,
    };
  },

  methods: {
    // ...mapActions(["addClinicalRecord", "uploadFile"]),

    fillForm() {
      //      console.log(this.tabName + " Form Fill Form");
      this.data = Object.assign({}, this.data, this.value);
    },
    fillVariantInsert(txt) {
/*       console.log(
        "fillVariantInsert",
        this.model[this.tab].name,

        this.focusedName,
        this.data?.[this.model[this.tab].name]?.[this.focusedName],
        this.data.Complaints
      ); */
      let src = this.focusedEl;
      let el = this.focusedEl; //.$el.querySelector("textarea");
      let cursorPos = el.selectionStart;
      let value = (value = src.value);
      let out =
        (value ? value.substring(0, cursorPos) : "") +
        txt.sample +
        (value ? value.substring(cursorPos) : "");
      cursorPos += txt.sample.length;
      this.data.[this.model[this.tab].name].[this.focusedName]=out
      //this.focusedName = out;
      //      console.log(out, this.data["diagnosis"]["diagnosComments"]);
      // this.data[this.focusedName] = out;
      //      this.$emit("change", out);
      this.$nextTick(() => el.setSelectionRange(cursorPos, cursorPos));
      el.focus();
    },
    onFocus(e) {
      this.focusedEl = e[0].srcElement;
      this.focusedName = e[1];
      /* console.log("onFocus", e, this.focusedEl); */
    },
  },
  created() {
    this.fillForm();
  },
  computed: {
    data: {
      set(v) {
        //  console.log("model emit input", v);
        this.$emit("input", v);
      },
      get() {
        return this.value;
      },
    },
    fillVar() {
      let res = this.$store.getters["doctors/getSamples"](this.tabName);
      if (this.focusedName) {
        res =res.filter((el)=>{if (!el.apply.length) {return true;} return el.apply.includes(this.focusedName)})
        }
      return res;
    },
  },
};
</script>

<style></style>
