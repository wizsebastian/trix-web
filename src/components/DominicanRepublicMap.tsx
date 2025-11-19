import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Configurar iconos por defecto de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DominicanRepublicMapProps {
  heroMode?: boolean;
}

export const DominicanRepublicMap = ({ heroMode = false }: DominicanRepublicMapProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(true);

  // Coordenadas de Santo Domingo como fallback
  const SANTO_DOMINGO_COORDS: [number, number] = [18.4861, -69.9312];

  useEffect(() => {
    // Intentar obtener ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Verificar si está en República Dominicana (aproximadamente)
          if (latitude >= 17.36 && latitude <= 19.93 && longitude >= -72.03 && longitude <= -68.32) {
            setUserLocation([latitude, longitude]);
          } else {
            // Si no está en RD, usar Santo Domingo
            setUserLocation(SANTO_DOMINGO_COORDS);
          }
          setIsLocating(false);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Fallback a Santo Domingo
          setUserLocation(SANTO_DOMINGO_COORDS);
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      // Geolocation no soportada, usar Santo Domingo
      setUserLocation(SANTO_DOMINGO_COORDS);
      setIsLocating(false);
    }
  }, []);

  if (isLocating && !heroMode) {
    return (
      <div className="h-80 bg-slate-800/50 border border-blue-400/30 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-blue-300 text-sm">Localizando...</p>
        </div>
      </div>
    );
  }

  // Hero mode - solo el mapa sin decoraciones
  if (heroMode) {
    return (
      <MapContainer
        center={userLocation || SANTO_DOMINGO_COORDS}
        zoom={userLocation ? 10 : 8}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marcador en la ubicación del usuario o Santo Domingo */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center">
                <strong>📍 Tu ubicación</strong>
                <br />
                <span className="text-sm text-gray-600">
                  {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                </span>
                <br />
                <span className="text-xs text-blue-600">República Dominicana</span>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Marcador adicional en Santo Domingo como referencia */}
        {userLocation && (userLocation[0] !== SANTO_DOMINGO_COORDS[0] || userLocation[1] !== SANTO_DOMINGO_COORDS[1]) && (
          <Marker position={SANTO_DOMINGO_COORDS}>
            <Popup>
              <div className="text-center">
                <strong>🏛️ Santo Domingo</strong>
                <br />
                <span className="text-sm text-gray-600">Capital de República Dominicana</span>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    );
  }

  // Modo normal con todas las decoraciones
  return (
    <div className="space-y-4">
      {/* Información del Mapa */}
      <div className="bg-slate-800/50 border border-blue-400/30 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-slate-300 font-semibold">República Dominicana - Ubicación en Tiempo Real</span>
        </div>
        <div className="text-xs text-slate-400">
          {userLocation 
            ? `📍 Coordenadas: ${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}`
            : '📍 Ubicación: Santo Domingo (Por defecto)'
          }
        </div>
      </div>

      {/* Mapa Real de República Dominicana */}
      <div className="relative w-full h-96 border border-blue-400/30 rounded-2xl overflow-hidden">
        <MapContainer
          center={userLocation || SANTO_DOMINGO_COORDS}
          zoom={userLocation ? 13 : 8}
          style={{ height: '100%', width: '100%' }}
          className="rounded-2xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Marcador en la ubicación del usuario o Santo Domingo */}
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <div className="text-center">
                  <strong>📍 Tu ubicación</strong>
                  <br />
                  <span className="text-sm text-gray-600">
                    {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                  </span>
                  <br />
                  <span className="text-xs text-blue-600">República Dominicana</span>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Marcador adicional en Santo Domingo como referencia */}
          {userLocation && (userLocation[0] !== SANTO_DOMINGO_COORDS[0] || userLocation[1] !== SANTO_DOMINGO_COORDS[1]) && (
            <Marker position={SANTO_DOMINGO_COORDS}>
              <Popup>
                <div className="text-center">
                  <strong>🏛️ Santo Domingo</strong>
                  <br />
                  <span className="text-sm text-gray-600">Capital de República Dominicana</span>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Información Adicional */}
      <div className="bg-slate-800/50 border border-blue-400/30 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">Información Geoespacial</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Coordenadas precisas en tiempo real</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Mapa interactivo de República Dominicana</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
            <span>Geolocalización automática</span>
          </div>
        </div>
      </div>
    </div>
  );
};