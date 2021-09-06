<template>
  <v-dialog :value="dialog" @input="$emit('close')" hide-overlay fullscreen>
    <v-card tile style="overflow: hidden;">
      <v-toolbar color="#F5F5F5" :elevation="0" short>
        <v-toolbar-title>
          <v-icon color="#6A6A6A" @click="$emit('close')">mdi-close</v-icon>
          {{ $_lang_getDoctorTranslation("Create consillium") }}
        </v-toolbar-title>
      </v-toolbar>

      <v-container fluid class="pa-5">
        <v-row
          no-gutters
          :class="[
            $vuetify.breakpoint.smAndDown
              ? 'flex-column'
              : 'justify-content-between',
          ]"
          class="mb-7"
        >
          <v-col md="5">
            <v-text-field
              hide-details
              :label="$_lang_getDoctorTranslation('Provisional diagnosis')"
              dense
              class="mt-0"
              :class="{ 'mb-7': $vuetify.breakpoint.smAndDown }"
            ></v-text-field>
          </v-col>
          <v-col md="5">
            <v-text-field
              hide-details
              :label="$_lang_getDoctorTranslation('Select a patient')"
              dense
              class="mt-0"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-textarea
          hide-details
          :label="$_lang_getDoctorTranslation('Problem description')"
          dense
          auto-grow
          :rows="1"
          class="mt-0 mb-7"
        ></v-textarea>
        <v-row no-gutters class="flex-column">
          <h3 class="ma-0 mb-4">
            {{ $_lang_getDoctorTranslation("Invite") }}
          </h3>

          <!-- 48 -->
          <v-col md="5" class="mb-7">
            <v-autocomplete
              prepend-inner-icon="mdi-magnify"
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

          <v-row
            no-gutters
            :class="
              $vuetify.breakpoint.smAndDown
                ? 'flex-column'
                : 'justify-content-between'
            "
            class="mb-7"
          >
            <!-- 48 -->
            <v-col md="5" :class="{ 'mb-7': $vuetify.breakpoint.smAndDown }">
              <v-select
                dense
                hide-details
                :label="$_lang_getCommonTranslation('By specialty')"
                class="mt-0"
              ></v-select>
            </v-col>

            <!-- 48 -->
            <v-col md="5">
              <v-select
                hide-details
                :label="$_lang_getCommonTranslation('By language')"
                dense
                class="mt-0"
              ></v-select>
            </v-col>
          </v-row>

          <!-- 48 -->
          <v-col md="4">
            <span
              class="d-flex align-items-center justify-content-between mb-7"
            >
              {{ $_lang_getDoctorTranslation("Urgent consillium") }}
              <v-switch
                class="ml-3 ma-0 pa-0"
                color="#406278"
                :ripple="false"
                hide-details
              ></v-switch>
            </span>
          </v-col>

          <!-- 48 -->
          <v-col md="5">
            <v-text-field
              dense
              class="mt-0"
              hide-details
              :label="$_lang_getCommonTranslation('Tags')"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div>
            <v-btn
              class="mr-5 pa-0 px-5"
              text
              color="#406278"
              @click="$emit('close')"
              >{{ $_lang_getCommonTranslation("Cancel") }}</v-btn
            >
            <v-btn
              class="pa-0 px-5"
              :text="$vuetify.breakpoint.smAndDown"
              :color="$vuetify.breakpoint.smAndDown ? '#406278' : 'primary'"
              >{{ $_lang_getCommonTranslation("Create") }}</v-btn
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
