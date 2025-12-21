import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Operation = "+" | "-" | "*";
type BitMode = 4 | 8;

const BinaryCalculator = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [bitMode, setBitMode] = useState<BitMode>(4);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [operation, setOperation] = useState<Operation>("+");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Training mode
  const [trainingMode, setTrainingMode] = useState(false);
  const [trainingProblem, setTrainingProblem] = useState<{
    num1: string;
    num2: string;
    op: Operation;
    answer: string;
  } | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);

  const maxValue = bitMode === 4 ? 15 : 255;

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.querySelectorAll(".calc-element"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  const toBinary = (num: number, bits: number): string => {
    if (num < 0) {
      // Two's complement for negative numbers
      return ((1 << bits) + num).toString(2).padStart(bits, "0");
    }
    return num.toString(2).padStart(bits, "0");
  };

  const fromBinary = (binary: string): number => {
    return parseInt(binary, 2);
  };

  const isValidBinary = (str: string): boolean => {
    return /^[01]+$/.test(str) && str.length <= bitMode;
  };

  const calculate = useCallback(() => {
    setError(null);
    setResult(null);

    if (!input1 || !input2) {
      setError("Please enter both binary numbers");
      return;
    }

    if (!isValidBinary(input1) || !isValidBinary(input2)) {
      setError(`Invalid binary. Use only 0s and 1s (max ${bitMode} bits)`);
      return;
    }

    const num1 = fromBinary(input1);
    const num2 = fromBinary(input2);
    let res: number;

    switch (operation) {
      case "+":
        res = num1 + num2;
        break;
      case "-":
        res = num1 - num2;
        break;
      case "*":
        res = num1 * num2;
        break;
      default:
        res = 0;
    }

    // Handle overflow
    if (res > maxValue) {
      setError(`Overflow! Result exceeds ${bitMode}-bit maximum (${maxValue})`);
      setResult(toBinary(res & maxValue, bitMode) + " (truncated)");
    } else if (res < 0) {
      setResult(toBinary(res, bitMode) + " (two's complement)");
    } else {
      setResult(toBinary(res, bitMode));
    }
  }, [input1, input2, operation, bitMode, maxValue]);

  const generateTrainingProblem = useCallback(() => {
    const max = bitMode === 4 ? 7 : 127; // Keep values smaller for easier calculation
    const num1 = Math.floor(Math.random() * max);
    const num2 = Math.floor(Math.random() * max);
    const ops: Operation[] = ["+", "-", "*"];
    const op = ops[Math.floor(Math.random() * ops.length)];

    let answer: number;
    switch (op) {
      case "+":
        answer = num1 + num2;
        break;
      case "-":
        answer = num1 - num2;
        break;
      case "*":
        answer = num1 * num2;
        break;
      default:
        answer = 0;
    }

    setTrainingProblem({
      num1: toBinary(num1, bitMode),
      num2: toBinary(num2, bitMode),
      op,
      answer: answer < 0 ? toBinary(answer, bitMode) : toBinary(Math.abs(answer) & maxValue, bitMode),
    });
    setUserAnswer("");
    setFeedback(null);
  }, [bitMode, maxValue]);

  const checkAnswer = useCallback(() => {
    if (!trainingProblem || !userAnswer) return;

    // Normalize answers for comparison
    const normalized = userAnswer.replace(/^0+/, "") || "0";
    const correctNormalized = trainingProblem.answer.replace(/^0+/, "") || "0";

    if (normalized === correctNormalized) {
      setFeedback({
        correct: true,
        message: "Correct! Well done!",
      });
    } else {
      const num1 = fromBinary(trainingProblem.num1);
      const num2 = fromBinary(trainingProblem.num2);
      let expected: number;

      switch (trainingProblem.op) {
        case "+":
          expected = num1 + num2;
          break;
        case "-":
          expected = num1 - num2;
          break;
        case "*":
          expected = num1 * num2;
          break;
        default:
          expected = 0;
      }

      setFeedback({
        correct: false,
        message: `Incorrect. ${num1} (${trainingProblem.num1}) ${trainingProblem.op} ${num2} (${trainingProblem.num2}) = ${expected} (${trainingProblem.answer})`,
      });
    }
  }, [trainingProblem, userAnswer]);

  return (
    <section
      id="calculator"
      ref={sectionRef}
      className="relative py-32 bg-card/20"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 calc-element">
          <span className="inline-block px-4 py-2 text-xs font-mono font-semibold tracking-widest text-secondary border border-secondary/30 rounded-full uppercase mb-6">
            Practice Tool
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Binary</span>{" "}
            <span className="text-secondary neon-text-green">Calculator</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Practice binary arithmetic with our interactive calculator and training mode.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Mode toggle */}
          <div className="flex justify-center gap-4 mb-8 calc-element">
            <button
              onClick={() => setTrainingMode(false)}
              className={`px-6 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
                !trainingMode
                  ? "bg-primary text-primary-foreground neon-glow"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Calculator
            </button>
            <button
              onClick={() => {
                setTrainingMode(true);
                generateTrainingProblem();
              }}
              className={`px-6 py-2 rounded-lg font-mono text-sm transition-all duration-300 ${
                trainingMode
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              style={trainingMode ? { boxShadow: "var(--glow-green)" } : {}}
            >
              Training Mode
            </button>
          </div>

          {/* Bit mode selector */}
          <div className="flex justify-center gap-4 mb-8 calc-element">
            <button
              onClick={() => setBitMode(4)}
              className={`px-4 py-1 rounded font-mono text-xs transition-all ${
                bitMode === 4
                  ? "bg-accent/20 text-accent border border-accent/50"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              4-bit
            </button>
            <button
              onClick={() => setBitMode(8)}
              className={`px-4 py-1 rounded font-mono text-xs transition-all ${
                bitMode === 8
                  ? "bg-accent/20 text-accent border border-accent/50"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              8-bit
            </button>
          </div>

          {!trainingMode ? (
            /* Calculator Mode */
            <div className="glass-panel rounded-xl p-6 space-y-6 calc-element">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-2">
                    Binary A
                  </label>
                  <input
                    type="text"
                    value={input1}
                    onChange={(e) => setInput1(e.target.value.replace(/[^01]/g, "").slice(0, bitMode))}
                    placeholder={"0".repeat(bitMode)}
                    className="w-full bg-muted border border-border rounded-lg px-4 py-3 font-mono text-lg text-center text-foreground focus:outline-none focus:border-primary transition-colors"
                    maxLength={bitMode}
                  />
                  <span className="block text-xs font-mono text-muted-foreground mt-1 text-center">
                    = {input1 ? fromBinary(input1) : 0}
                  </span>
                </div>

                <select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value as Operation)}
                  className="bg-muted border border-border rounded-lg px-4 py-3 font-mono text-2xl text-primary focus:outline-none focus:border-primary"
                >
                  <option value="+">+</option>
                  <option value="-">−</option>
                  <option value="*">×</option>
                </select>

                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-2">
                    Binary B
                  </label>
                  <input
                    type="text"
                    value={input2}
                    onChange={(e) => setInput2(e.target.value.replace(/[^01]/g, "").slice(0, bitMode))}
                    placeholder={"0".repeat(bitMode)}
                    className="w-full bg-muted border border-border rounded-lg px-4 py-3 font-mono text-lg text-center text-foreground focus:outline-none focus:border-primary transition-colors"
                    maxLength={bitMode}
                  />
                  <span className="block text-xs font-mono text-muted-foreground mt-1 text-center">
                    = {input2 ? fromBinary(input2) : 0}
                  </span>
                </div>
              </div>

              <button
                onClick={calculate}
                className="w-full btn-neon py-4 text-lg"
              >
                Calculate
              </button>

              {error && (
                <div className="p-4 rounded-lg bg-destructive/20 border border-destructive/50 text-destructive text-center font-mono text-sm">
                  {error}
                </div>
              )}

              {result && (
                <div className="p-6 rounded-lg bg-primary/10 border border-primary/30 text-center">
                  <span className="block text-xs font-mono text-muted-foreground mb-2">
                    Result
                  </span>
                  <span className="font-mono text-3xl text-primary neon-text">
                    {result}
                  </span>
                  <span className="block text-sm font-mono text-muted-foreground mt-2">
                    = {fromBinary(result.split(" ")[0])} (decimal)
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Training Mode */
            <div className="glass-panel rounded-xl p-6 space-y-6 calc-element">
              {trainingProblem && (
                <>
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <span className="block text-xs font-mono text-muted-foreground mb-4">
                      Solve this problem:
                    </span>
                    <div className="flex items-center justify-center gap-4 font-mono text-2xl">
                      <span className="text-primary">{trainingProblem.num1}</span>
                      <span className="text-accent">{trainingProblem.op}</span>
                      <span className="text-secondary">{trainingProblem.num2}</span>
                      <span className="text-muted-foreground">=</span>
                      <span className="text-foreground">?</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 font-mono text-sm text-muted-foreground mt-2">
                      <span>({fromBinary(trainingProblem.num1)})</span>
                      <span>{trainingProblem.op}</span>
                      <span>({fromBinary(trainingProblem.num2)})</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-2">
                      Your Answer (binary)
                    </label>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) =>
                        setUserAnswer(e.target.value.replace(/[^01]/g, "").slice(0, bitMode * 2))
                      }
                      placeholder="Enter binary result"
                      className="w-full bg-muted border border-border rounded-lg px-4 py-3 font-mono text-xl text-center text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button onClick={checkAnswer} className="flex-1 btn-neon py-3">
                      Check Answer
                    </button>
                    <button
                      onClick={generateTrainingProblem}
                      className="flex-1 btn-neon btn-neon-green py-3"
                    >
                      New Problem
                    </button>
                  </div>

                  {feedback && (
                    <div
                      className={`p-4 rounded-lg text-center font-mono ${
                        feedback.correct
                          ? "bg-secondary/20 border border-secondary/50 text-secondary"
                          : "bg-destructive/20 border border-destructive/50 text-destructive"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">
                        {feedback.correct ? "✓" : "✗"}
                      </span>
                      {feedback.message}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BinaryCalculator;
