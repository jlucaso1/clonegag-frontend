<template>
  <q-page class="flex full-height items-center justify-center" padding>
    <q-form
      class="q-gutter-xs column container main"
      @submit="onSubmit"
    >
      <h3 class="q-my-sm text-center">Adicionar novo MEME</h3>
      <q-input
        class="full-width"
        v-model="post.title"
        label="Título"
        :rules="[(val) => (val && val.length >= 5) || 'Mínimo 5 caracteres']"
      />
      <q-select
        class="full-width"
        label="Tipo de post"
        v-model="post.type"
        :options="options"
        :rules="[
          (val) => ['IMAGE', 'VIDEO'].includes(val) || 'Escolha uma opção!',
        ]"
        emit-value
        map-options
      />
      <q-input
        class="full-width"
        v-model="post.src"
        label="Link da Imagem/Video"
        :rules="[(val) => (val && val.length > 0) || 'Digite a url da media!']"
      />

      <q-btn
        color="positive"
        class="full-width"
        type="submit"
        label="Postar meme"
        :loading="addPostLoading"
      />
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { useMutation } from '@urql/vue';
import { Notify } from 'quasar';
import { Post } from 'src/entities';
import { MUTATION_CREATE_POST } from 'src/graphql/post';
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';

const options = [
  {
    label: 'Imagem',
    value: 'IMAGE',
  },
  {
    label: 'Video',
    value: 'VIDEO',
  },
];

export default defineComponent({
  name: 'AddPost',
  setup() {
    const { executeMutation: addPost, fetching: addPostLoading } =
      useMutation(MUTATION_CREATE_POST);
    const router = useRouter();

    const post = reactive<Post>({ type: 'IMAGE' } as Post);

    return {
      post,
      addPostLoading,
      options,
      async onSubmit() {
        const { error } = await addPost({
          createPostInput: post,
        });
        if (error) {
          return Notify.create({
            message: error.message,
            color: 'negative',
          });
        }
        Notify.create({
          message: 'Postagem feita com sucesso!',
          color: 'success',
        });
        void router.push('/');
      },
    };
  },
});
</script>

<style scoped>
.main {
  max-width: 768px;
}
</style>
