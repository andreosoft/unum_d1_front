<template>
  <div>
    <v-btn
      style="width: 100%"
      class="my-3"
      color="#f9f8ff"
      @click="createGroupChatDialog = true"
    >
      {{ $t("Create new group chat") }}
    </v-btn>
    <v-dialog v-model="createGroupChatDialog" max-width="500">
      <v-card class="pa-5">
        <form>
          {{ $t("Create new group chat") }}
          <v-text-field
            v-model="groupName"
            :label="$t('Your group title')"
          ></v-text-field>
          <v-autocomplete
            prepend-inner-icon="mdi-magnify"
            :items="getDoctors"
            v-model="selectedGroupMembers"
            item-text="name"
            item-value="user_id"
            hide-details
            :label="$t('By name')"
            multiple
            dense
            class="mt-0"
            autocomplete="off"
          >
            <template #selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                @click="data.select"
                @click:close="remove(data.item)"
                color="#406278"
                dark
                class="mb-2"
              >
                <v-avatar left class="pa-0">
                  <v-img
                    :src="
                      data.item.photo
                        ? `${imageSrc(data.item.photo)}?width=100&height=100`
                        : '/images/doctor-placeholder.jpeg'
                    "
                  ></v-img>
                </v-avatar>
                {{ data.item.name }}
              </v-chip>
            </template>
            <template #item="data">
              <v-list-item-avatar>
                <v-img
                  :src="
                    data.item.photo
                      ? `${imageSrc(data.item.photo)}?width=100&height=100`
                      : '/images/doctor-placeholder.jpeg'
                  "
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                {{ data.item.name }}
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-btn
            :disabled="!selectedGroupMembers.length || !groupName.length"
            @click="createGroup"
            class="mt-5"
          >
            {{ $t("Create group") }}
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
const { mapState: State_auth } = createNamespacedHelpers("auth");
const { mapActions: Actions_alerts } = createNamespacedHelpers("alerts");
const { mapActions: Actions_chats } = createNamespacedHelpers("chats");
const { mapState: State_doctors, mapGetters: Getters_doctors } =
  createNamespacedHelpers("doctors");
import ChatList from "./ChatList.vue";
import { lang } from "./../../mixins/lang";
export default {
  mixins: [lang],
  name: "List",
  components: {
    ChatList,
  },
  data() {
    return {
      createGroupChatDialog: false,
      selectedGroupMembers: [],

      groupName: "",
    };
  },
  computed: {
    ...State_doctors(["doctors"]),
    ...Getters_doctors(["imageSrc"]),
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
