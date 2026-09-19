import { useEffect, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type ScrollVideoStatus = "loading" | "ready" | "error";

type ScrollVideoOptions = {
  containerRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
};

type NetworkInformation = {
  downlink?: number;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  saveData?: boolean;
};

type VideoDecision =
  | { mode: "poster" }
  | { mode: "video"; source: string | undefined };

function chooseVideoSource(video: HTMLVideoElement): VideoDecision {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  const narrowViewport = window.matchMedia("(max-width: 699px)").matches;
  const compactViewport = window.matchMedia("(max-width: 1199px)").matches;
  const effectiveType = connection?.effectiveType;
  const downlink = connection?.downlink;

  if (connection?.saveData || effectiveType === "slow-2g" || effectiveType === "2g") {
    return { mode: "poster" };
  }

  if (effectiveType === "3g" || (downlink !== undefined && downlink < 4) || narrowViewport) {
    return { mode: "video", source: video.dataset.srcLow };
  }

  return {
    mode: "video",
    source: compactViewport || (downlink !== undefined && downlink < 9) ? video.dataset.srcSd : video.dataset.srcHd,
  };
}

function visibilityAt(progress: number, start: number, end: number) {
  if (progress < start || progress > end) return 0;

  const fade = 0.035;
  const entering = start === 0 ? 1 : (progress - start) / fade;
  const leaving = end === 1 ? 1 : (end - progress) / fade;
  const value = Math.min(entering, leaving, 1);

  return value * value * (3 - 2 * value);
}

export function useScrollVideo({ containerRef, videoRef }: ScrollVideoOptions) {
  const [status, setStatus] = useState<ScrollVideoStatus>("loading");
  const [loadProgress, setLoadProgress] = useState(0);
  const [posterOnly, setPosterOnly] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(query.matches);
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    if (reducedMotion) {
      setPosterOnly(true);
      setStatus("ready");
      return;
    }

    const download = new AbortController();
    const playhead = { progress: 0 };
    let blobUrl: string | undefined;
    let frameId = 0;
    let tween: gsap.core.Tween | undefined;
    let disposed = false;
    let unlocked = false;
    let unlocking = false;

    const copies = Array.from(container.querySelectorAll<HTMLElement>("[data-story-copy]")).map(
      (element) => ({
        element,
        start: Number(element.dataset.start),
        end: Number(element.dataset.end),
        opacity: gsap.quickSetter(element, "opacity"),
        y: gsap.quickSetter(element, "y", "px"),
      }),
    );
    const markers = container.querySelectorAll<HTMLElement>("[data-progress-item]");

    const renderCopy = (progress: number) => {
      copies.forEach(({ element, start, end, opacity, y }) => {
        const visibility = visibilityAt(progress, start, end);
        opacity(visibility);
        y((1 - visibility) * 14);
        element.style.visibility = visibility > 0 ? "visible" : "hidden";
        element.setAttribute("aria-hidden", String(visibility === 0));
      });

      const activeChapter = progress < 0.35 ? 0 : progress < 0.69 ? 1 : 2;
      container.dataset.chapter = String(activeChapter);
      markers.forEach((marker, index) => {
        marker.dataset.active = String(index === activeChapter);
      });
      container.style.setProperty("--scroll-story-progress", `${progress * 100}%`);
    };

    const requestSeek = () => {
      if (disposed || frameId || !unlocked || video.error) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        if (video.seeking || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

        const lastFrame = Math.max(0, video.duration - 1 / 30);
        const target = Math.min(lastFrame, playhead.progress * video.duration);
        if (Math.abs(video.currentTime - target) >= 1 / 60) video.currentTime = target;
      });
    };

    const handleSeeked = () => {
      if (disposed || !Number.isFinite(video.duration) || video.duration <= 0) return;
      renderCopy(video.currentTime / video.duration);
      requestSeek();
    };

    const startScrub = () => {
      if (tween) return;
      renderCopy(0);
      tween = gsap.to(playhead, {
        progress: 1,
        ease: "none",
        onUpdate: () => {
          if (!unlocked) renderCopy(playhead.progress);
          requestSeek();
        },
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });
      ScrollTrigger.refresh();
    };

    const fail = () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
      tween = undefined;
      window.cancelAnimationFrame(frameId);
      frameId = 0;
      copies.forEach(({ element }) => {
        gsap.set(element, { clearProps: "opacity,visibility,transform" });
        element.removeAttribute("aria-hidden");
      });
      setStatus("error");
    };

    const loadingTimeout = window.setTimeout(() => {
      if (!unlocked) {
        download.abort();
        fail();
      }
    }, 120_000);

    const prepare = () => {
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      if (!unlocked) {
        unlock();
        return;
      }

      window.clearTimeout(loadingTimeout);
      setStatus("ready");
      startScrub();
      requestSeek();
    };

    const unlock = () => {
      if (disposed || unlocked || unlocking) return;
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;

      unlocking = true;
      video.muted = true;
      void video
        .play()
        .then(() => {
          video.pause();
          if (disposed) return;
          unlocked = true;
          unlocking = false;
          prepare();
        })
        .catch(() => {
          unlocking = false;
        });
    };

    setStatus("loading");
    setLoadProgress(0);
    setPosterOnly(false);
    video.addEventListener("loadeddata", prepare);
    video.addEventListener("canplay", prepare);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", fail);

    const gestureEvents = ["pointerdown", "touchstart", "keydown", "wheel"] as const;
    gestureEvents.forEach((event) => window.addEventListener(event, unlock, { passive: true }));
    startScrub();

    void (async () => {
      try {
        const decision = chooseVideoSource(video);
        if (decision.mode === "poster") {
          window.clearTimeout(loadingTimeout);
          setPosterOnly(true);
          setStatus("ready");
          return;
        }

        const source = decision.source;
        if (!source) throw new Error("No video source is available");

        const response = await fetch(source, { signal: download.signal });
        if (!response.ok) throw new Error("The story video could not be downloaded");

        const total = Number(response.headers.get("content-length"));
        const reader = response.body?.getReader();
        let blob: Blob;

        if (reader) {
          const parts: Uint8Array<ArrayBuffer>[] = [];
          let received = 0;
          let lastPercent = 0;

          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            parts.push(new Uint8Array(value));
            received += value.byteLength;

            const percent = total > 0 ? Math.min(99, Math.floor((received / total) * 100)) : 0;
            if (!disposed && percent !== lastPercent) {
              lastPercent = percent;
              setLoadProgress(percent);
            }
          }
          blob = new Blob(parts, { type: "video/mp4" });
        } else {
          blob = await response.blob();
        }

        if (disposed || download.signal.aborted) return;
        blobUrl = URL.createObjectURL(blob);
        video.src = blobUrl;
        video.load();
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) prepare();
      } catch {
        if (!disposed && !download.signal.aborted) fail();
      }
    })();

    return () => {
      disposed = true;
      window.clearTimeout(loadingTimeout);
      download.abort();
      window.cancelAnimationFrame(frameId);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      video.removeEventListener("loadeddata", prepare);
      video.removeEventListener("canplay", prepare);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("error", fail);
      gestureEvents.forEach((event) => window.removeEventListener(event, unlock));
      video.pause();
      video.removeAttribute("src");
      video.load();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [containerRef, reducedMotion, videoRef]);

  return { status, reducedMotion, loadProgress, posterOnly };
}
