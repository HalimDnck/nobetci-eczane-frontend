<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import maplibregl, { type Map, type Marker } from 'maplibre-gl';
import type { Language } from '../i18n';
import { messages } from '../i18n';
import type { Coordinates, Pharmacy } from '../types/pharmacy';
import { isClosedPharmacy, normalizePharmacyStatus } from '../utils/pharmacyStatus';

const props = defineProps<{
  language: Language;
  pharmacies: Pharmacy[];
  selectedId?: string;
  userLocation?: Coordinates | null;
}>();

const emit = defineEmits<{
  select: [pharmacy: Pharmacy];
}>();

const mapContainer = ref<HTMLDivElement | null>(null);
let map: Map | null = null;
let pharmacyMarkers: Marker[] = [];
let userMarker: Marker | null = null;

function markerElement(pharmacy: Pharmacy) {
  const element = document.createElement('button');
  element.className = isClosedPharmacy(pharmacy) ? 'map-marker map-marker--closed' : 'map-marker';
  element.type = 'button';
  element.setAttribute('aria-label', pharmacy.name);
  element.addEventListener('click', () => emit('select', pharmacy));
  return element;
}

function userMarkerElement() {
  const element = document.createElement('span');
  element.className = 'map-marker map-marker--user';
  return element;
}

function popupContent(pharmacy: Pharmacy) {
  const content = document.createElement('div');
  content.className = 'map-popup';

  const title = document.createElement('strong');
  title.textContent = pharmacy.name;

  const address = document.createElement('span');
  address.textContent = pharmacy.address;

  const status = document.createElement('small');
  status.textContent = messages[props.language].status[normalizePharmacyStatus(pharmacy)];

  content.append(title, status, address);
  return content;
}

function clearMarkers() {
  pharmacyMarkers.forEach((marker) => marker.remove());
  pharmacyMarkers = [];
  userMarker?.remove();
  userMarker = null;
}

function fitToMarkers() {
  if (!map || props.pharmacies.length === 0) {
    return;
  }

  const bounds = new maplibregl.LngLatBounds();
  props.pharmacies.forEach((pharmacy) => bounds.extend([pharmacy.longitude, pharmacy.latitude]));

  if (props.userLocation) {
    bounds.extend([props.userLocation.lng, props.userLocation.lat]);
  }

  map.fitBounds(bounds, {
    padding: 56,
    maxZoom: 14,
    duration: 600,
  });
}

function renderMarkers() {
  if (!map) {
    return;
  }

  clearMarkers();

  pharmacyMarkers = props.pharmacies.map((pharmacy) =>
    new maplibregl.Marker({
      element: markerElement(pharmacy),
      anchor: 'bottom',
    })
      .setLngLat([pharmacy.longitude, pharmacy.latitude])
      .setPopup(new maplibregl.Popup({ offset: 18 }).setDOMContent(popupContent(pharmacy)))
      .addTo(map as Map),
  );

  if (props.userLocation) {
    userMarker = new maplibregl.Marker({
      element: userMarkerElement(),
      anchor: 'center',
    })
      .setLngLat([props.userLocation.lng, props.userLocation.lat])
      .addTo(map);
  }

  fitToMarkers();
}

watch(
  () => [props.pharmacies, props.userLocation, props.language],
  () => renderMarkers(),
  { deep: true },
);

watch(
  () => props.selectedId,
  (selectedId) => {
    const selected = props.pharmacies.find((pharmacy) => pharmacy.id === selectedId);
    if (map && selected) {
      map.flyTo({
        center: [selected.longitude, selected.latitude],
        zoom: 14,
        duration: 500,
      });
    }
  },
);

onMounted(() => {
  if (!mapContainer.value) {
    return;
  }

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [29.0255, 40.9864],
    zoom: 11,
    attributionControl: false,
  });

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
  map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
  map.on('load', renderMarkers);
});

onBeforeUnmount(() => {
  clearMarkers();
  map?.remove();
  map = null;
});
</script>

<template>
  <div class="map-shell">
    <div ref="mapContainer" class="map-canvas" :aria-label="messages[language].mapLabel" />
  </div>
</template>
