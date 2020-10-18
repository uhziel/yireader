<template>
  <div class="home">
    <BookInfo v-for="(bookInfo, index) in bookInfos" :key="index" :index="index" :info="bookInfo" :reading="getReading(bookInfo)" :inBookshelf="true" />
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
    this.$store.dispatch('fetchAllBook');
  },
  computed: {
    bookInfos() {
      return this.$store.getters.bookInfosInBookshelf;
    },
  },
  methods: {
    getReading(bookInfo) {
      const fullName = bookInfo.name + '-' + bookInfo.author;
      return this.$store.getters.getReadingProcess(fullName);
    }
  },
  components: {
    BookInfo
  },
  title: "易读"
}
</script>
