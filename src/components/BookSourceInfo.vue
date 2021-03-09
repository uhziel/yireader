<template>
  <div class="bookSource">
      <div class="d-flex">
        <div>{{content.name}}</div>
        <b-form-checkbox class="ml-auto" :checked="content.enableSearch" @input="enableBooksource" size="lg" switch />
      </div>
      <p><a :href="fullUrl" target="_blank">{{content.url}}</a></p>
      <b-button-group class="operate my-3" size="sm">
        <b-button class="mx-1" variant="danger" @click="deleteBooksource">删除</b-button>
        <b-button class="mx-1" @click="moveUpBooksource">上移</b-button>
        <b-button class="mx-1" @click="moveDownBooksource">下移</b-button>
      </b-button-group>
  </div>
</template>

<script>
export default {
  name: 'BookSourceInfo',
  props: ['content'],
  computed: {
    fullUrl() {
      return "http://" + this.content.url;
    },
    buttonTextEnable() {
      return this.content.enableSearch ? '停用' : '启用';
    },
  },
  created() {
  },
  methods: {
    deleteBooksource() {
      this.$store.dispatch({
        type: 'deleteBooksource',
        id: this.content.id,
      });
    },
    moveUpBooksource() {
      this.$store.dispatch({
        type: 'moveUpBooksource',
        id: this.content.id,
      });
    },
    moveDownBooksource() {
      this.$store.dispatch({
        type: 'moveDownBooksource',
        id: this.content.id,
      });
    },
    enableBooksource() {
      this.$store.dispatch({
        type: 'enableBooksource',
        id: this.content.id,
        value: !this.content.enableSearch,
      });
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.bookSource {
  margin: 10px 0;
  border: 1px solid black;
  padding: 10px;
}
</style>
