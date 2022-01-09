<template>
  <div class="pr-2" ref="">
    <v-list
      two-line
      :height="heightReminder"
      v-if="reminders && reminders.length"
    >
      <v-list-item
        ref="listItem"
        v-for="(item, index) in reminderSort"
        :key="item.sourceId"
        @click="clickReminder(item)"
        v-show="reminderShow(item)"
        :style="`background: ${item.color}`"
      >
        <template v-slot:default="{ active }">
          <v-list-item-content>
            <v-list-item-title>
              {{ getEventName(item.sourceId) }}
            </v-list-item-title>

            <v-list-item-subtitle>{{ item.message }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-list-item-action-text>
              {{ item.date | getDate }} {{ item.date | getTime }}
            </v-list-item-action-text>

            <v-icon v-if="!active" color="grey lighten-1">
              mdi-star-outline
            </v-icon>

            <v-icon v-else color="yellow darken-3"> mdi-star </v-icon>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
    <div v-else>
      <h4 class="mx-3">{{ $t("No reminders yet") }}</h4>
    </div>
  </div>
</template> 

<script>
import dayjs from "dayjs";
import _ from "lodash";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "ReminderCard",
  props: {},
  data() {
    return { selected: [], resize: 1 };
  },
  filters: {
    getDate(value) {
      return dayjs(value).format("DD.MM.YYYY");
    },
    getTime(value) {
      return dayjs(value).format("HH:mm");
    },
  },
  computed: {
    ...mapState({
      reminders: (state) => state.reminders.reminders,
      events: (state) => state.events.events,
    }),
    reminderSort() {
      let res = this.reminders.sort((a, b) => {
        let aa = _.min(a.duration.filter((el) => dayjs().isBefore(el)));
        let bb = _.min(b.duration.filter((el) => dayjs().isBefore(el)));

        if (aa < bb) {
          return -1;
        }
        if (aa > bb) {
          return 1;
        }
        return 0;
      });
      return res;
    },

    heightReminder() {
      if (!this.resize) {
        return 200;
      }
      if (this.$refs.listItem)
        console.log(
          "listItem",
          this.$refs.listItem.clientHeight,
          this.reminders?.length
        );
      let heightList = this.$parent.$refs.patientsList.clientHeight;
      let heightBar = this.$parent.$parent.$refs.mainBar.$el.clientHeight;
      let heightMain = this.$parent.$parent.$refs.mainLayout.clientHeight;
      let HeightListItem = this.$parent.$refs.patientsList.clientHeight;
      let heightReminder = heightMain - heightBar - heightList; //this.$parent.$refs.reminder.clientHeight;
      heightReminder =
        heightReminder < 200
          ? 200
          : heightReminder > 400
          ? 400
          : heightReminder;
      if (!this.reminders || this.reminders?.length < 2) heightReminder = 90;
      return heightReminder > window.innerHeight * 0.4
        ? window.innerHeight * 0.4
        : heightReminder;
    },
  },
  watch: {},
  created() {
    window.addEventListener("resize", this.matchHeight);
  },
  mounted() {
    this.$store.dispatch("reminders/fetchReminders");
    //this.matchHeight();
  },
  methods: {
    reminderShow(item) {
      if (item.duration.filter((el) => dayjs().isBefore(el)).length)
        return true;
      return false;
    },
    clickReminder(e) {
      e.duration.splice(0, 1);
    },
    getEventName(id) {
      return this.events.find((el) => {
        return el.id === id;
      })?.name;
    },
    matchHeight() {
      this.resize++;
      //Vue.set(this.leftColStyles, 'height', heightString);
    },
  },
};
</script>

<style lang="scss" scoped>
.v-list {
  overflow-y: auto;
}
</style>
