import { useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet's default marker icons when using Vite/React
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const locations = {
  airport: {
    name: 'Murtala Muhammed International Airport',
    shortName: 'Airport',
    position: [6.5774, 3.3213],
  },
  obalende: {
    name: 'Obalende Motor Park',
    shortName: 'Obalende',
    position: [6.4474, 3.4017],
  },
  eko: {
    name: 'Eko Hotels & Suites',
    shortName: 'Eko Hotels',
    position: [6.4281, 3.4219],
  },
  oriental: {
    name: 'Oriental Hotels & Suites',
    shortName: 'Oriental Hotel',
    position: [6.4315, 3.4326],
  },
}

const route = [
  locations.airport.position,
  [6.535, 3.36],
  [6.49, 3.39],
  locations.obalende.position,
  [6.438, 3.412],
  locations.eko.position,
  locations.oriental.position,
]

function FitMap() {
  const map = useMap()

  useEffect(() => {
    const bounds = L.latLngBounds(
      Object.values(locations).map((location) => location.position)
    )

    map.fitBounds(bounds, {
      padding: [40, 40],
    })
  }, [map])

  return null
}

function createMarkerIcon(type = 'venue') {
  const isVenue = type === 'venue'

  return L.divIcon({
    className: 'amano-map-marker',
    html: `
      <div style="
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        background: ${isVenue ? '#FFD21F' : '#002B5C'};
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,.25);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: ${isVenue ? '#002B5C' : '#FFD21F'};
        "></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  })
}

export default function ConventionMap() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-navy-100 shadow-xl">
      <MapContainer
        center={[6.45, 3.41]}
        zoom={12}
        scrollWheelZoom={false}
        className="h-[420px] md:h-[500px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitMap />

        <Polyline
          positions={route}
          pathOptions={{
            color: '#FFD21F',
            weight: 5,
            opacity: 0.9,
            dashArray: '10 8',
          }}
        />

        <Marker
          position={locations.airport.position}
          icon={createMarkerIcon('transport')}
        >
          <Popup>
            <div className="p-1">
              <strong>Murtala Muhammed International Airport</strong>
              <br />
              <span>Lagos · LOS</span>
            </div>
          </Popup>
        </Marker>

        <Marker
          position={locations.obalende.position}
          icon={createMarkerIcon('transport')}
        >
          <Popup>
            <div className="p-1">
              <strong>Obalende Motor Park</strong>
              <br />
              <span>Lagos Island</span>
            </div>
          </Popup>
        </Marker>

        <Marker
          position={locations.eko.position}
          icon={createMarkerIcon('venue')}
        >
          <Popup>
            <div className="p-1">
              <strong>Eko Hotels &amp; Suites</strong>
              <br />
              <span>Day 1 · Meet and Greet</span>
            </div>
          </Popup>
        </Marker>

        <Marker
          position={locations.oriental.position}
          icon={createMarkerIcon('venue')}
        >
          <Popup>
            <div className="p-1">
              <strong>Oriental Hotels &amp; Suites</strong>
              <br />
              <span>Days 2 &amp; 3 · Convention</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-navy-100">
        <p className="text-[10px] font-bold uppercase tracking-wider text-navy-500 mb-2">
          AMANOCON 2026
        </p>

        <div className="flex flex-col gap-2 text-xs text-navy-700">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gold-500 border border-navy-900" />
            Convention Venue
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-navy-900 border border-gold-500" />
            Transport Point
          </div>

          <div className="flex items-center gap-2">
            <span className="w-5 border-t-2 border-dashed border-gold-500" />
            Route
          </div>
        </div>
      </div>
    </div>
  )
}