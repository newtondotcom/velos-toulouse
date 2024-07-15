<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Button } from '@/components/ui/button';
  import { useVibrate } from '@vueuse/core';
  import { fetchBikeStations} from '@/lib/fetch';
  import { Star, StarOff, Bike, SquareParking, Rss,Squirrel } from 'lucide-vue-next';
  const { vibrate, stop, isSupported } = useVibrate({ pattern: [300, 100, 300] })

  const jcdc_key = import.meta.env.VITE_JC_DECAUX_API_KEY;
  let latitude: number = 43.6027039;
  let longitude: number = 1.4543495;

  const favorite = ref(true);

  let items = ref([]);

  onMounted(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      });
    }
    items.value = await fetchBikeStations(latitude, longitude);
  });

  function handleWaypoint() {
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

<template>
  <div class="px-4 py-4">
    <div class="flex flex-col items-center space-x-0">
      <div class="flex flex-col items-center">
        <div class="text-2xl font-bold">🚵 Velos Toulouse</div>
        <div class="text-sm">une app non-officielle</div>
        <div class="text-xs flex flex-row"><Squirrel class="mr-2" />Appuyez sur une des stations pour ouvrir votre application de navigation</div>
      </div>
      <div v-for="item in items" class="border rounded-xl flex flex-row w-full mt-3">
        <div class="flex flex-col w-full cursor-pointer" @click="handleWaypoint">
          <div class="flex flex-row justify-between px-1">
            <div class="flex">{{ item.label }}</div>
            <div class="flex">{{ item.distance }} m</div>
          </div>
          <div class="flex flex-row justify-between">
            <div class="flex-1 h-12 flex items-center justify-center">
              <Bike :size="18" />
              {{ item.availableBikes }}
            </div>
            <div class="flex-1 h-12 flex items-center justify-center">
              <SquareParking :size="18" />
              {{ item.availableBikeStands }}
            </div>
            <div class="flex-1 h-12 flex items-center justify-center">
              <Rss :size="18" />
              {{ item.deltaTime }} min
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-center align-middle w-16 px-2">
          <Button>
            <Star color="#ffff00" v-if="favorite" :size="22" />
            <StarOff color="#ffff00" v-else :size="22" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
