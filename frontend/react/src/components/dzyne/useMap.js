import { useEffect, useState } from 'react';
import L from 'leaflet';
import './leaflet.css'

const useMap = (
    containerID,
    mapOptions,
    layerOptions,
    onMapCreated = map => { },
    dependencies = []
) => {
    // state tracking
    const [map, setMap] = useState(null);

    // setup defaults
    mapOptions.startPosition = mapOptions?.startPosition || [0, 0];
    mapOptions.startZoom = mapOptions?.startZoom || 2;

    let attribution, tileLayer;

    tileLayer = layerOptions?.tileLayer || "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
    attribution = layerOptions?.attribution || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

    useEffect(() => {
        if (!map) {
            const currentMap = L.map(containerID, { ...mapOptions }).setView(mapOptions.startPosition, mapOptions.startZoom)

            // only add a default layer if the layer is not null (or falsy)
            if (layerOptions) {
                const mainLayer = L.tileLayer(tileLayer, {
                    ...layerOptions,
                    attribution
                })

                mainLayer.addTo(currentMap);
            }

            setMap(currentMap)
        } else {
            onMapCreated(map)
        }
    }, [map, ...dependencies])
    return map;
}

export default useMap;