<template>
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
              :label="getTitle('name')"
              @input="$emit('input', value)"
            ></v-text-field>
          </v-flex>

          <v-flex d-flex xs4 pa-1 pl-0>
            <div class="pa-0 pr-1">
              <a-input-color2
                dense
                outlined
                hide-details
                :model="{ title: $t('color') }"
                v-model="value.color"
                @input="$emit('input', value)"
              />
            </div>

            <v-text-field
              dense
              outlined
              type="number"
              hide-details
              :label="getTitle('order')"
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
          hide-details
          chips
          item-text="title"
          item-value="name"
          small-chips
          :label="getTitle('apply')"
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
          :label="getTitle('sample')"
          @input="$emit('input', value)"
        ></v-textarea>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
import { api } from "@/config/index";
export default {
  name: "SampleElement",
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
  computed: {},
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