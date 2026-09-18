import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Generation = {
  number: string;
  name: string;
  era: string;
  description: string;
};

type Props = {
  generations: readonly Generation[];
};

export default function StoryJourney({ generations }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
  }, []);

  return (
    <div ref={root} className="generation-journey">
      {generations.map((generation) => (
        <article key={generation.number} data-generation className="generation-card">
          <span className="generation-card__number">{generation.number}</span>
          <div>
            <p className="generation-card__era">{generation.era}</p>
            <h3>{generation.name}</h3>
            <p>{generation.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
