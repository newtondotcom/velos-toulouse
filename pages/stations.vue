<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
const config = useRuntimeConfig();
const jcdc_key = config.public.JC_DECAUX_API_KEY;

let BikeStations = ref([]);
let items = ref([]);

/*
const items = [{
  label: 'Getting Started',
  icon: 'i-heroicons-information-circle',
  defaultOpen: true,
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Installation',
  icon: 'i-heroicons-arrow-down-tray',
  disabled: true,
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Theming',
  icon: 'i-heroicons-eye-dropper',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Layouts',
  icon: 'i-heroicons-rectangle-group',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Components',
  icon: 'i-heroicons-square-3-stack-3d',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Utilities',
  icon: 'i-heroicons-wrench-screwdriver',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}]
*/

onMounted(async () => {
const { data } = await useFetch('https://api.jcdecaux.com/vls/v1/stations', {
    query: {
            apiKey: jcdc_key,
            contract: 'Toulouse'
        }
    })
for (let i = 0; i < data.value.length; i++) {
    BikeStations.value.push(data.value[i]);
}
for (let i = 0; i < BikeStations.value.length; i++) {
  const bikeStation = BikeStations.value[i];
  const address = bikeStation.address;
  const availableBikes = bikeStation.available_bikes;
  const availableBikeStands = bikeStation.available_bike_stands;
  const banking = bikeStation.banking;
  const bonus = bikeStation.bonus;
  const bikeStands = bikeStation.bike_stands;
  const last_update = bikeStation.last_update;
  const name = bikeStation.name.split('- ')[1];
  const position = bikeStation.position;
  const deltaTime = Math.floor((Date.now() - last_update) / 1000 / 60);
    items.value.push({
        label: name,
        icon: 'i-heroicons-information-circle',
        content: bikeStation,
        availableBikeStands: availableBikeStands,
        availableBikes: availableBikes,
        deltaTime: deltaTime,
    })
}})

</script>

<template>
  <UAccordion :items="items">
  <template #item="{ item }">
    {{ item.content }}
      <p class="italic text-gray-900 dark:text-white text-center">
        {{ item.availableBikeStands }}
        {{item.availableBikes}}
        {{item.deltaTime}}
      </p>
    </template>
  </UAccordion>
</template>

