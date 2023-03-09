import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="text-center mt-4">Home</div>
    </div>
  );
};

export default Home;
