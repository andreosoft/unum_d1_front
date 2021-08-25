<template>
  <div
    class="d-flex justify-content-between align-items-center pt-3 px-3"
    style="width: 100%;"
  >
    <v-menu>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-on="on"
          v-bind="attrs"
          :style="
            $vuetify.breakpoint.smAndDown ? 'align-self: start; order: 2;' : ''
          "
        >
          {{ getCommonTranslation("Sort") }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="$emit('sortByDate')">
          {{ getCommonTranslation("Sort by date") }}
        </v-list-item>
        <v-list-item @click="$emit('sortByName')">
          {{ getCommonTranslation("Sort by name") }}
        </v-list-item>
      </v-list>
    </v-menu>
    <div :style="$vuetify.breakpoint.smAndDown ? 'order: 1;' : ''">
      <v-btn
        class="mr-2"
        :class="{ 'mb-2': $vuetify.breakpoint.smAndDown }"
        @click="$emit('openRequestAccessDialog')"
      >
        {{ getDoctorTranslation("Request access") }}
      </v-btn>
      <v-btn @click="$emit('openNewPatientDialog')">
        {{ getDoctorTranslation("New patient") }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("lang");
export default {
  name: "PatientsControls",
  computed: {
    ...mapGetters(["getCommonTranslation", "getDoctorTranslation"]),
  },
};
</script>
