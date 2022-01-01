<template>
  <v-container class="pa-0 pb-3">
    <v-list two-line>
      <v-list-item-group v-model="selected" active-class="pink--text" multiple>
        <template v-for="(item, index) in reminders">
          <v-list-item :key="item.id">
            <template v-slot:default="{ active }">
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>

                <v-list-item-subtitle>какойто текст</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-action-text>
                  {{ item.start | getDate }}
                </v-list-item-action-text>

                <v-icon v-if="!active" color="grey lighten-1">
                  mdi-star-outline
                </v-icon>

                <v-icon v-else color="yellow darken-3"> mdi-star </v-icon>
              </v-list-item-action>
            </template>
          </v-list-item>

          <v-divider
            v-if="index < reminders.length - 1"
            :key="index"
          ></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </v-container>
</template> 

<script>
import dayjs from "dayjs";

export default {
  name: "EventsCard",
  props: {
    reminders: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return { selected: [] };
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
