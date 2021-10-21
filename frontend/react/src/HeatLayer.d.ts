declare namespace L {
	export class HeatLayer extends Layer {}
  namespace Map {
    export type _layers = any;
  }
  namespace HeatLayer {
    export interface options {
      minOpacity?: number;
      maxZoom?: number;
      radius?: number;
      blur?: number;
      max?: number;
    }
    export type LatLngHeatTuple = [number, number, number];
  }
  export function heatLayer(
    points: HeatLayer.LatLngHeatTuple[],
    options?: HeatLayer.options
  ): HeatLayer;

}
