<template>
  <div>
    {{ origSample }}
    <v-container grid-list-md>
      <v-btn
        @click="save"
        :class="{ primary: !needSave, error: needSave }"
        :disabled="!needSave"
      >
        <v-icon>mdi-check </v-icon>
      </v-btn>
      <v-btn @click="cancelEdit" :disabled="!needSave">
        <v-icon>mdi-close-thick </v-icon>
      </v-btn>
      <v-btn @click="addSample" :disabled="needSave">
        <v-icon>mdi-plus-thick </v-icon>
      </v-btn>
      <v-btn @click="delSample" :disabled="!sample">
        <v-icon>mdi-delete-forever </v-icon>
      </v-btn>
      <v-layout py-2 v-if="samples.length" row wrap>
        <v-flex sm6 xs12 grow pa-1>
          <sample-element
            :value="sample"
            :model="model"
            @input="onInput2($event)"
            v-if="sample"
          />
          <div v-else>Select sample for edit or add new</div>
        </v-flex>
        <v-flex sm6 xs12 pa-0 px-1>
          <v-card min-height="210">
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
      <div v-else>No matching any samples</div>
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
        this.onInput2(JSON.parse(this.origSample));
        let cs = JSON.stringify(this.curSample);
        this.curSample = -1;
        this.curSample = JSON.parse(cs);
        this.needSave = false;
      }
    },
    addSample() {
      this.samples.push(JSON.parse(JSON.stringify(this.sampleTemp)));
      this.curSample = this.samples.length - 1;
      this.needSave = true;
    },
    delSample() {
      this.samples.splice(this.curSample, 1);
      this.save();
    },
    save() {
      console.log("save", this.samples, this.model.name);

      this.$store.dispatch("doctors/updateSamples", [
        this.samples,
        this.model.name,
      ]);
      this.needSave = false;
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