<template>
  <q-page class="flex justify-center">
    <div
      v-if="posts.length"
      class="main"
      :class="`${lt.md ? 'q-py-md q-gutter-y-md' : 'q-py-lg q-gutter-y-lg'}`"
    >
      <card v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import Card from 'src/components/Card.vue';
import { lt } from 'src/utils';
import { useStore } from 'src/stores/main';

export default defineComponent({
  name: 'PageIndex',
  components: { Card },

  setup() {
    const store = useStore();

    onMounted(() => {
      store.fetchPosts();
    });

    return {
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
