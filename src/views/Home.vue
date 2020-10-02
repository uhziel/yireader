<template>
  <div class="home">
    <BookInfo v-for="bookInfo in bookInfos" :key="bookInfo.detail" :info="bookInfo" />
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
  computed: {
    bookInfos() {
      return this.$store.getters.bookInfosInBookshelf;
    }
  },
  components: {
    BookInfo
  },
  title: "易读"
}
</script>
