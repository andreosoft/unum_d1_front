<template>
  <div class="pr-2" ref="">
    <v-list
      two-line1
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
          <v-list-item-content class="py1-0">
            <v-list-item-title>
              {{ getEventName(item.sourceId) }}
            </v-list-item-title>

            <v-list-item-subtitle>{{ item.message }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action>
            <v-list-item-action-text>
              {{ item.date | getDate }} {{ item.date | getTime }}
            </v-list-item-action-text>
            <!--
            <v-icon v-if="active" color="grey lighten-1">
              mdi-star-outline
            </v-icon>

            <v-icon v-else color="yellow darken-3"> mdi-star </v-icon>
            -->
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
    <div v-else>
      <h4 class="mx-3">{{ $t("No reminders yet") }}</h4>
    </div>

    <confirm-dialogue ref="confirmDialogue"></confirm-dialogue>
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
      userProfile: (state) => state.auth.userProfile,
      events: (state) => state.events.events,
    }),
    //reminders() {      return this.$store.state.reminders.reminders;    },
    reminderSort() {
      //console.log("reminderSort", this.reminders);
      let res = this.reminders.sort((a, b) => {
        let aa = _.min(a.duration.filter((el) => dayjs().isAfter(el)));
        let bb = _.min(b.duration.filter((el) => dayjs().isAfter(el)));
        let r = 0;
        if (aa < bb) {
          r = -1;
        }
        if (aa > bb) {
          r = 1;
        }
        return r;
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
      let heightList = this.$parent.$refs.patientsList?.clientHeight;
      let heightBar = this.$parent.$parent.$refs.mainBar.$el?.clientHeight;
      let heightMain = this.$parent.$parent.$refs.mainLayout
        ? this.$parent.$parent.$refs.mainLayout?.clientHeight
        : 0;
      let HeightListItem = this.$parent.$refs.patientsList.clientHeight;
      let heightReminder = heightMain - heightBar - heightList; //this.$parent.$refs.reminder.clientHeight;
      heightReminder =
        heightReminder < 200
          ? 200
          : heightReminder > 400
          ? 400
          : heightReminder;
      if (
        !this.reminderSort ||
        this.reminderSort?.filter((el) => {
          if (dayjs().isBefore(el.date)) {
            return true;
          }
          return false;
        })?.length < 2
      ) {
        // console.log("ffff", this.reminderSort);
        heightReminder = 90;
      }
      // console.log("height", heightReminder, window.innerHeight);
      return heightReminder > window.innerHeight * 0.4
        ? window.innerHeight * 0.4
        : heightReminder;
    },
  },
  watch: {
    userProfile(v) {
      if (v) {
        console.log("reminders/fetchReminders");
        this.$store.dispatch("reminders/fetchReminders");
      }
    },
  },
  created() {
    window.addEventListener("resize", this.matchHeight);
  },
  mounted() {
    this.$store.dispatch("reminders/fetchReminders");
    //this.matchHeight();
  },
  methods: {
    minDuration(d) {
      return _.min(d);
    },
    reminderShow(item) {
      // return true;
      if (
        item.duration.filter((el) => {
          if (dayjs().isBefore(el)) {
            return true;
          }
          return false;
        }).length
      ) {
        return true;
      }
      return false;
    },
    async clickReminder(e) {
      let ok = false;
      if (e.duration.length == 1 || 1) {
        ok = await this.$refs.confirmDialogue.show({
          title: this.$t("Delete reminder"),
          message: [
            e.message,
            this.$t("Are you sure you want to delete this reminder?"),
          ],
          okButton: this.$t("Yes"),
          cancelButton: this.$t("No"),
        });
      } else {
        ok = true;
      }
      // If you throw an error, the method will terminate here unless you surround it wil try/catch
      if (ok) {
        console.log(
          "duration",
          e.duration.sort((a, b) => {
            let r = 0;
            if (a < b) {
              r = -1;
            }
            if (a > b) {
              r = 1;
            }
            return r;
          })
        );
        e.duration.splice(0, 1);
        this.$store.dispatch("reminders/updateReminder", e);
      } else {
      }
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
