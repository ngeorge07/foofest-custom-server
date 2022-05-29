const { Information } = require("./Information");
const { Festival } = require("./Festival.js");
const { shuffle } = require("./util/shuffle");
const { all } = require("express/lib/application");

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

  const firstHalf = allBandsfilter((band) => band.name !== "break").slice(
    0,
    16
  );
  const secondHalf = allBandsfilter((band) => band.name !== "break").slice(
    16,
    126
  );
  shuffle(secondHalf);

  allBands = firstHalf.concat(secondHalf);

  return allBands;
};

const allInfo = addBands(allBands);

module.exports = allInfo;
