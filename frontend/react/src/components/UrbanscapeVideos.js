import { useEffect, useRef } from "react";

const video_suffixes = [
  "_Depth_BLD",
  "_Weighted_Depth",
  "_Depth_PNG",
  "_Mask_BLD_BLUE",
  "_Overlay_BLD",
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
    videoRef.current.currentTime = props.masterVideoRef.current.currentTime;
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
			videoRef.current.currentTime = props.masterVideoRef.current.currentTime;
      videoRef.current.play();
    }
    const masterVid = props.masterVideoRef.current;

    videoRef.current.currentTime = masterVid.currentTime;
    masterVid.addEventListener("play", onPlay);
    masterVid.addEventListener("pause", onPause);
    masterVid.addEventListener("seeking", onSeek);
    masterVid.addEventListener("seeked", onSeek);

    return () => {
      // //release video memory
      // videoRef.current.pause();
      // videoRef.current.src = "";
      // videoRef.current.load();

      // Remove event listeners
      masterVid.removeEventListener("play", onPlay);
      masterVid.removeEventListener("pause", onPause);
      masterVid.removeEventListener("seeking", onSeek);
      masterVid.removeEventListener("seeked", onSeek);
    };
  }, [videoRef]);

  return (
    <video ref={videoRef} width="440" loop muted controls>
      <source
        src={prefix + props.id + props.suffix + ".mp4"}
        type="video/mp4"
      />
    </video>
  );
}

export default UrbanscapeVideos;
