<template>
  <v-dialog :value="dialog" @input="$emit('close')" :max-width="500">
    <v-card class="px-5 py-3">
      <v-card-title class="pa-0 mb-5">
        <v-icon color="#000" class="mr-2">mdi-close</v-icon>
        {{ $_lang_getDoctorTranslation("Close consillium") }}
      </v-card-title>
      <div class="mb-3">
        <v-text-field
          dense
          hide-details
          class="mt-0"
          :label="$_lang_getDoctorTranslation('Consillium decision')"
        >
        </v-text-field>
      </div>
      <v-card-actions class="pa-0">
        <v-spacer></v-spacer>
        <div>
          <v-btn
            class="mr-5 pa-0"
            text
            color="#406278"
            @click="$emit('close')"
            >{{ $_lang_getCommonTranslation("Cancel") }}</v-btn
          >
          <v-btn class="pa-0" text color="#406278">{{
            $_lang_getCommonTranslation("Create")
          }}</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { lang } from "./../../mixins/lang";
export default {
  mixins: [lang],
  name: "CloseConsilliumDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
