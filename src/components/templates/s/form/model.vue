<template>
  <div>
    <div v-for="(el, i) in model" :key="i">
      <component
        v-if="el.type"
        :config="el.config ? el.config : {}"
        :is="'s-input-' + el.type"
        :model="el"
        :values="data"
        :value="data[el.name]"
        @onfocus="$emit('onfocus', [$event, el.name, data[el.name]])"
        @input="onInput($event, el)"
      ></component>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
    model: Array,
    parentEl: {},
  },
  computed: {
    data: {
      set(v) {
        console.log("model set data");
        this.$emit("input", v);
      },
      get() {
        return this.value;
      },
    },
  },
  methods: {
    async onInput(e, el) {
      console.log("model onInput");
      if (this.parentEl) {
        el = Object.assign({}, el, {
          parent: this.parentEl.name,
          tab: this.parentEl.tab,
        });
      }
      this.data[el.name] = e;
      this.$emit("validate", e);
    },
  },
};
</script>