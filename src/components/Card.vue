<template>
  <div>
    <transition
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
    >
      <q-card>
        <q-card-section class="flex q-gutter-x-sm">
          <div class="text-h5 ellipsis">{{ post.title }}</div>
          <q-space />
          <q-btn
            icon="delete"
            dense
            color="negative"
            @click="OnDeleteClick(post.id)"
            v-if="isOwner"
          />
        </q-card-section>
        <q-card-section
          class="q-py-none rounded-borders flex justify-center items-center"
        >
          <q-img
            v-if="post.type === 'IMAGE'"
            :src="post.src"
            :width="`${lt.sm ? '100%' : '50vw'}`"
          />
          <player v-else :src="post.src" class="full-width" />
        </q-card-section>
        <q-card-section class="flex items-center">
          <div class="flex column items-center">
            <q-btn
              flat
              icon="favorite_border"
              :label="post.likes.length"
              @click="onLikePost(post.id)"
              dense
              size="lg"
              :disable="!isLoggedIn"
              :loading="loadingLikePost"
            />
            <div class="cursor-pointer" @click="view_likes = true">
              Ver curtidas
            </div>
          </div>
          <q-space />
          <div class="text-no-wrap">
            <div class="inline ellipsis text-subtitle2">
              por {{ post.user.name }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </transition>
  </div>
  <q-dialog v-model="view_likes">
    <q-list bordered separator v-if="post.likes.length" class="bg-dark">
      <q-item clickable v-ripple v-for="like in post.likes" :key="like.id">
        <q-item-section>{{ like.name }}</q-item-section>
      </q-item>
    </q-list>
    <q-list bordered separator v-else class="bg-dark">
      <q-item>
        <q-item-section>Nenhuma curtida :(</q-item-section>
      </q-item>
    </q-list>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue';
import { Post } from 'src/entities';
import { lt } from 'src/utils';
import Player from './Player.vue';
import { MUTATION_DELETE_POST, MUTATION_LIKE_POST } from 'src/graphql/post';
import { useStore } from 'src/stores/main';
import { Notify } from 'quasar';
import { useMutation } from '@urql/vue';

type LikeResponse = {
  likePost: Post;
};
type DeleteResponse = {
  deletePost: Post;
};

export default defineComponent({
  components: { Player },
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true,
    },
  },
  setup(props) {
    const post = ref(props.post);
    const { executeMutation: deletePost } =
      useMutation<DeleteResponse>(MUTATION_DELETE_POST);

    const { executeMutation: likePost, fetching: loadingLikePost } =
      useMutation<LikeResponse>(MUTATION_LIKE_POST);

    const store = useStore();

    const view_likes = ref(false);

    return {
      lt,
      view_likes,
      loadingLikePost,
      async onLikePost(postId: number) {
        const { error } = await likePost({ postId });
        if (error) {
          return Notify.create({
            message: error.message,
            color: 'negative',
          });
        }
      },
      async OnDeleteClick(id: number) {
        const { error } = await deletePost(
          { postId: id },
          { requestPolicy: 'network-only' }
        );
        if (error) {
          return Notify.create({
            message: `Erro ao deletar o post: ${error.message}`,
            color: 'negative',
          });
        }
        Notify.create({
          message: 'Post deletado com sucesso',
          color: 'positive',
        });
      },
      isLoggedIn: store.isLoggedIn,
      isOwner: computed(() => post.value?.user.id === store.loggedUser?.id),
    };
  },
});
</script>
