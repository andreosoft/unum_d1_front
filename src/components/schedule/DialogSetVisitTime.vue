<template>
  <v-dialog :value="value" @input="$emit('input')" max-width="400">
    <v-card v-if="value" class="pa-3">
      <v-card-title class="pa-0">
        {{ $t("Set your working time") }}
      </v-card-title>

      <v-card-text class="pa-1">
        <v-layout row wrap>
          <v-flex d-flex pa-2 xs12>
            <v-menu
              ref="visitTimeMenu"
              :close-on-content-click="false"
              :return-value.sync="date"
              min-width="290px"
              :disabled="dataEdit !== 0"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  :value="dateText"
                  :label="$t('Visiting date')"
                  v-bind="attrs"
                  v-on="on"
                  readonly
                >
                </v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                no-title
                locale="ru"
                first-day-of-week="1"
                :min="currentDate"
                @input="saveMultiDate(date)"
                :events="datesAll"
                event-color="blue lighten-1"
                close-on-content-click
                :allowed-dates="
                  (val) => val >= new Date().toISOString().substr(0, 10)
                "
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="blue darken-1"
                  @click="visitTimeMenu = false"
                >
                  {{ $t("Cancel") }}
                </v-btn>
                <v-btn text color="blue darken-1" @click="setDate">
                  {{ $t("Done") }}
                </v-btn></v-date-picker
              >
            </v-menu>
          </v-flex>
          <v-flex d-flex pa-2 sm6 xs12>
            <v-input
              class="
                v-input--is-label-active v-input--is-dirty
                v-text-field v-text-field--is-booted
              "
            >
              <template v-slot:default>
                <v-label :value="true" :absolute="true" class="mb-2">
                  {{ $t("Start") }}
                </v-label>
                <TimePicker :padding="false" v-model="startTimeVisit" />
              </template>
            </v-input>
          </v-flex>
          <v-flex d-flex pa-2 sm6 xs12>
            <v-input
              class="
                v-input--is-label-active v-input--is-dirty
                v-text-field v-text-field--is-booted
              "
            >
              <template v-slot:default>
                <v-label :value="true" :absolute="true">
                  {{ $t("End") }}
                </v-label>
                <TimePicker :padding="false" v-model="endTimeVisit" />
              </template>
            </v-input>
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-card-actions class="px-0">
        <v-btn @click="$emit('input')">{{ $t("Close") }}</v-btn>
        <v-btn @click="saveVisitTimeGap">{{ $t("Save") }}</v-btn>
        <v-spacer></v-spacer>

        <s-btn-any
          :title="'Delete'"
          :icon="''"
          @btnClick="deleteTimeGap"
          :disabled="!dataEdit"
          v-if="dataEdit"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapGetters, mapActions } = createNamespacedHelpers("events");
import dayjs from "dayjs";
export default {
  name: "DialogSetVisitTime",
  components: {
    DatePicker: () => import("@/components/schedule/DatePicker2"),
    TimePicker: () => import("@/components/schedule/TimePicker2"),
  },
  props: {
    value: false,
    dataEdit: 0,
  },
  data() {
    return {
      visitingDate: "",
      saving: false,
      currentDate: dayjs().format("YYYY-MM-DD"),
      visitingStartTime: "10:00",
      visitingEndTime: "11:00",
      datesAll: [],
    };
  },
  watch: {
    dataEdit(v) {
      if (v) {
        this.visitingDate = dayjs(v.start).format("YYYY-MM-DD");
        this.visitingStartTime = dayjs(v.start).format("HH:mm");
        this.visitingEndTime = dayjs(v.end).format("HH:mm");
      } else {
        this.visitingDate = "";
        this.datesAll = [];
        this.visitingStartTime = "10:00";
        this.visitingEndTime = "11:00";
      }
    },
    value(v) {
      if (!v) {
        this.visitingDate = "";
        this.datesAll = [];
        this.visitingStartTime = "10:00";
        this.visitingEndTime = "11:00";
      }
    },
  },
  computed: {
    events() {
      return this.$store.state.events.events;
    },
    dateText: {
      get() {
        let res = this.date;
        if (this.datesAll.length > 1) {
          res = res + " +" + (this.datesAll.length - 1) + this.$t("more...");
        }
        return res;
      },
    },
    date: {
      get() {
        return this.visitingDate;
      },
      set(v) {
        this.visitingDate = v;
      },
    },
    startTimeVisit: {
      get() {
        return this.visitingStartTime;
      },
      set(v) {
        this.visitingStartTime = v;
      },
    },
    endTimeVisit: {
      get() {
        return this.visitingEndTime;
      },
      set(v) {
        this.visitingEndTime = v;
      },
    },
  },
  methods: {
    ...mapActions(["createEvent", "fetchEvents", "deleteEvent"]),
    setDate() {
      this.saveMultiDate(this.date, false);
      this.$refs.visitTimeMenu.save(this.date);
    },
    saveMultiDate(date, del = true) {
      let index = this.datesAll.findIndex((x) => x === date);

      if (index === -1) {
        this.datesAll.push(date);
      } else {
        if (del) {
          this.datesAll.splice(index, 1);
        }
      }
    },
    visitingClick(e) {
      if (dayjs().isAfter(dayjs(e).add(1, "day"))) {
        return;
      }
      this.visitingDate = e;
    },
    async deleteTimeGap() {
      await this.deleteEvent(this.dataEdit.id);
      this.$emit("refresh");
      this.$emit("input");
    },

    async saveVisitTimeGap() {
      if (this.saving) return;
      this.saving = true;
      this.saveMultiDate(this.date, false);
      for (let date of this.datesAll) {
        this.saveVisitTimeGapDate(date);
      }
      this.datesAll = [];
      this.date = "";

      this.$root.addAlert({
        type: "success",
        text: this.$t("Working time set"),
      });

      this.$emit("refresh");
      this.saving = false;
      this.$emit("input");
    },
    async saveVisitTimeGapDate(date) {
      const payload = {
        name: "Прием пациентов",
        start: `${date} ${this.startTimeVisit}:00`,
        end: `${date} ${this.endTimeVisit}:00`,
        type_id: "2",
      };

      if (this.dataEdit) {
        payload.id = this.dataEdit.id;
      } else {
        for (let i = 0; i < this.events.length; i++) {
          if (
            /*  dayjs(this.events[i].start).format("YYYY-MM-DD") ===
            dayjs(payload.start).format("YYYY-MM-DD") */
            (payload.start >= this.events[i].start &&
              payload.start <= this.events[i].end) ||
            (payload.end >= this.events[i].start &&
              payload.end <= this.events[i].end)
          ) {
            if (this.events[i].type_id === 2) {
              this.$root.addAlert({
                type: "error",
                text: this.$t("Working time has already been set") + " " + date,
              });
              return;
            }
          }
        }
      }
      await this.createEvent(payload);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>