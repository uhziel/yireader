<template>
  <form class="form-signin">
    <h1 class="text-center">登录</h1>
    <label for="inputUsername" class="sr-only">用户名</label>
    <input id="inputUsername" type="text" class="form-control" v-model="username" placeholder="用户名" required>
    <label for="inputPassword" class="sr-only">密码</label>
    <input type="password" id="inputPassword" class="form-control" v-model="password" placeholder="密码" required>
    <b-button variant="primary" type="submit" @click.prevent="handleSubmit" block>提交</b-button>
    <b-button variant="outline-success" type="submit" to="/register" block>注册</b-button>
  </form>
</template>

<script>
  export default {
    data() {
      return {
        username: "",
        password: ""
      }
    },
    computed: {
      isLoggedIn() {
        return this.$store.getters.isLoggedIn;
      }
    },
    methods: {
      handleSubmit() {
        if (this.password.length > 0) {
          this.$store.dispatch('login', {
              username: this.username,
              password: this.password
          })
          .then(() => {
            if (this.isLoggedIn) {
              if (this.$route.query.nextUrl != null){
                this.$router.push(this.$route.query.nextUrl);
              } else {
                this.$router.push({name: 'Home'});
              }
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
