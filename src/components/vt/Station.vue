<template>
  <div class="flex flex-col w-full cursor-pointer" @click="handleWaypoint">
    <div class="flex flex-row justify-between px-1 pl-2 pt-1">
      <div class="flex font-bold">{{ station.label }}</div>
      <div class="flex font-light">{{ station.distance }} m</div>
    </div>
    <div class="flex flex-row justify-between">
      <div
        class="flex-1 h-12 flex items-center justify-center font-semibold"
        :style="{ color: station.colorBikes }"
      >
        <Bike :size="18" />
        {{ station.availableBikes }}
      </div>
      <div
        class="flex-1 h-12 flex items-center justify-center font-semibold"
        :style="{ color: station.colorStands }"
      >
        <SquareParking :size="18" />
        {{ station.availableBikeStands }}
      </div>
      <div class="flex-1 h-12 flex items-center justify-center text-orange-500/90">
        <Rss :size="18" />
        {{ station.deltaTime }} min
      </div>
    </div>
  </div>
  <div class="flex flex-col justify-center align-middle w-16 px-2">
    <Button>
      <Star color="#ffff00" v-if="station.favorite" :size="22" />
      <StarOff color="#ffff00" v-else :size="22" />
    </Button>
  </div>
</template>

<script setup lang="ts">
  import type { IStation } from '@/component/lib/types';
  import { PropType } from 'vue';
  defineProps({
    station: Object as PropType<IStation>,
  });
  import { Button } from '@/components/ui/button';
  import { Star, StarOff, Bike, SquareParking, Rss } from 'lucide-vue-next';

  import { useVibrate } from '@vueuse/core';
  const { vibrate, stop, isSupported } = useVibrate({ pattern: [300, 100, 300] });

  function handleWaypoint() {
    if (isSupported) {
      vibrate();
    }
    const isMobile = /Android|iOS|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);

    if (isMobile) {
      const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isiOS) {
        const appleMapsURL = `https://maps.apple.com/?q=${latitude},${longitude}`;
        window.location.href = appleMapsURL;
      } else {
        const googleMapsURL = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.location.href = googleMapsURL;
      }
    } else {
      alert('Navigation is only supported on mobile devices.');
    }
  }
</script>
