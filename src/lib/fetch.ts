import { ofetch } from 'ofetch';
import { getDistance } from 'geolib';
import type { IStation, IStationAPI, IFavorites } from '@/component/lib/types';

const jcdc_key = import.meta.env.VITE_JC_DECAUX_API_KEY;
const maxNameLength = 25;
const contract_name = 'toulouse';

function calculatedColor(percentage: number) {
  const red = 255 - Math.round(percentage * 255);
  const green = Math.round(percentage * 255);
  return `rgb(${red}, ${green}, 0)`;
}

export async function fetchBikeStations(latitude: number, longitude: number) {
  let items: IStation[] = [];
  const data: IStationAPI[] = await ofetch('https://api.jcdecaux.com/vls/v3/stations', {
    query: {
      apiKey: jcdc_key,
      contract: contract_name,
    },
    credentials: 'include',
  });

  const favorites: IFavorites[] = JSON.parse(localStorage.getItem('favorites') || '[]');

  items = data.map((bikeStation) => {
    const position = bikeStation.position;
    const distance: String = getDistance(
      { latitude, longitude },
      { latitude: position.latitude, longitude: position.longitude },
    );
    const formattedDistance: Number = parseFloat(distance).toFixed(0);

    const index = bikeStation.name.indexOf('-');
    let label = bikeStation.name.slice(index + 1).trim();
    if (label.length > maxNameLength) {
      label = label.slice(0, maxNameLength - 3) + '...';
    }
    const availableBikeStands = bikeStation.mainStands.availabilities.stands;
    const availableBikes = bikeStation.mainStands.availabilities.bikes;
    const deltaTime = Math.floor((Date.now() - new Date(bikeStation.lastUpdate)) / 1000 / 60);
    const percentageAvailableBikes =
      parseFloat(availableBikes) / (parseFloat(availableBikes) + parseFloat(availableBikeStands));
    const percentageAvailableSlots =
      parseFloat(availableBikeStands) /
      (parseFloat(availableBikes) + parseFloat(availableBikeStands));
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
      position,
    };
  });

  items.sort((a, b) => a.distance - b.distance);
  return items;
}
