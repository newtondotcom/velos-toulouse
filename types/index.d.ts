export { MyInterface };

declare global {
    interface BikeStation {
        number: number;
        contract_name: string;
        name: string;
        address: string;
        available_bike_stands: number;
        available_bikes: number;
        banking: boolean;
        bike_stands: number;
        bonus: boolean;
        last_update: number;
        position: {
          lat: number;
          lng: number;
        };
        status: string;
      }
      
}