import { Button } from "react-bootstrap";

export default function Score({ goToQuizPage, goToHomePage, score }) {
  return (
    <div
      className="container d-flex flex-column align-items-center mt-5"
      style={{ height: "100px" }}
    >
      <h1>Score - {score}/5</h1>
      <Button onClick={goToQuizPage} className="mt-2">
        Restart
      </Button>
      <Button onClick={goToHomePage} className="mt-2">
        Home
      </Button>
    </div>
  );
}
