/** @format */

import fillForm from './fillForm';

export default {
  mixins: [fillForm],
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    updateData(id) {
      console.log('updateData');
      this.resetFrom();
      this.fillForm();
      this.fetchData(id);
    },
    async fetchData(id) {
      console.log('fetchData', id);
      if (id) {
        this.loading = true;
        let response = await this.$axios.get(this.api + '/' + id);
        this.loading = false;
        this.data = response.data.data;
        this.afterFetchData(response);
      }
    },
    afterFetchData(response) {},
  },
};
