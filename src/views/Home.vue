<template>
  <div>
    <div v-if="patients.length">
      <h2 class="mx-3">Мои пациенты</h2>
      <PatientsCardList :patients="patients.slice(0, 4)" />
    </div>
    <div v-else>
      <h2 class="mx-3">Пока не пациентов</h2>
    </div>
    <v-divider></v-divider>
    <div v-if="events.length">
      <h2 class="mx-3">Мои записи</h2>
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
                          <td style="width: 20%;">Запись №</td>
                          <td>{{ event.id }}</td>
                        </tr>
                        <tr>
                          <td style="width: 20%;">Название</td>
                          <td>{{ event.name }}</td>
                        </tr>
                        <tr>
                          <td style="width: 20%;">Пациент</td>
                          <td>
                            {{ event.patient }}
                          </td>
                        </tr>
                        <tr>
                          <td style="width: 20%;">Дата</td>
                          <td>
                            {{ event.start | getDate }}
                          </td>
                        </tr>
                        <tr>
                          <td style="width: 20%;">Начало</td>
                          <td>
                            {{ event.start | getTime }}
                          </td>
                        </tr>
                        <tr>
                          <td style="width: 20%;">Конец</td>
                          <td>
                            {{ event.end | getTime }}
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
    </div>
    <div v-else>
      <h2 class="mx-3">Пока нет записей</h2>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("patients");
import PatientsCardList from "./../components/patient/PatientCardList.vue";
import dayjs from "dayjs";

dayjs.locale("ru");
const { mapState: State_events } = createNamespacedHelpers("events");
export default {
  name: "Home",

  components: {
    PatientsCardList,
  },
  filters: {
    getDate(value) {
      return dayjs(value.split(" ")[0]).format("YYYY MMM DD");
    },
    getTime(value) {
      const time = value.split(" ")[1];

      return time.substr(0, 5);
    },
  },
  computed: {
    ...mapState(["patients"]),
    ...State_events(["events"]),
  },
};
</script>
<style lang="scss" scoped>
.records__item {
  cursor: pointer;
}
</style>
