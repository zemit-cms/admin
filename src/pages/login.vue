<script lang="ts">
import {Vue, Component, toNative} from 'vue-facing-decorator'
import {useDisplay} from "vuetify";
import {toast} from "vuetify-sonner";
import {Identity, AuthService, fieldsMessages, MessageInterface} from 'zemit-sdk'
import {useRules} from "@/composables/rules";
import {handleCatch, handleSubmit} from "@/composables/forms";
import {useRouter} from "vue-router";

@Component
class Login extends Vue {
  display = useDisplay()
  rules = useRules()
  router = useRouter()
  service = new AuthService();

  showPassword = false;
  loading = false;
  valid = true;
  errors: fieldsMessages<any> = {}

  data = {
    email: '',
    password: '',
  }

  onSubmit = handleSubmit(this.login);
  login() {
    this.loading = true
    return this.service.login(this.data)
      .then((response: any) => {
        if (response.data.view.loggedIn) {
          Identity.setIdentity(response.data.view);
          this.router.push({name: 'Home'});
        }
        else {
          toast.error(this.$t('error.login.title'), {
            description: this.$t('error.login.description'),
            prependIcon: 'mdi-emoticon-dead-outline',
          })
        }
      })
      .catch(handleCatch(this.errors, this.$t('error.login.title')))
      .finally(() => this.loading = false);
  }
}

export default toNative(Login)
</script>

<template>
  <v-form
    name="login"
    ref="form"
    v-test-id="'login'"
    v-model="valid"
    :disabled="loading"
    :validate-on="valid === false? 'lazy' : 'submit'"
    @submit.prevent="onSubmit"
  >
    <v-text-field
      v-model="data.email"
      name="email"
      v-test-id="'email'"
      :error-messages="errors.email?.map(e => e.message)"
      :label="$t('label.email')"
      :rules="[rules.required, rules.email]"
      :autofocus="!!display.mdAndUp"
      prepend-inner-icon="mdi-account"
      autocomplete="email"
      tabindex="1"
      variant="outlined"
      required
      @input="errors = {}"
    />
    <v-text-field
      class="mt-4"
      name="password"
      v-test-id="'password'"
      v-model="data.password"
      :error-messages="errors.email?.map(e => e.message)"
      :label="$t('label.password')"
      :rules="[rules.required]"
      :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="!showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      prepend-inner-icon="mdi-lock"
      autocomplete="password"
      tabindex="2"
      variant="outlined"
      required
      @click:append-inner="showPassword = !showPassword"
      @input="errors = {}"
    />

    <v-btn
      type="submit"
      :disabled="valid === false"
      :loading="loading"
      append-icon="mdi-login"
      class="mt-4"
      variant="tonal"
      color="primary"
      block
    >
      {{ $t('btn.login') }}
    </v-btn>
  </v-form>

  <v-btn
    :disabled="loading"
    class="mt-4"
    variant="plain"
    block
  >
    {{ $t('btn.forgotPassword') }}
  </v-btn>
</template>
