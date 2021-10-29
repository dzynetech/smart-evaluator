import React, { useState, useEffect, useRef } from "react";
import Leaflet, { HeatLayer, LeafletMouseEvent } from "leaflet";
import { useLazyQuery } from "@apollo/client";
import {
  computeMarkers,
  circleWithText,
  individualMarkers,
  MarkerObj,
} from "../utils/LocationGrouping";
import { createMapLayers } from "../utils/MapLayers";
import useMap from "./dzyne_components/hooks/useMap";
import "../HeatLayer";

import "leaflet/dist/leaflet.css";
import ALL_PERMITS_QUERY from "../queries/AllPermitsQuery";
import UpdatablePermit from "../interfaces/UpdatablePermit";
import PopupData from "../interfaces/PopupData";
import { FilterVars } from "../interfaces/FilterVars";
import { GeometryPoint, PermitsEdge } from "../generated/graphql";
import { MultiPolygon } from "geojson";
import removeOldMarkers from "../utils/removeMarkers";

interface Props {
  setPermitForModal: (popupData: PopupData | null) => void;
  filterVars: FilterVars | null;
  activePermit: UpdatablePermit | null;
  zoomTarget: GeometryPoint | undefined;
  setZoomTarget: (zoomTarget: GeometryPoint | undefined) => void;
}

interface Location {
  id: number;
  x: number;
  y: number;
}

enum Overlay {
  GroupedMarkers,
  UngroupedMarkers,
  Heatmap,
}

function Map(props: Props) {
  const [getPermits, { error, data }] = useLazyQuery(ALL_PERMITS_QUERY);
  const [overlay, setOverlay] = useState(Overlay.GroupedMarkers);
  const [heatLayer, setHeatLayer] = useState<Leaflet.HeatLayer | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const zoomCallbackRef = useRef<() => void>();

  if (error) console.log(error);

  const map = useMap("map", {}, {}, (map) => {
    createMapLayers(map);
  });

  //keep reclustering on zoom from becoming stale
  useEffect(() => {
    if (!map) {
      return;
    }
    if (zoomCallbackRef.current) {
      map.off("zoomend", zoomCallbackRef.current);
    }
    zoomCallbackRef.current = updateMarkers;
    map.on("zoomend", zoomCallbackRef.current);
    updateMarkers();
  }, [map, overlay, props.activePermit, locations]);

  useEffect(() => {
    if (!data || !map) {
      return;
    }
    data.permits.edges.forEach((p: PermitsEdge) => {
      if (!p.node?.bounds) {
        return;
      }
      var geojsonFeature: MultiPolygon = {
        type: "MultiPolygon",
        coordinates: JSON.parse(p.node.bounds.geojson).coordinates,
      };
      const polygon = Leaflet.geoJSON(geojsonFeature, {
        style: { fill: false },
      });
      polygon.addTo(map);
      if (p.node) {
        polygon.on("mouseover", (e: Leaflet.LeafletMouseEvent) => {
          if (p.node) {
            props.setPermitForModal({
              id: p.node.id,
              x: e.containerPoint.y,
              y: e.containerPoint.x,
              overMarker: true,
            });
          }
        });
        polygon.on("mouseout", (e: Leaflet.LeafletMouseEvent) => {
          if (p.node) {
            props.setPermitForModal({
              id: p.node.id,
              x: e.containerPoint.y,
              y: e.containerPoint.x,
              overMarker: false,
            });
          }
        });
      }
    });
  }, [data, map]);

  //zoom to active permit when set
  useEffect(() => {
    if (props.zoomTarget) {
      map.flyTo([props.zoomTarget.y, props.zoomTarget.x], 16, {
        duration: 0.6,
      });
    }
  }, [props.zoomTarget]);

  //refetch permit data on filter change
  useEffect(() => {
    if (!props.filterVars) {
      return;
    }
    getPermits({ variables: props.filterVars });
  }, [props.filterVars]);

  useEffect(() => {
    //get all locations
    if (data) {
      var locs: Location[] = [];
      data.permits.edges.forEach((p: PermitsEdge) => {
        if (p.node && p.node.location) {
          locs.push({
            id: p.node.id,
            x: p.node.location.x,
            y: p.node.location.y,
          });
        }
      });
      setLocations(locs);

      // setup heatmap
      if (heatLayer) {
        map.removeLayer(heatLayer);
      }
      var heatmap_data: HeatLayer.LatLngHeatTuple[] = [];
      locs.forEach((l) => {
        heatmap_data.push([l.y, l.x, 7]);
      });
      const heat = Leaflet.heatLayer(heatmap_data, { radius: 25 });
      if (overlay == Overlay.Heatmap) {
        heat.addTo(map);
      }
      setHeatLayer(heat);
    }
  }, [data]);

  //enable disable heatmap
  useEffect(() => {
    if (overlay == Overlay.Heatmap && heatLayer) {
      heatLayer.addTo(map);
    }
    if (overlay != Overlay.Heatmap && heatLayer) {
      map.removeLayer(heatLayer);
    }
  }, [overlay]);

  //enable disable markers
  useEffect(() => {
    if (!data) {
      return;
    }
    if (
      overlay == Overlay.GroupedMarkers ||
      overlay == Overlay.UngroupedMarkers
    ) {
      updateMarkers();
    } else {
      removeOldMarkers(map);
    }
  }, [overlay]);

  //resize map to show all markers
  useEffect(() => {
    if (data && map) {
      var bounds = data.permits.edges.map((p: PermitsEdge) => [
        p.node?.location?.y,
        p.node?.location?.x,
      ]);
      if (bounds.length > 0) {
        map.fitBounds(bounds);
      }
      updateMarkers();
    }
  }, [data]);

  function updateMarkers() {
    props.setZoomTarget(undefined);
    const zoom = map.getZoom();
    const lat = map.getCenter().lat;
    let markerLocations: MarkerObj[] = [];
    if (overlay == Overlay.GroupedMarkers) {
      markerLocations = computeMarkers(
        zoom,
        lat,
        locations,
        props.activePermit
      );
    } else if (overlay == Overlay.UngroupedMarkers) {
      markerLocations = individualMarkers(locations, props.activePermit);
    }

    removeOldMarkers(map);
    props.setPermitForModal(null);
    for (let m of markerLocations) {
      const marker = circleWithText(
        [m.y, m.x],
        String(m.ids.length),
        m.r,
        2,
        m.active
      );
      if (m.ids.length === 1) {
        marker.on("mouseover", (e: Leaflet.LeafletMouseEvent) => {
          props.setPermitForModal({
            id: m.ids[0],
            x: e.containerPoint.y,
            y: e.containerPoint.x,
            overMarker: true,
          });
        });
        marker.on("mouseout", (e: Leaflet.LeafletMouseEvent) => {
          props.setPermitForModal({
            id: m.ids[0],
            x: e.containerPoint.y,
            y: e.containerPoint.x,
            overMarker: false,
          });
        });
      }
      marker.addTo(map);
    }
    if (props.activePermit && props.activePermit.location) {
      var icon = Leaflet.divIcon({
        html: '<h1><span class="bi bi-star-fill active-marker"></span></h1>',
        className: "",
        iconSize: [32, 42],
      });
      var marker = Leaflet.marker(
        [props.activePermit.location.y, props.activePermit.location.x],
        {
          icon: icon,
        }
      );
      marker.on("mouseover", (e: LeafletMouseEvent) => {
        if (props.activePermit) {
          props.setPermitForModal({
            id: props.activePermit.id,
            x: e.containerPoint.y,
            y: e.containerPoint.x,
            overMarker: true,
          });
        }
      });
      marker.on("mouseout", (e: LeafletMouseEvent) => {
        if (props.activePermit) {
          props.setPermitForModal({
            id: props.activePermit.id,
            x: e.containerPoint.y,
            y: e.containerPoint.x,
            overMarker: false,
          });
        }
      });
      marker.addTo(map);
      marker.setZIndexOffset(99);
    }
  }

  return (
    <>
      <div id="map">
        <div id="map-controls" className="leaflet-bottom leaflet-right">
          <button
            className="btn btn-light"
            onClick={() => setOverlay(Overlay.GroupedMarkers)}
          >
            Grouped Markers
          </button>
          <button
            className="btn btn-light"
            onClick={() => setOverlay(Overlay.UngroupedMarkers)}
          >
            Invidual Markers
          </button>
          <button
            className="btn btn-light"
            onClick={(e) => {
              setOverlay(Overlay.Heatmap);
            }}
          >
            Heatmap
          </button>
        </div>
      </div>
    </>
  );
}

export default Map;
