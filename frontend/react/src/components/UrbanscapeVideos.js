import { useEffect, useRef } from "react";

const video_suffixes = [
  "_Depth_PNG",
  "_Weighted_Depth",
  "_Depth_BLD",
  "_Overlay_BLD",
  "_Mask_BLD",
];
const prefix = "/data/urbanscape_videos/";

function UrbanscapeVideos(props) {
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

function UrbanscapeVideo(props) {
  const videoRef = useRef(null);

  function isPlaying(vid) {
    return !!(
      vid.currentTime > 0 &&
      !vid.paused &&
      !vid.ended &&
      vid.readyState > 2
    );
  }

  function onPlay() {
    videoRef.current.play();
  }
  function onPause() {
    videoRef.current.pause();
  }
  function onSeek() {
    if (videoRef.current) {
      videoRef.current.currentTime = props.masterVideoRef.current.currentTime;
    }
  }

  useEffect(() => {
    if (!props.masterVideoRef.current || !videoRef.current) {
      return;
    }
    if (isPlaying(props.masterVideoRef.current)) {
      videoRef.current.play();
    }
    videoRef.current.currentTime = props.masterVideoRef.current.currentTime;
    props.masterVideoRef.current.addEventListener("play", onPlay);
    props.masterVideoRef.current.addEventListener("pause", onPause);
    props.masterVideoRef.current.addEventListener("seeking", onSeek);
    props.masterVideoRef.current.addEventListener("seeked", onSeek);

    return () => {
      // //release video memory
      // videoRef.current.pause();
      // videoRef.current.src = "";
      // videoRef.current.load();

      // Remove event listeners
      props.masterVideoRef.current.removeEventListener("play", onPlay);
      props.masterVideoRef.current.removeEventListener("pause", onPause);
      props.masterVideoRef.current.removeEventListener("seeking", onSeek);
      props.masterVideoRef.current.removeEventListener("seeked", onSeek);
    };
  }, [videoRef]);

  return (
    <video ref={videoRef} width="540" loop muted controls>
      <source
        src={prefix + props.id + props.suffix + ".mp4"}
        type="video/mp4"
      />
    </video>
  );
}

export default UrbanscapeVideos;
