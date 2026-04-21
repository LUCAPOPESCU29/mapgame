import { useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadowUrl });

interface MapViewProps {
  onCountryClick: (country: string, lat: number, lng: number) => void;
  selectedCountry: string | null;
  isGeocoding: boolean;
}

// Pulse marker for selected country
function SelectedMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const container = document.createElement("div");
    container.style.cssText = "overflow:visible;position:relative;";
    container.innerHTML = `
      <div style="
        width:22px;height:22px;border-radius:50%;
        background:radial-gradient(circle,#fff8e0 0%,#C9A84C 55%,#5a4212 100%);
        border:2px solid #e2c97e;
        box-shadow:0 0 20px #C9A84C,0 0 40px rgba(201,168,76,.5);
        position:relative;z-index:2;
        display:flex;align-items:center;justify-content:center;
        font-size:10px;
      ">📍</div>
      <div style="
        position:absolute;inset:-8px;border-radius:50%;
        border:2px solid rgba(201,168,76,.4);
        animation:marker-ping 2s cubic-bezier(0,0,.2,1) infinite;
      "></div>
    `;

    const icon = L.divIcon({ html: container, className: "", iconSize: [22, 22], iconAnchor: [11, 11] });
    const marker = L.marker([lat, lng], { icon, zIndexOffset: 2000 }).addTo(map);
    markerRef.current = marker;
    return () => { marker.remove(); };
  }, [map, lat, lng]);

  return null;
}

// Click handler → reverse geocode via Nominatim
function ClickHandler({
  onCountryClick,
  isGeocoding,
}: {
  onCountryClick: (c: string, lat: number, lng: number) => void;
  isGeocoding: boolean;
}) {
  useMapEvents({
    click: async (e) => {
      if (isGeocoding) return;
      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=3`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        const country: string =
          data?.address?.country ??
          data?.display_name?.split(", ").at(-1) ??
          "";
        if (country) onCountryClick(country, lat, lng);
      } catch {
        // ignore network errors
      }
    },
  });
  return null;
}

// Zoom-to-country when selection changes
function MapController({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.flyTo([lat, lng], Math.max(map.getZoom(), 5), { animate: true, duration: 1.0 });
    }
  }, [map, lat, lng]);
  return null;
}

// Geocoding cursor overlay
function GeocodingOverlay({ active }: { active: boolean }) {
  const map = useMap();
  useEffect(() => {
    map.getContainer().style.cursor = active ? "wait" : "crosshair";
  }, [map, active]);
  return null;
}

export function MapView({ onCountryClick, selectedCountry, isGeocoding }: MapViewProps) {
  const selectedPos = useRef<{ lat: number; lng: number } | null>(null);

  const handleCountryClick = useCallback(
    (country: string, lat: number, lng: number) => {
      selectedPos.current = { lat, lng };
      onCountryClick(country, lat, lng);
    },
    [onCountryClick]
  );

  return (
    <MapContainer
      center={[48, 15]}
      zoom={5}
      minZoom={3}
      maxZoom={10}
      className="w-full h-full"
      zoomControl={true}
      attributionControl={true}
      style={{ background: "#0d0a06" }}
      worldCopyJump={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />

      <ClickHandler onCountryClick={handleCountryClick} isGeocoding={isGeocoding} />
      <GeocodingOverlay active={isGeocoding} />

      {selectedPos.current && (
        <>
          <SelectedMarker lat={selectedPos.current.lat} lng={selectedPos.current.lng} />
          <MapController lat={selectedPos.current.lat} lng={selectedPos.current.lng} />
        </>
      )}
    </MapContainer>
  );
}
