const request = require('superagent');

const PROGRESS_BAR_SIZE = 40;

function displayProgress(size = PROGRESS_BAR_SIZE) {
  request
  .get('https://www.unitedwifi.com/portal/r/getAllSessionData')
  .end((err, res) => {
    const flight = res.body.flifo;
    console.log(
      formatTimeRemaining(flight.timeRemainingToDestination)
    );
    console.log(
      flight.actualDepartureTime,
      flight.originAirportCode,
      generateProgressBar(size, flight.timeRemainingToDestination, flight.flightDurationMinutes),
      flight.destinationAirportCode,
      flight.estimatedArrivalTime,
      '\n'
    );
  });
}

function generateProgressBar(size, timeRemaining, duration) {
  const timeElapsed = duration - timeRemaining;
  const planePosition = Math.round((timeElapsed / duration) * size);
  let str = '[';
  for (let i = 0; i < planePosition; i++)
    str += '-';
  str += ' ✈︎ ';
  for (let i = str.length; i < size; i++)
    str += '·';
  str += ']';
  return str;
}

function formatTimeRemaining(minsRemaining) {
  const hours = Math.floor(minsRemaining / 60);
  const mins = minsRemaining % 60;
  let str = '';
  if (hours) {
    if (hours > 1) 
      str += `${hours} hours and `;
    else 
      str += `${hours} hour and `;
  }
  if (mins > 1)
    str += `${mins} minutes remaining`;
  else
    str += `${mins} minute remaining`;
  return str;
}

displayProgress();
setInterval(() => { displayProgress() }, 60 * 1000);
