import { ofetch } from 'ofetch';
import { getDistance } from 'geolib';
import type { IStation, IStationAPI, IFavorites } from '@/component/lib/types';

const jcdc_key = import.meta.env.VITE_JC_DECAUX_API_KEY;
const maxNameLength = 25;

function calculatedColor(percentage: number) {
  const red = 255 - Math.round((percentage / 100) * 255);
  const green = Math.round((percentage / 100) * 255);
  return `rgb(${red}, ${green}, 0)`;
}

export async function fetchBikeStations(latitude: number, longitude: number) {
  let items: IStation[] = [];
  const data: IStationAPI[] = await ofetch('https://api.jcdecaux.com/vls/v3/stations', {
    query: {
      apiKey: jcdc_key,
      contract: 'Toulouse',
    },
    credentials: 'include',
  });
  /*
  const data: IStationAPI[] = [
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
    {
      number: 80,
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
  */

  const favorites: IFavorites[] = JSON.parse(localStorage.getItem('favorites') || '[]');

  items = data.map((bikeStation) => {
    const position = bikeStation.position;
    const distance: String = getDistance(
      { latitude, longitude },
      { latitude: position.latitude, longitude: position.longitude },
    );
    const formattedDistance: Number = parseFloat(distance).toFixed(0);

    let label = bikeStation.name.split('- ')[1];
    if (label.length > maxNameLength) {
      label = label.slice(0, maxNameLength - 3) + '...';
    }
    const availableBikeStands = bikeStation.mainStands.availabilities.stands;
    const availableBikes = bikeStation.mainStands.availabilities.bikes;
    const deltaTime = Math.floor((Date.now() - new Date(bikeStation.lastUpdate)) / 1000 / 60);
    const percentageAvailableBikes =
      parseFloat(availableBikes) / (parseFloat(availableBikes) + parseFloat(availableBikeStands));
    const percentageAvailableSlots = 100 - parseFloat(percentageAvailableBikes);
    const colorBikes = calculatedColor(percentageAvailableBikes);
    const colorStands = calculatedColor(percentageAvailableSlots);
    const number = bikeStation.number;
    const favorite = favorites.includes(number);

    return {
      number,
      label,
      availableBikeStands,
      availableBikes,
      deltaTime,
      distance: formattedDistance,
      favorite,
      percentageAvailableBikes,
      colorBikes,
      colorStands,
    };
  });

  items.sort((a, b) => a.distance - b.distance);
  return items;
}
