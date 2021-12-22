<template>
  <v-layout row wrap>
    <v-flex d-flex xs12 pa-0>
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
            <v-flex d-flex xs2 pa-1>
              <a-input-color2
                dense
                outlined
                hide-details
                :model="{ title: $t('color') }"
                v-model="value.color"
                @input="$emit('input', value)"
              >
              </a-input-color2>
            </v-flex>
            <v-flex d-flex xs2 pa-1>
              <v-text-field
                dense
                outlined
                hide-details
                :label="$t('order')"
                v-model="value.order"
                @input="$emit('input', value)"
              >
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex d-flex xs12 pa-0 py-1>
          <v-autocomplete
            v-model="value.apply"
            :items="model.apply"
            outlined
            dense
            chips
            item-text="title"
            item-value="name"
            small-chips
            label="Apply"
            multiple
            @input="$emit('input', value)"
          >
            <template v-slot:selection="data">
              <v-chip
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                small
                @click="data.select"
                @click:close="remove(data.item)"
              >
                {{ $t(data.item.title) }}
              </v-chip>
            </template>
            <template v-slot:item="data">
              {{ $t(data.item.title) }}
            </template>
          </v-autocomplete>
        </v-flex>
        <v-flex d-flex xs12 pa-0>
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
    </v-flex>
  </v-layout>
</template>

<script>
import { api } from "@/config/index";
export default {
  name: "SampleElement2",
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
    remove(item) {
      const index = this.value.apply.indexOf(item.name);
      if (index >= 0) this.value.apply.splice(index, 1);
    },
  },
};
</script>