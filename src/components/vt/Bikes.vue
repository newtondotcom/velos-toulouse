<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { Button } from '@/components/ui/button';
  import Station from '@/components/vt/Station.vue';
  import SkeletonStation from '@/components/vt/SkeletonStation.vue';

  import type { IStation } from '@/components/lib/types';

  import { fetchBikeStations } from '@/lib/fetch';
  import { Squirrel, BadgeInfo, RefreshCcw } from 'lucide-vue-next';

  let latitude: number = 43.6027039;
  let longitude: number = 1.4543495;

  const stations = ref<IStation[]>([]);
  const loading = ref(true);

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
    const favorites: IFavorites[] = stations.value
      .filter((station) => station.favorite)
      .map((station) => station.number);

    // Save the favorites array to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  async function refresh() {
    loading.value = true;
    stations.value = await fetchBikeStations(latitude, longitude);
    loading.value = false;
  }

  onMounted(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      });
    }
    stations.value = await fetchBikeStations(latitude, longitude);
    loading.value = false;
  });
</script>

<template>
  <div class="px-4 py-4 md:px-[30vw]">
    <div class="flex flex-col items-center space-x-0">
      <div class="flex flex-col items-center">
        <div class="text-2xl font-bold">🚵 Velos Toulouse</div>
        <div class="text-sm">une app non-officielle</div>
        <div class="text-xs flex flex-row mt-2">
          <Squirrel class="mr-2" />
          Appuyez sur une des stations pour ouvrir votre application de navigation
        </div>
      </div>
      <div class="absolute top-2 right-2">
        <Button @click="refresh">
          <RefreshCcw />
        </Button>
      </div>
      <div class="pt-2 font-bold text-primary" v-if="favoriteStations.length > 0">VOS FAVORIS</div>
      <div v-for="station in favoriteStations" class="border rounded-xl flex flex-row w-full mt-3">
        <Station :station="station" :favoriteButtonPressed />
      </div>
      <div class="pt-2 font-bold text-primary">STATIONS A PROXIMITÉ</div>
      <div v-if="loading" class="flex flex-col">
        <SkeletonStation v-for="i in 10" />
      </div>
      <div
        v-else
        v-for="station in nonFavoriteStations"
        class="border rounded-xl flex flex-row w-full mt-3"
      >
        <Station :station="station" :favoriteButtonPressed />
      </div>
    </div>
  </div>
  <footer class="flex flex-col items-center">
    <div class="h-[20vh] md:g-[30vh] md:mt-10 px-4 md:w-[30vw]">
      <div class="text-xs flex flex-row mt-2 mb-6 md:hidden">
        <BadgeInfo class="mr-2" />
        Cette application peut être ajoutée à votre écran d'acceuil pour une meilleure expérience.
      </div>
      <div class="flex flex-row justify-around">
        <a href="https://github.com/newtondotcom/velos-toulouse">
          <svg
            class="w-6 h-6 text-primary"
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>GitHub</title>
            <path
              fill="currentColor"
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            />
          </svg>
        </a>
        <a href="https://www.linkedin.com/in/robin-augereau">
          <svg
            class="w-6 h-6 text-primary"
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>LinkedIn</title>
            <path
              fill="currentColor"
              d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
            />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>
