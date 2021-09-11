import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("lang");
export const lang = {
  computed: {
    ...mapGetters({
      $_lang_getCommonTranslation: "getCommonTranslation",
      $_lang_getDoctorTranslation: "getDoctorTranslation",
    }),
  },
};
