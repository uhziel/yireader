<template>
  <v-card class="bookInfo my-4" elevation="3" >
    <div class="d-flex flex-no-wrap">
      <div class="bookCover ma-1">
        <router-link :to='{name:"BookDetail", params:{name: info.name, author:info.author}, query: info}'>
          <v-img :alt="info.name+'封面'" :src="info.cover"></v-img>
        </router-link>
      </div>
      <div>
        <v-card :ripple="ripple" elevation="0" :to='{name:"BookDetail", params:{name: info.name, author:info.author}, query: info}'>
          <v-card-title>
              {{info.name}}<span class="redpoint" v-if="contentChanged" />
          </v-card-title>
          <v-card-subtitle class="author">{{info.author}}</v-card-subtitle>
          <v-divider/>
          <v-card-text>{{info.summary}}</v-card-text>
        </v-card>
        <v-card-text class="operate">
          <span v-if="reading">已读到：<router-link :to='{name:"BookChapter", params:{name:info.name, author:info.author, chapterIndex:reading.chapterIndex}}'>{{reading.chapterName}}</router-link></span>
        </v-card-text>
        <v-card-actions class="operate">
          <v-btn v-if="inBookshelf" @click="removeFromBookshelf">移出</v-btn>
          <v-btn v-if="inBookshelf" :disabled="!moveUpEnable" @click="moveUp">上移</v-btn>
          <v-btn v-if="inBookshelf" :disabled="!moveDownEnable" @click="moveDown">下移</v-btn>
        </v-card-actions>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'CardBook',
  props: ['info', 'reading', 'inBookshelf', 'index'],
  data: () => {
    return {
      ripple: false,
    }
  },
  computed: {
    bookFullName() {
      return this.info.name + '-' + this.info.author;
    },
    moveUpEnable() {
      return this.inBookshelf && this.index > 0;
    },
    moveDownEnable() {
      return this.inBookshelf && this.index < this.$store.getters.bookshelfLength - 1;
    },
    contentChanged() {
      const bookUserData = this.$store.getters.getBookUserData(this.bookFullName);
      if (!bookUserData) {
        return false;
      }
      return this.inBookshelf && bookUserData.contentChanged;
    },
  },
  created() {
    console.log('CardBookWider info', this.info);
    console.log('CardBookWider reading', this.reading);
    console.log('CardBookWider inBookshelf', this.inBookshelf);
    console.log('CardBookWider index', this.index);
  },
  methods: {
    removeFromBookshelf() {
      this.$store.commit('removeFromBookshelf', this.index);
    },
    moveUp() {
      this.$store.commit('moveUpInBookshelf', this.index);
    },
    moveDown() {
      this.$store.commit('moveDownInBookshelf', this.index);
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.redpoint{
  vertical-align: top;
  display:inline-block;
  height:10px;
  width:10px;
  border-radius:10px;
  background:red;
}
</style>
