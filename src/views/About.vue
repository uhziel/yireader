<template>
  <div class="about">
    <p>yireader 版本: v{{version}}</p>
    <p v-if="apiVersion.length > 0">yireader-api 版本: v{{apiVersion}}</p>
    <p>帮助文档：<a href="https://uhziel.github.io/yireader/" target="_blank">https://uhziel.github.io/yireader/</a></p>
  </div>
</template>

<script>
import {version} from '../version';
import {apiVersion} from '../api';

export default {
  name: 'About',
  data() {
    return {
      version,
      apiVersion: '',
    };
  },
  created() {
    apiVersion().then(res => {
      this.apiVersion = res.data.version;
    }).catch(e => console.error(e));
  },
}
</script>
