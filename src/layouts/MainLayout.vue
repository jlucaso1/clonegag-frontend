<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-black flex justify-center">
      <q-toolbar class="flex items-center">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="mobile-only"
        />

        <q-toolbar-title shrink>
          <q-btn stretch flat dense size="lg" to="/">
            <div class="flex items-center q-gutter-x-sm">
              <q-icon name="img:/icons/favicon-128x128.png" />
              <div>CloneGAG</div>
            </div>
          </q-btn>
        </q-toolbar-title>
        <q-space />
        <div class="flex items-center q-gutter-x-md" v-if="isLoggedIn">
          <q-btn
            color="white"
            text-color="black"
            dense
            class="q-pa-sm gt-xs"
            to="/addpost"
          >
            <div>Adicionar meme</div>
          </q-btn>
          <q-btn color="red" dense class="q-pa-sm gt-xs" @click="reset">
            <div>Logout</div>
          </q-btn>
          <q-btn dense round to="/me">
            <q-avatar>
              <img :src="picture" />
            </q-avatar>
          </q-btn>
        </div>
        <div class="flex items-center q-gutter-x-md" v-else>
          <q-btn color="primary" dense class="q-pa-sm" to="/auth/login">
            <div>Entrar</div>
          </q-btn>
          <q-btn color="secondary" dense class="q-pa-sm" to="/auth/register">
            <div>Registrar</div>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list> </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useStore } from 'src/stores/main';
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const leftDrawerOpen = ref(false);

    const store = useStore();

    const router = useRouter();
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      isLoggedIn: computed(() => store.isLoggedIn),
      picture: computed(() => store.picture),
      async reset() {
        store.logout();
        await router.push('/');
      },
    };
  },
});
</script>

<style scoped>
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: yellow;
}
.q-toolbar {
  max-width: 860px;
}
</style>
