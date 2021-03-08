<template>
  <form class="form-signin">
    <b-alert variant="danger" :show="showDeployAlert" class="mt-3">你的部署缺少数据库配置，请先按 <b-link href="https://uhziel.github.io/yireader/user/deploy.html" target="_blank">部署</b-link> 进行操作。</b-alert>
    <h1 class="text-center">登录</h1>
    <label for="inputUsername" class="sr-only">用户名</label>
    <input id="inputUsername" type="text" class="form-control" v-model="username" placeholder="用户名" required>
    <label for="inputPassword" class="sr-only">密码</label>
    <input type="password" id="inputPassword" class="form-control" v-model="password" placeholder="密码" required>
    <b-button variant="primary" type="submit" @click.prevent="handleSubmit" block>提交</b-button>
    <b-button variant="outline-success" type="submit" to="/register" block>注册</b-button>
    <b-alert variant="danger" class="mt-3" :show="showAlert">{{error}}</b-alert>
  </form>
</template>

<script>
  import {apiStatus} from '../api';
  export default {
    data() {
      return {
        username: "",
        password: "",
        error: "",
        showDeployAlert: false,
      }
    },
    computed: {
      showAlert() {
        return this.error.length > 0;
      },
    },
    created() {
      apiStatus().then(res => {
        this.showDeployAlert = !res.data.configMongodbUri;
      }).catch(e => console.error(e));
    },
    methods: {
      handleSubmit() {
        if (this.password.length > 0) {
          this.$store.dispatch('login', {
              username: this.username,
              password: this.password
          })
          .then((result) => {
            if (result.ret == 0) {
              if (this.$route.query.nextUrl != null){
                this.$router.push(this.$route.query.nextUrl);
              } else {
                this.$router.push({name: 'Home'});
              }
            } else {
              this.error = result.error;
            }
          })
          .catch(function (error) {
            console.error(error);
          });
        }
      }
    }
  }
</script>

<style>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
