<template>
  <div class="about">
    <p>易读是一款简单易用的个人小说阅读器。</p>
    <p>yireader 版本: v{{version}}</p>
    <p>项目地址：<a href="https://github.com/uhziel/yireader" target="_blank">https://github.com/uhziel/yireader</a></p>
  </div>
</template>

<script>
import {version} from '../version';

export default {
  name: 'About',
  data() {
    return {
      version,
    };
  },
}
</script>
