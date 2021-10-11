<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      filled
      v-model="registerInput.name"
      label="Seu nome"
      hint="Seu nome"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Digite algo']"
    />
    <q-input
      filled
      v-model="registerInput.email"
      label="Seu email"
      hint="Seu email"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Digite algo']"
    />

    <q-input
      filled
      type="password"
      v-model="registerInput.password"
      label="Sua senha"
      lazy-rules
      :rules="[(val) => (val && val.length >= 8) || 'Minimo 8 algoritmos']"
    />

    <div>
      <q-btn
        :loading="registerLoading"
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
import { MUTATION_REGISTER } from 'src/graphql/auth';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import { useStore } from 'src/stores/main';
import { User } from 'src/entities';
import { GraphQLError } from 'graphql';

type RegisterResponse = {
  register: { access_token: string; user: User };
};

export default {
  setup() {
    const registerInput = reactive({
      name: '',
      email: '',
      password: '',
    });
    const router = useRouter();
    const store = useStore();

    const { mutate: register, loading: registerLoading } =
      useMutation<RegisterResponse>(MUTATION_REGISTER);

    return {
      registerInput,
      registerLoading,

      onSubmit() {
        register({
          registerInput: {
            ...registerInput,
          },
        })
          .then((result) => {
            if (!result?.data) return;
            const { access_token, user } = result.data.register;
            store.access_token = access_token;
            store.loggedUser = user;
            Notify.create({
              message: 'Logado com sucesso!',
              type: 'positive',
            });
            void router.push('/');
          })
          .catch((err: GraphQLError) => {
            Notify.create({
              message: `Falha ao registrar ${err.message}`,
              type: 'negative',
            });
          });
      },
    };
  },
};
</script>
