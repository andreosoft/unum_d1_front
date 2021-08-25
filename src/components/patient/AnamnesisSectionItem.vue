<template>
  <li>
    {{ section.body }}
    <span style="white-space: nowrap;"> ({{ section.created }} - </span>
    <span>
      {{ showDoctorSpecialty(section.doctor_id).toLowerCase() }}
      <span
        @click="
          $router.push({ name: 'Doctor', params: { id: section.doctor_id } })
        "
        class="link"
        >{{ section.doctor }}</span
      >)
    </span>
  </li>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("doctors");
const { mapGetters: Getters_lang } = createNamespacedHelpers("lang");
export default {
  name: "AnamnesisSectionItem",
  props: {
    section: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters(["getDoctorSpecialty"]),
    ...Getters_lang(["getCommonTranslation"]),
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
