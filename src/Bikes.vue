<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { fetchBikeStations } from '@/lib/fetch';
  import Station from '@/components/vt/Station.vue';
  import { Squirrel } from 'lucide-vue-next';

  const jcdc_key = import.meta.env.VITE_JC_DECAUX_API_KEY;
  let latitude: number = 43.6027039;
  let longitude: number = 1.4543495;

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

</script>

<template>
  <div class="px-4 py-4">
    <div class="flex flex-col items-center space-x-0">
      <div class="flex flex-col items-center">
        <div class="text-2xl font-bold">🚵 Velos Toulouse</div>
        <div class="text-sm">une app non-officielle</div>
        <div class="text-xs flex flex-row mt-2">
          <Squirrel class="mr-2" />
          Appuyez sur une des stations pour ouvrir votre application de navigation
        </div>
      </div>
      <div class="pt-2">VOS FAVORIS</div>
      <div v-for="item in items" class="border rounded-xl flex flex-row w-full mt-3">
        <Station :station="item" />
      </div>
      <div class="pt-2">STATIONS A PROXIMITES</div>
      <div v-for="item in items" class="border rounded-xl flex flex-row w-full mt-3">
        <Station :station="item" />
      </div>
    </div>
  </div>
</template>
