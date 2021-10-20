<template>
  <q-page class="flex full-height items-center justify-center">
    <q-form
      @submit="onSubmit"
      class="
        q-gutter-xs
        column
        items-center
        justify-center
        max-width-599
        full-width
      "
    >
      <q-input
        class="full-width"
        filled
        v-model="email"
        label="Seu email"
        lazy-rules
        :rules="[requiredValidate || 'Digite algo']"
      />

      <q-input
        class="full-width"
        filled
        type="password"
        v-model="password"
        label="Sua senha"
        lazy-rules
        :rules="[requiredValidate || 'Minimo 8 algoritmos']"
      />

      <q-btn
        class="full-width"
        :loading="loginLoading"
        label="Entrar"
        type="submit"
        color="primary"
        size="md"
      />
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { Notify } from 'quasar';
import { MUTATION_LOGIN } from 'src/graphql/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useStore } from 'src/stores/main';
import { User } from 'src/entities';
import { useMutation } from '@urql/vue';

type LoginResponse = {
  login: { access_token: string; user: User };
};

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const store = useStore();

    const { executeMutation: login, fetching: loginLoading } =
      useMutation<LoginResponse>(MUTATION_LOGIN);

    return {
      requiredValidate(val: string) {
        return val && val.length > 0;
      },
      email,
      password,
      loginLoading,

      async onSubmit() {
        const { data, error } = await login({
          loginInput: {
            email: email.value,
            password: password.value,
          },
        });
        if (error) {
          return Notify.create({
            message: error.message,
            type: 'negative',
          });
        }
        if (!data) return;
        const { access_token, user } = data.login;
        store.access_token = access_token;
        store.loggedUser = user;
        Notify.create({
          message: 'Logado com sucesso!',
          type: 'positive',
        });
        await router.push('/');
      },
    };
  },
};
</script>
