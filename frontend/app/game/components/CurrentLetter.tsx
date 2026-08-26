type CurrentLetterProps = {
  letter: string;
};

export default function CurrentLetter({
  letter,
}: CurrentLetterProps) {
  return (
    <div>
      <h2>Current Letter</h2>

      <div>
        {letter}
      </div>
    </div>
  );
}
