<template>
  <v-expansion-panels accordion flat tile>
    <ConsilliumItem
      v-for="(item, index) in items"
      :key="index"
      :item="item"
      @goToChat="$emit('goToChat', $event)"
      :class="{ 'mb-2': index !== items.length }"
    />
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
