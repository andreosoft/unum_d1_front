<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            {{ getCommonTranslation("Today") }}
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ getDoctorTranslation("Schedule") }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="getAppointments"
          :event-color="getEventColor"
          :event-name="getEventName"
          :event-ripple="false"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @click:time="createEventHandler"
          @click:day="createEventHandler"
          @change="updateRange"
          :interval-format="intervalFormat"
          :first-interval="8"
        >
        </v-calendar>
      </v-sheet>
      <v-fab-transition>
        <v-btn
          v-show="!showEventForm"
          fab
          right
          dark
          bottom
          fixed
          color="pink"
          @click="
            createEventHandler({ date: currentDate });
            showButtomCreate = false;
          "
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>

      <!-- выбор действия при нажатии на день -->
      <v-dialog v-model="chooseAction" :max-width="500">
        <v-card class="mx-auto d-flex justify-content-center">
          <v-card-actions>
            <v-btn @click="showEventForm = true">{{
              getDoctorTranslation("Create event")
            }}</v-btn>
            <v-btn @click="visitTimeGap = true">{{
              getDoctorTranslation("Set working time")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- создание события -->
      <v-dialog v-model="showEventForm" :max-width="600">
        <v-card>
          <v-card-title>
            {{ getCommonTranslation("New event") }}
          </v-card-title>
          <v-card-text>
            <v-text-field
              dense
              :label="getCommonTranslation('Event name')"
              v-model="eventName"
            ></v-text-field>
            <v-select
              :items="patients"
              v-model="selectedPatient"
              item-text="name"
              item-value="id"
              :label="getDoctorTranslation('Patients')"
              @change="onSelectedPatientChange"
            ></v-select>
            <v-input
              class="v-input--is-label-active v-input--is-dirty v-text-field v-text-field--is-booted"
            >
              <template v-slot:default>
                <v-label :value="true" :absolute="true">
                  {{ getCommonTranslation("Start") }}
                </v-label>
                <DatePicker
                  @change="onStartDateChange"
                  :dateProps="eventDefaultData.start.split(' ')[0]"
                />
                <TimePicker
                  @change="onStartTimeChange"
                  :timeProps="eventDefaultData.start.split(' ')[1]"
                />
              </template>
            </v-input>
            <v-input
              class="v-input--is-label-active v-input--is-dirty v-text-field v-text-field--is-booted"
            >
              <template v-slot:default>
                <v-label :value="true" :absolute="true">
                  {{ getCommonTranslation("End") }}
                </v-label>
                <DatePicker
                  @change="onEndDateChange"
                  :dateProps="eventDefaultData.end.split(' ')[0]"
                />
                <TimePicker
                  @change="onEndTimeChange"
                  :timeProps="eventDefaultData.end.split(' ')[1]"
                />
              </template>
            </v-input>
            <v-input
              class="v-input--is-label-active v-input--is-dirty v-text-field v-text-field--is-booted"
            >
              <template v-slot:default>
                <v-label :value="true" :absolute="true">
                  {{ getCommonTranslation("Color") }}
                </v-label>
                <v-icon>mdi-palette</v-icon>
                <ColorPicker @change="onColorChange" />
              </template>
            </v-input>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="blue darken-1" @click="showEventForm = false">
              {{ getCommonTranslation("Close") }}
            </v-btn>
            <v-btn text color="blue darken-1" @click="saveEvent">{{
              editingEvent
                ? getCommonTranslation("Edit")
                : getCommonTranslation("Create")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- создание диапазона посещений -->
      <v-dialog v-model="visitTimeGap" width="350">
        <v-card v-if="visitTimeGap" class="pa-3">
          <v-card-title class="pa-0">
            {{ getDoctorTranslation("Working time on") }}&nbsp;
            <span style="white-space: nowrap;">{{ getStartDate }}</span>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-input
              class="v-input--is-label-active v-input--is-dirty v-text-field v-text-field--is-booted"
            >
              <template v-slot:default>
                <v-label :value="true" :absolute="true">
                  {{ getCommonTranslation("Start") }}
                </v-label>
                <TimePicker
                  :padding="false"
                  @change="visitStartTimeChange"
                  :timeProps="visitingStartTime"
                />
              </template>
            </v-input>
          </v-card-text>
          <v-card-text class="pa-0">
            <v-input
              class="v-input--is-label-active v-input--is-dirty v-text-field v-text-field--is-booted"
            >
              <template v-slot:default>
                <v-label :value="true" :absolute="true">
                  {{ getCommonTranslation("End") }}
                </v-label>
                <TimePicker
                  :padding="false"
                  @change="visitEndTimeChange"
                  :timeProps="visitingEndTime"
                />
              </template>
            </v-input>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="visitTimeGap = false">{{
              getCommonTranslation("Close")
            }}</v-btn>
            <v-btn @click="saveVisitTimeGap">{{
              getCommonTranslation("Save")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-menu
        v-model="eventMenu"
        :position-x="x"
        :position-y="y"
        absolute
        offset-x
        top
      >
        <v-list>
          <v-list-item-group active-class="">
            <v-list-item
              @click="
                $router.push(`/patients/${eventDefaultData.patient_id}`);
                eventMenu = false;
              "
            >
              <v-list-item-title>
                {{ getCommonTranslation("Patient card") }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="eventEdit">
              <v-list-item-title>
                {{ getCommonTranslation("Edit event") }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title @click="deleteEventHandler">
                {{ getCommonTranslation("Delete event") }}
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import dayjs from "dayjs";
const { mapState, mapGetters, mapActions } = createNamespacedHelpers("events");
const { mapState: State_patients } = createNamespacedHelpers("patients");
const { mapGetters: Getters_lang } = createNamespacedHelpers("lang");
const { mapActions: Actions_alerts } = createNamespacedHelpers("alerts");
const { mapState: State_auth } = createNamespacedHelpers("auth");
import DatePicker from "./../components/schedule/DatePicker";
import TimePicker from "./../components/schedule/TimePicker";
import ColorPicker from "./../components/schedule/ColorPicker";

export default {
  name: "Schedule",
  components: {
    DatePicker,
    TimePicker,
    ColorPicker,
  },
  data() {
    return {
      eventName: "",
      chooseAction: false,
      showEventForm: false,
      visitTimeGap: false,
      eventMenu: false,
      x: 0,
      y: 0,
      eventDefaultData: {},
      showButtomCreate: true,
      focus: "",
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days",
      },
      eventsDate: {
        start: null,
        end: null,
      },
      startTime: new Date().toISOString().substr(11, 5),
      endTime: new Date().toISOString().substr(11, 5),
      editingEvent: false,
      selectedPatient: null,
      currentDate: dayjs().format("YYYY-MM-DD"),
      visitingStartTime: "10:00",
      visitingEndTime: "11:00",
    };
  },
  computed: {
    ...mapState(["events"]),
    ...mapGetters(["getAppointments"]),
    ...State_patients(["patients"]),
    ...State_auth(["doctorProfile"]),
    ...Getters_lang(["getDoctorTranslation", "getCommonTranslation"]),
    selectedDate() {
      return this.date;
    },
    getStartDate() {
      return this.eventDefaultData.start.split(" ")[0];
    },
    getEndDate() {
      return this.eventDefaultData.end.split(" ")[0];
    },
    getStartTime() {
      return this.eventDefaultData.start.split(" ")[1];
    },
    getEndTime() {
      return this.eventDefaultData.end.split(" ")[1];
    },
    getPatientNames() {
      const names = [];
      this.patients &&
        this.patients.map((patient) => {
          if (patient.name) {
            names.push(patient.name + " " + patient.id);
          }
        });
      return names;
    },
    getDoctorSpecialty() {
      return this.doctorProfile &&
        this.doctorProfile.info &&
        this.doctorProfile.info.doctor_specialty
        ? this.doctorProfile.info.doctor_specialty
        : "no specialty";
    },
  },
  watch: {
    showEventForm(val) {
      if (!val) {
        this.showButtomCreate = true;
        this.editingEvent = false;
        this.eventName = "";
        this.selectedPatient = null;
        this.eventDefaultData.patient_id = null;
      }
    },
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    ...mapActions(["createEvent", "fetchEvents", "deleteEvent"]),
    ...Actions_alerts(["addAlert"]),
    intervalFormat(interval) {
      return interval.time;
    },
    createEventHandler(event) {
      if (!event.time) {
        event.time = "10:00:00";
        this.startTime = "10:00:00";
        this.endTime = "11:00:00";
      }
      let start = event.date + " " + event.time;
      let d = new Date(Date.parse(start.replace(/-/g, "/")));
      let minutes = d.getMinutes();
      let roundM = (Math.round(minutes / 15) * 15) % 60;
      d.setMinutes(roundM);
      let st = new Date(d);
      let end = this.addHours(d, 1);
      this.eventDefaultData = {
        start: this.getDateTime(st),
        end: this.getDateTime(end),
        color: "#CC0000",
      };

      // get start and end time
      const getStartTime = this.eventDefaultData.start.split(" ")[1];
      const getFormattedStartTime =
        getStartTime.split(":")[0] + ":" + getStartTime.split(":")[1];
      const getEndTime = this.eventDefaultData.end.split(" ")[1];
      const getFormattedEndTime =
        getEndTime.split(":")[0] + ":" + getEndTime.split(":")[1];
      //
      this.startTime = getFormattedStartTime;
      this.endTime = getFormattedEndTime;
      this.chooseAction = true;
    },
    async deleteEventHandler() {
      await this.deleteEvent(this.eventDefaultData.id);
      this.fetchEvents(this.eventsDate);
      this.eventMenu = false;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    getEventName(event) {
      return event.input.patient;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      this.eventDefaultData = event;
      this.showEventMenu(nativeEvent);
      console.log("ev: ", event);
      nativeEvent.stopPropagation();
    },
    showEventMenu(e) {
      e.preventDefault();
      this.eventMenu = false;
      this.x = e.clientX - 100;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.eventMenu = true;
      });
    },
    updateRange({ start, end }) {
      this.eventsDate = {
        start: start.date,
        end: end.date,
      };
      this.fetchEvents(this.eventsDate);
    },
    getDateTime(date) {
      const getDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      const getTime = date.toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0];
      const dateTime = getDate + " " + getTime;
      return dateTime;
    },
    addHours(date, hours) {
      date.setTime(date.getTime() + hours * 60 * 60 * 1000);
      return date;
    },
    eventEdit() {
      this.showEventForm = true;
      this.editingEvent = true;
      this.eventName = this.eventDefaultData.name;
      this.eventMenu = false;
      this.selectedPatient = this.eventDefaultData.patient_id;
    },
    async saveEvent() {
      const payload = {
        color: this.eventDefaultData.color,
        name: this.eventName,
        start: this.eventDefaultData.start,
        end: this.eventDefaultData.end,
        patient_id: this.eventDefaultData.patient_id,
        type_id: 1,
      };
      if (!this.selectedPatient) {
        alert("couldnt create appointment. Choose a patient");
        return;
      }
      if (this.editingEvent) {
        payload.id = this.eventDefaultData.id;
      }
      await this.createEvent(payload);
      this.fetchEvents(this.eventsDate);
      this.eventName = "";
      this.showEventForm = false;
      this.chooseAction = false;
      this.eventDefaultData.color = "";
    },
    // onChange
    onStartDateChange(startDate) {
      this.eventDefaultData.start = startDate + " " + this.getStartTime;
    },
    onEndDateChange(endDate) {
      this.eventDefaultData.end = endDate + " " + this.getEndTime;
    },
    onStartTimeChange(startTime) {
      this.eventDefaultData.start = this.getStartDate + " " + startTime;
    },
    onEndTimeChange(endTime) {
      this.eventDefaultData.end = this.getEndDate + " " + endTime;
    },
    onColorChange(color) {
      this.eventDefaultData.color = color;
    },
    onSelectedPatientChange(patientId) {
      this.eventDefaultData.patient_id = patientId;
      const patient = this.patients.find((p) => p.id === patientId);
      this.selectedPatient = patientId;
    },
    visitStartTimeChange(time) {
      this.visitingStartTime = time;
    },
    visitEndTimeChange(time) {
      this.visitingEndTime = time;
    },
    async saveVisitTimeGap() {
      const payload = {
        name: "Прием пациентов",
        start: `${this.getStartDate} ${this.visitingStartTime}:00`,
        end: `${this.getStartDate} ${this.visitingEndTime}:00`,
        type_id: "2",
      };
      this.showEventForm = false;
      this.visitTimeGap = false;
      this.chooseAction = false;
      await this.createEvent(payload);
      this.addAlert({
        type: "success",
        text: this.getDoctorTranslation("Working time set"),
      });
    },
  },
};
</script>
