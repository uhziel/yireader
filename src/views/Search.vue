<template>
  <div class="search">
    <h1>This is an {{searchKey}} search page</h1>
  </div>
</template>

<script>
export default {
  name: "Search",
  props: ["searchKey"]
}
</script>