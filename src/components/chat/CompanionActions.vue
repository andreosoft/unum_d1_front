<template>
  <v-card
    tile
    style="box-shadow: 0px 4px 8px rgba(186, 186, 186, 0.25);"
    class="pa-3"
  >
    <div class="d-flex">
      <div class="pt-3">
        <v-icon size="20">mdi-format-list-bulleted</v-icon>
      </div>
      <v-list class="pa-0">
        <div v-for="(item, index) in actions" :key="index">
          <v-list-item
            v-if="item.show"
            class="d-flex align-items-center"
            @click="item.action"
          >
            <v-list-item-title :style="`color: ${item.color && item.color}`">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </div>
      </v-list>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "CompanionActions",
  props: {
    consilium: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      actions: [
        // {
        //   title: "Поделиться контактом",
        // },
        // {
        //   title: "Изменить контакт",
        // },
        {
          title: "Удалить контакт",
          action: this.removeChat,
          show: !this.consilium ? true : false,
        },
        {
          title: "Очистить историю",
          action: this.clearHistory,
          show: true,
        },
        {
          title: "Закрыть консилиум",
          color: "#FF3636",
          show: this.consilium ? true : false,
          action: this.removeChat,
        },
        // {
        //   title: "Заблокировать",
        //   color: "#FF3636",
        //   show: true,
        //   action: this.removeChat,
        // },
      ],
    };
  },
  methods: {
    removeChat() {
      this.$emit("removeChat");
    },
    clearHistory() {
      this.$emit("clearHistory");
    },
  },
};
</script>

<style></style>
