import React from "react";
import { useState, useEffect } from "react";
import Stepper from "../components/Stepper";
import QuizCard from "../components/QuizCard";
import Button from "@mui/material/Button";
import _ from "lodash";

function shuffleObject(obj) {
  // new obj to return
  let newObj = {};
  // create keys array
  var keys = Object.keys(obj);
  // randomize keys array
  keys.sort(function (a, b) {
    return Math.random() - 0.5;
  });
  // save in new array
  keys.forEach(function (k) {
    newObj[k] = obj[k];
  });
  return newObj;
}

// Get Question Bank from Local Storage
const Allqns = localStorage.getItem("QnsBank");
const AllqnsObj = JSON.parse(Allqns);
const SelectedQns = _.sampleSize(AllqnsObj, 15);

const Quiz = () => {
  const [Selected, setSelected] = useState([]);
  const [RemainingQns, setRemainingQns] = useState([]);
  const [QuizQns, setQuizQns] = useState([]);
  const [CurrQns, setCurrQns] = useState([]);
  const [options, setOptions] = useState([]);
  const [ans, setAns] = useState([]);

  useEffect(() => {
    setQuizQns(_.shuffle(SelectedQns));
    setRemainingQns(SelectedQns);
    setCurrQns(SelectedQns[0]);
    //Randomly Select 15 Questions from Bank
  }, []);

  useEffect(() => {
    //Get Options from QnsObj & Remove Empty Options
    const Opts = _.pickBy(
      CurrQns,
      (value, key) => key.startsWith("Option") && !_.isEmpty(value)
    );
    const shuffleOpts = shuffleObject(Opts);
    setOptions(shuffleOpts);

    //Get Answer from QnsObj
    setAns(_.split(CurrQns.Answer, ","));
  }, [CurrQns]);

  const handleOnSubmit = (evt) => {
    if (_.isEmpty(Selected)) {
      console.log("nothing selected");
    } else {
      if (_.isEqual(Selected, ans)) {
        RemainingQns.shift();
      }
      const Reshuffle = _.shuffle(RemainingQns);
      setRemainingQns(Reshuffle);
      setCurrQns(Reshuffle[0]);
      setSelected([]);
    }
  };

  return (
    <div className="App">
      <Stepper QuizQns={QuizQns} RemainingQns={RemainingQns} />
      <div>
        <QuizCard
          CurrQns={CurrQns}
          Selected={Selected}
          setSelected={setSelected}
          ans={ans}
          setAns={setAns}
          options={options}
          setOptions={setOptions}
        />
      </div>
      <Button
        disabled={false}
        size="small"
        variant="outlined"
        onClick={handleOnSubmit}
      >
        SUBMIT
      </Button>
    </div>
  );
};

export default Quiz;
