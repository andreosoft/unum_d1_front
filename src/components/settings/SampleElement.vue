<template>
  <v-layout row wrap>
    <v-flex d-flex xs6 pa-0>
      <v-layout row wrap pa-1 align-content-start>
        <v-flex d-flex xs12 pa-0>
          <v-layout row>
            <v-flex d-flex xs8 pa-1>
              <v-text-field
                dense
                outlined
                hide-details
                v-model="value.name"
                :label="$t('name')"
                @input="$emit('input', value)"
              ></v-text-field>
            </v-flex>
            <v-flex d-flex xs4 pa-1>
              <v-text-field
                dense
                outlined
                hide-details
                :label="$t('color')"
                v-model="value.color"
              >
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex d-flex xs12 pa-0 py-1>
          <v-text-field
            dense
            hide-details
            outlined
            :value="value.apply"
            :label="$t('apply')"
            @input="$emit('input', $event.target.value)"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex d-flex xs6 pa-0 px-1>
      <v-textarea
        auto-grow
        rows="4"
        dense
        hide-details
        outlined
        v-model="value.sample"
        :label="$t('sample')"
        @input="$emit('input', value)"
      ></v-textarea>
    </v-flex>
  </v-layout>
</template>

<script>
import { api } from "@/config/index";
export default {
  name: "SampleElement",
  props: {
    value: Object,
    model: Object,
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
  computed: {},
  methods: {
    async onInput(e, el) {
      if (typeof e === "object" && e !== null) {
        Object.assign(this.data, e);
      } else {
        this.data[el.name] = e;
      }
    },
  },
};
</script>