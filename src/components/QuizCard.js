import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import _ from "lodash";

export default function QuizCard({
  CurrQns,
  Selected,
  setSelected,
  ans,
  setAns,
  options,
  setOptions
}) {
  const handleChange = (event, options) => {
    if (!_.isArray(options)) {
      setSelected([options]);
    } else {
      setSelected(options);
    }
  };

  const optionBtn = _.map(options, (value, key) => {
    return (
      <ToggleButton key={key} value={key} aria-label={key}>
        {value}
      </ToggleButton>
    );
  });

  return (
    <>
      <div>{CurrQns.Question}</div>
      <ToggleButtonGroup
        orientation="vertical"
        value={Selected}
        exclusive={ans.length === 1 ? true : false}
        onChange={handleChange}
      >
        {optionBtn}
      </ToggleButtonGroup>
    </>
  );
}
