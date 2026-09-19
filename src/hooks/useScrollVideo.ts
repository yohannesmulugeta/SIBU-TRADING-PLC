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
  const [status, setStatus] = useState<ScrollVideoStatus>("ready");
  const [posterOnly, setPosterOnly] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [preferenceReady, setPreferenceReady] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setReducedMotion(query.matches);
      setPreferenceReady(true);
    };
    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video || !preferenceReady) return;

    if (reducedMotion) {
      setPosterOnly(true);
      setVideoReady(false);
      setStatus("ready");
      return;
    }

    const playhead = { progress: 0 };
    let frameId = 0;
    let tween: gsap.core.Tween | undefined;
    let disposed = false;
    let unlocked = false;
    let unlocking = false;
    let loadingTimeout = 0;

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
      setVideoReady(false);
    };

    const prepare = () => {
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      if (!unlocked) {
        unlock();
        return;
      }

      window.clearTimeout(loadingTimeout);
      setVideoReady(true);
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

    setPosterOnly(false);
    setVideoReady(false);
    video.addEventListener("loadeddata", prepare);
    video.addEventListener("canplay", prepare);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("error", fail);

    const gestureEvents = ["pointerdown", "touchstart", "keydown", "wheel"] as const;
    gestureEvents.forEach((event) => window.addEventListener(event, unlock, { passive: true }));

    const decision = chooseVideoSource(video);
    const intentEvents = ["pointerdown", "touchstart", "keydown", "wheel", "scroll"] as const;
    let beginOnIntent = () => startScrub();
    let waitForIntent = true;

    if (decision.mode === "poster") {
      setPosterOnly(true);
      setVideoReady(false);
      setStatus("ready");
    } else if (decision.source) {
      let loadingStarted = false;
      beginOnIntent = () => {
        startScrub();
        if (loadingStarted || disposed) return;
        loadingStarted = true;
        setStatus("loading");
        loadingTimeout = window.setTimeout(() => {
          if (!unlocked) fail();
        }, 30_000);

        // Assign the media URL directly so the browser can stream byte ranges instead
        // of downloading the complete film into memory before the first frame appears.
        video.src = decision.source ?? "";
        video.load();
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) prepare();
      };
    } else {
      waitForIntent = false;
      fail();
    }

    if (waitForIntent) {
      intentEvents.forEach((event) => window.addEventListener(event, beginOnIntent, { passive: true, once: true }));
      if (window.scrollY > 0) beginOnIntent();
    }

    return () => {
      disposed = true;
      window.clearTimeout(loadingTimeout);
      window.cancelAnimationFrame(frameId);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      video.removeEventListener("loadeddata", prepare);
      video.removeEventListener("canplay", prepare);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("error", fail);
      gestureEvents.forEach((event) => window.removeEventListener(event, unlock));
      intentEvents.forEach((event) => window.removeEventListener(event, beginOnIntent));
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [containerRef, preferenceReady, reducedMotion, videoRef]);

  return { status, reducedMotion, loadProgress: 0, posterOnly, videoReady };
}
