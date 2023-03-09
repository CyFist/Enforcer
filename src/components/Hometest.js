import { Button } from "react-bootstrap";

export default function Home({ goToQuizPage }) {
  return (
    <div className="container">
      <div>
        <h1 className="mt-4 text-center">
          <span role="img" aria-label="icon">
            ⚡
          </span>
          Quizer
          <span role="img" aria-label="icon">
            ⚡
          </span>
        </h1>
      </div>
      <div className="text-center mt-4">
        <Button onClick={goToQuizPage}>Start Quiz</Button>
      </div>
    </div>
  );
}
