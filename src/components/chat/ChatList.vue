<template>
  <div>
    <ChatItem
      v-for="(item, index) in sortedChats"
      :key="index"
      :active="activeItem === item.id"
      @click.native="chooseChat(item.id)"
      :group="item.type === 2"
      :name="getChatName(item)"
      :avatarUrl="getChatUserImage(item)"
      :lastMessage="item.last_message[0] && item.last_message[0].message"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapGetters, mapActions } = createNamespacedHelpers("chats");
const { mapState: State_auth } = createNamespacedHelpers("auth");
const { mapGetters: Getters_doctors } = createNamespacedHelpers("doctors");
import ChatItem from "./ChatItem.vue";
export default {
  name: "ChatList",
  components: {
    ChatItem,
  },
  data() {
    return {
      activeItem: null,
    };
  },
  computed: {
    ...mapState(["chats"]),
    ...mapGetters(["getSelectChatById", "getChatsButConsilliums"]),
    ...Getters_doctors(["imageSrc"]),
    ...State_auth(["userProfile"]),
    sortedChats() {
      const copy = JSON.parse(JSON.stringify(this.getChatsButConsilliums));
      const withLastMessage = [];
      const noLastMessage = [];
      copy.map((item, index) => {
        if (item.last_message.length) {
          withLastMessage.push(item);
        } else {
          noLastMessage.push(item);
        }
      });
      withLastMessage.sort((a, b) =>
        a.last_message[0].createdon < b.last_message[0].createdon ? 1 : -1
      );
      return [...withLastMessage, ...noLastMessage];
    },
  },
  watch: {
    "$route.params.chatId": {
      immediate: true,
      handler(id) {
        if (id) {
          const numID = Number(id);
          this.chooseChat(numID);
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
      this.$router
        .push({ name: "Chat", params: { chatId: id } })
        .catch(() => {});
    },
    getChatName(item) {
      if (item.type !== 1) {
        return item.name;
      }
      for (let i = 0; i < item.participants.length; i++) {
        if (item.participants[i].user_id !== this.userProfile.id) {
          if (!item.participants[i].user_name) {
            return "имя не указано";
          }
          return item.participants[i].user_name;
        }
      }
    },
    getChatUserImage(item) {
      if (item.type !== 1) {
        return;
      }
      for (let i = 0; i < item.participants.length; i++) {
        if (item.participants[i].user_id !== this.userProfile.id) {
          if (!item.participants[i].user_image) {
            return "/images/patient-placeholder.jpeg";
          }
          return `${this.imageSrc(
            item.participants[i].user_image
          )}?width=100&height=100`;
        }
      }
    },
  },
};
</script>

<style></style>
