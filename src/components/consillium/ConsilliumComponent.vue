<template>
  <div>
    <div class="d-flex justify-content-between px-4">
      <p>{{ $_lang_getCommonTranslation("Sort") }}</p>
      <p>{{ $_lang_getCommonTranslation("Filter") }}</p>
    </div>
    <ConsilliumList :items="mockupComputed" />

    <portal to="toolbar-action">
      <v-icon @click="search">mdi-magnify</v-icon>
    </portal>

    <v-fab-transition>
      <v-btn
        fab
        right
        dark
        bottom
        fixed
        color="#406278"
        @click="createConsilliumDialog = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <CreateConsilliumDialog
      :dialog="createConsilliumDialog"
      @close="createConsilliumDialog = false"
    />
  </div>
</template>

<script>
import { lang } from "../../mixins/lang";
import ConsilliumList from "./ConsilliumList";
import CreateConsilliumDialog from "./CreateConsilliumDialog";
export default {
  mixins: [lang],
  name: "ConsilliumComponent",
  components: {
    ConsilliumList,
    CreateConsilliumDialog,
  },
  data() {
    return {
      createConsilliumDialog: false,
      mockup: [
        {
          createdDate: "2021-09-01",
          diagnosis: "Туберкулез",
          problem:
            "Возле здания МВД неспокойно. Там митинговали с требованием отправить в отставку министра внутренних дел из-за убийства Айзады Канатбековой. ",
          patient: "Алеша Попович",
          participants: ["Кубанов Алексей", "Николай Спаркович"],
          tags: ["Кубанов Алексей", "Николай Спаркович"],
          id: 1,
          status: false,
          notifications: 5,
        },
        {
          createdDate: "2021-09-01",
          diagnosis: "Туберкулез",
          problem:
            "Возле здания МВД неспокойно. Там митинговали с требованием отправить в отставку министра внутренних дел из-за убийства Айзады Канатбековой. ",
          patient: "Алеша Попович",
          participants: ["Кубанов Алексей", "Николай Спаркович"],
          tags: ["Кубанов Алексей", "Николай Спаркович"],
          id: 2,
          status: true,
          notifications: 0,
        },
        {
          createdDate: "2021-09-01",
          diagnosis: "Туберкулез",
          problem:
            "Возле здания МВД неспокойно. Там митинговали с требованием отправить в отставку министра внутренних дел из-за убийства Айзады Канатбековой. ",
          patient: "Алеша Попович",
          participants: ["Кубанов Алексей", "Николай Спаркович"],
          tags: ["Кубанов Алексей", "Николай Спаркович"],
          id: 3,
          status: true,
          notifications: 0,
        },
        {
          createdDate: "2021-09-01",
          diagnosis: "Туберкулез",
          problem:
            "Возле здания МВД неспокойно. Там митинговали с требованием отправить в отставку министра внутренних дел из-за убийства Айзады Канатбековой. ",
          patient: "Алеша Попович",
          participants: ["Кубанов Алексей", "Николай Спаркович"],
          tags: ["Кубанов Алексей", "Николай Спаркович"],
          id: 4,
          status: false,
          notifications: 1,
        },
        {
          createdDate: "2021-09-01",
          diagnosis: "Туберкулез",
          problem:
            "Возле здания МВД неспокойно. Там митинговали с требованием отправить в отставку министра внутренних дел из-за убийства Айзады Канатбековой. ",
          patient: "Алеша Попович",
          participants: ["Кубанов Алексей", "Николай Спаркович"],
          tags: ["Кубанов Алексей", "Николай Спаркович"],
          id: 5,
          status: true,
          notifications: 0,
        },
      ],
    };
  },
  computed: {
    mockupComputed() {
      const data = [...this.mockup];
      data.map((item) => {
        item.participants = item.participants.join(", ");
        item.tags = item.tags.join(", ");
      });
      return data;
    },
  },
  methods: {
    search() {
      console.log("search");
    },
  },
};
</script>
