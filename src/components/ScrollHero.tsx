import { useRef } from "react";
import { heroStoryChapters, heroStoryIntro } from "../data/heroStory";
import { useScrollVideo } from "../hooks/useScrollVideo";

type Props = {
  poster: string;
  lowVideoSrc: string;
  sdVideoSrc: string;
  hdVideoSrc: string;
};

export default function ScrollHero({ poster, lowVideoSrc, sdVideoSrc, hdVideoSrc }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { status, reducedMotion, loadProgress, posterOnly } = useScrollVideo({ containerRef, videoRef });
  const staticStory = status === "error" || reducedMotion;

  return (
    <section
      ref={containerRef}
      className={`scroll-story${staticStory ? " scroll-story--static" : ""}`}
      aria-label="Three generations of Sibu coffee heritage"
      data-chapter="0"
      data-media-mode={posterOnly ? "poster" : "video"}
    >
      <div className="scroll-story__viewport">
        <div className={`scroll-story__media${status === "ready" ? " is-ready" : ""}`}>
          <img className="scroll-story__poster" src={poster} alt="" aria-hidden="true" />
          <video
            ref={videoRef}
            className="scroll-story__video"
            data-src-low={lowVideoSrc}
            data-src-sd={sdVideoSrc}
            data-src-hd={hdVideoSrc}
            poster={poster}
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="scroll-story__shade" />
          <div className="scroll-story__vignette" />
        </div>

        {status === "loading" && !reducedMotion && (
          <div className="scroll-story__loading" role="status">
            Loading the story{loadProgress > 0 ? ` · ${loadProgress}%` : "…"}
          </div>
        )}

        <div className="scroll-story__copy-layer">
          {status === "error" && (
            <p className="scroll-story__notice" role="status">
              The film is unavailable. The Sibu story continues below.
            </p>
          )}

          <article
            className="scroll-story__copy scroll-story__copy--intro"
            data-story-copy
            data-start={heroStoryIntro.range[0]}
            data-end={heroStoryIntro.range[1]}
          >
            <p className="scroll-story__eyebrow">{heroStoryIntro.eyebrow}</p>
            <h1>
              {heroStoryIntro.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className="scroll-story__description">{heroStoryIntro.description}</p>
            <div className="scroll-story__cue" aria-hidden="true">
              <span>Scroll to follow the journey</span>
              <i />
            </div>
          </article>

          {heroStoryChapters.map((chapter) => (
            <article
              key={chapter.number}
              className={`scroll-story__copy scroll-story__copy--chapter scroll-story__copy--${chapter.position}`}
              data-story-copy
              data-start={chapter.range[0]}
              data-end={chapter.range[1]}
            >
              <p className="scroll-story__chapter-label">
                <span>{chapter.number}</span>
                <i aria-hidden="true" />
                {chapter.eyebrow}
              </p>
              <h2>{chapter.title}</h2>
              <p className="scroll-story__description">{chapter.description}</p>
              {chapter.number === "03" && (
                <p className="scroll-story__coda">Rooted in Guji. Looking forward.</p>
              )}
            </article>
          ))}
        </div>

        <aside className="scroll-story__progress" aria-hidden="true">
          <span className="scroll-story__progress-track">
            <i />
          </span>
          <ol>
            {heroStoryChapters.map((chapter, index) => (
              <li key={chapter.number} data-progress-item data-active={index === 0}>
                {chapter.number}
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}
