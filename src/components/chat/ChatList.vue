<template>
  <div>
    <ChatItem
      v-for="(item, index) in chats"
      :key="index"
      :active="activeItem === item.chat_id"
      @click.native="chooseChat(item.chat_id)"
      :name="String(item.name)"
      :avatarUrl="item.image && item.image"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapGetters, mapActions } = createNamespacedHelpers("chats");
import ChatItem from "./ChatItem.vue";
export default {
  name: "ChatList",
  components: {
    ChatItem,
  },
  data() {
    return {
      activeItem: 1,
      chatItems: [
        {
          notification: 1,
          id: 1,
        },
        {
          notification: 323,
          id: 2,
        },
        {
          notification: 4,
          id: 3,
        },
        {
          notification: 2,
          id: 4,
        },
        {
          notification: 312312,
          id: 5,
        },
      ],
    };
  },
  computed: {
    ...mapState(["chats"]),
    ...mapGetters(["getSelectChatById"]),
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler(id) {
        if (id) {
          const numID = Number(id);
          this.chooseChat(numID);
        }
      },
    },
    chats: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.length) {
          const selectedChat = this.getSelectChatById(
            Number(this.$route.params.id)
          );
          this.setSelectedChat(selectedChat);
        }
      },
    },
  },
  methods: {
    ...mapActions(["setSelectedChat"]),
    chooseChat(id) {
      const selectedChat = this.getSelectChatById(id);
      this.setSelectedChat(selectedChat);
      this.activeItem = id;
      this.$router.push({ name: "Chat", params: { id } }).catch(() => {});
    },
  },
};
</script>

<style></style>
