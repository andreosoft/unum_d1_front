<template>
  <div class="records__list mb-3">
    <v-treeview hoverable :items="records" :open="openRecord">
      <template v-slot:label="{ item }">
        <div @click="clickOnNode(item)" class="text-wrap">
          {{ item.name }} <br />
          ({{ item.createdon | getCreatedDate }}
          -
          {{ getDoctorSpecialty(item.doctor_id).toLowerCase() }}
          {{ getDoctorName(item.doctor_id) }})&nbsp;
        </div>
      </template>
      <template v-slot:append="{ item }">
        <div>
          <v-btn right @click.prevent="showVisitDialog(item)"> View </v-btn>
        </div>
      </template>
    </v-treeview>
    <ClinicalRecordView
      v-if="selectedVisit"
      v-model="visitDialog"
      :record="selectedVisit"
    />
  </div>
</template>

<script>
import dayjs from "dayjs";

import { createNamespacedHelpers } from "vuex";
import ClinicalRecordView from "./../dialog/ClinicalRecordView";

const { mapGetters } = createNamespacedHelpers("lang");
const { mapGetters: Getters_doctors } = createNamespacedHelpers("doctors");

export default {
  name: "PatientTabClinicalRecords",
  components: {
    ClinicalRecordView,
  },
  props: {
    records: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      openRecord: [],
      visitDialog: false,
      selectedVisit: null,
    };
  },
  filters: {
    getCreatedDate(val) {
      try {
        //        const date = JSON.parse(val).createdAt;
        const date = val;
        return dayjs(date).format("DD.MM.YYYY");
      } catch (err) {
        return "";
      }
    },
  },

  computed: {
    //...mapGetters(["getDoctorTranslation"]),
    ...Getters_doctors(["getDoctorName", "getDoctorSpecialty"]),
  },
  methods: {
    clickOnNode(item) {
      if (item.children) {
        if (this.openRecord.includes(item.id)) {
          this.openRecord = this.openRecord.filter((el) => {
            el !== item.id;
          });
        } else {
          this.openRecord.push(item.id);
        }
      }
    },
    showVisitDialog(event, item) {
      this.visitDialog = true;
      this.selectedVisit = event;
    },
  },
};
</script>

<style>
.v-treeview-node__label {
  white-space: normal;
}
</style>
