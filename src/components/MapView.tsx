import { useEffect, useRef, useCallback, useState } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, ScaleControl, ZoomControl, Marker } from "react-leaflet";
import L from "leaflet";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadowUrl });

const CARTO_DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png";
const CARTO_LABEL_TILES = "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png";
const OSM_FALLBACK_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const HISTORICAL_LABELS = [
  { name: "NORWAY", position: [61.3, 8.2], className: "" },
  { name: "SWEDEN", position: [62.3, 16.2], className: "" },
  { name: "DENMARK", position: [56.1, 10.3], className: "" },
  { name: "SCOTLAND", position: [57.1, -4.3], className: "" },
  { name: "IRELAND", position: [53.3, -8.2], className: "" },
  { name: "ENGLAND", position: [52.6, -1.5], className: "" },
  { name: "FRANCE", position: [46.4, 2.0], className: "is-major" },
  { name: "SPAIN", position: [40.2, -3.8], className: "is-major" },
  { name: "ITALY", position: [42.8, 12.4], className: "" },
  { name: "POLAND", position: [52.0, 19.2], className: "is-major" },
  { name: "HUNGARY", position: [47.0, 19.2], className: "" },
  { name: "LITHUANIA", position: [55.2, 24.0], className: "" },
  { name: "NORTH<br/>SEA", position: [56.1, 3.0], className: "is-water" },
  { name: "HOLY ROMAN<br/>EMPIRE", position: [50.0, 10.4], className: "is-empire" },
  { name: "BYZANTINE<br/>EMPIRE", position: [41.2, 28.3], className: "is-empire" },
] satisfies Array<{ name: string; position: [number, number]; className: string }>;

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
    map.getContainer().style.cursor = active ? "wait" : "grab";
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

function MapHandle({ onMap }: { onMap: (map: L.Map) => void }) {
  const map = useMap();

  useEffect(() => {
    onMap(map);
  }, [map, onMap]);

  return null;
}

function HistoricalLabels() {
  return (
    <>
      {HISTORICAL_LABELS.map((label) => (
        <Marker
          key={label.name}
          position={label.position}
          interactive={false}
          icon={L.divIcon({
            html: `<span class="historical-map-label ${label.className}">${label.name}</span>`,
            className: "historical-label-marker",
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          })}
        />
      ))}
    </>
  );
}

function MapControlIcon({ name }: { name: "target" | "layers" }) {
  if (name === "layers") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" className="h-6 w-6">
        <path d="m12 5 7.2 3.35L12 11.7 4.8 8.35 12 5Z" stroke="currentColor" strokeWidth="1.45" strokeLinejoin="round" />
        <path d="m5.2 12.1 6.8 3.2 6.8-3.2M5.2 15.55l6.8 3.2 6.8-3.2" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" className="h-6 w-6">
      <circle cx="12" cy="12" r="5.6" stroke="currentColor" strokeWidth="1.45" />
      <circle cx="12" cy="12" r="1.65" fill="currentColor" />
      <path d="M12 3.4v3M12 17.6v3M3.4 12h3M17.6 12h3" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

function MobileMapControls({ map }: { map: L.Map | null }) {
  const controlClass = "flex h-14 w-14 items-center justify-center text-gold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.96]";
  const resetMap = () => {
    const isDesktop = (map?.getContainer().clientWidth ?? 0) >= 1024;
    map?.flyTo([51, 10], isDesktop ? 5 : 4, { duration: 0.75 });
  };

  return (
    <div className="pointer-events-auto absolute right-3 top-[36%] z-[460] -translate-y-1/2 overflow-hidden rounded-[1.45rem] border border-gold/20 bg-[#0b0a07]/90 shadow-[0_18px_38px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(245,232,196,0.06)] md:right-8 md:top-1/2">
      <button
        type="button"
        aria-label="Reset map"
        className={controlClass}
        onClick={resetMap}
      >
        <MapControlIcon name="target" />
      </button>
      <div className="h-px bg-gold/15" />
      <button type="button" aria-label="Zoom in" className={`${controlClass} font-garamond text-4xl leading-none`} onClick={() => map?.zoomIn()}>
        +
      </button>
      <div className="h-px bg-gold/15" />
      <button type="button" aria-label="Zoom out" className={`${controlClass} font-garamond text-4xl leading-none`} onClick={() => map?.zoomOut()}>
        -
      </button>
      <div className="h-px bg-gold/15" />
      <button type="button" aria-label="Map layers" className={controlClass} onClick={() => map?.setZoom(Math.max(map.getMinZoom(), map.getZoom()))}>
        <MapControlIcon name="layers" />
      </button>
    </div>
  );
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
    <div className="pointer-events-none absolute inset-x-4 bottom-[10.9rem] z-[450] flex justify-center md:bottom-[11.75rem]">
      <div className={`max-w-[320px] rounded-[1.55rem] border p-1.5 text-center shadow-[0_18px_42px_rgba(0,0,0,0.48),inset_0_1px_1px_rgba(245,232,196,0.08)] ${
        failed
          ? "border-red-400/25 bg-red-950/60"
          : "border-gold/20 bg-[#0d0c08]/90"
      }`}>
        <div className="rounded-[1.15rem] bg-[#11100b]/90 px-8 py-4 shadow-[inset_0_1px_0_rgba(245,232,196,0.05)]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className={`mx-auto mb-2 h-6 w-6 ${failed ? "text-red-200" : "text-gold"}`} fill="none">
            <path d="M7.2 4.5h9.6M7.2 19.5h9.6M8.4 4.5c0 3.1 1.35 4.75 3.6 6.3 2.25-1.55 3.6-3.2 3.6-6.3M8.4 19.5c0-3.1 1.35-4.75 3.6-6.3 2.25 1.55 3.6 3.2 3.6 6.3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="font-cinzel text-[1.45rem] font-semibold leading-none tracking-[0.03em] text-gold">
            {failed ? "Map network issue" : fallback ? "Backup map active" : "Loading map..."}
          </p>
          <p className="mt-2 font-garamond text-base leading-snug text-parchment-600">
            {failed
              ? "Tiles are not responding. You can still browse nations from the menu."
              : fallback
              ? "Primary tiles were slow, so a backup layer is being used."
              : "Fetching historical tiles"}
          </p>
          <div className="mx-auto mt-3 h-1.5 w-52 max-w-full overflow-hidden rounded-full bg-gold/10">
            <div className={`h-full rounded-full ${failed ? "bg-red-300/80" : "bg-gold/80"} ${loading ? "map-status-progress" : "w-full"}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MapView({ onCountryClick, isGeocoding }: MapViewProps) {
  const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [tilesLoading, setTilesLoading] = useState(true);
  const [tilesLoaded, setTilesLoaded] = useState(false);
  const [tileErrorCount, setTileErrorCount] = useState(0);
  const [initialOverlayDone, setInitialOverlayDone] = useState(false);

  const useFallbackTiles = tileErrorCount >= 4 && !tilesLoaded;
  const hasMapFailed = tileErrorCount >= 10 && !tilesLoaded;
  const isDesktopViewport = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
  const initialCenter: [number, number] = isDesktopViewport ? [51, 10] : [50.8, 10.3];
  const initialZoom = isDesktopViewport ? 5 : 4;

  const handleCountryClick = useCallback(
    (country: string, lat: number, lng: number) => {
      setSelectedPos({ lat, lng });
      onCountryClick(country, lat, lng);
    },
    [onCountryClick]
  );

  useEffect(() => {
    if (!mapReady || tilesLoading) return undefined;
    const timer = window.setTimeout(() => setInitialOverlayDone(true), 1200);
    return () => window.clearTimeout(timer);
  }, [mapReady, tilesLoading]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink">
      <MapStatusOverlay
        loading={!initialOverlayDone || !mapReady || tilesLoading}
        fallback={useFallbackTiles}
        failed={hasMapFailed}
      />
      <MobileMapControls map={mapInstance} />
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
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
        <MapHandle onMap={setMapInstance} />
        <MapResizeController />
        <ClickHandler onCountryClick={handleCountryClick} isGeocoding={isGeocoding} />
        <GeocodingOverlay active={isGeocoding} />
        <ScaleControl position="bottomleft" imperial={false} />
        <HistoricalLabels />

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
