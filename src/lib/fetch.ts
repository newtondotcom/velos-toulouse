import { ofetch } from 'ofetch';
import { getDistance } from 'geolib';

const maxNameLength = 25;

export async function fetchBikeStations(latitude: number, longitude: number) {
  let items: any[] = [];
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

  items = data.map((bikeStation) => {
    const position = bikeStation.position;
    const distance: String = getDistance(
      { latitude, longitude },
      { latitude: position.latitude, longitude: position.longitude },
    );
    const formattedDistance: Number = parseFloat(distance).toFixed(0);

    let label  = bikeStation.name.split('- ')[1];
    if (label.length > maxNameLength){label = label.slice(0,maxNameLength-3)+"..."}
    const availableBikeStands= bikeStation.mainStands.availabilities.stands;
    const availableBikes= bikeStation.mainStands.availabilities.bikes;
    const deltaTime=Math.floor((Date.now() - new Date(bikeStation.lastUpdate)) / 1000 / 60);
    const percentageAvailableBikes = (parseFloat(availableBikes))/(parseFloat(availableBikes) + parseFloat(availableBikeStands));

    return {
      label,
      availableBikeStands,
      availableBikes,
      deltaTime,
      distance: formattedDistance,
      favorite : false,
      percentageAvailableBikes
    };
  });

  items.sort((a, b) => a.distance - b.distance);
  return items;
}
