<template>
  <div>
    <v-container grid-list-md>
      <v-layout py-2 row wrap>
        <v-flex sm6 xs12 grow pa-1 sm-pb-0>
          <v-flex sm12 xs12 grow pa-0 pb-1>
            <SBtnAny
              title="Save"
              icon="mdi-check"
              @btnClick="save"
              :disabled="!needSave"
              :classBtn="{ primary: !needSave, error: needSave }"
            />
            <SBtnAny
              title="Cancel"
              icon="mdi-close-thick"
              @btnClick="cancelEdit"
              :disabled="!needSave"
            />

            <SBtnAny
              title="Add"
              icon="mdi-plus-thick"
              @btnClick="addElement"
              :disabled="needSave"
            />
            <SBtnAny
              title="Delete"
              icon="mdi-delete-forever"
              @btnClick="delElement"
              :disabled="!sample"
            />
          </v-flex>
          <div v-if="samples.length">
            <sample-element
              :value="sample"
              :model="model"
              @input="onInput($event)"
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
              class="ml-1 mt-1"
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
  name: "SampleForm",
  components: {
    SampleElement: () => import("./SampleElement"),
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
        let original = JSON.parse(this.origSample);
        Object.keys(original).forEach((k) => {
          this.sample[k] = original[k];
        });
        //this.onInput2(JSON.parse(this.origSample));
        this.needSave = this.isNew;
        //this.key++;
      }
    },
    addElement() {
      this.samples.push(JSON.parse(JSON.stringify(this.sampleTemp)));
      this.curSample = this.samples.length - 1;
      this.needSave = true;
      this.isNew = true;
    },
    delElement() {
      this.samples.splice(this.curSample, 1);
      this.save();
    },
    save() {
      this.$store.dispatch("settings/updateSamples", [
        this.samples,
        this.model.name,
      ]);
      this.needSave = false;
      this.isNew = false;
    },
    async onInput(e) {
      //console.log("onInput", i, e, this.samples[i]);
      this.sample = e;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>