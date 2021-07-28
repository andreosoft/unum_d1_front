<template>
  <div v-if="array && array.length" class="pb-3">
    <h4>{{ getDoctorTranslation(title) }}</h4>
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
import { createNamespacedHelpers } from "vuex";
import AnamnesisSectionItem from "./AnamnesisSectionItem";

const { mapGetters } = createNamespacedHelpers("lang");

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
    array: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters(["getDoctorTranslation"]),
  },
};
</script>

<style></style>
