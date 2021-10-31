<template>
  <v-container class="doctor-info pa-4">
    <v-row no-gutters>
      <v-col cols="12">
        <DoctorProfileAvatar :avatarUrl="avatarUrl" class="mb-4" />
        <ContactButtons
          @createChat="createChat"
          :email="email"
          :phone="phone"
          :userId="userId"
        />
        <div>
          <p class="mb-1 doctor-info__text">
            {{ lastName || getCommonTranslation("Surname") }}
            {{ firstName || getCommonTranslation("Name") }}
            {{ middleName || getCommonTranslation("Middle name") }}
          </p>
          <p class="mb-1 doctor-info__text doctor-info__text--spec">
            <span v-if="doctorSpecialty">{{ doctorSpecialty }}</span>
            <span v-else class="grey--text text--lighten-1">
              {{ getCommonTranslation("No specialty") }}
            </span>
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import DoctorProfileAvatar from "./DoctorProfileAvatar.vue";
import ContactButtons from "./../ContactButtons.vue";
const { mapGetters } = createNamespacedHelpers("lang");
const { mapActions: Actions_chat } = createNamespacedHelpers("chats");
export default {
  name: "DoctorBio",
  components: {
    DoctorProfileAvatar,
    ContactButtons,
  },
  props: {
    avatarUrl: {
      type: String,
      default: "",
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    middleName: {
      type: String,
      default: "",
    },
    doctorSpecialty: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    userId: {
      type: Number,
    },
  },
  computed: {
    ...mapGetters(["getDoctorTranslation", "getCommonTranslation"]),
  },
  methods: {
    ...Actions_chat(["createNewChat", "fetchChats"]),
    async createChat() {
      const chat_id = await this.createNewChat(this.userId);
      this.fetchChats()
      this.$router.push({name: "Chat", params: { chatId: chat_id }})

    },
  },
};
</script>

<style lang="scss" scoped>
.doctor-info {
  width: fit-content;
  max-width: 100%;
}
.doctor-info__text {
  font-weight: 600;
  text-align: center;
  font-size: 22px;
  line-height: 26px;
  font-family: "Exo 2", sans-serif;
}
.doctor-info__text--spec {
  font-weight: normal;
  font-size: inherit;
  font-family: inherit;
}
</style>
