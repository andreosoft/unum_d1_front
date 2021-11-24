<template>
  <div class="chat-window">
    <div class="chat-window__container">
      <ChatWindowToolbar @click="openCompanionDialog" />
      <div class="chat-window__messages pa-3" ref="container">
        <MessagesList :messages="formattedMessages" class="messages__list" />
      </div>
      <UserInput
        @sendMessage="sendMessage"
        @attachFile="attachFile"
        @chooseEmoji="chooseEmoji"
      />
    </div>
    <v-dialog
      v-model="companionDialog"
      :max-width="580"
      content-class="rounded-0 dialog"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
      <v-card color="#EEEEEE" tile :min-height="680">
        <CompanionInfo
          :disabled="selectedChat && selectedChat.type !== 1"
          @close="companionDialog = false"
          :showPhone="selectedChat && selectedChat.type === 1"
          @click="openUserProfile(getSelectedChatUserId)"
        />

        <v-card
          v-if="selectedChat && selectedChat.type !== 1"
          tile
          style="box-shadow: 0px 4px 8px rgba(186, 186, 186, 0.25);"
          class="mb-3 pa-4"
        >
          <v-card-title class="pa-0">Участники</v-card-title>
          <v-list-item
            class="px-0"
            v-for="member in getSelectedChatParticipants"
            :key="member.user_id"
            @click="openUserProfile(member.user_id)"
          >
            {{ member.user_name }}
          </v-list-item>

          <v-btn
            v-show="selectedChatParticipantsShort"
            text
            small
            class="pa-0"
            @click="selectedChatParticipantsShort = false"
            >{{ $_lang_getDoctorTranslation("Show all") }}</v-btn
          >
        </v-card>

        <CompanionEducation
          v-if="selectedChat && selectedChat.type === 1 && !isCompanionPatient"
          :specialty="getDoctorByUserId(getCompanionID).info.doctor_specialty"
          :country="getDoctorByUserId(getCompanionID).country"
        />

        <CompanionMedia
          :photos="getPhotos"
          :videos="getVideos"
          :files="getFiles"
        />

        <CompanionActions
          @removeChat="removeChat"
          @clearHistory="clearHistory"
          :consilium="selectedChat && selectedChat.type === 3"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { lang } from "./../../mixins/lang";
import dayjs from "dayjs";
const { mapState, mapActions } = createNamespacedHelpers("chats");
const { mapState: State_auth } = createNamespacedHelpers("auth");
const { mapActions: Actions_alerts } = createNamespacedHelpers("alerts");
const { mapState: State_patients } = createNamespacedHelpers("patients");
const { mapState: State_doctors, mapGetters: Getters_doctors } = createNamespacedHelpers("doctors");
import ChatWindowToolbar from "./ChatWindowToolbar";
import MessagesList from "./MessagesList";
import CompanionInfo from "./CompanionInfo";
import CompanionEducation from "./CompanionEducation";
import CompanionMedia from "./CompanionMedia";
import CompanionActions from "./CompanionActions";
import UserInput from "./UserInput";
import ImagePreview from "./ImagePreview";
export default {
  mixins: [lang],
  name: "ChatWindow",
  components: {
    ChatWindowToolbar,
    MessagesList,
    CompanionInfo,
    CompanionEducation,
    CompanionMedia,
    CompanionActions,
    UserInput,
    ImagePreview,
  },
  data() {
    return {
      companionDialog: false,
      selectedChatParticipantsShort: true,
    };
  },
  computed: {
    ...mapState(["messages", "messagesFetched", "selectedChat"]),
    ...State_auth(["userProfile"]),
    ...State_patients(["patients"]),
    ...State_doctors(["doctors"]),
    ...Getters_doctors(['getDoctorByUserId']),
    formattedMessages() {
      const messages = [...this.messages];
      const result = messages.reduce((prev, item, index, arr) => {
        item.showDate = true
        if (arr[index - 1]) {
          if (
            dayjs(arr[index - 1].createdon).format("YYYY-MM-DD") ===
            dayjs(arr[index].createdon).format("YYYY-MM-DD")
          ) {
            item.showDate = false
          }
        }
        if (item.user_id !== this.getUserId) {
          item.showAvatar = true;
          if (this.selectedChat && this.selectedChat.type === 1) {
            if (arr[index + 1] && arr[index + 1].user_id !== this.getUserId) {
              arr[index + 1].show = true;
              item.showAvatar = undefined;
              // return;
            }
          }
        }
        prev.push(item);
        return prev;
      }, []);
      return result;
    },
    getUserId() {
      return this.userProfile && this.userProfile.id;
    },
    getPhotos() {
      const media = [];
      this.messages.map((message) => {
        if (
          message.attachments &&
          message.attachments.length &&
          message.attachments[0].type === "image"
        ) {
          message.attachments[0].value =
            "http://api.neomedy.com/api/image/download/" +
            message.attachments[0].value;
          media.push(message.attachments[0]);
        }
      });
      return media;
    },
    getVideos() {
      const media = [];
      this.messages.map((message) => {
        if (
          message.attachments &&
          message.attachments.length &&
          message.attachments[0].type === "video"
        ) {
          // message.attachments[0].value =
          //   "http://api.neomedy.com/api/file/download/" +
          //   message.attachments[0].value;
          media.push(message.attachments[0]);
        }
      });
      return media;
    },
    getFiles() {
      return this.messages.filter(
        (message) =>
          message.attachments &&
          message.attachments.length &&
          message.attachments[0].type === "file"
      );
    },
    getChatId() {
      return this.selectedChat && this.selectedChat.id;
    },
    getSelectedChatParticipants() {
      if (this.selectedChatParticipantsShort) {
        return this.selectedChat?.participants.slice(0, 1);
      }
      return this.selectedChat?.participants;
    },
    getSelectedChatUserId() {
      return (
        this.selectedChat &&
        this.selectedChat.participants.find(
          (member) => member.user_id !== this.userProfile.id
        ).user_id
      );
    },
    isCompanionPatient() {
      if (this.selectedChat && this.selectedChat.type === 1) {
        const user_id = this.selectedChat.participants.find(item => item.user_id !== this.userProfile.id).user_id
        const users = [...this.patients, ...this.doctors];
        const user = users.find((user) => user.user_id === user_id);
        return user.doctor_id === null
      }
    },
    getCompanionID() {
      const notMe = this.selectedChat?.participants.find(i => i.user_id !== this.userProfile.user_id)
      return notMe.user_id
    },
  },
  methods: {
    ...mapActions([
      "fetchCurrentUserMessages",
      "postMessage",
      "postImage",
      "postFile",
      "deleteChat",
      "clearChatHistory",
    ]),
    ...Actions_alerts(["addAlert"]),
    openCompanionDialog() {
      this.companionDialog = true;
    },
    async sendMessage({ message, file }) {
      let attachments = [];
      if (file) {
        if (file.type.includes("image/")) {
          console.log("image");
          const fileId = await this.postImage(file);
          attachments.push({ type: "image", value: fileId, name: file.name });
        } else if (file.type.includes("video/")) {
          console.log("video");
          const fileId = await this.postFile(file);
          attachments.push({ type: "video", value: fileId, name: file.name });
        } else if (file.type.includes("audio/")) {
          console.log("audio");
          const fileId = await this.postFile(file);
          attachments.push({ type: "audio", value: fileId, name: file.name });
        } else {
          console.log("file");
          const fileId = await this.postFile(file);
          attachments.push({ type: "file", value: fileId, name: file.name });
        }
      }
      const params = {
        chat_id: this.$route.params.chatId,
        message,
        attachments: JSON.stringify(attachments),
      };
      this.$root.ws.send(
        JSON.stringify({
          e: "send_message",
          params,
        })
      );
      await this.fetchCurrentUserMessages(params.chat_id);
      this.scrollDown();
    },
    attachFile(e) {
      console.log(e);
      console.log("attaching file");
    },
    chooseEmoji() {
      console.log("choosing emoji");
    },
    scrollDown() {
      const content = this.$refs.container;
      content.scrollTop = content.scrollHeight;
    },

    removeChat() {
      console.log("action delete");
      this.deleteChat(this.getChatId);
      this.companionDialog = false;
      if (this.selectedChat && this.selectedChat.type === 3) {
        this.$router.push({ name: "Consilliums" });
        return;
      }
      this.$router.push({ name: "Chats" });
    },
    clearHistory() {
      console.log("action clear");
      this.clearChatHistory(this.getChatId);
      this.companionDialog = false;
    },

    openUserProfile(user_id) {
      const users = [...this.patients, ...this.doctors];
      const user = users.find((user) => user.user_id === user_id);
      if (user.doctor_id === null) {
        this.$router.push({ name: "Patient", params: { id: user.id } });
        return;
      }
      this.$router.push({ name: "Doctor", params: { id: user.id } });
    },
  },
  async mounted() {
    await this.fetchCurrentUserMessages(this.$route.params.chatId);
    this.scrollDown();
  },
};
</script>

<style lang="scss" scoped>
.chat-window ::v-deep .v-toolbar__content {
  padding: 0 !important;
}
.chat-window {
  position: absolute;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}
.chat-window__container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.chat-window__messages {
  flex-grow: 1;
  overflow: auto;
  min-height: 0;
}

// .v-list-item:after {
//   content: unset;
// }
</style>
