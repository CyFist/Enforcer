import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import { restdb } from "../utils/api_client";
import {
  alpha,
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  Backdrop,
  Typography,
  TextField,
  Grid,
  Button
} from "@mui/material/";
import Modal from "@mui/material/Modal";
import { teal, pink, grey } from "@mui/material/colors";
import {
  isEqual,
  forIn,
  update,
  find,
  findIndex,
  compact,
  orderBy
} from "lodash";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import boldfaces from "../utils/boldfaces.json";
import dayjs from "dayjs";

export default function Boldface({ UserObj, setUserObj, Data, setData }) {
  const defaultValues = {};

  const [Questions, setQuestions] = useState(boldfaces);
  const [randomNumber, setRandomNumber] = useState(
    Math.floor(Math.random() * Questions.length)
  );
  const [formValues, setFormValues] = useState(defaultValues);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [Openpop, setOpenpop] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [Counter, setCounter] = useState(0);
  const timer = useRef();
  const myRefs = useRef([]);
  const navigate = useNavigate();

  const { control, handleSubmit, reset } = useForm({
    reValidateMode: "onBlur"
  });

  const bgSx = { ...(success && { backgroundColor: alpha(teal[800], 0.9) }) };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    textAlign: "center",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 2
  };

  useEffect(() => {
    var items = {};

    Questions[randomNumber].answers.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        if (key.startsWith("answerText")) {
          items = { ...items, [key]: obj[key] };
        }
      });
    });
    setFormValues(items);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    compact(myRefs.current)[0].focus();
  }, [Counter]);

  const putData = async () => {
    setError("");

    const body = {
      _id: UserObj._id,
      User: UserObj.User,
      BF_Date: dayjs()
        .set("hour", 0)
        .set("minute", 0)
        .set("second", 0)
        .toISOString(),
      Quiz_Date: UserObj.Quiz_Date
    };

    let newState = Data;
    const index = findIndex(newState, { _id: UserObj._id });
    newState.splice(index, 1, body);

    try {
      let res = await restdb.put(`/records/${UserObj._id}`, body);
      if (res.status === 200) {
        setData(
          orderBy(
            newState,
            [
              (o) => {
                return o.Date || "";
              },
              "User"
            ],
            ["desc", "asc"]
          )
        );
      }
    } catch (error) {
      setError("Something went wrong!");
      return console.log(error);
    }
  };

  const handleClose = () => {
    putData();
    navigate("/Overview");
    setOpen(false);
  };

  function getLines(str) {
    // This uses RegEx to match new lines.
    // We use || [] because it would otherwise fail if there weren't
    // any line breaks yet.

    return (str.match(/[\r\n]/g) || []).length;
  }

  const handleOnInput = (e) => {
    const newValue = e.target.value;
    const newLines = getLines(newValue);

    const compactRefs = compact(myRefs.current);
    const current = findIndex(compactRefs, (element) => {
      return element === e.target;
    });
    const next = current + 1;
    const last = compactRefs.length - 1;

    const textfield = (index) =>
      find(
        compactRefs,
        (element) => {
          return element !== null;
        },
        index
      );

    if (newLines > 0) {
      if (textfield(current) === textfield(last)) {
        handleSubmit(handleOnSubmit)();
      } else {
        textfield(current).value = newValue.replace(/(\r\n|\n|\r)/gm, "");
        textfield(next).focus();
      }
    }
  };

  const handleOnSubmit = (evt) => {
    forIn(evt, function (value, key) {
      update(evt, key, function (value) {
        return value.toUpperCase();
      });
    });

    console.log(evt);
    setCounter(Counter + 1); //track submission of form to trigger setfocus

    if (isEqual(evt, formValues)) {
      //console.log("correct")
      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      setSuccess(true);
      setOpenpop(true);

      timer.current = window.setTimeout(() => {
        setOpenpop(false);
      }, 500);

      timer.current = window.setTimeout(() => {
        setSuccess(false);
      }, 700);

      if (Questions.length !== 1) {
        Questions.splice(randomNumber, 1);
      } else {
        setOpen(true);
      }
    } else {
      //console.log("wrong")
      setSuccess(false);
      setOpenpop(true);
      timer.current = window.setTimeout(() => {
        setOpenpop(false);
        setSuccess(false);
      }, 700);
    }

    reset();

    const rndnum = Math.floor(Math.random() * Questions.length);
    setRandomNumber(rndnum);
    setFormValues(defaultValues);

    Questions[rndnum].answers.forEach((obj) => {
      if (Object.keys(obj)[0].startsWith("answerText")) {
        setFormValues((prev) => ({
          ...prev,
          [Object.keys(obj)[0]]: obj[Object.keys(obj)[0]]
        }));
      }
    });
  };

  const bf = Questions[randomNumber].answers.map((ans, index) => {
    if (Object.keys(ans)[0].startsWith("prompt")) {
      return (
        <>
          <Grid item xs={12}>
            <Typography variant="body2">{ans.promptText}</Typography>
          </Grid>
        </>
      );
    } else {
      return (
        <>
          <Grid item xs={6}>
            <Controller
              control={control}
              name={Object.keys(ans)[0]}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: alpha(teal["A400"], 0.9)
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: alpha(teal["A400"], 0.9),
                        backgroundColor: alpha(grey[100], 0.2)
                      }
                    }
                  }}
                  {...field}
                  onInput={(ev) => {
                    handleOnInput(ev);
                  }}
                  fullWidth
                  id={Object.keys(ans)[0]}
                  variant="outlined"
                  size="small"
                  multiline
                  autoComplete="off"
                  inputProps={{
                    style: { fontSize: "0.75rem", textTransform: "uppercase" }
                  }}
                  inputRef={(el) => (myRefs.current[index] = el)}
                />
              )}
            />
          </Grid>
        </>
      );
    }
  });

  return (
    <Container
      sx={{
        "& .MuiBackdrop-root": { position: "absolute", top: "3.5rem" }
      }}
      disableGutters={true}
      maxWidth="xl"
    >
      <Backdrop
        sx={[
          {
            zIndex: (theme) => theme.zIndex.drawer - 1,
            backgroundColor: alpha(pink[900], 0.9)
          },
          bgSx
        ]}
        open={Openpop}
      />
      <Box
        component="form"
        onSubmit={handleSubmit(handleOnSubmit)}
        sx={{
          "& .MuiInputBase-root": { padding: "0.3rem 0.5rem" },
          "& .MuiBackdrop-root": {
            position: "absolute",
            "flex-direction": "column"
          },
          "& .MuiStep-root": { padding: "0", width: "100%" },
          "& .MuiStepLabel-iconContainer": { padding: "0.2rem" },
          "& .MuiStepLabel-root": { "flex-direction": "column" },
          "& .MuiStepIcon-root.Mui-active": { color: teal[200] },
          "& .MuiStepIcon-root.Mui-completed": { color: teal[400] },
          position: "relative"
        }}
        noValidate
        autoComplete="off"
      >
        <Backdrop
          sx={{
            zIndex: (theme) => theme.zIndex.drawer - 1,
            backgroundColor: "transparent"
          }}
          open={Openpop}
        >
          {success ? (
            <CheckCircleOutlinedIcon sx={{ fontSize: "6rem" }} />
          ) : (
            <CancelOutlinedIcon sx={{ fontSize: "6rem" }} />
          )}
          <Typography
            sx={{
              fontSize: "3rem",
              backgroundColor: "transparent",
              color: grey[300]
            }}
          >
            {success ? "Correct" : "Incorrect"}
          </Typography>
        </Backdrop>
        <Box sx={{ display: { sm: "flex" } }}>
          <Stepper activeStep={activeStep}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => {
              const stepProps = {};
              const labelProps = {};
              return (
                <Step key={index} {...stepProps}>
                  <StepLabel {...labelProps}></StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
        <Typography variant="h6">{Questions[randomNumber].header}</Typography>
        <Grid
          sx={{ padding: "0.3rem" }}
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 1, md: 1 }}
        >
          {bf}
        </Grid>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" fullWidth>
            Completed!
          </Typography>
          <Button
            fullWidth
            sx={{
              borderColor: "whitesmoke",
              color: "white",
              "&:hover": {
                backgroundColor: alpha(grey[300], 0.5),
                borderColor: "whitesmoke"
              }
            }}
            variant="outlined"
            onClick={() => {
              handleClose();
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}
