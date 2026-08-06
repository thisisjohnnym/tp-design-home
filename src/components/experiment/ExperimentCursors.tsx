import {
  experimentCursorRoster,
  experimentCursorSlots,
} from "./content";

function CursorArrow() {
  return (
    <svg
      className="experiment-cursor__svg"
      width="26"
      height="28"
      viewBox="0 0 26 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 2.5 L3 22 L8.4 16.6 L12 24.8 L15.6 23.2 L12 15 L19.6 15 Z"
        fill="currentColor"
        stroke="var(--experiment-light)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExperimentCursors() {
  const initialGroup = experimentCursorRoster.slice(0, 4);

  return (
    <div className="experiment-cursors" aria-hidden="true">
      {initialGroup.map((person, index) => (
        <div
          className="experiment-cursor"
          data-person={person.id}
          data-slot={experimentCursorSlots[index]}
          data-text={person.text}
          key={index}
        >
          <span className="experiment-cursor__body">
            <span className="experiment-cursor__arrow">
              <CursorArrow />
            </span>
            <span className="experiment-cursor__label">{person.name}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
