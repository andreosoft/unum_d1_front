<template>
  <v-container fluid>
    <v-row :no-gutters="$vuetify.breakpoint.smAndDown">
      <v-col
        v-for="patient in patients"
        :key="patient.id"
        cols="6"
        sm="3"
        lg="2"
        :class="{
          'pa-1': $vuetify.breakpoint.smAndDown,
          'pa-2': !$vuetify.breakpoint.smAndDown,
        }"
      >
        <v-hover>
          <template v-slot="{ hover }">
            <PatientCard
              :patient="patient"
              :hover="hover"
              @click.native="
                $router.push({
                  name: 'Patient',
                  params: { id: patient.id },
                })
              "
            />
          </template>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PatientCard from "./PatientCard";
export default {
  name: "PatientCardList",
  components: {
    PatientCard,
  },
  props: {
    patients: {
      type: Array,
      default: () => [],
    },
    slug: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 100%;
}
</style>