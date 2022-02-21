<template>
  <v-flex d-flex xs12 pa-0>
    <v-layout row wrap pa-1 align-content-start>
      <v-flex d-flex xs12 pa-0>
        <v-layout row my-1>
          <v-flex d-flex xs8 pa-1>
            <v-text-field
              dense
              outlined
              hide-details
              v-model="value.name"
              :label="getTitle('name')"
              @input="$emit('input', value)"
            ></v-text-field>
          </v-flex>

          <v-flex d-flex xs4 pa-1 pl-0>
            <v-text-field
              dense
              outlined
              type="number"
              hide-details
              :label="getTitle('time')"
              v-model="value.time"
              @input="$emit('input', value)"
            >
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex d-flex xs12 pa-0 pt-1 mb-1>
        <v-textarea
          auto-grow
          rows="2"
          dense
          hide-details
          outlined
          v-model="value.description"
          :label="getTitle('description')"
          @input="$emit('input', value)"
        ></v-textarea>
      </v-flex>
      <v-flex d-flex xs12 pa-0 py-1 mb-1>
        <s-input-autocomplete
          v-model="value.reminder"
          :items="getDuration"
          :label="getTitle('reminder')"
          @input="$emit('input', value)"
        />

        <div class="pa-0 pl-1">
          <s-input-color
            dense
            outlined
            hide-details
            palette
            :model="{ title: $t('color') }"
            v-model="value.color"
            @input="$emit('input', value)"
          />
        </div>
      </v-flex>
      <v-flex d-flex xs12 pa-0>
        <v-textarea
          auto-grow
          rows="2"
          dense
          hide-details
          outlined
          v-model="value.message"
          :label="getTitle('message')"
          @input="$emit('input', value)"
        ></v-textarea>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import { api } from "@/config/index";
export default {
  name: "ServiceElement",
  props: {
    value: Object,
    model: Object,
    title: Object,

    disabled: {
      type: Boolean,
      default: false,
    },
    config: Object,
    error: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      status: 0,
      color: null,
    };
  },
  mounted() {},
  computed: {
    swatches() {
      return this.$store.getters["settings/getPalette"];
    },
    getDuration() {
      return this.$store.getters["settings/getDuration"];
    },
  },
  methods: {
    getTitle(v) {
      return this.$t(this.title?.[v] || v);
    },
    async onInput(e, el) {
      if (typeof e === "object" && e !== null) {
        Object.assign(this.data, e);
      } else {
        this.data[el.name] = e;
      }
    },
    remove(item) {
      const index = this.value.apply.indexOf(item.name);
      if (index >= 0) this.value.apply.splice(index, 1);
    },
  },
};
</script>