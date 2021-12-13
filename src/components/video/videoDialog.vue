<template>
  <div>
    <v-dialog
      :value="value"
      @input="$emit('input')"
      :width="dialogWidth"
      :height="dialogHeight"
      transition="dialog-bottom-transition"
      content-class="ma-1"
    >
      <v-card>
        <v-toolbar v-if="0 == 1" dark color="primary">
          <v-btn icon @click="$emit('input')">
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <v-toolbar-title> Название видео файла </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-responsive :aspect-ratio="16 / 9">
          <youtube
            :video-id="videoId"
            ref="youtube"
            width="100%"
            height="100%"
            @playing="playing"
          ></youtube>
        </v-responsive>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
export default {
  name: "videoDialog",
  props: {
    value: Boolean,
    id: String,
  },
  data() {
    return {
      title: "",
    };
  },
  methods: {
    playVideo() {
      this.player.playVideo();
    },
    playing() {
      //      console.log("o/ we are watching!!!");
    },
    dialog_size(type = "") {
      const { innerWidth, innerHeight } = window;
      let ww = innerWidth;
      let wh = innerHeight;
      let w = ww - 10;
      let h = (w * 9) / 16;
      console.log("window size", ww, wh);
      console.log("calculated", w, h);
      if (h > wh) {
        h = wh - 10;
        w = (h * 16) / 9;
        if (w > wh) {
          w = wh - 4;
        }
      }
      if (type == "h") {
        return h;
      }
      if (type == "w") {
        return w;
      }
      return { w: w, h: h };
    },
  },
  computed: {
    videoId() {
      console.log("videoId", this.id, this.dialog_height);
      return this.id;
    },
    player() {
      return this.$refs.youtube.player;
    },
    dialogWidth() {
      return this.dialog_size("w");
    },
    dialogHeight() {
      return this.dialog_size("h");
    },
  },
};
</script>