<template>
  <div></div>
</template>

<script>
export default {
  name: "PatientTabFiles",
  props: {
    records: {
      type: Array,
      default: () => [],
    },
    titleArray: [],
  },
  data() {
    return {};
  },
  created() {
    console.log("patient tab files created");
    console.log(this.records);
  },
};
</script>

<style lang="scss" scoped>
</style>