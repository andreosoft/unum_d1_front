<template>
  <div>
    <div v-for="(el, i) in model" :key="i">
      <component
        v-if="el.type"
        :config="el.config ? el.config : {}"
        :is="'a-input-' + el.type"
        :model="el"
        :values="data"
        :value="data[el.name]"
        @onfocus="$emit('onfocus', [$event, el.name, data[el.name]])"
        @input="onInput($event, el)"
        :error="el.type == 'ref' ? errors[el.name + '_id'] : errors[el.name]"
      ></component>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
    model: Array,
    errors: Object,
    parentEl: {},
  },
  computed: {
    data: {
      set(v) {
        this.$emit("input", v);
      },
      get() {
        return this.value;
      },
    },
  },
  methods: {
    async onInput(e, el) { 
      el = Object.assign({}, el, {
        parent: this.parentEl.name,
        tab: this.parentEl.tab,
      });

      this.data[el.name] = e;
      this.$emit("validate", e);
    },
  },
};
</script>