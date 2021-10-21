<template>
  <q-page class="flex justify-center">
    <q-spinner v-if="loading" color="white" size="lg" class="absolute-center" />

    <div
      v-else-if="posts?.length"
      class="main"
      :class="`${lt.md ? 'q-py-md q-gutter-y-md' : 'q-py-lg q-gutter-y-lg'}`"
    >
      <card v-for="post in posts" :key="post.id" :post="post" />
    </div>

    <div v-else class="flex column items-center justify-center">
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

    <q-page-sticky position="bottom-right" :offset="[20, 20]" v-if="lt.sm">
      <q-btn color="white" text-color="black" fab icon="add" to="/addpost" />
    </q-page-sticky>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import Card from 'src/components/Card.vue';
import { lt } from 'src/utils';
import { QUERY_POSTS } from 'src/graphql/post';
import { Post } from 'src/entities';
import { useQuery } from '@urql/vue';

type ResponsePosts = {
  posts: Post[];
};

export default defineComponent({
  name: 'PageIndex',
  components: { Card },

  setup() {
    const { data, fetching: loading } = useQuery<ResponsePosts>({
      query: QUERY_POSTS,
      requestPolicy: 'network-only',
    });

    return {
      loading,
      lt,
      posts: computed(() => data.value?.posts),
    };
  },
});
</script>

<style scoped>
.main {
  max-width: 460px;
}
</style>
