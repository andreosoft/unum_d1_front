<template>
  <div
    class="d-flex justify-content-between align-items-center pt-3 px-3"
    style="width: 100%"
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
          <v-icon v-if="$vuetify.breakpoint.smAndDown"
            >mdi-sort-reverse-variant</v-icon
          >
          <div v-else>{{ $t("Sort") }}</div>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="$emit('sortByDate')">
          {{ $t("Sort by date") }}
        </v-list-item>
        <v-list-item @click="$emit('sortByName')">
          {{ $t("Sort by name") }}
        </v-list-item>
      </v-list>
    </v-menu>
    <div :style="$vuetify.breakpoint.smAndDown ? 'order: 1;' : ''">
      <v-btn
        class="mr-2"
        :class="{ 'mb-2': $vuetify.breakpoint.smAndDown }"
        @click="$emit('openRequestAccessDialog')"
      >
        <v-icon v-if="$vuetify.breakpoint.smAndDown"
          >mdi-account-box-multiple</v-icon
        >
        <div v-else>{{ $t("Request access") }}</div>
      </v-btn>
      <v-btn
        class="mr-2"
        :class="{ 'mb-2': $vuetify.breakpoint.smAndDown }"
        @click="$emit('openNewPatientDialog')"
        ><v-icon v-if="$vuetify.breakpoint.smAndDown">mdi-account-plus</v-icon>
        <div v-else>{{ $t("New patient") }}</div>
      </v-btn>
    </div>
  </div>
</template>

<script>
//mdiSortReverseVariant
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("lang");
export default {
  name: "PatientsControls",
  computed: {
    ...mapGetters(["getCommonTranslation", "getDoctorTranslation"]),
  },
};
</script>
