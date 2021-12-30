<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn
            text
            rounded
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            <v-icon>mdi-calendar-today</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="mr-3"
            :elevation="0"
            :ripple="false"
            @click="
              dataEdit = 0;
              visitTimeGap = true;
            "
          >
            <!-- {{ getDoctorTranslation("Set working time") }} -->
            <v-icon>mdi-calendar-plus</v-icon>
          </v-btn>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>D</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>W</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>M</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4D</v-list-item-title>
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
          :weekdays="[1, 2, 3, 4, 5, 6, 0]"
          :events="getEvents"
          :event-color="getEventColor"
          :event-name="getEventName"
          :event-ripple="false"
          :type="type"
          locale="ru"
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
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark dense>
              <v-toolbar-title
                >{{ selectedEvent.name }}
                {{ selectedEvent.start | convertToDate }}</v-toolbar-title
              >
            </v-toolbar>
            <v-card-text class="d-flex flex-column">
              <span
                >{{ $t("Start") }}
                {{ selectedEvent.start | convertToTime }}</span
              >
              <span
                >{{ $t("End") }} {{ selectedEvent.end | convertToTime }}</span
              >
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                {{ $t("Close") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
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
          @click="createEventHandler({ date: currentDate })"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>

      <!-- создание события -->
      <DialogCreateEvent
        v-model="showEventForm"
        :editingEvent="editingEvent"
        :eventDefaultData="eventDefaultData"
        @refresh="refreshEvents"
        @showPatientCard="pushToPatientCard"
        @deleteEvent="deleteEventHandler"
      />
      <!-- создание диапазона посещений -->
      <DialogSetVisitTime
        v-model="visitTimeGap"
        :dataEdit="dataEdit"
        @refresh="refreshEvents"
      />
    </v-col>
    <portal portal to="toolbar-action">
      <v-menu
        bottom
        offset-y
        transition="scale-transition"
        origin="center center"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-icon large v-bind="attrs" v-on="on">mdi-school-outline</v-icon>
        </template>
        <v-list>
          <v-list-item v-for="el in videoList">
            <v-list-item-title @click="showVideo(el)">
              {{ el.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </portal>
    <portal to="v-main">
      <video-dialog
        v-if="showVideoDialog"
        v-model="showVideoDialog"
        :id="idVideo"
      ></video-dialog>
    </portal>
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
//import DatePicker from "@/components/schedule/DatePicker";
//import TimePicker from "@/components/schedule/TimePicker";
//import ColorPicker from "@/components/schedule/ColorPicker";
import VideoDialog from "@/components/video/videoDialog.vue";
import DialogCreateEvent from "@/components/schedule/DialogCreateEvent.vue";
import DialogSetVisitTime from "@/components/schedule/DialogSetVisitTime.vue";
export default {
  name: "Schedule",
  components: {
    //   DatePicker,
    TimePicker: () => import("@/components/schedule/TimePicker2"),
    //  ColorPicker,
    VideoDialog,
    DialogCreateEvent,
    DialogSetVisitTime,
  },
  data() {
    return {
      idVideo: "",
      dataEdit: null,
      videoList: [
        { title: "Длительность приема.", video: "NZQcTe493LU" },
        { title: "Рабочее расписание.", video: "5M9H-q8QuQg" },
      ],
      showVideoDialog: false,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      showEventForm: false,
      visitTimeGap: false,
      eventMenu: false,
      x: 0,
      y: 0,
      eventDefaultData: {},
      focus: "",
      type: this.settingBasic?.defaultView || "month",
      typeToLabel: {
        month: "M",
        week: "W",
        day: "W",
        "4day": "4D",
      },
      eventsDate: {
        start: null,
        end: null,
      },
      editingEvent: false,
      currentDate: dayjs().format("YYYY-MM-DD"),
    };
  },
  filters: {
    convertToTime(val) {
      const date = new Date(val);
      const hours =
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      const minutes =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      return `${hours}:${minutes}`;
    },
    convertToDate(val) {
      const date = new Date(val);
      const day = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();
      const month = date.getMonth();
      const year = date.getFullYear();
      return `${year}.${month}.${day}`;
    },
  },
  computed: {
    ...mapState(["events"]),
    ...State_patients(["patients"]),
    ...State_auth(["doctorProfile"]),
    ...Getters_lang(["getDoctorTranslation", "getCommonTranslation"]),
    setingServices() {
      return this.$store.state.settings.servicesList;
    },
    settingBasic() {
      return this.$store.state.settings.scheduleBasic;
    },
    getEvents() {
      const events = _.cloneDeep(this.events);
      this.$log("events2", this.events);
      if (events && events.length) {
        events.map((event) => {
          if (event.type_id === 2) {
            event.start = new Date(event.start);
            event.end = new Date(event.end);
          }
        });
      }
      return events;
    },
    selectedDate() {
      return this.date;
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
        this.editingEvent = false;
        //this.eventName = "";
        //this.selectedPatient = null;
        this.eventDefaultData.patient_id = null;
      }
    },
  },
  created() {
    this.$store.dispatch("settings/fetchServicesList");
    this.$store.dispatch("settings/fetchScheduleBasic");
    this.type = this.settingBasic?.defaultView || "month";
  },
  mounted() {
    this.$refs.calendar.checkChange();
  },
  methods: {
    showVideo(el) {
      this.idVideo = el.video;
      this.showVideoDialog = true;
    },
    ...mapActions([
      "createEvent",
      "fetchEvents",
      "deleteEvent",
      "updateVisitingTime",
    ]),
    myDayFormat(d) {
      //if you look at d.weekday, it's a number 0 to 6, and you could hard code
      //values for each, like if its 0, return "XXX", where XXX is Sunday for Spanish
    },
    ...Actions_alerts(["addAlert"]),
    intervalFormat(interval) {
      return interval.time;
    },
    createEventHandler(event) {
      if (dayjs().isAfter(dayjs(event.date).add(1, "day"))) {
        return;
      }
      if (!event.time) {
        event.time = "10:00:00";
        //this.startTime = "10:00:00";
        //this.endTime = "11:00:00";
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
        color: event.color ? event.color : "#CC0000",
      };
      this.showEventForm = true;
    },
    async deleteEventHandler() {
      await this.deleteEvent(this.eventDefaultData.id);
      this.fetchEvents(this.eventsDate);
      this.eventMenu = false;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type =
        this.type == "day" ? this.settingBasic?.defaultView || "month" : "day";
    },
    getEventColor(event) {
      return event.color;
    },
    getEventName(event) {
      return event.input.patient ? event.input.patient : event.input.name;
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
      nativeEvent.stopPropagation();
      if (event.type_id === 2) {
        this.dataEdit = event;
        this.visitTimeGap = true;
        return;
      }
      this.eventDefaultData = event;
      this.showEventMenu(nativeEvent);
    },
    showEventMenu(e) {
      e.preventDefault();
      this.eventEdit();
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
      this.eventMenu = false;
    },
    pushToPatientCard() {
      if (this.eventDefaultData.patient_id) {
        this.$router.push(`/patients/${this.eventDefaultData.patient_id}`);
        this.eventMenu = false;
        return;
      }
      this.$router.push({ name: "New patient" });
    },

    refreshEvents() {
      this.fetchEvents(this.eventsDate);
    },
  },
};
</script>
