<template>
  <div
    style="height: 40px; width: 40px"
    :style="{ backgroundColor: value }"
  ></div>
</template>

<script>
export default {
  props: {
    value: String,
  },
};
</script>