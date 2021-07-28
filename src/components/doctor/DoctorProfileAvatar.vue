<template>
  <div class="rounded-circle avatar-wrap">
    <img
      :src="avatarUrl ? imageSrc(avatarUrl) : '/images/doctor-placeholder.jpeg'"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("doctors");

export default {
  name: "DoctorProfileAvatar",
  props: {
    size: {
      type: Number,
      default: 200,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters(["imageSrc"]),
  },
};
</script>

<style lang="scss" scoped>
.avatar-wrap {
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  overflow: hidden;
  img {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: block;
    object-fit: cover;
  }
}
</style>
