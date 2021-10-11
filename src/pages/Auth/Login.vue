<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      filled
      v-model="email"
      label="Seu email"
      hint="Seu email"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Digite algo']"
    />

    <q-input
      filled
      type="password"
      v-model="password"
      label="Sua senha"
      lazy-rules
      :rules="[(val) => (val && val.length >= 8) || 'Minimo 8 algoritmos']"
    />

    <div>
      <q-btn
        :loading="loginLoading"
        label="Submit"
        type="submit"
        color="primary"
      />
    </div>
  </q-form>
</template>

<script lang="ts">
import { useMutation } from '@vue/apollo-composable';
import { Notify } from 'quasar';
import { MUTATION_LOGIN } from 'src/graphql/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useStore } from 'src/stores/main';
import { User } from 'src/entities';

type LoginResponse = {
  login: { access_token: string; user: User };
};

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const store = useStore();

    const { mutate: login, loading: loginLoading } =
      useMutation<LoginResponse>(MUTATION_LOGIN);

    return {
      email,
      password,
      loginLoading,

      onSubmit() {
        login({
          loginInput: {
            email: email.value,
            password: password.value,
          },
        })
          .then(async (result) => {
            if (!result?.data) return;
            const { access_token, user } = result.data.login;
            store.access_token = access_token;
            store.loggedUser = user;
            Notify.create({
              message: 'Logado com sucesso!',
              type: 'positive',
            });
            await router.push('/');
          })
          .catch(() => {
            Notify.create({
              message: 'Dados inválidos',
              type: 'negative',
            });
          });
      },
    };
  },
};
</script>
