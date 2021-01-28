<template>
  <b-container class="bookSources">
    <b-row cols="1" cols-sm="2" cols-xl="3">
      <b-col v-for="(booksource, index) in bookSources" :key="index">
        <BookSourceInfo :content="booksource" :index="index" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import BookSourceInfo from "@/components/BookSourceInfo"

export default {
  name: "BookSources",
  components: {
    BookSourceInfo
  },
  data() {
    return {
    };
  },
  computed: {
    bookSources() {
      return this.$store.state.bookSources.all;
    },
  },
  created() {
    this.fetchBookSources();
  },
  watch: {
    $route() {
      this.fetchBookSources();
    }
  },
  methods: {
    fetchBookSources() {
      this.$store.dispatch('fetchBookSources');
    }
  },
  title: "书源 - 易读"
}
</script>
