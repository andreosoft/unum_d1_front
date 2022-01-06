<template>
  <v-dialog :value="value" @input="$emit('input')" :max-width="600">
    <v-card>
      <v-card-title>
        {{ $t(title) }}
        <v-spacer></v-spacer>
        <s-btn-del
          :title="'Delete event'"
          @btnClick="
            $emit('deleteEvent');
            $emit('input');
          "
          :disabled="!editingEvent"
        />
        <s-btn-any
          :title="'Patient card'"
          :icon="'mdi-account-details'"
          @btnClick="$emit('showPatientCard')"
          :disabled="!selectedPatient"
        />
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex d-flex pa-1 xs12>
            <v-combobox
              dense
              :label="$t('Event name')"
              :items="servicesList"
              @change="changeEventName"
              item-text="name"
              v-model="eventName"
            ></v-combobox>
          </v-flex>
          <v-flex d-flex pa-1 xs12>
            <v-combobox
              v-model="selectedPatient"
              :items="patients"
              item-text="name"
              :label="$t('Patients')"
              @change="onSelectedPatientChange"
            ></v-combobox>
            <div class="pa-0 pl-1 pt-1">
              <s-input-color
                dense
                outlined
                palette
                hide-details
                :size="'40px'"
                :model="{ title: $t('color') }"
                v-model="eventDefaultData.color"
                @input="onColorChange"
              />
            </div>
          </v-flex>
          <v-flex d-flex sm6 pa-1>
            <v-input
              class="
                v-input--is-label-active v-input--is-dirty
                v-text-field v-text-field--is-booted
              "
            >
              <template v-slot:default>
                <v-label :value="true" :absolute="true">
                  {{ $t("Start") }}
                </v-label>
                <DatePicker v-model="startDate" />
                <TimePicker v-model="startTime" />
              </template>
            </v-input>
          </v-flex>
          <v-flex d-flex sm6 pa-1>
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

                <DatePicker v-model="endDate" />
                <TimePicker v-model="endTime" />
              </template>
            </v-input>
          </v-flex>
          <v-flex d-flex xs12 pa-1>
            <v-switch
              v-model="hasReminder"
              dense
              :label="$t('Reminders')"
            ></v-switch>
          </v-flex>
          <v-flex d-flex flex-wrap v-if="hasReminder" pa-0>
            <v-flex d-flex sm12 md6 lg6 pa-1>
              <div class="pa-0 pr-1">
                <s-input-color
                  dense
                  outlined
                  palette
                  hide-details
                  :model="{ title: $t('color') }"
                  v-model="reminder.color"
                />
              </div>
              <v-autocomplete
                v-model="reminder.reminder"
                :items="[
                  '1d',
                  '2d',
                  '3d',
                  '5d',
                  '7d',
                  '1h',
                  '2h',
                  '3h',
                  '5h',
                  '7h',
                ]"
                outlined
                dense
                hide-details
                hide-selected
                chips
                small-chips
                label="Reminder"
                multiple
                :menu-props="{ closeOnClick: true }"
                @click:close="remove(data.item)"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    small
                  >
                    {{ $t(data.item) }}
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  {{ $t(data.item) }}
                </template>
              </v-autocomplete>
            </v-flex>
            <v-flex d-flex sm12 md6 lg6 pa-1 pt-1>
              <v-textarea
                auto-grow
                rows="1"
                dense
                hide-details
                outlined
                v-model="reminder.message"
                :label="$t('message')"
              ></v-textarea>
            </v-flex>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="blue darken-1" @click="$emit('input')">
          {{ $t("Close") }}
        </v-btn>
        <v-btn text color="blue darken-1" @click="saveEvent">{{
          editingEvent ? $t("Edit") : $t("Create")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DatePicker from "@/components/schedule/DatePicker";
import ColorPicker from "@/components/schedule/ColorPicker";
import dayjs from "dayjs";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "DialogCreateEvent",
  components: {
    DatePicker,
    TimePicker: () => import("@/components/schedule/TimePicker2"),
    ColorPicker,
  },
  props: {
    value: false,
    editingEvent: false,
    eventDefaultData: Object,
  },
  data() {
    return {
      hasReminder: false,
      reminder: {},
      Patient: null,
      eventName: "",
      durationVisit: 0,
      readTime: 0,
      saving: false,
    };
  },
  mounted() {
    this.readTime++;
  },
  computed: {
    ...mapState({
      events: (state) => state.events.events,
      patients: (state) => state.patients.patients,
    }),
    ...mapGetters("reminders", { reminderBySource: "reminderBySource" }),
    servicesList() {
      return this.$store.state.settings.servicesList;
      //return this.$store.state.doctors.samples;

      //this.$store.state?.auth?.doctorProfile
    },
    basic() {
      return this.$store.state.settings.scheduleBasic;
    },
    title() {
      return this.editingEvent ? "Edit event" : "New event";
    },

    selectedPatient: {
      get() {
        if (this.eventDefaultData.data && this.eventDefaultData.data.length) {
          let res = JSON.parse(this.eventDefaultData.data);
          if (res && res?.patientName) {
            this.Patient = res.patientName;
          }
        }
        return this.Patient;
      },
      set(v) {
        this.Patient = v;
      },
    },
    startDate: {
      get() {
        return this.eventDefaultData.start.split(" ")[0];
      },
      set(v) {
        this.eventDefaultData.start = v + " " + this.startTime;
        this.calcEnd();
      },
    },
    startTime: {
      get() {
        return this.eventDefaultData.start.split(" ")[1];
      },
      set(v) {
        this.eventDefaultData.start = this.startDate + " " + v;
        this.calcEnd();
      },
    },
    endDate: {
      get() {
        return this.eventDefaultData.end.split(" ")[0];
      },
      set(v) {
        this.eventDefaultData.end = v + " " + this.endTime;
      },
    },
    endTime: {
      get() {
        return this.eventDefaultData.end.split(" ")[1];
      },
      set(v) {
        this.eventDefaultData.end = this.endDate + " " + v;
      },
    },
  },
  watch: {
    reminder(v) {
      return;
      console.log("watch reminder", v);
      if (v?.reminder?.length) {
        this.hasReminder = true;
      } else {
        this.hasReminder = false;
      }
    },
    hasReminder(v) {
      if (!v) {
        console.log("resetReminder");
        this.resetReminder();
      }
    },
    readTime(v) {
      this.durationVisit =
        this.eventName?.time || this.basic?.defaultTime || 60;
      this.calcEnd();
    },

    value(val) {
      if (!val) {
        this.hasReminder = false;
        this.editingEvent = false;
        this.eventName = "";
        this.selectedPatient = null;
        this.eventDefaultData.patient_id = null;
        //this.eventDefaultData.color = "";
      } else {
        this.calcEnd();
        this.eventName = this.eventDefaultData.name;
        this.selectedPatient = this.eventDefaultData.patient;
        if (this.eventDefaultData?.id) {
          this.reminder = this.reminderBySource({
            name: "event",
            id: this.eventDefaultData.id,
          });
        } else {
          this.reminder = {};
        }
      }
    },
  },
  methods: {
    ...mapActions("events", ["createEvent", "fetchEvents", "deleteEvent"]),
    resetReminder() {
      this.reminder = { color: "#ffffff", reminder: [], message: "" };
    },
    calcEnd() {
      if (this.durationVisit) {
        this.eventDefaultData.end = dayjs(this.eventDefaultData.start)
          .add(this.durationVisit, "minute")
          .format("YYYY-MM-DD HH:mm:ss");
      }
    },
    changeEventName() {
      this.readTime++;
      if (this.eventName?.reminder) {
        this.hasReminder = true;
      } else {
        this.hasReminder = false;
      }
      this.reminder.color = this.eventName?.color || this.reminder.color;
      this.reminder.message = this.eventName?.message || this.reminder.message;
      this.reminder.reminder =
        this.eventName?.reminder || this.reminder.reminder;

      console.log("reminder", this.reminder, this.eventName);
    },
    onSelectedPatientChange(patient) {
      if (patient.id) {
        this.eventDefaultData.patient_id = patient.id;
        this.eventDefaultData.color = "#8100CC";
        return;
      }
      this.eventDefaultData.color = "#CC8400";
      //this.eventDefaultData.patient = patient;
    },
    remove(item) {
      const index = this.value.apply.indexOf(item.name);
      if (index >= 0) this.value.apply.splice(index, 1);
    },
    onColorChange(color) {
      this.eventDefaultData.color = color;
    },
    async saveEvent() {
      if (this.saving) return;
      try {
        this.saving = true;
        const payload = {
          color: this.eventDefaultData.color,
          name: this.eventName?.name || this.eventName,
          start: this.eventDefaultData.start,
          end: this.eventDefaultData.end,
          patient_id: this.eventDefaultData.patient_id,
          type_id: 1,
        };
        if (!this.selectedPatient) {
          this.saving = false;
          return;
        }

        if (typeof this.selectedPatient === "string") {
          payload.data = JSON.stringify({ patientName: this.selectedPatient });
        }

        if (this.editingEvent) {
          payload.id = this.eventDefaultData.id;
        }

        await this.createEvent(payload);
        if (this.hasReminder && this.reminder?.reminder) {
          let reminder = JSON.parse(JSON.stringify(this.reminder));
          reminder.sourceName = "event";
          reminder.sourceId = payload.id;
          reminder.date = payload.start;
          await this.$store.dispatch("reminders/updateReminders", reminder);
        }
        //this.fetchEvents(this.eventsDate);
      } catch (error) {
        console.log(error);
        this.$root.addAlert({
          type: "error",
          text: this.$t("ERROR"),
        });
        this.saving = false;
        return false;
      }
      this.$root.addAlert({
        type: "success",
        text: this.$t("Event saved"),
      });
      this.$emit("refresh");
      //this.showEventForm = false
      this.saving = false;
      this.$emit("input");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>