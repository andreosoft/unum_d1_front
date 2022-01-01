<template>
  <v-container class="pa-0 pb-3">
    <v-row no-gutters>
      <v-col
        v-for="event in events"
        :key="event.id"
        cols="8"
        md="4"
        lg="3"
        class="pa-1 records__item"
        @click="
          $router.push({ name: 'Patient', params: { id: event.patient_id } })
        "
      >
        <v-hover>
          <template v-slot="{ hover }">
            <v-card :elevation="hover ? 1 : 0" outlined>
              <v-list-item three-line>
                <v-list-item-content>
                  <div class="text-overline mb-4">
                    {{ event.start | getDate }}
                  </div>
                  <v-list-item-title class="text-h7 mb-1">
                    {{ event.patient | shortname }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      event.name === event.patient
                        ? $t("Patient reception")
                        : event.name
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template> 

<script>
import dayjs from "dayjs";

export default {
  name: "EventsCard",
  props: {
    events: {
      type: Array,
      default: () => [],
    },
  },
  filters: {
    getDate(value) {
      return dayjs(value.split(" ")[0]).format("DD.MM.YYYY");
    },
    getTime(value) {
      const time = value.split(" ")[1];
      return time.substr(0, 5);
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.records__item {
  cursor: pointer;
}
.table-title {
  width: 40%;
}
</style>
