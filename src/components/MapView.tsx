import { useEffect, useRef, useCallback, useState } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, ScaleControl, ZoomControl } from "react-leaflet";
import L from "leaflet";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadowUrl });

const CARTO_DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";
const CARTO_LABEL_TILES = "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png";
const OSM_FALLBACK_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

interface MapViewProps {
  onCountryClick: (country: string, lat: number, lng: number) => void;
  selectedCountry?: string | null;
  isGeocoding: boolean;
}

// Modern selected country marker — clean ring + glowing dot
function SelectedMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const container = document.createElement("div");
    container.style.cssText = "overflow:visible;position:relative;width:0;height:0;";
    container.innerHTML = `
      <style>
        @keyframes ring-expand {
          0%   { transform: translate(-50%,-50%) scale(0.6); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
        }
        @keyframes ring-expand-slow {
          0%   { transform: translate(-50%,-50%) scale(0.6); opacity: 0.5; }
          100% { transform: translate(-50%,-50%) scale(3); opacity: 0; }
        }
        @keyframes dot-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.6), 0 0 16px 4px rgba(201,168,76,0.4); }
          50%       { box-shadow: 0 0 0 6px rgba(201,168,76,0), 0 0 24px 8px rgba(201,168,76,0.2); }
        }
      </style>

      <!-- Outer slow ring -->
      <div style="
        position:absolute; left:0; top:0;
        width:44px; height:44px; border-radius:50%;
        border:1px solid rgba(201,168,76,0.3);
        animation: ring-expand-slow 3s ease-out infinite 0.5s;
        transform:translate(-50%,-50%);
      "></div>

      <!-- Middle ring -->
      <div style="
        position:absolute; left:0; top:0;
        width:28px; height:28px; border-radius:50%;
        border:1.5px solid rgba(201,168,76,0.5);
        animation: ring-expand 2.5s ease-out infinite;
        transform:translate(-50%,-50%);
      "></div>

      <!-- Static outer ring -->
      <div style="
        position:absolute; left:0; top:0;
        width:18px; height:18px; border-radius:50%;
        border:1.5px solid rgba(201,168,76,0.4);
        transform:translate(-50%,-50%);
        background: rgba(201,168,76,0.06);
        backdrop-filter: blur(2px);
      "></div>

      <!-- Inner dot -->
      <div style="
        position:absolute; left:0; top:0;
        width:8px; height:8px; border-radius:50%;
        background: radial-gradient(circle, #fff8e0 0%, #C9A84C 60%, #8b6914 100%);
        transform:translate(-50%,-50%);
        animation: dot-pulse 2s ease-in-out infinite;
        border:1px solid rgba(255,248,224,0.6);
        z-index:3;
      "></div>
    `;

    const icon = L.divIcon({
      html: container,
      className: "",
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

    const marker = L.marker([lat, lng], { icon, zIndexOffset: 2000 }).addTo(map);
    markerRef.current = marker;
    return () => { marker.remove(); };
  }, [map, lat, lng]);

  return null;
}

// Click → Nominatim reverse geocode
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
        // ignore
      }
    },
  });
  return null;
}

// Fly to selected country
function MapController({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.flyTo([lat, lng], Math.max(map.getZoom(), 5), { animate: true, duration: 1.2 });
    }
  }, [map, lat, lng]);
  return null;
}

// Cursor style while geocoding
function GeocodingOverlay({ active }: { active: boolean }) {
  const map = useMap();
  useEffect(() => {
    // Keep cursor hidden (none) so our CustomCursor shows; use wait during geocoding
    map.getContainer().style.cursor = active ? "wait" : "crosshair";
  }, [map, active]);
  return null;
}

function MapResizeController() {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => map.invalidateSize({ pan: false });
    const timers = [0, 160, 420, 900].map((delay) => window.setTimeout(invalidate, delay));

    const container = map.getContainer();
    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(invalidate)
      : null;

    observer?.observe(container);
    window.addEventListener("resize", invalidate);
    window.addEventListener("orientationchange", invalidate);

    return () => {
      timers.forEach(window.clearTimeout);
      observer?.disconnect();
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("orientationchange", invalidate);
    };
  }, [map]);

  return null;
}

function MapStatusOverlay({
  loading,
  fallback,
  failed,
}: {
  loading: boolean;
  fallback: boolean;
  failed: boolean;
}) {
  if (!loading && !fallback && !failed) return null;

  return (
    <div className="pointer-events-none absolute inset-x-4 top-[5.4rem] z-[450] flex justify-center sm:top-20">
      <div className={`max-w-[320px] rounded-2xl border px-4 py-3 text-center backdrop-blur-xl shadow-[0_14px_34px_rgba(0,0,0,0.42)] ${
        failed
          ? "border-red-400/25 bg-red-950/40"
          : "border-gold/20 bg-ink/80"
      }`}>
        <div className="mx-auto mb-2 h-1 w-24 overflow-hidden rounded-full bg-white/10">
          <div className={`h-full rounded-full ${failed ? "bg-red-300/80" : "bg-gold/80"} ${loading ? "map-status-progress" : "w-full"}`} />
        </div>
        <p className="font-cinzel text-[10px] uppercase tracking-[0.24em] text-gold/80">
          {failed ? "Map network issue" : fallback ? "Backup map active" : "Drawing the atlas"}
        </p>
        <p className="mt-1 font-garamond text-[12px] italic leading-snug text-parchment-500">
          {failed
            ? "The tile provider is not responding. You can still browse nations from the menu."
            : fallback
            ? "Primary tiles were slow, so a backup layer is being used."
            : "Loading map tiles and labels for your screen."}
        </p>
      </div>
    </div>
  );
}

export function MapView({ onCountryClick, isGeocoding }: MapViewProps) {
  const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [tilesLoading, setTilesLoading] = useState(true);
  const [tilesLoaded, setTilesLoaded] = useState(false);
  const [tileErrorCount, setTileErrorCount] = useState(0);

  const useFallbackTiles = tileErrorCount >= 4 && !tilesLoaded;
  const hasMapFailed = tileErrorCount >= 10 && !tilesLoaded;

  const handleCountryClick = useCallback(
    (country: string, lat: number, lng: number) => {
      setSelectedPos({ lat, lng });
      onCountryClick(country, lat, lng);
    },
    [onCountryClick]
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
    <MapStatusOverlay
      loading={!mapReady || tilesLoading}
      fallback={useFallbackTiles}
      failed={hasMapFailed}
    />
    <MapContainer
      center={[45, 15]}
      zoom={3}
      minZoom={2}
      maxZoom={12}
      className="w-full h-full"
      zoomControl={false}
      attributionControl={true}
      style={{ background: "#0d0a06" }}
      worldCopyJump={true}
      zoomAnimation={true}
      fadeAnimation={true}
      whenReady={() => setMapReady(true)}
    >
      <TileLayer
        key={useFallbackTiles ? "osm-fallback" : "carto-dark"}
        url={useFallbackTiles ? OSM_FALLBACK_TILES : CARTO_DARK_TILES}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        subdomains={useFallbackTiles ? "abc" : "abcd"}
        maxZoom={20}
        className={useFallbackTiles ? "map-fallback-layer" : "map-base-layer"}
        eventHandlers={{
          loading: () => setTilesLoading(true),
          load: () => setTilesLoading(false),
          tileload: () => {
            setTilesLoaded(true);
            setTilesLoading(false);
          },
          tileerror: () => {
            setTileErrorCount((count) => count + 1);
            setTilesLoading(false);
          },
        }}
      />
      {!useFallbackTiles && (
        <TileLayer
          url={CARTO_LABEL_TILES}
          subdomains="abcd"
          maxZoom={20}
          className="map-label-layer"
          eventHandlers={{
            tileerror: () => setTileErrorCount((count) => count + 1),
          }}
        />
      )}

      <ZoomControl position="bottomright" />
      <MapResizeController />
      <ClickHandler onCountryClick={handleCountryClick} isGeocoding={isGeocoding} />
      <GeocodingOverlay active={isGeocoding} />
      <ScaleControl position="bottomleft" imperial={false} />

      {selectedPos && (
        <>
          <SelectedMarker lat={selectedPos.lat} lng={selectedPos.lng} />
          <MapController lat={selectedPos.lat} lng={selectedPos.lng} />
        </>
      )}
    </MapContainer>
    </div>
  );
}
