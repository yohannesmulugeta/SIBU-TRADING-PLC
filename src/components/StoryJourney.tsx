import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Generation = {
  number: string;
  name: string;
  era: string;
  description: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
};

type Props = {
  generations: readonly Generation[];
};

const mobileJourneyQuery = "(max-width: 700px)";

export default function StoryJourney({ generations }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const [isMobileJourney, setIsMobileJourney] = useState(false);
  const [activeGeneration, setActiveGeneration] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia(mobileJourneyQuery);
    const updateLayout = () => setIsMobileJourney(mediaQuery.matches);

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  useEffect(() => {
    if (!root.current || isMobileJourney || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-generation]").forEach((panel) => {
        gsap.fromTo(
          panel,
          { opacity: 0.35, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 78%",
              end: "top 42%",
              scrub: 0.5,
            },
          },
        );
      });
    }, root);

    return () => context.revert();
  }, [isMobileJourney]);

  useEffect(() => {
    if (!isMobileJourney || !root.current) return;

    const rail = root.current;
    let frame = 0;

    const updateActiveGeneration = () => {
      const railCenter = rail.scrollLeft + rail.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - railCenter);
        if (distance < nearestDistance) {
          nearestIndex = index;
          nearestDistance = distance;
        }
      });

      setActiveGeneration((current) => (current === nearestIndex ? current : nearestIndex));
    };

    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveGeneration);
    };

    updateActiveGeneration();
    rail.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isMobileJourney]);

  const moveToGeneration = (nextIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(generations.length - 1, nextIndex));
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    cardRefs.current[boundedIndex]?.scrollIntoView({ behavior, block: "nearest", inline: "start" });
    setActiveGeneration(boundedIndex);
  };

  const handleRailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isMobileJourney) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveToGeneration(activeGeneration + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveToGeneration(activeGeneration - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveToGeneration(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveToGeneration(generations.length - 1);
    }
  };

  return (
    <div className="generation-journey-wrap">
      {isMobileJourney ? (
        <p className="generation-journey__cue" aria-live="polite">
          <span>Swipe left to explore</span>
          <strong>{`${String(activeGeneration + 1).padStart(2, "0")} / ${String(generations.length).padStart(2, "0")}`}</strong>
        </p>
      ) : null}
      <div
        ref={root}
        className="generation-journey"
        role="region"
        aria-label="Sibu's generational journey chapters"
        aria-describedby={isMobileJourney ? "generation-journey-instructions" : undefined}
        tabIndex={isMobileJourney ? 0 : undefined}
        onKeyDown={handleRailKeyDown}
      >
        {isMobileJourney ? <span id="generation-journey-instructions" className="sr-only">Use the left and right arrow keys to browse the journey chapters.</span> : null}
        {generations.map((generation, index) => (
          <article
            key={generation.number}
            data-generation
            className="generation-card"
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
          >
            <span className="generation-card__number">{generation.number}</span>
            <figure className="generation-card__portrait">
              <img
                src={generation.image}
                alt={generation.imageAlt}
                width={generation.imageWidth}
                height={generation.imageHeight}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="generation-card__content">
              <p className="generation-card__era">{generation.era}</p>
              <h3>{generation.name}</h3>
              <p>{generation.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
