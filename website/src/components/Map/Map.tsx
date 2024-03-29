import 'leaflet/dist/leaflet.css'
import styles from '../../styles/modules/Map.module.scss'

import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { LatLngExpression, icon } from 'leaflet'

function Map() {
    const POSITION: LatLngExpression = [49.82792974753923, 13.900512955720863]
    const pinIcon = icon({
        iconUrl: 'assets/pin.svg',
        iconSize: [40, 40]
    })

    return (
        <MapContainer center={POSITION} zoom={13} scrollWheelZoom={false} className={styles.map} >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={POSITION} icon={pinIcon} />
        </MapContainer>
    )
}

export default Map