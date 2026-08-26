type CurrentLetterProps = {
  letter: string;
};

export default function CurrentLetter({
  letter,
}: CurrentLetterProps) {
  return (
    <div className="current-letter-container">
      <div className="keycap-wrapper">
        <div key={letter} className="keycap-3d animate-pop">
          <span className="keycap-letter">{letter}</span>
          <span className="keycap-glow"></span>
        </div>
      </div>
      <div className="keyboard-prompt">
        <span className="kbd-badge">PRESS KEY</span>
        <span className="kbd-hint">Type <kbd>{letter}</kbd> on your keyboard</span>
      </div>
    </div>
  );
}
