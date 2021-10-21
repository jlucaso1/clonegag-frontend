<template>
  <q-page class="flex justify-center items-center" padding>
    <div
      class="flex justify-center q-ma-sm items-center bg-dark q-pa-md container"
      v-if="!loading && user"
    >
      <q-avatar class="avatar">
        <q-img
          :src="
            user.profile.picture ||
            'https://www.aaronandpartners.com/wp-content/uploads/blank-profile-picture-973460_640-1-e1599559219598-1.png'
          "
          class="avatar"
        />
      </q-avatar>

      <div class="q-gutter-y-sm full-width">
        <div style="width: fit-content">Nome: {{ user.name }}</div>
        <div>Email: {{ user.email }}</div>
        <div style="width: fit-content">Biografia: {{ user.profile.bio }}</div>
      </div>
    </div>
    <div
      v-else-if="error"
      class="flex column items-center justify-center q-gutter-lg"
    >
      <div>Usuário não existe :(</div>
      <q-btn label="Início" to="/" />
    </div>
    <div v-else>
      <q-spinner />
    </div>
  </q-page>
</template>

<script lang="ts">
import { useQuery } from '@urql/vue';
import { User } from 'src/entities';
import { QUERY_USER } from 'src/graphql/user';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

type UserResponse = {
  user: User;
};

export default {
  name: 'MyProfile',
  setup() {
    const route = useRoute();
    const userId = Number(route.params.id);
    const {
      data,
      fetching: loading,
      error,
    } = useQuery<UserResponse>({
      query: QUERY_USER,
      variables: { userId },
    });

    return {
      user: computed(() => data.value?.user),
      loading,
      error,
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
