<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-black flex justify-center">
      <q-toolbar class="flex justify-center">
        <q-btn stretch flat dense size="lg" to="/">
          <div class="flex items-center q-gutter-x-sm">
            <q-icon name="img:/icons/favicon-128x128.png" />
            <div>CloneGAG</div>
          </div>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({});
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
