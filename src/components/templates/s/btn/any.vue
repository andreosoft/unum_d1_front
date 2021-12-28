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
        <v-icon v-if="icon.length">{{ icon }} </v-icon>
        <div v-else>{{ $t(title) }}</div>
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
    title: { type: String, default: "button" },
    icon: { type: String, default: " mdi-gesture-tap-button" },
  },
};
</script>

<style lang="scss" scoped>
</style>