type TypingTextProps = {
  targetText: string;
  typedText: string;
};

export function TypingText({
  targetText,
  typedText,
}: TypingTextProps) {
  return (
    <p>
      {targetText.split("").map((character, index) => {
        const typedCharacter = typedText[index];

        let className = "";

        if (typedCharacter !== undefined) {
          className =
            typedCharacter === character ? "correct" : "incorrect";
        }

        return (
          <span key={index} className={className}>
            {character}
          </span>
        );
      })}
    </p>
  );
}
