<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12 pb-2 relative">
              <transition name="slide-y-reverse-transition">
                <v-alert
                  v-show="isError"
                  icon="error"
                  type="error"
                  class="text-center login-alert-error"
                  dismissible
                  >Invalid password or email</v-alert
                >
              </transition>
              <v-toolbar dark class="d-flex justify-center">
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form
                  v-model="valid"
                  @submit.prevent="checkData"
                  id="check-form"
                >
                  <v-text-field
                    color="black"
                    prepend-icon="email"
                    label="Email"
                    type="email"
                    autocomplete="username"
                    v-model="email"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    color="black"
                    prepend-icon="lock"
                    label="Password"
                    type="password"
                    autocomplete="new-password"
                    v-model="password"
                    :rules="passwordRules"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :disabled="isError || !valid"
                  type="submit"
                  width="100%"
                  form="check-form"
                  >Login</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "Auth",
  data: () => ({
    valid: true,
    email: "",
    emailRules: [
      (v) => !!v || "Email is required!",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    password: "",
    passwordRules: [(v) => !!v || "Password is required!"],
    isError: false,
  }),
  methods: {
    checkData() {
      if (!this.valid) return;
      this.$store
        .dispatch("user/login", {
          username: this.email,
          password: this.password,
        })
        .then(() => {
          this.$router.push({ name: "Dashboard" });
        })
        .catch((err) => {
          console.error(err);
          this.isError = true;
          this.password = "";
          setTimeout(() => {
            this.isError = false;
          }, 2000);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-alert-error {
  position: absolute;
  top: -70px;
  left: 50%;
  width: 100%;
  transform: translateX(-50%);
  margin: 0;
}
</style>
