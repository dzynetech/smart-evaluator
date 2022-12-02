import { Map, MapOptions, LayerOptions } from "leaflet";

type useMapType = (
  containerID: string,
  mapOptions: MapOptions,
  layerOptions: LayerOptions,
  onMapCreated: (map: Map) => void,
  dependencies?: React.DependencyList
) => Map;

export const useMap: useMapType;
export default useMap;
