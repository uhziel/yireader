<template>
  <div class="BookChapter">
    <h2>{{chapterInfo.name}}</h2>
    <router-link :to='{name:"BookChapter", params:{name:name, author:author, chapterIndex:parseInt(chapterIndex)-1}}'>{{lastChapterInfo.name}}</router-link>
    <router-link :to='{name:"BookDetail", params:{name: name, author:author}, query: bookData.bookInfo}'><h4>目录</h4></router-link>
    <router-link :to='{name:"BookChapter", params:{name:name, author:author, chapterIndex:parseInt(chapterIndex)+1}}'>{{nextChapterInfo.name}}</router-link>
    <p v-for="(paragraph, index) in paragraphs" :key="index">{{paragraph}}</p>
    <router-link :to='{name:"BookChapter", params:{name:name, author:author, chapterIndex:chapterIndex-1}}'>{{lastChapterInfo.name}}</router-link>
    <router-link :to='{name:"BookDetail", params:{name: name, author:author}, query: bookData.bookInfo}'><h4>目录</h4></router-link>
    <router-link :to='{name:"BookChapter", params:{name:name, author:author, chapterIndex:chapterIndex+1}}'>{{nextChapterInfo.name}}</router-link>
  </div>
</template>

<script>
import {chapter} from "@/api.js";

export default {
  name: "BookChapter",
  props: ["name", "author", "chapterIndex"],
  data() {
    return {
      bookData: { bookDetail: {lastChapter: ""}, bookCatalog: [], bookInfo: {} },
      bookFullName: "",
      paragraphs: [],
      chapterInfo: {},
      lastChapterInfo: {},
      nextChapterInfo: {}
    };
  },
  created() {
    this.loadBookData();
    this.fetchChapter(this.chapterInfo);
    console.log("name: ", this.name);
    console.log("author: ", this.author);
    console.log("chapterIndex: ", this.chapterIndex);
  },
  watch: {
    $route() {
      this.loadBookData();
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
    },
    loadBookData() {
      this.bookFullName = this.name + "-" + this.author;
      if (localStorage.getItem(this.bookFullName)) {
        try {
          this.bookData = JSON.parse(localStorage.getItem(this.bookFullName));
          this.chapterInfo = this.bookData.bookCatalog[this.chapterIndex];
          this.nextChapterInfo = this.bookData.bookCatalog[this.chapterIndex+1];
          this.lastChapterInfo = this.bookData.bookCatalog[this.chapterIndex-1];
        } catch (e) {
          localStorage.removeItem(this.bookFullName);
        }
      }
    },
    saveBookData() {
      const parsed = JSON.stringify(this.bookData);
      localStorage.setItem(this.bookFullName, parsed);
    }
  }
}
</script>