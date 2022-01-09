<template>
  <div>
    <v-container grid-list-md pa-0>
      <v-layout py-2 row wrap>
        <v-flex sm6 xs12 grow pa-1 sm-pb-0>
          <v-flex sm12 xs12 grow pa-0 pb-1>
            <SBtnAny
              title="Save"
              icon="mdi-check"
              @btnClick="save"
              :disabled="!needSave"
              :classBtn="{ primary: !needSave, error: needSave }"
            />
            <SBtnAny
              title="Cancel"
              icon="mdi-close-thick"
              @btnClick="cancelEdit"
              :disabled="!needSave"
            />

            <SBtnAny
              title="Add"
              icon="mdi-plus-thick"
              @btnClick="addElement"
              :disabled="needSave"
            />
            <SBtnAny
              title="Delete"
              icon="mdi-delete-forever"
              @btnClick="delElement"
              :disabled="!element"
            />
          </v-flex>
          <div v-if="elements.length">
            <Element
              :value="element"
              :model="model"
              @input="onInput($event)"
              v-if="element"
              :key="key"
            />
            <div v-else>Select sample for edit or add new</div>
          </div>
        </v-flex>
        <v-flex sm6 xs12 pa-0 px-1 pb-1 v-if="elements.length">
          <v-card outlined min-height="100" height="100%">
            <v-card-subtitle>{{ $t("Your's services") }}</v-card-subtitle>
            <v-chip
              v-for="(el, i) of elements"
              :key="i"
              @click.stop="needSave ? true : (curElement = i)"
              :color="el.color"
              class="ml-1 mt-1"
            >
              <v-icon left v-if="i === curElement"> mdi-pencil-outline </v-icon>
              {{ el.name }}
            </v-chip>
          </v-card>
        </v-flex>
      </v-layout>
      <div v-if="!elements.length">{{ $t("No matching anything") }}</div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "ServicesForm",
  components: {
    Element: () => import("./ServiceElement"),
  },
  props: {
    value: [],
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
      temp: {
        name: "",
        description: "",
        time: 0,
        reminder: [],
        color: "",
        message: "",
      },
      elements: [],
      curElement: null,
      origElement: "",
      needSave: false,
      isNew: false,
      key: 0,
    };
  },
  created() {
    this.elements = this.value || [];
  },
  mounted() {},
  watch: {
    value(v) {
      this.elements = v || [];
    },
    curElement(v) {
      this.origElement = JSON.stringify(this.elements[v]);
    },
  },
  computed: {
    element: {
      get() {
        let res = null;
        if (this.curElement >= 0) {
          res = this.elements[this.curElement];
        }
        return res;
      },
      set(v) {
        this.needSave = true;
        this.elements[this.curElement] = v;
      },
    },
  },
  methods: {
    cancelEdit() {
      if (this.origElement) {
        let original = JSON.parse(this.origElement);
        Object.keys(original).forEach((k) => {
          this.element[k] = original[k];
        });
        this.needSave = this.isNew;

      }
    },
    addElement() {
      this.elements.push(JSON.parse(JSON.stringify(this.temp)));
      this.curElement = this.elements.length - 1;
      this.needSave = true;
      this.isNew = true;
    },
    delElement() {
      this.elements.splice(this.curElement, 1);
      this.save();
    },

    save() {
      console.log("save", this.elements, this.model.name);

      this.$store.dispatch("settings/updateServicesList", this.elements);
      this.needSave = false;
      this.isNew = false;
    },

    async onInput(e) {
      console.log("onInput", e);

      this.element = e;
    },
  },
};
</script>
  }
</script>

<style lang="scss" scoped>
</style>