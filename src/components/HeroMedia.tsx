import { useEffect, useState } from "react";

type Props = {
  poster: string;
  videoSrc: string;
};

export default function HeroMedia({ poster, videoSrc }: Props) {
  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

    setShowVideo(desktop.matches && !reducedMotion.matches && !connection?.saveData);
  }, []);

  return (
    <div className="hero-media" aria-hidden="true">
      <img src={poster} alt="" className="hero-media__poster" />
      {showVideo && (
        <video
          className={`hero-media__video ${videoReady ? "is-ready" : ""}`}
          src={videoSrc}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          poster={poster}
          onCanPlay={() => setVideoReady(true)}
        />
      )}
      <div className="hero-media__shade" />
    </div>
  );
}
