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
          </v-flex>
          <v-flex d-flex md12 pa-1>
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
          <v-flex d-flex md12 pa-1>
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
          <v-flex d-flex xs12 pa-1 wrap>
            <v-flex d-flex sm12 md2 pa-1 shrink>
              <v-input
                class="
                  v-input--is-label-active v-input--is-dirty
                  v-text-field v-text-field--is-booted
                "
              >
                <template v-slot:default>
                  <v-label :value="true" :absolute="true">
                    {{ $t("Color") }}
                  </v-label>
                  <v-icon>mdi-palette</v-icon>
                  <ColorPicker
                    @change="onColorChange"
                    :color="eventDefaultData.color"
                  />
                </template>
              </v-input>
            </v-flex>
            <v-flex d-flex sm12 md10 pa-1>
              <v-autocomplete
                v-model="notify"
                :items="['1d', '2d', '1h', '2h']"
                outlined
                dense
                hide-details1
                hide-selected
                chips
                small-chips
                label="Notify"
                multiple
                :menu-props="{ closeOnClick: true }"
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
import { createNamespacedHelpers } from "vuex";
const { mapState: State_patients } = createNamespacedHelpers("patients");
const { mapState: state_settings } = createNamespacedHelpers("settings");
const { mapState, mapGetters, mapActions } = createNamespacedHelpers("events");
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
      notify: null,
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
    ...State_patients(["patients"]),
    ...mapState(["events"]),
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
    readTime(v) {
      this.durationVisit =
        this.eventName?.time || this.basic?.defaultTime || 60;
      this.calcEnd();
    },

    value(val) {
      if (!val) {
        this.editingEvent = false;
        this.eventName = "";
        this.selectedPatient = null;
        this.eventDefaultData.patient_id = null;
        //this.eventDefaultData.color = "";
      } else {
        this.calcEnd();

        this.eventName = this.eventDefaultData.name;
        this.selectedPatient = this.eventDefaultData.patient;
      }
    },
  },
  methods: {
    ...mapActions(["createEvent", "fetchEvents", "deleteEvent"]),
    calcEnd() {
      if (this.durationVisit) {
        this.eventDefaultData.end = dayjs(this.eventDefaultData.start)
          .add(this.durationVisit, "minute")
          .format("YYYY-MM-DD HH:mm:ss");
      }
    },
    changeEventName() {
      this.readTime++;
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

    onColorChange(color) {
      this.eventDefaultData.color = color;
    },
    async saveEvent() {
      if (this.saving) return;
      this.saving = true;
      const payload = {
        color: this.eventDefaultData.color,
        name: this.eventName,
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
      //this.fetchEvents(this.eventsDate);
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