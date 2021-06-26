<template>
  <div>
    <DoctorCardList :doctors="doctors" />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import DoctorCardList from './../components/doctor/DoctorCardList.vue'


const { mapState } = createNamespacedHelpers('doctors')
export default {
  components: {
    DoctorCardList
  },
  computed: {
    ...mapState(['doctors'])
  }
}
</script>

<style>

</style>