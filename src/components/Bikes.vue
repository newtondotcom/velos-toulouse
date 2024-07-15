<script setup lang="ts">
import { getDistance } from 'geolib';
import {ref, onMounted} from 'vue';
import { ofetch } from "ofetch";

const jcdc_key = import.meta.env.VITE_JC_DECAUX_API_KEY;
let latitude : number = 43.6027039;
let longitude : number = 1.4543495;

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

async function fetchBikeStations(latitude : number, longitude: number) {
  const data = await ofetch('https://api.jcdecaux.com/vls/v3/stations', {
    query : {
      apiKey: jcdc_key,
      contract: 'Toulouse'
    },
    credentials : 'include'
  });
  console.log(data[0]);

  items.value = data.map((bikeStation) => {
    const position = bikeStation.position;
    const distance = getDistance(
      { latitude, longitude },
      { latitude: position.latitude, longitude: position.longitude }
    );

    return {
      label: bikeStation.name.split('- ')[1],
      icon: 'i-heroicons-information-circle',
      availableBikeStands: bikeStation.mainStands.availabilities.stands,
      availableBikes: bikeStation.mainStands.availabilities.bikes,
      deltaTime: Math.floor((Date.now() - bikeStation.last_update) / 1000 / 60),
      defaultOpen: false, 
      distance : distance,
      last_update : bikeStation.lastUpdate,
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
  <div class="px-3 py-4">
  <div v-for="item in items">
      <div class="flex flex-row items-center justify-between mt-3 space-x-0">
      <div class="flex-1 h-12 bg-primary-400 flex items-center justify-center rounded-l-md">{{ item.availableBikes }}</div>
      <div class="flex-1 h-12 bg-primary-300 flex items-center justify-center ">{{ item.availableBikeStands }}</div>
      <div class="flex-1 h-12 bg-primary-200 flex items-center justify-center mr-1">{{ item.distance.toFixed(2) }} m</div>
      <button class="flex-1 h-12 bg-primary-500 flex items-center justify-center text-white rounded-r-md">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4.47046 17.0591L10.2111 5.57771C10.9482 4.10361 13.0518 4.10362 13.7889 5.57771L19.5295 17.0591C20.3661 18.7322 18.6528 20.5356 16.9391 19.7858L12.4008 17.8004C12.1453 17.6886 11.8547 17.6886 11.5992 17.8004L7.06094 19.7858C5.34719 20.5356 3.6339 18.7322 4.47046 17.0591Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
      </button>
      </div>
  </div>
  </div>
</template>
