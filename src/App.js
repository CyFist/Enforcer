import "./styles.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import TopBar from "./components/TopBar";
import { useEffect, createContext, useState, useMemo } from "react";

import { restdb, realtimeURL } from "./utils/api_client";
import { Routes, Route } from "react-router-dom";
//Pages
import Home from "./Pages/Home";
import Overview from "./Pages/Overview";
import Boldface from "./Pages/Boldface";
import Quiz from "./Pages/Quiz";

let eventSource = new EventSource(realtimeURL);

var ping = new Date();

setInterval(() => {
  let now = new Date().getTime();
  let diff = (now - ping.getTime()) / 1000;

  // haven't heard from the server in 20 secs?
  if (diff > 20) {
    // hard reload of client
    window.location.reload();
  }
}, 10000);

eventSource.addEventListener(
  "ping",
  function (e) {
    ping = new Date(e.data);
  },
  false
);

const ColorModeContext = createContext({ toggleColorMode: () => {} });

const App = () => {
  //Used for dark/light theme
  const [mode, setMode] = useState("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      }
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode
        }
      }),
    [mode]
  );
  //ends here
  const [UserObj, setUserObj] = useState([]);
  const [Records, setRecords] = useState([]);
  const [QuizQns, setQuizQns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    eventSource.addEventListener(
      "put",
      (event) => {
        //console.log('getData')
        getData();
      },
      false
    );

    eventSource.addEventListener(
      "post",
      (event) => {
        //console.log('getData')
        getData();
      },
      false
    );

    eventSource.addEventListener(
      "delete",
      (event) => {
        //console.log('getData')
        getData();
      },
      false
    );

    setRecords(JSON.parse(localStorage.getItem("records")));
    // GET request using axios inside useEffect React hook
    getData();
    getData("/quiz");
  }, []);

  const getData = async (query) => {
    setLoading(true);
    try {
      const { data } = await restdb.get(
        query
          ? query
          : '/records?q={}&h={"$orderby": {"BF_Date": -1, "Quiz_Date": -1, "User": 1 }}'
      );
      //console.log(data);
      localStorage.setItem("records", JSON.stringify(data));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopBar ColorModeContext={ColorModeContext} />
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="Overview" element={<Overview />} />
          <Route path="Boldface" element={<Boldface />} />
          <Route path="Quiz" element={<Quiz />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
