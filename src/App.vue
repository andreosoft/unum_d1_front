<template>
  <v-app>
    <v-main>
      <router-view/>

      <div class="alerts">
        <v-alert v-for="alert in alerts" :key="alert.id" :type="alert.type">
          {{ alert.text }}
        </v-alert>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import "dayjs/locale/ru";
const { mapState } = createNamespacedHelpers('alerts')
export default {
  name: 'App',
  computed: {
    ...mapState(['alerts'])
  }
};
</script>
<style lang="scss" scoped>
.alerts {
  position: fixed;
  right: 10px;
  bottom: 0;
}
</style>
<style lang="scss">
  .justify-content-between {
    justify-content: space-between;
  }
  .justify-content-center {
    justify-content: center;
  }
  .align-items-center {
    align-items: center;
  }
  .flex-column {
    flex-direction: column;
  }
  .theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: transparent !important;
}
</style>
