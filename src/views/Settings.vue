<template>
  <div>
    <v-container fluid>
      <v-row :no-gutters="$vuetify.breakpoint.smAndDown">
        <v-col
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
                    params: { cname: 'SetClinicalRecord' },
                  })
                "
              >
                <v-card-text style="height: 65px; overflow: hidden">
                  {{ $t("Samples for clinical record") }}
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
export default {
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
};
</script>
