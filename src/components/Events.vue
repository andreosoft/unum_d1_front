<template>
  <v-container class="pa-0 pb-3">
    <v-row no-gutters>
      <v-col
        v-for="event in events"
        :key="event.id"
        cols="12"
        md="6"
        lg="4"
        class="pa-3 records__item"
        @click="
          $router.push({ name: 'Patient', params: { id: event.patient_id } })
        "
      >
        <v-hover>
          <template v-slot="{ hover }">
            <v-card :elevation="hover ? 1 : 0" outlined>
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <td class="table-title">
                        {{ getCommonTranslation("Event name") }}
                      </td>
                      <td>{{ event.name === event.patient ? getDoctorTranslation('Patient reception'): event.name }}</td>
                    </tr>
                    <tr>
                      <td class="table-title">
                        {{ getCommonTranslation("Patient") }}
                      </td>
                      <td>
                        {{ event.patient }}
                      </td>
                    </tr>
                    <tr>
                      <td class="table-title">
                        {{ getCommonTranslation("Date") }}
                      </td>
                      <td>
                        {{ event.start | getDate }}
                      </td>
                    </tr>
                    <tr>
                      <td class="table-title">
                        {{ getCommonTranslation("Start") }}
                      </td>
                      <td>
                        {{ event.start | getTime }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template> 

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("lang");
import dayjs from "dayjs";

export default {
  name: "Events",
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
  computed: {
    ...mapGetters(["getCommonTranslation", "getDoctorTranslation"]),
  },
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
