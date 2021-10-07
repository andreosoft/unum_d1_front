<template>
  <div>
    <PatientsControls
      @sortByDate="sortPatientsBy('date')"
      @sortByName="sortPatientsBy('alphabet')"
      @openNewPatientDialog="$router.push({ name: 'New patient' })"
      @openRequestAccessDialog="requestAccessDialog = true"
    />

    <PatientCardList :patients="patients" />

    <RequestAccess
      :dialog="requestAccessDialog"
      @close="requestAccessDialog = false"
    />

    <router-view></router-view>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import PatientsControls from "../components/patient/PatientsControls.vue";
import PatientCardList from "./../components/patient/PatientCardList.vue";
import NewPatientDialog from "./../components/patient/NewPatientDialog.vue";
import RequestAccess from "./../components/patient/RequestAccess.vue";

const { mapState, mapActions } = createNamespacedHelpers("patients");

export default {
  components: {
    PatientCardList,
    NewPatientDialog,
    PatientsControls,
    RequestAccess,
  },
  data() {
    return {
      newPatientDialog: false,
      requestAccessDialog: false,
    };
  },
  computed: {
    ...mapState(["patients"]),
  },
  methods: {
    ...mapActions(["sortPatientsBy"]),
  },
};
</script>

<style></style>
