<template>
  <div>
    <v-row v-for="(item, i) in group" :key="i" no-gutters class="mb-1">
      <v-col cols="1">
        <v-btn
          @click="btnClickPlus"
          icon
          large
          v-if="i == group.length - 1"
          :disabled="isEmptyFiles"
        >
          <v-icon>mdi-folder-plus-outline</v-icon>
        </v-btn>
        <v-btn
          @click="group.splice(i, 1)"
          icon
          large
          v-if="i !== group.length - 1 && item.files && item.files.length === 0"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-text-field
          outlined
          v-model="item.group_name"
          :label="$t('description')"
          @input="$emit('input', group)"
        ></v-text-field>
      </v-col>
      <v-col cols="8">
        <component
          :config="{ multiple: true }"
          :is="'a-input-file'"
          :model="model"
          :value="item.files"
          @input="onInput($event, item)"
        ></component>
      </v-col>
    </v-row>
    <div v-for="group in attachedFiles" v-if="attachedFiles.length">
      <div>
        {{ group.group_name ? group.group_name : $t("other") }}
        <v-chip-group column>
          <v-chip
            outlined
            v-for="file in group.files"
            :href="download(file.file)"
            target="_blank"
          >
            {{ file.name }}
          </v-chip>
        </v-chip-group>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/config/index";
export default {
  props: {
    value: [],
    model: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    config: Object,
    error: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      status: 0,
      color: null,
      group: [{ group_name: "", files: null }],
      attachedFiles: [],
    };
  },
  mounted() {
    console.log(" mounted   ooooh, ", this.value);
    if (this.value && this.value.length) {
      this.attachedFiles = this.value;
    }
  },
  computed: {
    canDelete(params) {
      console.log("canDelete", params, this.group);
      if (params !== this.group.length - 1 && !this.group[params].files)
        return true;
      return false;
    },
    isEmptyFiles() {
      if (
        this.group.findIndex((el) => {
          if (el.files && el.files.length > 0) return false;
          return true;
        }) >= 0
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    btnClickPlus() {
      this.group.push({ group_name: "", files: null });
    },
    async onInput(e, el) {
      el.files = e;
      let res;
      res = this.group.concat(this.attachedFiles);
      this.$emit("input", res);
    },
    download(id) {
      return `http://api.neomedy.com${api.getFile}/${id}`;
    },
  },
};
</script>