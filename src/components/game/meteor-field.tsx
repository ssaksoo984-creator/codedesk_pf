interface MeteorPreset {
  leftStart: string;
  topStart: string;
  leftEnd: string;
  topEnd: string;
  size: number;
  delay: number;
  duration: number;
}

const PRESETS: MeteorPreset[] = [
  { leftStart: "85%", topStart: "-18%", leftEnd: "60%", topEnd: "56%", size: 9, delay: 0, duration: 650 },
  { leftStart: "58%", topStart: "-24%", leftEnd: "20%", topEnd: "48%", size: 7, delay: 90, duration: 720 },
  { leftStart: "30%", topStart: "-16%", leftEnd: "76%", topEnd: "64%", size: 11, delay: 160, duration: 680 },
  { leftStart: "96%", topStart: "-26%", leftEnd: "46%", topEnd: "40%", size: 6, delay: 60, duration: 610 },
];

/** A small shower instead of a single meteor — `count` picks the first N
 * presets so smaller cells (the code panel) can show fewer than the city
 * panel without the two fields looking identical. */
export function MeteorField({ count = PRESETS.length }: { count?: number }) {
  return (
    <>
      {PRESETS.slice(0, count).map((m, i) => (
        <div
          key={i}
          className="teaser-meteor"
          style={
            {
              "--m-left-start": m.leftStart,
              "--m-top-start": m.topStart,
              "--m-left-end": m.leftEnd,
              "--m-top-end": m.topEnd,
              "--m-size": `${m.size}px`,
              animationDelay: `${m.delay}ms`,
              animationDuration: `${m.duration}ms`,
            } as React.CSSProperties
          }
          aria-hidden
        />
      ))}
    </>
  );
}
