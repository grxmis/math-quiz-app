import React, { useState, useEffect } from "react";

const generateQuestion = (level, mode, tableNumber) => {
  const max = level === "easy" ? 10 : level === "medium" ? 20 : 50;
  let a = Math.floor(Math.random() * max) + 1;
  let b = Math.floor(Math.random() * max) + 1;
  let question = "";
  let correctAnswer = 0;

  if (mode === "mix") {
    const isMultiplication = Math.random() < 0.5;
    question = isMultiplication ? `${a} × ${b}` : `${a * b} ÷ ${a}`;
    correctAnswer = isMultiplication ? a * b : b;
  } else if (mode === "add") {
    const isAddition = Math.random() < 0.5;
    question = isAddition ? `${a} + ${b}` : `${a + b} - ${a}`;
    correctAnswer = isAddition ? a + b : b;
  } else if (mode === "table") {
    a = tableNumber;
    b = Math.floor(Math.random() * 10) + 1;
    question = `${a} × ${b}`;
    correctAnswer = a * b;
  }

  const options = [correctAnswer];
  while (options.length < 4) {
    const delta = Math.floor(Math.random() * 5) + 1;
    let fakeAnswer = Math.random() < 0.5
      ? correctAnswer + delta
      : correctAnswer - delta;
    if (fakeAnswer > 0 && !options.includes(fakeAnswer)) {
      options.push(fakeAnswer);
    }
  }

  return {
    question,
    correctAnswer,
    options: options.sort(() => Math.random() - 0.5),
  };
};

export default function MathQuiz() {
  const [difficulty, setDifficulty] = useState(null);
  const [mode, setMode] = useState(null);
  const [tableNumber, setTableNumber] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showClap, setShowClap] = useState(false);
  const [showWrong, setShowWrong] = useState(false);

  useEffect(() => {
    if (difficulty && mode && (mode !== "table" || tableNumber)) {
      setQuestionData(generateQuestion(difficulty, mode, tableNumber));
    }
  }, [difficulty, mode, tableNumber]);

  const handleAnswer = (answer) => {
    const isCorrect = answer === questionData.correctAnswer;
    setSelectedAnswer(answer);
    setTotalCount(prev => prev + 1);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setCorrectCount(prev => prev + 1);
      setFeedback("✅ Σωστά!");
      setShowClap(true);
    } else {
      setFeedback(`❌ Λάθος. Η σωστή απάντηση είναι ${questionData.correctAnswer}`);
      setShowWrong(true);
    }

    const delay = isCorrect ? 2000 : 3000;
    setTimeout(() => {
      setQuestionData(generateQuestion(difficulty, mode, tableNumber));
      setFeedback("");
      setSelectedAnswer(null);
      setShowClap(false);
      setShowWrong(false);
    }, delay);
  };

  const restartQuiz = () => {
    setDifficulty(null);
    setMode(null);
    setTableNumber(null);
    setQuestionData(null);
    setSelectedAnswer(null);
    setFeedback("");
    setScore(0);
    setCorrectCount(0);
    setTotalCount(0);
    setShowClap(false);
    setShowWrong(false);
  };

  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  if (!difficulty) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold">Διάλεξε επίπεδο δυσκολίας</h2>
        <button onClick={() => setDifficulty("easy")}>🟢 Εύκολο</button>
        <button onClick={() => setDifficulty("medium")}>🟡 Μέτριο</button>
        <button onClick={() => setDifficulty("hard")}>🔴 Δύσκολο</button>
      </div>
    );
  }

  if (!mode) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold">Διάλεξε είδος ασκήσεων</h2>
        <button onClick={() => setMode("mix")}>✖️➗ Πολλαπλασιασμοί / Διαιρέσεις</button>
        <button onClick={() => setMode("add")}>➕➖ Προσθαφαιρέσεις</button>
        <button onClick={() => setMode("table")}>🧠 Προπαίδεια</button>
      </div>
    );
  }

  if (mode === "table" && !tableNumber) {
    return (
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">Διάλεξε προπαίδεια</h2>
        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
          <button key={n} onClick={() => setTableNumber(n)} className="m-1">
            Προπαίδεια του {n}
          </button>
        ))}
      </div>
    );
  }

  if (!questionData) {
    return <p className="text-center">Φόρτωση ερώτησης...</p>;
  }

  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold">Μαθηματικό Quiz</h1>
      <p className="text-lg">Ερώτηση: {questionData.question}</p>
      <div className="grid grid-cols-2 gap-2 justify-center">
        {questionData.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt)}
            disabled={!!selectedAnswer}
            className={`py-2 px-4 rounded-lg border ${
              selectedAnswer !== null
                ? opt === questionData.correctAnswer
                  ? "bg-green-500 text-white"
                  : selectedAnswer === opt
                  ? "bg-red-500 text-white"
                  : "bg-gray-200"
                : "bg-blue-500 text-white"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <p className="text-lg">{feedback}</p>
      {showClap && <img src="/images/clap.gif" alt="Σωστά!" className="mx-auto w-24" />}
      {showWrong && <img src="/images/wrong.gif" alt="Λάθος" className="mx-auto w-24" />}
      <p>Βαθμολογία: {score}</p>
      <p>Ποσοστό επιτυχίας: {percentage}%</p>
      <button onClick={restartQuiz} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">🔁 Επανεκκίνηση</button>
    </div>
  );
}
