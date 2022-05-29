const { Information } = require("./Information");
const { Festival } = require("./Festival.js");

const fest = new Festival("FooFest");
const data = new Information(fest).slots;

let allBands = [];

const addBands = (allBands) => {
  function addBand(band) {
    return allBands.push(band);
  }

  for (const stage in data) {
    for (const day in data[stage]) {
      for (let i = 0; i < data[stage][day].length; i++) {
        const band = data[stage][day][i];

        if (band.name !== "break") {
          addBand(band);
        }
      }
    }
  }

  return allBands;
};

const allInfo = addBands(allBands);

module.exports = allInfo;
