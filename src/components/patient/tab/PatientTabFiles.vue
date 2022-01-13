<template>
  <div>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="files"
        :search="search"
        show-group-by
      >
        <template v-slot:item.file_name="{ item }">
          <v-chip outlined :href="download(item.file)" target="_blank">
            {{ item.file_name }}
          </v-chip>
        </template></v-data-table
      >
    </v-card>
  </div>
</template>

<script>
import { api } from "./../../../config/index";
export default {
  name: "PatientTabFiles",
  props: {
    records: {
      type: Array,
      default: () => [],
    },
    titleArray: [],
  },
  data() {
    return {
      search: null,
      headers: [
        {
          text: this.$t("date"),
          align: "start",
          groupable: false,
          //sortable: false,
          value: "date",
        },
        { text: this.$t("section"), value: "section" },
        { text: this.$t("folder name"), value: "group_name" },
        { text: this.$t("file name"), value: "file_name" },
      ],
    };
  },
  computed: {
    files() {
      let res = [];
      let section = "";
      this.records.forEach((el, index) => {
        if (el.files) {
          console.log("files", el.files);
          for (const [key, value] of Object.entries(JSON.parse(el.files))) {
            console.log("value", value);
            if (Array.isArray(value))
              value.forEach((group, i) => {
                console.log("group", group);
                //for (const [i, files] of value.entries()) {
                if (Array.isArray(group.files)) {
                  group.files.forEach((file) => {
                    console.log("file", file);
                    section = this.$t(
                      key.replace("_file", "").replace("_", " ")
                    );

                    res.push({
                      date: this.records[index].createdon,
                      section: this.$t(
                        key.replace("_file", "").replace("_", " ")
                      ),
                      group_name: group.group_name,
                      file_name: file.name,
                      file: file.file,
                    });
                  });
                  /* for (const [idx, file] of files) {
                    res.push({
                      date: this.records[index].createdon,
                      section: key,
                      group_name: files.group_name,
                      file_name: file.name,
                      file: file.file,
                    });
                  } */
                }
              });
          }
        }
      });
      return res;
    },
  },
  created() {
    console.log("patient tab files created");
    console.log(this.records);
    console.log(this.files);
  },
  methods: {
    download(id) {
      return `http://api.neomedy.com${api.getFile}/${id}`;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>