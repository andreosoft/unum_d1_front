<template>
  <v-container fluid>
    <v-tabs v-model="tabSelected" align-with-title>
      <v-tab v-for="tab in tabs" :disabled="tab.disabled">
        {{ $t(tab.title) }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabSelected">
      <v-tab-item>
        <v-col>
          <v-divider class="mt-1 mb-3"></v-divider>
          <v-row>
            <s-btn-any
              :title="'Save'"
              :icon="'mdi-check'"
              @btnClick="saveBasic"
              :disabled="!needSave"
            />
            <v-col>
              <s-form-model
                v-model="data.basic"
                :model="model"
                @validate="changeBasic"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-tab-item>
      <v-tab-item>
        <v-col>
          <v-divider class="mt-1 mb-3"></v-divider>
          <v-row>
            <v-col>
              <ServcesForm v-model="services" :model="{}"></ServcesForm>
            </v-col>
          </v-row>
        </v-col>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script>
import { getForm, submitForm, fillForm } from "./../templates/mixings";
import { validate, validators } from "./../templates/mixings";
export default {
  name: "SetSchedule",
  //mixins: [submitForm, fillForm, validate, validators],
  components: { ServcesForm: () => import("./Schedule/ServicesForm") },
  data() {
    return {
      // basic: {},
      needSave: false,
      model: [
        {
          name: "defaultTime",
          title: "default time of service",
          type: "number",
        },
        {
          name: "defaultView",
          title: "default calendar view",
          validator: [],
          type: "select",
          options: ["month", "week"],
        },
      ],
      tabs: [
        {
          name: "basic",
          title: "Basic settings",
          validator: [],
          active: true,
          disabled: false,
        },
        {
          name: "services",
          title: "Services",
          active: true,
          disabled: false,
        },
      ],
      //  userSamples: [{ name: "test", apply: [], color: "", sample: "text" }],
      tabSelected: 0,
    };
  },
  created() {
    this.$store.dispatch("settings/fetchServicesList");
    this.$store.dispatch("settings/fetchScheduleBasic");
    this.fillForm();
  },
  computed: {
    services() {
      return this.$store.state.settings.servicesList;
      //return this.$store.state.doctors.samples;

      //this.$store.state?.auth?.doctorProfile
    },
    basic() {
      return this.$store.state.settings.scheduleBasic;
    },
  },
  methods: {
    fillForm() {
      console.log("fillForm", this.basic);
      this.data = Object.assign({}, this.data, { basic: this.basic });
    },
    changeBasic() {
      this.needSave = true;
      console.log("changeBasis");
    },
    saveBasic() {
      console.log("saveBasic", this.basic);

      this.$store.dispatch("settings/updateScheduleBasic", this.data.basic);
      this.needSave = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>