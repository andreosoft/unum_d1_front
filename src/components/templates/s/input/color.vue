<template>
  <s-input-base-color-picker v-model="color" :size="size" />
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
    size: { type: String, default: "40px" },
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