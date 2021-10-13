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
      <q-item>Nenhuma curtida</q-item>
    </q-list>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from 'vue';
import { Post } from 'src/entities';
import { useMutation } from '@vue/apollo-composable';
import { lt } from 'src/utils';
import Player from './Player.vue';
import { MUTATION_DELETE_POST, MUTATION_LIKE_POST } from 'src/graphql/post';
import { useStore } from 'src/stores/main';
import { Notify } from 'quasar';

type LikeResponse = {
  likePost: Post;
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
    const { mutate: deletePost } = useMutation(MUTATION_DELETE_POST);

    const { mutate: likePost, loading: loadingLikePost } =
      useMutation<LikeResponse>(MUTATION_LIKE_POST, {
        fetchPolicy: 'no-cache',
      });

    const store = useStore();

    const isLoggedIn = computed(() => store.isLoggedIn);

    const view_likes = ref(false);

    return {
      lt,
      view_likes,
      loadingLikePost,
      onLikePost(postId: number) {
        if (!isLoggedIn.value) {
          return Notify.create({
            message: 'Você precisa estar logado para votar',
            color: 'negative',
          });
        }
        void likePost({ postId }).then((result) => {
          if (!result?.data) return;
          const post = result.data.likePost;
          store.updatePostLikes(postId, post);
        });
      },
      OnDeleteClick(id: number) {
        deletePost({ postId: id })
          .then(() => {
            store.deletePost(id);
            Notify.create({
              message: 'Post deletado com sucesso',
              color: 'positive',
            });
          })
          .catch(() => {
            Notify.create({
              message: 'Não foi possível deletar o post',
              color: 'negative',
            });
          });
      },
      isLoggedIn: store.isLoggedIn,
      isOwner: computed(() => props.post.user.id === store.loggedUser?.id),
    };
  },
});
</script>
