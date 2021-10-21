<template>
  <q-page class="flex justify-center items-center" padding>
    <div
      class="flex justify-center q-ma-sm items-center bg-dark q-pa-md container"
    >
      <q-avatar class="avatar">
        <q-img :src="picture" class="avatar" />
        <q-btn
          color="secondary"
          size="md"
          round
          class="absolute-top-right"
          icon="edit"
        >
          <q-popup-edit
            v-model="user.profile.picture"
            v-slot="scope"
            buttons
            persistent
            @update:model-value="saveUser"
          >
            <q-input
              v-model="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-btn>
      </q-avatar>

      <div class="q-gutter-y-sm full-width">
        <div class="cursor-pointer" style="width: fit-content">
          Nome: {{ user.name }}
          <q-popup-edit
            v-model="user.name"
            v-slot="scope"
            buttons
            persistent
            @update:model-value="saveUser"
          >
            <q-input
              v-model="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </div>
        <div>Email: {{ user.email }}</div>
        <div class="cursor-pointer" style="width: fit-content">
          Biografia: {{ user.profile.bio }}
          <q-popup-edit
            v-model="user.profile.bio"
            v-slot="scope"
            buttons
            persistent
            @update:model-value="saveUser"
          >
            <q-input
              v-model="scope.value"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </div>
        <q-btn color="red" label="Deletar conta" @click="deleteMe" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useMutation } from '@urql/vue';
import { Notify } from 'quasar';
import { User } from 'src/entities';
import { MUTATION_DELETE_ME, MUTATION_EDIT_USER } from 'src/graphql/user';
import { useStore } from 'src/stores/main';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'MyProfile',
  setup() {
    const router = useRouter();
    const store = useStore();
    const user = computed(() => store.loggedUser as User);

    const { executeMutation: editUser } = useMutation(MUTATION_EDIT_USER);
    const { executeMutation: deleteMe } = useMutation(MUTATION_DELETE_ME);

    return {
      user,
      picture: computed(() => store.picture),

      async saveUser() {
        console.log(user.value.name);
        const { error } = await editUser(
          {
            updateUserInput: {
              name: user.value.name,
              profile: {
                bio: user.value.profile.bio,
                picture: user.value.profile.picture,
              },
            },
          },
          { requestPolicy: 'network-only' }
        );
        if (error) {
          return Notify.create({
            message: error.message,
            color: 'negative',
          });
        }
      },
      async deleteMe() {
        const { error } = await deleteMe({ requestPolicy: 'network-only' });
        if (error) {
          return Notify.create({
            message: error.message,
            color: 'negative',
          });
        }
        store.logout();
        Notify.create({
          message: 'Conta deletada com sucesso',
          color: 'positive',
        });
        await router.push('/');
      },
    };
  },
};
</script>

<style>
.picture {
  margin-top: -10%;
}
.circle {
  border-radius: 50%;
}
.avatar {
  width: 100%;
  height: 100%;
  max-width: 256px;
  max-height: 256px;
}
</style>
