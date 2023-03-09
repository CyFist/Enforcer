import axios from "axios";

// CORS enabled apikey
const apikey = "63eca0d0478852088da682d1";

const restdb = axios.create({
  baseURL: "https://enforcer-88e7.restdb.io/rest",
  headers: {
    "Content-Type": "application/json",
    "x-apikey": apikey,
    "cache-control": "no-cache"
  }
});
// Eventsource endpoint
const realtimeURL = `https://enforcer-88e7.restdb.io/realtime?apikey=${apikey}`;

export { restdb, realtimeURL };
