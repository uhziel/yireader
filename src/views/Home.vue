<template>
  <div class="home">
    <p v-if="bookInfos.length === 0">请先添加"书源"再通过搜索框添加"书籍"。详细见 <a href="https://uhziel.github.io/yireader/user/#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B" target="_blank">快速开始</a>。</p>
    <b-container v-else>
      <b-row cols="1">
        <b-col v-for="(bookInfo, index) in bookInfos" :key="index">
          <BookInfo :index="index" :info="bookInfo" :inBookshelf="true" />
        </b-col>
      </b-row>  
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import BookInfo from '@/components/BookInfo.vue'

export default {
  name: 'Home',
  data: function() {
    return {
    };
  },
  created() {
    this.$store.dispatch('books');
  },
  computed: {
    bookInfos() {
      return this.$store.state.books.all;
    },
  },
  methods: {
  },
  components: {
    BookInfo
  },
  title: "易读"
}
</script>
