<template>
  <v-dialog
    content-class="rounded-0 dialog"
    :value="dialog"
    @input="$emit('close')"
    :max-width="500"
  >
    <v-card
      tile
      class="py-4 px-6 d-flex flex-column justify-content-between"
      :height="600"
    >
      <v-card-title class="pa-0">
        <v-icon class="mr-2" color="#000">mdi-plus</v-icon>
        {{ $_lang_getDoctorTranslation("Create consillium") }}
      </v-card-title>
      <v-container fluid class="pa-0">
        <v-row class="flex-column" no-gutters>
          <v-col class="pa-0 mb-4">
            <v-text-field
              hide-details
              :label="$_lang_getDoctorTranslation('Provisional diagnosis')"
              dense
              class="mt-0 mb-7"
            ></v-text-field>
            <v-text-field
              hide-details
              :label="$_lang_getDoctorTranslation('Problem description')"
              dense
              class="mt-0 mb-7"
            ></v-text-field>
            <v-text-field
              hide-details
              :label="$_lang_getDoctorTranslation('Select a patient')"
              dense
              class="mt-0"
            ></v-text-field>
          </v-col>
          <v-col class="mb-8">
            <h3 class="ma-0 mb-4">
              {{ $_lang_getDoctorTranslation("Invite") }}
            </h3>
            <v-autocomplete
              :items="people"
              v-model="choosenPeople"
              item-text="name"
              item-value="name"
              hide-details
              :label="$_lang_getCommonTranslation('By name')"
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
                >
                  {{ data.item.name }}
                </v-chip>
              </template>
              <template #item="data">
                <v-list-item-avatar>
                  <v-img style="background-color: black;"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ data.item.name }}
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="6" class="mb-4">
            <v-select
              dense
              hide-details
              :label="$_lang_getCommonTranslation('By specialty')"
              class="mt-0 mb-7"
            ></v-select>
            <v-select
              hide-details
              :label="$_lang_getCommonTranslation('By language')"
              dense
              class="mt-0 mb-6"
            ></v-select>
            <span class="d-flex align-items-center">
              {{ $_lang_getDoctorTranslation("Urgent consillium") }}
              <v-switch
                class="ml-3 ma-0 pa-0"
                color="#406278"
                :ripple="false"
                hide-details
              ></v-switch>
            </span>
          </v-col>
          <v-col>
            <v-text-field
              dense
              class="mt-0"
              hide-details
              :label="$_lang_getCommonTranslation('Tags')"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
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
  name: "CreateConsilliumDialog",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      people: [
        {
          name: "emir dzhetybaev",
          id: 1,
        },
        {
          name: "aizada nurlanova",
          id: 2,
        },
        {
          name: "jack grealish",
          id: 3,
        },
        {
          name: "kevin de bryune",
          id: 4,
        },
        {
          name: "erling haaland",
          id: 5,
        },
        {
          name: "david silva",
          id: 6,
        },
      ],
      string: "",
      choosenPeople: [],
    };
  },
  methods: {
    change() {
      this.choosenPeople.push(this.string);
      this.string = "";
      console.log(this.string);
    },
    remove(item) {
      const index = this.choosenPeople.indexOf(item.name);
      if (index >= 0) this.choosenPeople.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped></style>
