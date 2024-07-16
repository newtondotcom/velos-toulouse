<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import Station from '@/components/vt/Station.vue';

  import type { IStation } from '@/components/lib/types';

  import { fetchBikeStations } from '@/lib/fetch';
  import { Squirrel } from 'lucide-vue-next';

  let latitude: number = 43.6027039;
  let longitude: number = 1.4543495;

  let stations = ref<IStation[]>([]);

  const favoriteStations = computed(() => {
    return stations.value.filter((station) => station.favorite);
  });

  const nonFavoriteStations = computed(() => {
    return stations.value.filter((station) => !station.favorite);
  });

  function favoriteButtonPressed(number: number) {
    // Toggle the favorite property of the specific station
    stations.value.forEach((station) => {
      if (station.number === number) {
        station.favorite = !station.favorite;
      }
    });

    // Map the items to get an array of favorite station numbers
    const favorites : IFavorites[] = stations.value
      .filter((station) => station.favorite)
      .map((station) => station.number);

    // Save the favorites array to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  onMounted(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      });
    }
    stations.value = await fetchBikeStations(latitude, longitude);
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
      <div class="pt-2 font-semibold text-primary">VOS FAVORIS</div>
      <div v-for="station in favoriteStations" class="border rounded-xl flex flex-row w-full mt-3">
        <Station :station="station" :favoriteButtonPressed />
      </div>
      <div class="pt-2 font-semibold text-primary">STATIONS A PROXIMITES</div>
      <div
        v-for="station in nonFavoriteStations"
        class="border rounded-xl flex flex-row w-full mt-3"
      >
        <Station :station="station" :favoriteButtonPressed />
      </div>
    </div>
  </div>
</template>
