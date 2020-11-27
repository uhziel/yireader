<template>
  <div class="bookSource">
    <dl>
      <dt>{{name}}</dt>
      <dd><a :href="fullUrl" target="_blank">{{url}}</a></dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'BookSourceInfo',
  props: ['name', 'url'],
  computed: {
    fullUrl() {
      return "http://" + this.url;
    }
  },
  created() {
  },
  methods: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bookSource {
  margin: 10px 0;
  border: 1px solid black;
  padding: 10px;
}
</style>
