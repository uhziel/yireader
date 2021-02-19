<template>
  <b-container class="bookSources">
    <b-row>
      <b-col>
        <b-form-input type="text" v-model="newBooksourceUrl" size="sm" class="mr-sm-2"></b-form-input>
        <b-button size="sm" class="my-2 my-sm-0" @click.prevent="addBooksource">添加书源</b-button>
        <b-alert variant="danger" class="mt-3" :show="error.length > 0">{{error}}</b-alert>
      </b-col>
    </b-row>
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
    BookSourceInfo,
  },
  data() {
    return {
      newBooksourceUrl: "",
    };
  },
  computed: {
    bookSources() {
      return this.$store.state.bookSources.all;
    },
    error() {
      return this.$store.state.bookSources.error;
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
    addBooksource() {
      if (this.newBooksourceUrl.length > 0 ) {
        this.$store.dispatch({
          type: 'addBooksource',
          downloadUrl: this.newBooksourceUrl,
        });
        this.newBooksourceUrl = "";
      }
    },
    fetchBookSources() {
      this.$store.dispatch('fetchBookSources');
    }
  },
  title: "书源 - 易读"
}
</script>
