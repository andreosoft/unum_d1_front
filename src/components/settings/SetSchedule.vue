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
        {
          name: "userPalette",
          title: "palette of colors",
          type: "palette",
          default: [
            "#FFEB3BFF",
            "#8BC34AFF",
            "#80DEEAFF",
            "#B39DDBFF",
            "#F48FB1FF",
            "#FFAB91FF",
          ],
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
      basicSetting: {},
    };
  },
  created() {
    this.$store.dispatch("settings/fetchServicesList");
    this.$store.dispatch("settings/fetchScheduleBasic");
    this.basicSetting = this.$store.state.settings.scheduleBasic || {};

    this.fillForm();
  },
  computed: {
    services() {
      return this.$store.state.settings.servicesList;
      //return this.$store.state.doctors.samples;

      //this.$store.state?.auth?.doctorProfile
    },
    defaults() {
      return this.$store.state.settings.defaults.scheduleBasic;
    },
    basic1: {
      get() {
        return this.$store.state.settings.scheduleBasic;
      },
      set(v) {
        this.$store.commit("settings/SET_SCHEDULE_BASIC", v);
      },
    },
  },
  methods: {
    getDefaults(el) {
      console.log("getDefaults", el, this.defaults);
      if (this.defaults && this.defaults[el.name] !== undefined)
        return this.defaults[el.name];
      if (el.default !== undefined) return el.default;
      return null;
    },
    fillForm() {
      //let basic = JSON.parse(JSON.stringify(this.basic));
      let basic = this.basicSetting;
      for (let el of this.model) {
        if (!basic[el.name]) {
          console.log("add setter", el.name);
          basic = Object.assign({}, basic, {
            [el.name]: this.getDefaults(el),
          });
        }
      }
      console.log("fillForm", basic);
      this.data = Object.assign({}, this.data, { basic: basic });
    },
    changeBasic() {
      this.needSave = true;
      console.log("changeBasis");
    },
    saveBasic() {
      console.log("saveBasic", this.data.basic);
      this.$store.dispatch("settings/updateScheduleBasic", this.data.basic);
      this.needSave = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>