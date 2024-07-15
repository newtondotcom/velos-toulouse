<script setup lang="ts">
  import { getDistance } from 'geolib';
  import { ref, onMounted } from 'vue';
  import { ofetch } from 'ofetch';
  import { Button } from '@/components/ui/button';
  import { Star, StarOff } from 'lucide-vue-next';

  const jcdc_key = import.meta.env.VITE_JC_DECAUX_API_KEY;
  let latitude: number = 43.6027039;
  let longitude: number = 1.4543495;

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

  async function fetchBikeStations(latitude: number, longitude: number) {
    /*
  const data = await ofetch('https://api.jcdecaux.com/vls/v3/stations', {
    query : {
      apiKey: jcdc_key,
      contract: 'Toulouse'
    },
    credentials : 'include'
  });
  console.log(data[0]);
  */
    const data = [
      {
        number: 55,
        contractName: 'toulouse',
        name: '00055 - SAINT-SERNIN - G. ARNOULT',
        address: '2 RUE GATIEN ARNOULT',
        position: {
          latitude: 43.609022,
          longitude: 1.441105,
        },
        banking: false,
        bonus: false,
        status: 'OPEN',
        lastUpdate: '2024-07-15T13:50:21Z',
        connected: true,
        overflow: false,
        shape: null,
        totalStands: {
          availabilities: {
            bikes: 1,
            stands: 14,
            mechanicalBikes: 1,
            electricalBikes: 0,
            electricalInternalBatteryBikes: 0,
            electricalRemovableBatteryBikes: 0,
          },
          capacity: 15,
        },
        mainStands: {
          availabilities: {
            bikes: 1,
            stands: 14,
            mechanicalBikes: 1,
            electricalBikes: 0,
            electricalInternalBatteryBikes: 0,
            electricalRemovableBatteryBikes: 0,
          },
          capacity: 15,
        },
        overflowStands: null,
      },
    ];

    items.value = data.map((bikeStation) => {
      const position = bikeStation.position;
      const distance = getDistance(
        { latitude, longitude },
        { latitude: position.latitude, longitude: position.longitude },
      );

      return {
        label: bikeStation.name.split('- ')[1],
        availableBikeStands: bikeStation.mainStands.availabilities.stands,
        availableBikes: bikeStation.mainStands.availabilities.bikes,
        deltaTime: Math.floor((Date.now() - new Date(bikeStation.lastUpdate)) / 1000 / 60),
        distance: distance,
      };
    });

    items.value.sort((a, b) => a.distance - b.distance);
    if (items.value.length > 0) {
      items.value[0].defaultOpen = true;
    }
  }

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
        <div class="text-xl font-bold">🚵 Velos Toulouse</div>
        <div class="text-sm">une app non-officielle</div>
      </div>
      <div v-for="item in items" class="border rounded-xl flex flex-row w-full mt-3">
        <div class="flex flex-row justify-between">
          <div class="">{{ item.label }}</div>
          <div class="">{{ item.deltaTime }}</div>
        </div>
        <div class="flex flex-row justify-between">
          <div class="flex-1 h-12 bg-primary-400 flex items-center justify-center">{{ item.availableBikes }}</div>
          <div class="flex-1 h-12 bg-primary-300 flex items-center justify-center">{{ item.availableBikeStands }}</div>
          <div class="flex-1 h-12 bg-primary-200 flex items-center justify-center">
            {{ item.distance.toFixed(2) }} m
          </div>
        </div>
        <Button class="flex-1 h-12 bg-primary-500 flex items-center justify-center text-white rounded-r-md">
          <Star color="#ffff00" />
          <Star color="#ffff00" />
        </Button>
      </div>
    </div>
  </div>
</template>
