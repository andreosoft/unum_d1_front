<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        depressed
        v-bind="attrs"
        v-on="on"
        :disabled="disabled"
        @click="$emit('btnClick')"
      >
        <v-icon>mdi-delete-forever </v-icon>
      </v-btn>
    </template>
    <span>{{ $t(title) }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    title: { type: String, default: "Delete" },
  },
};
</script>

<style lang="scss" scoped>
</style>