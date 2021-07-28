<template>
  <div class="d-inline-block">
    <v-dialog ref="dialog" v-model="showPicker" persistent width="290px">
      <template v-slot:activator="{ on, attrs }">
        <slot>
          <div v-bind="attrs" v-on="on">
            <div
              style="height: 16px; width: 100px"
              :style="{ backgroundColor: color }"
            ></div>
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
          <v-btn text color="blue darken-1" @click="showPicker = false">
            {{ getCommonTranslation("Cancel") }}
          </v-btn>
          <v-btn text color="blue darken-1" @click="onChange">
            ок
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("lang");
export default {
  name: "ColorPicker",
  data() {
    return {
      showPicker: false,
      color: "#CC0000",
    };
  },
  computed: {
    ...mapGetters(["getCommonTranslation"]),
  },
  methods: {
    onChange() {
      this.$refs.dialog.save(this.color);
      this.showPicker = false;

      this.$emit("change", this.color);
    },
  },
};
</script>

<style></style>
