<template>
  <v-input outlined>
    <div outlined>
      <a-input-base-color-picker v-model="color" />
    </div>
  </v-input>
</template>

<script>
export default {
  props: {
    value: [String, Number],
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
  computed: {
    color: {
      get: function () {
        if (!this.value) return "#FFffffFF";
        return this.value;
      },
      set: function (v) {
        this.$emit("input", v);
      },
    },
  },
};
</script>