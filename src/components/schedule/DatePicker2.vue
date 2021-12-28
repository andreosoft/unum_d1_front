<template>
  <div>
    <v-icon>mdi-calendar</v-icon>
    <div class="d-inline-block">
      <v-dialog ref="dialog" v-model="showPicker" persistent width="290px"
      :return-value.sync="date">
        <template v-slot:activator="{ on, attrs }">
          <slot>
            <div v-bind="attrs" v-on="on">
              <span>{{ date }}</span>
            </div>
          </slot>
        </template>
        <v-date-picker
          v-if="showPicker"
          v-model="date"
          @input="save(date)"
          :events="datesAll"
          event-color="blue lighten-1"
          full-width
          locale="ru"
          first-day-of-week="1"
        >
          <v-spacer></v-spacer>
          <v-btn text color="blue darken-1" @click="showPicker = false">
            {{ $t("Cancel") }}
          </v-btn>
          <v-btn text color="blue darken-1" @click="onChange">
            {{ $t("Done") }}
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
    value: {
      type: String,
      default: "11",
    },
  },
  data() {
    return {
      showPicker: false,
      datesAll: [],
    };
  },
  methods: {
    onChange() {
      this.$refs.dialog.save(this.date);
      this.showPicker = false;

      //  this.$emit("change", this.date);
    },
    save: function (date) {
      var index = this.datesAll.findIndex((x) => x === date);

      if (index === -1) {
        this.datesAll.push(date);
      } else {
        this.datesAll.splice(index, 1);
      }
    },

  },
  computed: {
    ...mapGetters(["getCommonTranslation"]),
    date: {
      get: function () {
        return this.value;
      },
      set: function (v) {
        this.$emit("input", v);
      },
    },
  },
};
</script>

<style></style>
