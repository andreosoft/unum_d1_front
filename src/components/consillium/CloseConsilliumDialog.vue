<template>
  <v-dialog :value="dialog" @input="$emit('close')" fullscreen>
    <v-card tile>
      <v-toolbar color="#F5F5F5" short :elevation="0">
        <v-icon color="#6A6A6A" class="mr-2" @click="$emit('close')"
          >mdi-close</v-icon
        >
        <v-toolbar-title>
          {{ $_lang_getDoctorTranslation("Close consillium") }}
        </v-toolbar-title>
      </v-toolbar>
      <v-container fluid class="px-5 py-3">
        <v-row no-gutters class="mb-3 flex-column">
          <v-col md="6">
            <v-text-field
              dense
              class="mt-0"
              :label="$_lang_getDoctorTranslation('Diagnosed')"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <v-textarea
              dense
              hide-details
              :rows="1"
              auto-grow
              class="mt-0"
              :label="$_lang_getDoctorTranslation('Comments')"
            >
            </v-textarea>
          </v-col>
        </v-row>
        <v-card-actions class="pa-0">
          <v-spacer></v-spacer>
          <div>
            <v-btn
              class="mr-2 pa-0 px-5"
              text
              color="#406278"
              @click="$emit('close')"
              >{{ $_lang_getCommonTranslation("Cancel") }}</v-btn
            >
            <v-btn
              class="pa-0 px-5"
              :text="$vuetify.breakpoint.smAndDown"
              :color="$vuetify.breakpoint.smAndDown ? '#406278' : 'primary'"
              >{{ $_lang_getCommonTranslation("Save") }}</v-btn
            >
          </div>
        </v-card-actions>
      </v-container>
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
