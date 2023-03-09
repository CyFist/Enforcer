import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import Step from "@mui/material/Step";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { teal } from "@mui/material/colors";
import _ from "lodash";

export default function HorizontalLabelPositionBelowStepper({
  QuizQns,
  RemainingQns
}) {
  const theme = createTheme({
    components: {
      // Name of the component
      MuiStep: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            padding: "0.2rem",
            width: "100%"
          }
        }
      },
      MuiStepIcon: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            "&.Mui-active": {
              color: teal[300]
            },
            "&.Mui-completed": {
              color: teal[400]
            }
          }
        }
      },
      MuiStepConnector: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            color: "transparent",
            "&.Mui-active": {
              color: teal[300]
            },
            "&.Mui-completed": {
              color: teal[400]
            }
          },
          line: {
            width: "0rem"
          }
        }
      }
    }
  });
  const activeStep = QuizQns.length - RemainingQns.length;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {_.map(QuizQns, (value, key) => {
            //const stepProps = {};
            //const labelProps = {};
            return (
              <Step key={key}>
                <StepLabel></StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    </ThemeProvider>
  );
}
