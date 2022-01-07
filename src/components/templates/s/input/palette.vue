<template>
  <v-card outlined class="pa-3" label="fff">
    <v-flex row wrap pa-2>
      <div v-for="(color, i) in palette" :key="i">
        <s-input-base-color-picker
          :size="'30px'"
          :classList="'pa-1'"
          v-model="palette[i]"
          @input="onInput($event, i)"
        />
      </div>
    </v-flex>
  </v-card>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: [],
    },
    model: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
  },
  data() {
    return { paletts: [] };
  },
  created() {
    this.paletts = this.value || [];
  },
  computed: {
    palette: {
      get() {
        if (!this.value) {
          return [];
        }
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      },
    },
  },
  methods: {
    onInput(e, i) {
      console.log("update curColor", e, i);
      this.palette[i] = e;
      this.palette = this.palette;
    },
  },
};
</script>