<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="d-flex justify-content-between py-3">
      <div class="d-flex align-items-center">
        <v-icon
          v-show="item.notifications"
          color="error"
          size="20"
          class="mr-2"
        >
          mdi-alert
        </v-icon>
        <span>
          {{ $_lang_getDoctorTranslation("Consillium") }} № {{ item.id }}
        </span>
      </div>
      <span v-if="item.status" class="d-flex flex-column align-items-end">
        <v-icon color="success">mdi-check-circle</v-icon>
      </span>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-list>
        <ConsilliumItemInfo
          v-for="(value, key, index) in item"
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
        >
          {{ $_lang_getCommonTranslation("Go to chat") }}
        </v-btn>
        <v-btn
          dark
          :ripple="false"
          :elevation="0"
          color="#FF3636"
          class="d-block"
          style="width: 100%;"
          @click="closeConsilliumDialog = true"
        >
          {{ $_lang_getDoctorTranslation("Close consillium") }}
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
import ConsilliumItemInfo from "./ConsilliumItemInfo";
import CloseConsilliumDialog from "./CloseConsilliumDialog";
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
  methods: {
    formatTitle(val) {
      let title = "";
      switch (val) {
        case "createdDate":
          title = this.$_lang_getCommonTranslation("Created date");
          break;
        case "diagnosis":
          title = this.$_lang_getDoctorTranslation("Provisional diagnosis");
          break;
        case "problem":
          title = this.$_lang_getDoctorTranslation("Problem description");
          break;
        case "patient":
          title = this.$_lang_getCommonTranslation("Patient");
          break;
        case "participants":
          title = this.$_lang_getDoctorTranslation("Participants");
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
.v-expansion-panel-content,
.v-list {
  background-color: #f5f5f5;
}
</style>
