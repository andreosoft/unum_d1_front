<template>
  <div>
    <v-container grid-list-md>
      <v-layout py-2 row wrap>
        <v-flex sm6 xs12 grow pa-1 sm-pb-0>
          <v-flex sm12 xs12 grow pa-0 pb-1>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="save"
                  :class="{ primary: !needSave, error: needSave }"
                  :disabled="!needSave"
                  depressed
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-check </v-icon>
                </v-btn>
              </template>
              <span>{{ $t("Save") }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="cancelEdit"
                  :disabled="!needSave"
                  depressed
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-close-thick </v-icon>
                </v-btn>
              </template>
              <span>{{ $t("Cancel") }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="addSample"
                  :disabled="needSave"
                  depressed
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-plus-thick </v-icon>
                </v-btn>
              </template>
              <span>{{ $t("Add") }}</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  @click="delSample"
                  :disabled="!sample"
                  depressed
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-delete-forever </v-icon>
                </v-btn>
              </template>
              <span>{{ $t("Delete") }}</span>
            </v-tooltip>
          </v-flex>
          <div v-if="samples.length">
            <sample-element
              :value="sample"
              :model="model"
              @input="onInput2($event)"
              v-if="sample"
              :key="key"
            />
            <div v-else>Select sample for edit or add new</div>
          </div>
        </v-flex>
        <v-flex sm6 xs12 pa-0 px-1 pb-1 v-if="samples.length">
          <v-card outlined min-height="100" height="100%">
            <v-card-subtitle>Your's samples</v-card-subtitle>
            <v-chip
              v-for="(el, i) of samples"
              :key="i"
              @click.stop="needSave ? true : (curSample = i)"
              :color="el.color"
            >
              <v-icon left v-if="i === curSample"> mdi-pencil-outline </v-icon>
              {{ el.name }}
            </v-chip>
          </v-card>
        </v-flex>
      </v-layout>
      <div v-if="!samples.length">No matching any samples</div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "SampleForm2",
  components: {
    SampleElement: () => import("./SampleElement2"),
  },
  props: {
    value: [],
    model: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    config: Object,
    error: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      status: 0,
      color: null,
      sampleTemp: { name: "", apply: [], color: "", sample: "", order: 0 },
      samples: [],
      curSample: null,
      origSample: "",
      needSave: false,
      isNew: false,
      key: 0,
    };
  },
  created() {
    this.samples = this.value?.[this.model.name] || [];
  },
  mounted() {},
  watch: {
    value(v) {
      this.samples = v?.[this.model.name] || [];
    },
    curSample(v) {
      this.origSample = JSON.stringify(this.samples[v]);
    },
  },
  computed: {
    sample: {
      get() {
        let res = null;
        if (this.curSample >= 0) {
          res = this.samples[this.curSample];
        }
        return res;
      },
      set(v) {
        this.needSave = true;
        this.samples[this.curSample] = v;
      },
    },
  },
  methods: {
    cancelEdit() {
      if (this.origSample) {
        console.log(this.origSample);
        this.onInput2(JSON.parse(this.origSample));

        this.needSave = this.isNew;
        this.key++;
      }
    },
    addSample() {
      this.samples.push(JSON.parse(JSON.stringify(this.sampleTemp)));
      this.curSample = this.samples.length - 1;
      this.needSave = true;
      this.isNew = true;
    },
    delSample() {
      this.samples.splice(this.curSample, 1);
      this.save();
    },
    saveFile() {
      console.log("start to save the file !");
      const fs = require("fs");
      let model = this.model.name;
      if (!model) return;
      let k = "";
      k = JSON.parse(JSON.stringify(model.toLowerCase()));
      let samples = this.samples;
      if (!samples.hasOwnProperty(k)) {
        samples = Object.assign({}, samples, { [k]: [] });
      }
      samples[k] = this.samples;
      fs.writeFileSync("samples.json", JSON.stringify(samples), "utf-8");
      try {
        fs.writeFileSync("samples.json", JSON.stringify(samples), "utf-8");
      } catch (e) {
        console.log("Failed to save the file !");
      }
      console.log("finish to save the file !");
    },
    save() {
      console.log("save", this.samples, this.model.name);

      this.$store.dispatch("doctors/updateSamples", [
        this.samples,
        this.model.name,
      ]);
      this.needSave = false;
      this.isNew = false;
    },
    async onInput(e, el) {
      console.log("onInput", el, e);
      if (typeof e === "object" && e !== null) {
        Object.assign(this.data, e);
      } else {
        this.data[el.name] = e;
      }
    },
    async onInput2(e) {
      //console.log("onInput", i, e, this.samples[i]);

      this.sample = e;
    },
  },
};
</script>
  }
</script>

<style lang="scss" scoped>
</style>