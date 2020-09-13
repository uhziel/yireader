<template>
  <div class="home">
    <BookInfo v-for="bookInfo in books" :key="bookInfo.detail" :info="bookInfo" />
  </div>
</template>

<script>
// @ is an alias to /src
import BookInfo from '@/components/BookInfo.vue'

export default {
  name: 'Home',
  data: function() {
    return {
      books: [
        {name:"剑来",author:"烽火戏诸侯",cover:"https://img.jueshitangmen.info/4469/219372.jpg",summary:"大千世界，无奇不有。 我陈平安，唯有一剑，可搬山，倒海，降妖，镇魔，敕神，摘星，断江，摧城，开天！",detail: "https://www.jueshitangmen.info/4469/"},
        {name:"我师兄实在太稳健了",author:"言归正传",cover:"https://img.jueshitangmen.info/5721/849247.jpg",summary:"重生在封神大战之前的上古时代，李长寿成了一个小小的炼气士，没有什么气运加身，也不是什么注定的大劫之子，他只有一个想要长生不老的修仙梦。为了能在残酷的洪荒安身立命，他努力不沾因果，杀人必扬其灰，凡事谋而后动，从不轻易步入危险之中。藏底牌，修遁术，炼丹毒，掌神通...",detail: "https://www.jueshitangmen.info/5721/"}
      ],
    };
  },
  components: {
    BookInfo
  }
}
</script>
