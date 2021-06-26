<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import "dayjs/locale/ru";
export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
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
