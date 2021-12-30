<template>
  <div>
    <v-btn @click="save">save</v-btn>
    <v-container grid-list-md>
      <v-layout row v-for="(item, i) in samples" :key="i" py-2>
        <v-flex d-flex xs1 lx1 shrink pa-1>
          <v-btn
            @click="btnClickPlus"
            icon
            large
            v-if="i == samples.length - 1"
            :disabled="isEmpty"
          >
            <v-icon>mdi-folder-plus-outline</v-icon>
          </v-btn>
          <v-btn
            @click="samples.splice(i, 1)"
            icon
            large
            v-if="
              i !== samples.length - 1 &&
              item.sample &&
              item.sample.length === 0
            "
          >
            <v-icon>mdi-close-circle-outline</v-icon>
          </v-btn>
        </v-flex>
        <v-flex d-flex xs11 grow pa-1>
          <sample-element :value="item" @input="onInput2($event, i)" />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import SampleElement from "./SampleElement.vue";
export default {
  name: "SampleForm",
  components: {
    SampleElement: () => import("./SampleElement"),
  },
  props: {
    value: [],
    //model: Object,
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
      sample: { name: "", apply: [], color: "", sample: "" },
      samples: [],
    };
  },
  created() {
    this.samples = this.value || [this.sample];
  },
  mounted() {},
  computed: {
    canDelete(params) {
      console.log("canDelete", params, this.samples);
      if (params !== this.samples.length - 1 && !this.samples[params].sample)
        return true;
      return false;
    },
    isEmpty() {
      if (
        this.samples.findIndex((el) => {
          if (el.sample && el.sample.length > 0 && el.name) return false;
          return true;
        }) >= 0
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    save() {
      console.log("save", this.samples);
      this.$store.dispatch("doctors/fetchSamples", this.samples);
    },
    btnClickPlus() {
      this.samples.push({ name: "", apply: [], color: "", sample: "" });
    },
    async onInput(e, el) {
      console.log("onInput", el, e);
      if (typeof e === "object" && e !== null) {
        Object.assign(this.data, e);
      } else {
        this.data[el.name] = e;
      }
    },
    async onInput2(e, i) {
      //console.log("onInput", i, e, this.samples[i]);

      this.samples[i] = e;
    },
  },
};
</script>
  }
</script>

<style lang="scss" scoped>
</style>