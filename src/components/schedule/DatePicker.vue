<template>
  <div style="margin: 5px 0; min-height: 28px; width: 100%;">
    <v-icon>mdi-calendar</v-icon>
    <div class="d-inline-block">
      <v-dialog ref="dialog" v-model="showPicker" persistent width="290px">
        <template v-slot:activator="{ on, attrs }">
          <slot>
            <div v-bind="attrs" v-on="on">
              <span>{{ dateProps }}</span>
            </div>
          </slot>
        </template>
        <v-date-picker v-if="showPicker" v-model="date" full-width>
          <v-spacer></v-spacer>
          <v-btn text color="blue darken-1" @click="showPicker = false">
            {{ getCommonTranslation("Cancel") }}
          </v-btn>
          <v-btn text color="blue darken-1" @click="onChange">
            ок
          </v-btn>
        </v-date-picker>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("lang");
export default {
  name: "DatePicker",
  props: {
    dateProps: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showPicker: false,
      date: new Date().toISOString().substr(0, 10),
    };
  },
  methods: {
    onChange() {
      this.$refs.dialog.save(this.date);
      this.showPicker = false;

      this.$emit("change", this.date);
    },
  },
  computed: {
    ...mapGetters(["getCommonTranslation"]),
  },
};
</script>

<style></style>
