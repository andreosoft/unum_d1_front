<template>
  <v-list-item v-if="content" class="px-0">
    <v-list-item-content>
      <v-list-item-subtitle> {{ title }}: </v-list-item-subtitle>
      <v-list-item-content>
        {{ content }}
      </v-list-item-content>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import { lang } from "./../../mixins/lang";
export default {
  mixins: [lang],
  name: "ConsilliumItemInfo",
  props: {
    content: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style></style>
