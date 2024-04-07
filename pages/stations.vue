<script setup lang="ts">
const config = useRuntimeConfig();
const jcdc_key = config.public.JC_DECAUX_API_KEY;

let items = ref([]);

onMounted(async () => {
  let latitude = 43.6027039;
  let longitude = 1.4543495;

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
    const distance = Math.sqrt(
      Math.pow(position.lat - latitude, 2) +
      Math.pow(position.lng - longitude, 2)
    ) * 100;

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
</script>

<template>
  <UAccordion :items="items">
    <template #item="{ item }">
      {{ item.content }}
      <p class="italic text-gray-900 dark:text-white text-center">
        {{ item.availableBikeStands }}
        {{ item.availableBikes }}
        {{ item.deltaTime }}
      </p>
    </template>
  </UAccordion>
</template>
