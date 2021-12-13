<template>
  <div class="records__list mb-3">
    <v-treeview hoverable :items="records" :open="openRecord">
      <template v-slot:label="{ item }">
        <div @click.stop="clickOnNode(item)" class="text-wrap">
          {{ item.name }} <br />
          ({{ item.createdon | date }}
          -
          {{ getDoctorSpecialty(item.doctor_id).toLowerCase() }}
          {{ getDoctorName(item.doctor_id) | shortname }})&nbsp;
        </div>
      </template>
      <template v-slot:append="{ item }">
        <div>
          <v-btn right @click.prevent="showVisitDialog(item)">
            {{ $t("View") }}
          </v-btn>
        </div>
      </template>
    </v-treeview>
    <ClinicalRecordView
      v-if="visitDialog"
      v-model="visitDialog"
      :record="selectedVisit"
      :titleArray="titleArray"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const { mapGetters: Getters_doctors } = createNamespacedHelpers("doctors");

export default {
  name: "PatientTabClinicalRecords",
  components: {
    ClinicalRecordView: () => import("./../dialog/ClinicalRecordView2"),
  },
  props: {
    records: {
      type: Array,
      default: () => [],
    },
    titleArray: [],
  },
  data() {
    return {
      openRecord: [],
      visitDialog: false,
      selectedVisit: null,
    };
  },

  computed: {
    ...Getters_doctors(["getDoctorName", "getDoctorSpecialty"]),
  },
  methods: {
    clickOnNode(item) {
      if (item.children) {
        if (this.openRecord.includes(item.id)) {
          this.openRecord = this.openRecord.filter((el) => {
            return el !== item.id;
          });
        } else {
          this.openRecord.push(item.id);
        }
      }
    },
    showVisitDialog(item) {
      this.visitDialog = true;
      this.selectedVisit = item;
    },
  },
};
</script>

<style>
.v-treeview-node__label {
  white-space: normal;
}
</style>
