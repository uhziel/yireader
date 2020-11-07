<template>
  <v-card class="bookInfo my-4" @click="goToBookDetail">
    <v-img class="mx-auto" :alt="info.name+'的封面'" max-width="150px" :src="info.cover"></v-img>
    <v-card-title>
      {{info.name}}<span class="redpoint" v-if="contentChanged" />
    </v-card-title>
    <v-card-subtitle >{{info.author}}</v-card-subtitle>

    <v-card-actions class="operate">
          <v-btn v-if="inBookshelf" @click.stop="removeFromBookshelf" icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn v-if="inBookshelf" :disabled="!moveUpEnable" @click.stop="moveUp" icon>
            <v-icon>mdi-arrow-up-bold</v-icon>
          </v-btn>
          <v-btn v-if="inBookshelf" :disabled="!moveDownEnable" @click.stop="moveDown" icon>
            <v-icon>mdi-arrow-down-bold</v-icon>
          </v-btn>
    </v-card-actions>

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
        简介
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          {{info.summary}}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
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
    goToBookDetail() {
      this.$router.push({name:"BookDetail", params:{name: this.info.name, author:this.info.author}, query: this.info});
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
