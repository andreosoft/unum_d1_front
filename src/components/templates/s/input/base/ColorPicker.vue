<template>
  <v-dialog
    ref="dialog"
    v-model="showPicker"
    :return-value.sync="color"
    persistent
    @keydown.esc="showPicker = false"
    width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot>
        <div v-bind="attrs" v-on="on">
          <s-view-base-color
            :value="color"
            :size="size"
            :classList="classList"
          />
        </div>
      </slot>
    </template>
    <v-card>
      <v-color-picker
        :show-swatches="palette"
        :swatches="getSwatches"
        v-if="showPicker"
        v-model="color"
        hide-inputs
        full-width
      ></v-color-picker>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="showPicker = false">Cancel</v-btn>
        <v-btn @click="$refs.dialog.save(color)">Ok</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: String,
    size: null,
    classList: null,
    palette: { type: Boolean, default: false },
  },
  data() {
    return {
      showPicker: false,
    };
  },
  computed: {
    getSwatches() {
      if (!this.palette) return [];
      let swatches = this.$store.getters["settings/getPalette"];
      let res = [];
      if (swatches) {
        for (let el of swatches) {
          res.push([el]);
        }
      }
      return res;
    },
    color: {
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