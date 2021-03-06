<template>
  <div class="chapterNav mb-3">
    <router-link replace v-if="prevChapterInfo" :to='{name:"BookChapter", params:{bookId:bookInfo.bookId, chapterIndex:chapterIndex-1}, query: bookInfo}'>上一章</router-link>
    <span v-else>没有前一章节</span>
    <router-link :to='{name:"BookDetail", params:{bookId: bookInfo.bookId}, query: bookInfo}'>目录</router-link>
    <router-link replace v-if="nextChapterInfo" :to='{name:"BookChapter", params:{bookId:bookInfo.bookId, chapterIndex:chapterIndex+1}, query: bookInfo}'>下一章</router-link>
    <span v-else>没有更多章节</span>
  </div>
</template>

<script>
export default {
  name: 'ChapterNav',
  props: ["bookInfo", "chapterIndex", "prevChapterInfo", "nextChapterInfo"],
  computed: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chapterNav {
  border: 1px solid black;
  display: flex;
  justify-content: space-around;
}
</style>
