<template>
  <div class="BookChapter">
    <p v-for="paragraph in paragraphs" :key="paragraph">{{paragraph}}</p>
  </div>
</template>

<script>
import {chapter} from "@/api.js";

export default {
  name: "BookChapter",
  props: ["name", "chapterName"],
  data() {
    return { paragraphs: [], chapterInfo: {} };
  },
  created() {
    this.chapterInfo = this.$route.query;
    this.fetchChapter(this.chapterInfo);
    console.log("name: ", this.name);
    console.log("chapterName: ", this.chapterName);
    console.log("chapterInfo: ", this.chapterInfo)
  },
  watch: {
    $route() {
      this.chapterInfo = this.$route.query;
      this.fetchChapter(this.chapterInfo);
    }
  },
  methods: {
    fetchChapter(chapterInfo) {
      chapter(chapterInfo).then(res => {
        console.log(res.data);
        this.paragraphs = res.data.content.split('\n');
      }).catch(res => {
        console.error(res);
      });
    }
  }
}
</script>