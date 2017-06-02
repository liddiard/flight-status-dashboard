const STORAGE_KEY = 'flight-data';
const API_URL = 'https://www.unitedwifi.com/portal/r/getAllSessionData';

function renderChart() {
  const data = getStoredFlightData();
  const chart = c3.generate({
    bindTo: '#chart',
    data: {
      x: 'x',
      xFormat: '%H:%M',
      columns: [
        ['times'].concat(data.map(d => d.time)),
        ['airspeed'].concat(data.map(d => d.airspeed)),
        ['ground speed'].concat(data.map(d => d.groundSpeed)),
        ['altitude'].concat(data.map(d => d.altitude)),
        ['air temperature'].concat(data.map(d => d.airTemp)),
      ]
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%H:%M'
        }
      }
    }
  });
}

function clearChart() {
  resetStoredFlightData();
  renderChart();
}

function resetStoredFlightData() {
  setStoredFlightData([]);
}

function getStoredFlightData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function updateStoredFlightData(newData) {
  currentData = getStoredFlightData();
  currentData.push(newData);
  setStoredFlightData(currentData);
}

function setStoredFlightData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  renderChart();
}

function getCurrentFlightData() {
  fetch(API_URL)
  .then(res => {
    const info = JSON.parse(res.text).flifo;
    const currentTime = new Date();
    const newData = {
      time: [currentTime.getHours(), currentTime.getMinutes()].join(':'),
      airSpeed: info.airSpeedKPH,
      groundSpeed: info.groundSpeedKPH,
      altitude: info.altitudeMeters,
      airTemp: info.airTemperatureC,
      eta: info.estimatedArrivalTime
    };
    updateStoredFlightData(newData);
  });  
}

resetStoredFlightData();
setInterval(getCurrentFlightData, 1000*60); // run every minute
