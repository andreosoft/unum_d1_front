<template>
  <div class="d-inline-block">
    <v-dialog ref="dialog" v-model="showPicker" persistent width="290px">
      <template v-slot:activator="{ on, attrs }">
        <slot>
          <div v-bind="attrs" v-on="on">
            <div
              style="height: 16px; width: 100px"
              :style="{ backgroundColor: colorEdit }"
            ></div>
          </div>
        </slot>
      </template>
      <v-card>
        <v-color-picker
          v-if="showPicker"
          v-model="colorEdit"
          full-width
        ></v-color-picker>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="blue darken-1" @click="showPicker = false">
            {{ $t("Cancel") }}
          </v-btn>
          <v-btn text color="blue darken-1" @click="$refs.dialog.save(color)">
            ок
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "ColorPicker",
  props: { color: { type: String, default: "#CC0000" } },
  data() {
    return {
      showPicker: false,
      colorEdit1: this.color,
    };
  },
  computed: {
    colorEdit: {
      get: function () {
        console.log("get colorEdit", this.color);
        if (!this.color) return "##CC0000";
        return this.color;
      },
      set: function (v) {
        this.$emit("change", v);
      },
    },
  },
  created() {
    console.log("color", this.color, this.colorEdit);
  },
  methods: {
    onChange() {
      //this.$refs.dialog.save(this.colorEdit);
      this.showPicker = false;

      this.$emit("change", this.colorEdit);
    },
  },
};
</script>

<style></style>
