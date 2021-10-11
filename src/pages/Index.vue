<template>
  <q-page class="flex justify-center">
    <div
      v-if="posts.length"
      class="main"
      :class="`${lt.md ? 'q-py-md q-gutter-y-md' : 'q-py-lg q-gutter-y-lg'}`"
    >
      <card v-for="post in posts" :key="post.id" :post="post" />
    </div>

    <div v-else-if="!loading" class="flex column items-center justify-center">
      <div class="text-h6">Nenhum meme encontrado...</div>
      <q-btn
        color="white"
        text-color="black"
        dense
        class="q-pa-sm"
        to="/addpost"
      >
        <div>Adicionar meme</div>
      </q-btn>
    </div>
    <q-spinner v-else color="white" size="lg" class="absolute-center" />
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Card from 'src/components/Card.vue';
import { lt } from 'src/utils';
import { useStore } from 'src/stores/main';
import { useQuery, useResult } from '@vue/apollo-composable';
import { QUERY_POSTS } from 'src/graphql/post';
import { Post } from 'src/entities';
import { Notify } from 'quasar';

export default defineComponent({
  name: 'PageIndex',
  components: { Card },

  setup() {
    const store = useStore();

    const {
      result: resultPosts,
      onResult,
      onError,
      loading,
    } = useQuery(QUERY_POSTS, {}, { fetchPolicy: 'no-cache' });

    onResult(() => {
      store.posts = useResult<Post[]>(resultPosts).value as Post[];
    });
    onError(() => {
      Notify.create({
        message: 'Erro ao carregar os memes',
        color: 'negative',
      });
    });

    return {
      loading,
      lt,
      posts: computed(() => store.posts),
    };
  },
});
</script>

<style scoped>
.main {
  max-width: 460px;
}
</style>
