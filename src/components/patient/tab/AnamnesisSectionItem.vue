<template>
  <li>
    {{ section.body }}
    <span style="white-space: nowrap"> ({{ section.created }} - </span>
    <span>
      {{ showDoctorSpecialty(section.doctor_id).toLowerCase() }}
      <span
        @click="
          $router.push({ name: 'Doctor', params: { id: section.doctor_id } })
        "
        class="link"
        >{{ getDoctorName(section.doctor_id) | shortname }}</span
      >)
    </span>
  </li>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("doctors");

export default {
  name: "AnamnesisSectionItem",
  props: {
    section: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters(["getDoctorSpecialty", "getDoctorName"]),
  },
  methods: {
    showDoctorSpecialty(id) {
      if (!this.getDoctorSpecialty(id).length) {
        return "";
      }
      return this.getDoctorSpecialty(id);
    },
  },
};
</script>

<style scoped>
.link {
  text-decoration: underline;
  cursor: pointer;
}
</style>
