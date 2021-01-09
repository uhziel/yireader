<template>
  <form class="form-signin">
    <h1 class="text-center">注册</h1>
    <label for="inputUsername" class="sr-only">用户名</label>
    <input id="inputUsername" type="text" class="form-control" v-model="username" placeholder="用户名" required>
    <label for="inputPassword" class="sr-only">密码</label>
    <input type="password" id="inputPassword" class="form-control" v-model="password" placeholder="密码" required>
    <label for="inputPasswordConfirmation" class="sr-only">密码</label>
    <input type="password" id="inputPasswordConfirmation" class="form-control" v-model="password_confirmation" placeholder="请再次确认密码" required>
    <b-button variant="primary" type="submit" @click.prevent="handleSubmit" block>提交</b-button>
  </form>
</template>

<script>
  export default {
    props: ["nextUrl"],
    data() {
      return {
        username: "",
        password: "",
        password_confirmation: "",
      }
    },
    computed: {
      isLoggedIn() {
        return this.$store.getters.isLoggedIn;
      }
    },
    methods : {
      handleSubmit() {
        if (this.password === this.password_confirmation && this.password.length > 0) {
          this.$store.dispatch('register', {
            username: this.username,
            password: this.password,
            password_confirmation: this.password_confirmation,
          })
          .then(() => {
            if (this.isLoggedIn) {
              if(this.$route.query.nextUrl != null){
                  this.$router.push(this.$route.query.nextUrl);
              }
              else{
                  this.$router.push('/');
              }
            }
          })
          .catch(error => {
              console.error(error);
          });
        } else {
          this.password = ""
          this.passwordConfirm = ""

          return alert("Passwords do not match");
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
#inputPasswordConfirmation {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>