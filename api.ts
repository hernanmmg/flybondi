import crypto from "crypto";

import {Flight, Trip} from "./pages/api/types";
import DATA from "./db/dataset.json";

const api = {
  trips: {
    list: async (origin: Flight["origin"]): Promise<Trip[]> => {
      const [origins, destinations] = DATA.filter(
        (flight: Flight) => new Date(flight.date) > new Date(),
      ).reduce<[Flight[], Flight[]]>(
        ([origins, destinations], flight) => {
          if (flight.origin === origin) {
            origins.push(flight);
          } else if (flight.destination === origin) {
            destinations.push(flight);
          }

          return [origins, destinations];
        },
        [[], []],
      );
      const trips: Trip[] = [];

      for (let origin of origins) {
        for (let destination of destinations) {
          const originDate = Number(new Date(destination.date));
          const destinationDate = Number(new Date(origin.date));

          if (destinationDate > originDate) {
            const days = Math.ceil((destinationDate - originDate) / (1000 * 60 * 60 * 24));
            const ratio = Math.ceil(origin.price + destination.price);

            trips.push({
              availability: Math.min(origin.availability, destination.availability),
              days,
              destination,
              id: crypto.randomUUID(),
              origin,
              price: origin.price + destination.price,
              ratio,
            });
          }
        }
      }

      return trips;
    },
  },
  origin: {
    list: async (): Promise<Flight["origin"][]> => {
      const origins = new Set<Flight["origin"]>();

      for (let flight of DATA) {
        origins.add(flight.origin);
      }

      return Array.from(origins);
    },
  },
};

export default api;
