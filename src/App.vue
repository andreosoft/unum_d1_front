<template>
  <v-app>
    <v-main>
      <router-view />

      <div class="alerts">
        <v-alert v-for="alert in alerts" :key="alert.id" :type="alert.type">
          {{ alert.text }}
        </v-alert>
      </div>
      <portal-target name="v-main" />
    </v-main>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import "dayjs/locale/ru";
const { mapState } = createNamespacedHelpers("alerts");
export default {
  name: "App",
  computed: {
    ...mapState(["alerts"]),
  },
};
</script>
<style lang="scss" scoped>
.alerts {
  position: fixed;
  right: 10px;
  bottom: 0;
  z-index: 99999;
}
</style>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Exo+2:wght@500;600&display=swap");
.justify-content-between {
  justify-content: space-between;
}
.justify-content-center {
  justify-content: center;
}
.align-items-center {
  align-items: center;
}
.align-items-start {
  align-items: start !important;
}
.align-items-end {
  align-items: flex-end !important;
}
.align-self-center {
  align-items: center !important;
}
.align-self-start {
  align-self: start !important;
}
.align-self-end {
  align-self: flex-end;
}
.cursor-pointer {
  cursor: pointer;
}
.position-relative {
  position: relative;
}
.position-absolute {
  position: absolute !important;
}
.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: transparent !important;
}
.form__title {
  font-size: 36px;
  font-weight: bold;
}
</style>
