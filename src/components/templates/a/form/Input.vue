<template>
  <v-input
    class="v-input--is-label-active v-input--is-dirty v-text-field v-text-field--is-booted"
  >
    <template v-slot:default>
      <v-label :value="hasValue" :absolute="true"> {{ label }}</v-label>
      <div style="margin: 5px 0; min-height: 28px; width: 100%;">
        <slot></slot>
      </div> 
    </template>
    <template v-slot:append>
        <slot name="append"></slot>
    </template>
  </v-input>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    value: [String, Number, Array, Object, Boolean],
  },
  computed: {
    hasValue() {
      return !!this.value;
    },
  },
};
</script>