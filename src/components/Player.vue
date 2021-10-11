<template>
  <video
    v-intersection="options"
    :style="{ width: `${lt.sm ? '100%' : '50vw'}` }"
    controls
    loop
    playsinline
    ref="player"
    :onplaying="setPlayer"
    :oncanplay="onCanPlay"
  >
    <source :src="src" type="video/mp4" />
  </video>
</template>

<script lang="ts">
import { reactive, ref } from 'vue';
import { Screen } from 'quasar';
declare const window: { player: HTMLVideoElement };
export default {
  props: { src: String },
  setup() {
    const percent = ref(0);
    const player = ref<HTMLVideoElement>();
    const canplay = ref(false);
    player.value?.onplay;
    return {
      lt: reactive(Screen.lt),
      player,
      percent,
      setPlayer() {
        if (window.player) {
          window.player.pause();
        }
        window.player = player.value as HTMLVideoElement;
      },
      onCanPlay() {
        canplay.value = true;
      },
      options: {
        handler(entry: { intersectionRatio: number }) {
          const val = parseInt((entry.intersectionRatio * 100).toFixed(0));
          if (canplay.value)
            if (val != 0) {
              player.value?.play();
            } else {
              player.value?.pause();
            }
        },
      },
    };
  },
};
</script>

<style></style>
