<template>
  <div v-if="array && array.length" class="pb-3">
    <h4>{{ $t(title) }}</h4>
    <ul class="mb-3">
      <AnamnesisSectionItem
        v-for="(item, index) in array"
        :key="index"
        :section="item"
      />
    </ul>

    <v-divider></v-divider>
  </div>
</template>

<script>
import AnamnesisSectionItem from "./AnamnesisSectionItem";

export default {
  name: "AnamnesisSection",
  components: {
    AnamnesisSectionItem,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    array: null,
  },
  computed: {},
  methods: {},
};
</script>

<style></style>
