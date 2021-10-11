<template>
  <div v-if="movies?.length">
    <q-card v-for="movie in movies" :key="movie.title">
      <q-card-section class="flex">
        <div class="text-h5 ellipsis">{{ movie.title }}</div>
      </q-card-section>
      <q-card-section
        class="q-py-none rounded-borders flex justify-center items-center"
      >
        <q-img :src="movie.poster" width="50vw" />
      </q-card-section>
    </q-card>
  </div>
  <div v-else>
    <div v-if="loading">Loading...</div>
    <div v-else>Not found...</div>
  </div>
</template>

<script lang="ts">
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { computed } from 'vue';
export interface Node {
  title: string;
  poster: string;
  __typename: string;
}

export interface Edge {
  __typename: string;
  node: Node;
}

export interface Search {
  __typename: string;
  edges: Edge[];
  totalCount: number;
}

export interface SearchResult {
  search: Search;
}
export default {
  setup() {
    const { result, loading } = useQuery<SearchResult>(gql`
      query Search {
        search(term: "dragon ball") {
          totalCount
          edges {
            node {
              __typename
              ... on Movie {
                title
                poster(size: W780)
              }
            }
          }
        }
      }
    `);
    const movies = computed(() =>
      result.value?.search.edges
        .filter((item) => item.node.__typename == 'Movie')
        .map((item) => item.node)
    );

    return {
      movies,
      loading,
    };
  },
};
</script>

<style></style>
