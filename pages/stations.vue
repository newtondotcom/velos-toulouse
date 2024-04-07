<script setup lang="ts">
import { getDistance } from 'geolib';
const config = useRuntimeConfig();
const jcdc_key = config.public.JC_DECAUX_API_KEY;
  let latitude = 43.6027039;
  let longitude = 1.4543495;

let items = ref([]);

onMounted(async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      fetchBikeStations(latitude, longitude);
    });
  } else {
    fetchBikeStations(latitude, longitude);
  }
});

async function fetchBikeStations(latitude, longitude) {
  const { data } = await useFetch('https://api.jcdecaux.com/vls/v1/stations', {
    query: {
      apiKey: jcdc_key,
      contract: 'Toulouse'
    }
  });

  items.value = data.value.map((bikeStation) => {
    const position = bikeStation.position;
    const distance = getDistance(
      { latitude, longitude },
      { latitude: position.lat, longitude: position.lng }
    );

    return {
      label: bikeStation.name.split('- ')[1],
      icon: 'i-heroicons-information-circle',
      content: bikeStation,
      availableBikeStands: bikeStation.available_bike_stands,
      availableBikes: bikeStation.available_bikes,
      deltaTime: Math.floor((Date.now() - bikeStation.last_update) / 1000 / 60),
      defaultOpen: false, 
      distance: distance
    };
  });

  items.value.sort((a, b) => a.distance - b.distance);
  if (items.value.length > 0) {
    items.value[0].defaultOpen = true;
  }
}

function handleWaypoint() {
  const isMobile = /Android|iOS|iPhone|iPad|iPod|Windows Phone/i.test(
    navigator.userAgent
  );

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
  <UAccordion :items="items">
    <template #item="{ item }">
      {{ item.content }}
      <p class="italic text-gray-900 dark:text-white text-center">
        {{ item.availableBikeStands }} velos disponibles <br>
        {{ item.availableBikes }} places disponibles <br>
        {{ item.deltaTime }} minutes depuis la dernière mise à jour <br>
        {{ item.distance.toFixed(2) }} mètres de votre position
      </p>
    </template>
  </UAccordion>
</template>
