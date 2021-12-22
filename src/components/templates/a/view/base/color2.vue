<template>
  <v-btn block :style="{ backgroundColor: value }"> </v-btn>
</template>

<script>
export default {
  props: {
    value: String,
  },
};
</script>