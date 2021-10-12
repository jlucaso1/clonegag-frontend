<template>
  <q-page class="container flex justify-center items-center">
    <div class="flex justify-center q-ma-sm items-center bg-dark q-pa-md">
      <q-avatar size="256px">
        <q-img :src="picture" />
        <q-btn color="secondary" size="md" round class="absolute-top-right" icon="edit"/>
      </q-avatar>

      <div class="q-gutter-y-sm full-width">
        <div>Nome: {{ user.name }}</div>
        <div>Email: {{ user.email }}</div>
        <div>Biografia: {{ user.profile.bio }}</div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { User } from 'src/entities';
import { useStore } from 'src/stores/main';
import { computed } from 'vue';

export default {
  name: 'MyProfile',
  setup() {
    const store = useStore();
    const user = computed(() => store.loggedUser as User);
    return {
      user,
      picture: store.picture,
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
</style>
