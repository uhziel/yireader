<template>
  <div class="register">
    <h4>Register</h4>
    <form>
      <label for="username">Username</label>
      <div>
        <input id="username" type="text" v-model="username" required>
      </div>
      <label for="password">Password</label>
      <div>
        <input id="password" type="password" v-model="password" required>
      </div>
      <label for="password-confirm">Confirm Password</label>
      <div>
        <input id="password-confirm" type="password" v-model="password_confirmation" required>
      </div>
      <div>
        <button type="submit" @click.prevent="handleSubmit">
          Register
        </button>
      </div>
    </form>
  </div>
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
