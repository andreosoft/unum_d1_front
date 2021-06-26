<template>
  <v-container fluid class="pb-0">
    <v-row class="mb-0">
      <v-col
        v-if="$vuetify.breakpoint.mdAndUp"
        cols="3"
        class="d-flex align-items-center flex-column"
      >
        <div class='doctor-info'>
          <v-avatar size="200" class="mx-auto">
            <v-img
              :src="
                selectedDoctor &&
                selectedDoctor.photo &&
                selectedDoctor.photo.includes('http')
                  ? selectedDoctor.photo
                  : '/images/doctor-placeholder.jpeg'
              "
            ></v-img>
          </v-avatar>
          <div>
            <p class="mb-1 doctor-info__text">{{ getFirstName || "Имя" }}</p>
            <p class="mb-1 doctor-info__text">{{ getLastName || "Фамилия" }}</p>
            <p class="mb-1 doctor-info__text">
              {{ getMiddleName || "Отчество" }}
            </p>
            <p class="mb-1" style="max-width: 200px;">
              Специальность -
              {{ selectedDoctor && selectedDoctor.medical_specialty || "Специальность врача" }}
            </p>
          </div>
        </div>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col :cols="$vuetify.breakpoint.mdAndUp ? 9 : 12">
        <div
          v-show="$vuetify.breakpoint.smAndDown"
          class="mb-3"
          @click="drawer = true"
          style="cursor: pointer;"
        >
          <v-icon>
            mdi-account-box
          </v-icon>
          показать данные доктора
        </div>
        <h2 class="mb-3">Информация о враче</h2>
        <v-card>
          <v-list>
            <v-list-item class="mb-2">Имя - {{ getFirstName }}</v-list-item>
            <v-list-item class="mb-2">Фамилия - {{ getLastName }}</v-list-item>
            <v-list-item class="mb-2">
              Язык -
              {{ (selectedDoctor && selectedDoctor.country) || "Страна" }}
            </v-list-item>
          </v-list>
          <v-list>
            <v-list-item class="mb-2">
              Специальность -
              {{
                (selectedDoctor && selectedDoctor.medical_specialty) ||
                  "Специальность врача"
              }}
            </v-list-item>
            <v-list-item class="mb-2">
              Образование -
              {{
                (selectedDoctor && selectedDoctor.medical_university) ||
                  "Образование врача"
              }}
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.smAndDown"
      v-model="drawer"
      app
    >
      <div class="mx-auto pt-3 doctor-info">
        <v-avatar size="200" class="mx-auto">
          <v-img
            :src="
              selectedDoctor &&
              selectedDoctor.photo &&
              selectedDoctor.photo.includes('http')
                ? selectedDoctor.photo
                : '/images/doctor-placeholder.jpeg'
            "
          ></v-img>
        </v-avatar>
        <div>
          <p class="mb-1 doctor-info__text">{{ getFirstName || "Имя" }}</p>
          <p class="mb-1 doctor-info__text">{{ getLastName || "Фамилия" }}</p>
          <p class="mb-1 doctor-info__text">
            {{ getMiddleName || "Отчество" }}
          </p>
          <p class="mb-1" style="max-width: 200px;">
            Специальность -
            {{ selectedDoctor && selectedDoctor.medical_specialty || "Специальность врача" }}
          </p>
        </div>
      </div>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("doctors");
export default {
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    ...mapState(["selectedDoctor"]),
    getFirstName() {
      return this.selectedDoctor && this.selectedDoctor.name.split(" ")[1];
    },
    getLastName() {
      return this.selectedDoctor && this.selectedDoctor.name.split(" ")[0];
    },
    getMiddleName() {
      return this.selectedDoctor && this.selectedDoctor.name.split(" ")[2];
    },
  },
  methods: {
    ...mapActions(["fetchSelectedDoctor"]),
  },
  created() {
    this.fetchSelectedDoctor(this.$route.params.id);
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
.row {
  height: 100%;
}
.doctor-info {
  width: fit-content;
}
.doctor-info__text {
  font-weight: 800;
}
</style>
