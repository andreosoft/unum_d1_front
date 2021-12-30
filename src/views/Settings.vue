<template>
  <div>
    <v-container fluid>
      <v-row :no-gutters="$vuetify.breakpoint.smAndDown">
        <v-col
          v-for="el in settingCard"
          :key="el.component"
          cols="6"
          sm="3"
          lg="2"
          :class="{
            'pa-1': $vuetify.breakpoint.smAndDown,
            'pa-2': !$vuetify.breakpoint.smAndDown,
          }"
        >
          <v-hover>
            <template v-slot="{ hover }">
              <v-card
                :elevation="hover ? 5 : 2"
                @click.native="
                  $router.push({
                    name: 'Setting',
                    params: { cname: el.component, desc: el.description },
                  })
                "
              >
                <v-card-text style="height: 65px; overflow: hidden">
                  {{ $t(el.description) }}
                </v-card-text>
              </v-card>
            </template>
          </v-hover>
        </v-col>
      </v-row>
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script>
//import SettingCard from "../components/settings/SettingCard.vue";

export default {
  //components: { SettingCard },
  data() {
    return {
      settingCard: [
        {
          component: "SetClinicalRecord",
          description: "Samples for clinical record",
        },
        {
          component: "SetSchedule",
          description: "Schedules settings",
        },
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {
    clickCardSetting(el) {
      this.$router.push({
        name: "Setting",
        params: { cname: el.component },
      });
    },
  },
};
</script>
