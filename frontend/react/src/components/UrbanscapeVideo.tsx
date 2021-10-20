import { useRef, useEffect } from "react";

const prefix = "/data/urbanscape_videos/";
interface Props {
  id: number;
  masterVideoRef: React.MutableRefObject<null | HTMLVideoElement>;
  suffix: string;
}

function UrbanscapeVideo(props: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  function isPlaying(vid: HTMLVideoElement) {
    return !!(
      vid.currentTime > 0 &&
      !vid.paused &&
      !vid.ended &&
      vid.readyState > 2
    );
  }

  function onPlay() {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }
  function onPause() {
    if (videoRef.current) {
      videoRef.current.pause();
      if (props.masterVideoRef.current) {
        videoRef.current.currentTime = props.masterVideoRef.current.currentTime;
      }
    }
  }
  function onSeek() {
    if (videoRef.current && props.masterVideoRef.current) {
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

export default UrbanscapeVideo;
