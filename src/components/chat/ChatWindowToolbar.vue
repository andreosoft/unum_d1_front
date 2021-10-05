<template>
  <v-toolbar
    :elevation="0"
    style="border-bottom: 1px solid #C4C4C4; position: sticky; top: 0; flex-grow: unset;"
  >
    <v-icon
      v-if="$vuetify.breakpoint.smAndDown"
      @click="$router.push({ name: 'Chats' })"
      >mdi-chevron-left</v-icon
    >
    <UserAvatarAndName
      :name="selectedChat && selectedChat.name"
      :avatarUrl="selectedChat && selectedChat.image"
      :online="online"
      @click="$emit('click')"
    />
    <v-spacer></v-spacer>
    <v-toolbar-items class="align-items-center">
      <ChatWindowToolbarActions
        v-for="(action, index) in actions"
        :key="index"
        :class="{ 'mr-2': index !== actions.length - 1 }"
        :action="action"
      />
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("chats");
import UserAvatarAndName from "./UserAvatarAndName";
import ChatWindowToolbarActions from "./ChatWindowToolbarActions";
export default {
  name: "ChatWindowToolbar",
  components: {
    UserAvatarAndName,
    ChatWindowToolbarActions,
  },
  props: {
    online: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      actions: [
        {
          icon: "mdi-phone",
          bgColor: "#406278",
          color: "white",
        },
        {
          icon: "mdi-video-outline",
          bgColor: "#406278",
          color: "white",
        },
        {
          icon: "mdi-magnify",
          bgColor: "transparent",
          color: "#406278",
        },
      ],
    };
  },
  computed: {
    ...mapState(["selectedChat"]),
  },
};
</script>

<style lang="scss" scoped>
// .v-toolbar__content {
//   padding-left: 0;
// }
.v-toolbar__content {
  padding: 0px !important;
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
