<template>
  <v-autocomplete
    :value="value"
    @input="$emit('input', $event)"
    :items="getItems"
    item-text="name"
    item-value="name"
    outlined
    dense
    hide-details
    hide-selected
    chips
    :label="$t(label || model.title)"
    multiple
    :menu-props="{ closeOnClick: true }"

  >
    <template v-slot:selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        small
        @click="data.select"
        @click:close="remove(data.item)"
        class="mt-1"
      >
        {{ $t(data.item) }}
      </v-chip>
    </template>
    <template v-slot:item="data">
      {{ $t(data.item) }}
    </template>
  </v-autocomplete>
</template>

<script>
import modelOptions from "./../../libs/modelOptions";

export default {
  mixins: [modelOptions],
  props: {
    value: [Array],
    model: Object,
    label: {
      type: String,
      default: "",
    },
    items: [Object, Array],
    disabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  mounted() {},
  computed: {
    getItems() {
      if (this.items?.length) return this.items;
      return this.model.options;
    },
  },
  methods: {
    remove(item) {
      const index = this.value.indexOf(item);
      if (index >= 0) {
        this.value.splice(index, 1);
        this.$emit("input", this.value);
      }
    },
  },
};
</script>