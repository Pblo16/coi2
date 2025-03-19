import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface RoutePoint {
    latitude: string;
    longitude: string;
    order?: number;
    id?: number;
}

interface RouteMapProps {
    points: RoutePoint[];
    height?: string;
    width?: string;
}

const RouteMap = ({ points, height = '400px', width = '100%' }: RouteMapProps) => {
    // Fix Leaflet default icon issue in React
    useEffect(() => {
        // Delete the default icon reference to prevent invalid URL errors
        delete (L.Icon.Default.prototype as any)._getIconUrl;

        // Set the icon URLs manually from CDN
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
    }, []);

    // No points provided
    if (!points || points.length === 0) {
        return (
            <div
                style={{ height, width }}
                className="bg-neutral-100 rounded-md flex items-center justify-center text-neutral-500"
            >
                No hay puntos para mostrar en el mapa
            </div>
        );
    }

    // Convert string coordinates to numbers for Leaflet
    const routePoints = points.map(point => [
        parseFloat(point.latitude),
        parseFloat(point.longitude)
    ] as [number, number]);

    // Calculate center and bounds of the map
    const bounds = L.latLngBounds(routePoints.map(point => L.latLng(point[0], point[1])));
    const center = bounds.getCenter();

    return (
        <div style={{ height, width }}>
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                bounds={bounds}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Draw route line */}
                <Polyline
                    positions={routePoints}
                    color="#3B82F6"
                    weight={4}
                    opacity={0.7}
                />

                {/* Place markers at each point */}
                {points.map((point, index) => (
                    <Marker
                        key={point.id || index}
                        position={[parseFloat(point.latitude), parseFloat(point.longitude)]}
                    >
                        <Popup>
                            Punto {point.order || index + 1}<br />
                            Lat: {point.latitude}<br />
                            Lng: {point.longitude}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default RouteMap;
