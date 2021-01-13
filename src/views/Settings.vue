<template>
  <div class="settings">
    <h2>修改密码</h2>
    <b-form>
      <b-form-group id="input-group-1" label="密码:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.password"
          type="password"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="新密码：" label-for="input-2" description="密码必须至少6位">
        <b-form-input
          id="input-2"
          v-model="form.newPassword"
          type="password"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="确认新密码：" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.newPasswordConfirmation"
          type="password"
          required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary" @click.prevent="handleSubmit">确认</b-button>
      <b-alert variant="success" class="mt-3" :show="success.length > 0">{{success}}</b-alert>
      <b-alert variant="danger" class="mt-3" :show="error.length > 0">{{error}}</b-alert>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {
      form: {
        password: "",
        newPassword: "",
        newPasswordConfirmation: "",
      },
      success: "",
      error: "",
    }  
  },
  computed: {
    username() {
      return this.$store.getters.username;
    }
  },
  methods: {
    reset() {
      this.form = {
        password: "",
        newPassword: "",
        newPasswordConfirmation: "",
      };
      this.success = "";
      this.error = "";
    },
    handleSubmit() {
      this.$store.dispatch('changePassword', {
          username: this.username,
          password: this.form.password,
          newPassword: this.form.newPassword,
          newPasswordConfirmation: this.form.newPasswordConfirmation,
      })
      .then((result) => {
        this.reset();
        if (result.ret == 0) {
          this.success = result.success;
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
</script>

<style>
.settings {
  max-width: 20rem;
}
</style>
