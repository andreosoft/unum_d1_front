<template>
  <v-btn
    block
    :style="{ backgroundColor: value }"
    height="40px"
    width="40px"
    mx-1
  >
  </v-btn>
</template>

<script>
export default {
  props: {
    value: String,
  },
};
</script>