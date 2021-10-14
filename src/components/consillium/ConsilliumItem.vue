<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="d-flex justify-content-between py-3">
      <div class="d-flex align-items-center">
        <v-icon v-show="item.status === 0" color="error" size="20" class="mr-2">
          mdi-alert
        </v-icon>
        <span>
          {{ $_lang_getDoctorTranslation("Consillium") }} № {{ item.id }}
        </span>
      </div>
      <span v-if="item.status === 1" class="d-flex flex-column align-items-end">
        <v-icon color="success">mdi-check-circle</v-icon>
      </span>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-list>
        <ConsilliumItemInfo
          v-for="(value, key, index) in getConsilliumInfo"
          :key="index"
          :title="formatTitle(key)"
          :content="typeof value === 'string' ? value : ''"
        />
      </v-list>
      <div>
        <v-btn
          dark
          :ripple="false"
          :elevation="0"
          class="d-block mb-3"
          color="#406278"
          style="width: 100%;"
          @click="$emit('goToChat', item.id)"
        >
          {{ $_lang_getCommonTranslation("Go to chat") }}
        </v-btn>
      </div>

      <CloseConsilliumDialog
        :dialog="closeConsilliumDialog"
        @close="closeConsilliumDialog = false"
      />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { lang } from "./../../mixins/lang";
import { createNamespacedHelpers } from "vuex";
import ConsilliumItemInfo from "./ConsilliumItemInfo";
import CloseConsilliumDialog from "./CloseConsilliumDialog";
const { mapGetters } = createNamespacedHelpers("doctors");
export default {
  mixins: [lang],
  name: "ConsilliumItem",
  components: {
    ConsilliumItemInfo,
    CloseConsilliumDialog,
  },
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      closeConsilliumDialog: false,
    };
  },
  computed: {
    ...mapGetters(["getDoctorByUserId"]),
    getConsilliumInfo() {
      const { name, createdon } = this.item;
      const {
        provisionalDiagnosis,
        problemDescription,
        selectedPatient,
        invitedPeople,
        tags,
      } = this.item.info;
      return {
        name,
        createdon,
        provisionalDiagnosis,
        problemDescription,
        selectedPatient,
        invitedPeople,
        tags,
      };
    },
  },
  methods: {
    formatTitle(val) {
      let title = "";
      switch (val) {
        case "name":
          title = this.$_lang_getCommonTranslation("Consillium name");
          break;
        case "createdon":
          title = this.$_lang_getCommonTranslation("Created date");
          break;
        case "provisionalDiagnosis":
          title = this.$_lang_getDoctorTranslation("Provisional diagnosis");
          break;
        case "problemDescription":
          title = this.$_lang_getDoctorTranslation("Problem description");
          break;
        case "selectedPatient":
          title = this.$_lang_getCommonTranslation("Patient");
          break;
        case "invitedPeople":
          title = this.$_lang_getDoctorTranslation("Members");
          break;
        case "tags":
          title = this.$_lang_getCommonTranslation("Tags");
          break;
      }
      return title;
    },
  },
};
</script>

<style lang="scss" scoped>
.v-expansion-panel-header,
.v-expansion-panel-content {
  background-color: #f5f5f5;
}
.v-list {
  background: transparent !important;
}
</style>
