<template>
  <div class="login">
    <h4>Login</h4>
    <form>
        <label for="username" >Username</label>
        <div>
            <input id="username" type="text" v-model="username" required>
        </div>
        <div>
            <label for="password" >Password</label>
            <div>
                <input id="password" type="password" v-model="password" required>
            </div>
        </div>
        <div>
            <button type="submit" @click.prevent="handleSubmit">
                Login
            </button>
        </div>
    </form>
  </div>
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
                this.$router.push({name: 'Dashboard'});
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
