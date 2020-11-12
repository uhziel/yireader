<template>
  <div class="chapterNav">
    <router-link replace v-if="lastChapterInfo" :to='{name:"BookChapter", params:{name:bookInfo.name, author:bookInfo.author, chapterIndex:parseInt(chapterIndex)-1}}'>上一章</router-link>
    <span v-else>没有前一章节</span>
    <router-link :to='{name:"BookDetail", params:{name:bookInfo.name, author:bookInfo.author}, query: bookInfo}'>目录</router-link>
    <router-link replace v-if="nextChapterInfo" :to='{name:"BookChapter", params:{name:bookInfo.name, author:bookInfo.author, chapterIndex:parseInt(chapterIndex)+1}}'>下一章</router-link>
    <span v-else>没有更多章节</span>
  </div>
</template>

<script>
export default {
  name: 'ChapterNav',
  props: ["bookInfo", "chapterIndex", "lastChapterInfo", "nextChapterInfo"]
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
