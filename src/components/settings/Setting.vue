<template>
  <div>
    <component :is="$route.params.cname"></component>
  </div>
</template>

<script>
export default {
  name: "Setting",
  props: {},

  components: {
    SetClinicalRecord: () => import("./SetClinicalRecord"),
  },
  computed: {},
  methods: {},
  created() {
    //console.log(this.$router.params.cname);
  },
};
</script>

<style lang="scss" scoped>
</style>