<template>
  <div>
    <v-btn
      style="width: 100%;"
      class="my-3"
      color="#f9f8ff"
      @click="createGroupChatDialog = true"
    >
      {{ getDoctorTranslation("Create new group chat") }}
    </v-btn>
    <v-dialog v-model="createGroupChatDialog" max-width="500">
      <v-card class="pa-5">
        <form>
          {{ getDoctorTranslation("Create new group chat") }}
          <v-text-field
            v-model="groupName"
            :label="getDoctorTranslation('Your group title')"
          ></v-text-field>
          <v-select
            v-model="selectedGroupMembers"
            :items="getDoctors"
            item-text="name"
            item-value="user_id"
            chips
            multiple
            :label="getDoctorTranslation('Your group members')"
          >
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                @click:close="remove(data.item)"
              >
                {{ data.item.name }}
              </v-chip>
            </template>
          </v-select>
          <v-btn
            :disabled="!selectedGroupMembers.length || !groupName.length"
            @click="createGroup"
          >
            {{ getDoctorTranslation("Create group") }}
          </v-btn>
        </form>
      </v-card>
    </v-dialog>
    <v-text-field
      prepend-inner-icon="mdi-magnify"
      dense
      solo
      flat
      placeholder="Поиск чатов, групп"
      hide-details
    ></v-text-field>
    <ChatList />
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("lang");
const { mapState: State_auth } = createNamespacedHelpers("auth");
const { mapActions: Actions_alerts } = createNamespacedHelpers("alerts");
const { mapActions: Actions_chats } = createNamespacedHelpers("chats");
const { mapState: State_doctors } = createNamespacedHelpers("doctors");
import ChatList from "./ChatList.vue";
export default {
  name: "List",
  components: {
    ChatList,
  },
  data() {
    return {
      createGroupChatDialog: false,
      selectedGroupMembers: [],
      items: [
        {
          name: "Vuetify",
          id: 1,
        },
        {
          name: "Programming",
          id: 2,
        },
        {
          name: "Vue",
          id: 3,
        },
        {
          name: "Vuex",
          id: 4,
        },
      ],
      groupName: "",
    };
  },
  computed: {
    ...mapGetters(["getDoctorTranslation"]),
    ...State_doctors(["doctors"]),
    ...State_auth(["userProfile"]),
    getDoctors() {
      return (
        this.doctors &&
        this.doctors.filter((doc) => this.userProfile.id !== doc.user_id)
      );
    },
  },
  methods: {
    ...Actions_alerts(["addAlert"]),
    ...Actions_chats([
      "createNewGroupChat",
      "addUserToGroupChat",
      "fetchChats",
    ]),
    async createGroup() {
      const chat_id = await this.createNewGroupChat({ name: this.groupName });
      for (let i = 0; i < this.selectedGroupMembers.length; i++) {
        await this.addUserToGroupChat({
          chat_id,
          to_id: this.selectedGroupMembers[i],
        });
      }
      this.fetchChats();
      this.addAlert({ type: "success", text: "group has been created" });
      this.createGroupChatDialog = false;
      this.selectedGroupMembers = [];
      this.groupName = "";
    },
    remove(item) {
      this.selectedGroupMembers = this.selectedGroupMembers.filter(
        (id) => id !== item.user_id
      );
    },
  },
};
</script>

<style></style>
