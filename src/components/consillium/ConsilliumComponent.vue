<template>
  <div>
    <v-btn
      style="width: 100%;"
      color="#f9f8ff"
      class="mb-3"
      @click="createConsilliumDialog = true"
      >{{ $_lang_getDoctorTranslation("Create consillium") }}</v-btn
    >
    <!-- <div class="d-flex justify-content-between px-4">
      <p>{{ $_lang_getCommonTranslation("Sort") }}</p>
      <p>{{ $_lang_getCommonTranslation("Filter") }}</p>
    </div> -->
    <ConsilliumList :items="getConsilliumChats" @goToChat="goToChat" />

    <portal to="toolbar-action">
      <v-icon @click="search">mdi-magnify</v-icon>
    </portal>

    <CreateConsilliumDialog
      :dialog="createConsilliumDialog"
      @close="createConsilliumDialog = false"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { lang } from "../../mixins/lang";
import ConsilliumList from "./ConsilliumList";
import CreateConsilliumDialog from "./CreateConsilliumDialog";
const { mapState, mapGetters, mapActions } = createNamespacedHelpers("chats");
export default {
  mixins: [lang],
  name: "ConsilliumComponent",
  components: {
    ConsilliumList,
    CreateConsilliumDialog,
  },
  data() {
    return {
      createConsilliumDialog: false,
    };
  },
  computed: {
    ...mapState(["chats"]),
    ...mapGetters(["getConsilliumChats", "getSelectChatById"]),
  },
  watch: {
    chats: {
      immediate: true,
      handler(val) {
        if (val.length) {
          const selectedChat = this.getSelectChatById(
            Number(this.$route.params.chatId)
          );
          this.setSelectedChat(selectedChat);
        }
      },
    },
  },
  methods: {
    ...mapActions(["setSelectedChat"]),
    search() {
      console.log("search");
    },
    goToChat(id) {
      this.$router
        .push({ name: "Consillium", params: { chatId: id } })
        .catch(() => {});
      const selectedChat = this.getSelectChatById(id);
      this.setSelectedChat(selectedChat);
    },
  },
};
</script>
