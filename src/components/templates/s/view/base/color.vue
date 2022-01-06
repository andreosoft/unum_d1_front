<template>
  <v-btn
    block
    :style="{ backgroundColor: value }"
    :height="size"
    :width="size"
    :class="classList"
    mx-1
  >
  </v-btn>
</template>

<script>
export default {
  props: {
    value: String,
    size: { type: String, default: "40px" },
    classList: { type: String, default: "" },
  },
};
</script>