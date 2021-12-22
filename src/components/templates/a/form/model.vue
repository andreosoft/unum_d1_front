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
        @onfocus="$emit('onfocus', $event, data[el.name])"
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
        console.log("model emit input", v);
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
      //      let ee = { [el.parent]: { [el.name]: e } };
      //      console.log("onInput", this.parent, el, e, this.data);
      if (typeof e === "object" && e !== null) {
        Object.assign(this.data, e);
      } else {
        this.data[el.name] = e;
      }
      /*if (el.parent) {
        this.data[el.tab][el.parent][el.name] = e;
      } else {
        this.data[el.tab][el.name] = e;
      }
*/
      //      this.$emit("validate", { e, el });
      this.$emit("validate", e);
    },
  },
};
</script>