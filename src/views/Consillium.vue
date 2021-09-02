<template>
  <v-container fluid class="px-0">
    <v-row no-gutters>
      <v-col cols="6" class="pa-0">
        <ConsilliumComponent />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ConsilliumComponent from "./../components/consillium/ConsilliumComponent";
export default {
  name: "Consillium",
  components: {
    ConsilliumComponent,
  },
};
</script>

<style></style>
