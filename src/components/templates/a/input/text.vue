<template>
  <v-textarea
    outlined
    :value="value"
    :label="model.title"
    :error-messages="error"
    :disabled="disabled"
    @focus="$emit('onfocus', $event)"
    @input="$emit('input', $event)"
  ></v-textarea>
</template>

<script>
export default {
  props: {
    value: [String, Number],
    model: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
  },
};
</script>