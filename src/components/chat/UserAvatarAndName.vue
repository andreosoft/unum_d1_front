<template>
  <v-list-item @click="$emit('click')" :ripple="false" :disabled="disabled">
    <v-list-item-avatar :size="avatarSize">
      <v-img
        :src="
          avatarUrl
            ? `${imageSrc(avatarUrl)}?width=100&height=100`
            : '/images/doctor-placeholder.jpeg'
        "
      ></v-img>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="text-truncate text-no-wrap">
        {{ name }}
      </v-list-item-title>
      <slot name="subtitle"></slot>
    </v-list-item-content>
    <slot name="badge"></slot>
  </v-list-item>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("doctors");
export default {
  name: "UserAvatarAndName",
  props: {
    online: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "",
    },
    avatarSize: {
      type: Number,
      default: 50,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["imageSrc"]),
  },
};
</script>

<style lang="scss" scoped>
.v-list-item {
  background-color: transparent !important;
  width: 50%;
  &:after,
  &:before {
    content: unset;
  }
}
.theme--light.v-list-item--disabled {
  color: black;
}
.online {
  &:before {
    content: "●";
    color: #35d11b;
  }
}
.offline {
  &:before {
    content: "●";
  }
}
</style>
