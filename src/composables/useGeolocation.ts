import { ref } from 'vue';
import type { Coordinates } from '../types/pharmacy';

export type GeolocationStatus =
  'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported' | 'error';

export function useGeolocation() {
  const status = ref<GeolocationStatus>('idle');
  const coordinates = ref<Coordinates | null>(null);
  const errorMessage = ref('');

  function requestLocation() {
    if (!navigator.geolocation) {
      status.value = 'unsupported';
      errorMessage.value = 'Tarayiciniz konum paylasimini desteklemiyor.';
      return Promise.resolve(null);
    }

    status.value = 'requesting';
    errorMessage.value = '';

    return new Promise<Coordinates | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nextCoordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          coordinates.value = nextCoordinates;
          status.value = 'granted';
          resolve(nextCoordinates);
        },
        (error) => {
          status.value = error.code === error.PERMISSION_DENIED ? 'denied' : 'error';
          errorMessage.value =
            error.code === error.PERMISSION_DENIED
              ? 'Konum izni verilmedi. Il ve ilce secerek arama yapabilirsiniz.'
              : 'Konum alinamadi. Il ve ilce secerek devam edin.';
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        },
      );
    });
  }

  return {
    coordinates,
    errorMessage,
    requestLocation,
    status,
  };
}
