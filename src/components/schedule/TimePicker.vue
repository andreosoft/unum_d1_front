<template>
  <div class="d-inline-block" :class="{ 'pl-5': padding }">
    <v-icon>mdi-clock</v-icon>
    <div class="d-inline-block">
      <v-dialog ref="dialog" v-model="showPicker" persistent width="290px">
        <template v-slot:activator="{ on, attrs }">
          <slot>
            <div v-bind="attrs" v-on="on">
              <span>{{ timeProps }}</span>
            </div>
          </slot>
        </template>
        <v-time-picker
          v-if="showPicker"
          v-model="time"
          full-width
          format="24hr"
        >
          <v-spacer></v-spacer>
          <v-btn text color="blue darken-1" @click="showPicker = false">
            {{ getCommonTranslation("Cancel") }}
          </v-btn>
          <v-btn text color="blue darken-1" @click="onChange">
            ок
          </v-btn>
        </v-time-picker>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("lang");
export default {
  name: "TimePicker",
  props: {
    timeProps: {
      type: String,
      default: "",
    },
    padding: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showPicker: false,
      time: new Date().toISOString().substr(11, 5),
    };
  },
  computed: {
    ...mapGetters(["getCommonTranslation"]),
  },
  methods: {
    onChange() {
      this.$refs.dialog.save(this.time);
      this.showPicker = false;

      this.$emit("change", this.time);
    },
  },
};
</script>

<style></style>
