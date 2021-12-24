<template>
  <v-dialog
    ref="dialog"
    v-model="showPicker"
    :return-value.sync="color"
    persistent
    width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <slot>
        <div v-bind="attrs" v-on="on" >
          <a-view-base-color2 :value="color" />
        </div>
      </slot>
    </template>
    <v-card>
      <v-color-picker
        v-if="showPicker"
        v-model="color"
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
  },
  data() {
    return {
      showPicker: false,
    };
  },
  computed: {
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