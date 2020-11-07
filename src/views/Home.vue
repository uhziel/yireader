<template>
  <v-container>
    <v-row>
      <v-col v-for="(bookInfo, index) in bookInfos" :key="index" cols="6" md="3">
        <CardBook :index="index" :info="bookInfo" :reading="getReading(bookInfo)" :inBookshelf="true" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import CardBook from '@/components/CardBook'

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
    CardBook,
  },
  title: "易读"
}
</script>
