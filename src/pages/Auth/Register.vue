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
        v-model="registerInput.name"
        label="Seu nome"
        lazy-rules
        :rules="[requiredValidate || 'Digite algo']"
      />
      <q-input
        class="full-width"
        filled
        v-model="registerInput.email"
        label="Seu email"
        lazy-rules
        :rules="[requiredValidate || 'Digite algo']"
      />

      <q-input
        class="full-width"
        filled
        type="password"
        v-model="registerInput.password"
        label="Sua senha"
        lazy-rules
        :rules="[requiredValidate || 'Minimo 8 algoritmos']"
      />

      <q-btn
        class="full-width"
        :loading="registerLoading"
        label="Registrar-se"
        type="submit"
        color="primary"
      />
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { Notify } from 'quasar';
import { MUTATION_REGISTER } from 'src/graphql/auth';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import { useStore } from 'src/stores/main';
import { User } from 'src/entities';
import { useMutation } from '@urql/vue';

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

    const { executeMutation: register, fetching: registerLoading } =
      useMutation<RegisterResponse>(MUTATION_REGISTER);

    return {
      requiredValidate(val: string) {
        return val && val.length > 0;
      },
      registerInput,
      registerLoading,

      async onSubmit() {
        const { data, error } = await register({
          registerInput: {
            ...registerInput,
          },
        });
        if (error) {
          return Notify.create({
            message: `Falha ao registrar ${error.message}`,
            type: 'negative',
          });
        }

        if (!data) return;
        const { access_token, user } = data.register;
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
