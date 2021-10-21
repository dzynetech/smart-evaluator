import { useEffect, useRef } from "react";
import UrbanscapeVideo from "./UrbanscapeVideo";

const video_suffixes = [
  "_Depth_BLD",
  "_Weighted_Depth",
  "_Depth_PNG",
  "_Mask_BLD_BLUE",
  "_Overlay_BLD",
];

interface Props {
  id: number;
  masterVideoRef: React.MutableRefObject<null>;
}

function UrbanscapeVideos(props: Props) {
  return (
    <div className="video-container">
      {video_suffixes.map((suffix) => (
        <div key={suffix}>
          <UrbanscapeVideo
            id={props.id}
            masterVideoRef={props.masterVideoRef}
            suffix={suffix}
          />
        </div>
      ))}
    </div>
  );
}

export default UrbanscapeVideos;
