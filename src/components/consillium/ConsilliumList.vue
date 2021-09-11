<template>
  <v-expansion-panels accordion flat tile>
    <ConsilliumItem v-for="(item, index) in items" :key="index" :item="item" />
  </v-expansion-panels>
</template>

<script>
import ConsilliumItem from "./ConsilliumItem";
export default {
  name: "ConsilliumList",
  components: {
    ConsilliumItem,
  },
  props: {
    items: {
      type: Array,
      default: () => {},
    },
  },
};
</script>
