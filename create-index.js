const fs = require("fs");
const countries = JSON.parse(fs.readFileSync("./data.json", "utf8"));

//
// split into one file per country, name of file is ./data/[alpha2Code].json
//

// clean. remove any prior data and create a fresh directory
fs.rmSync("./data", { force: true, recursive: true });
fs.mkdirSync("./data");

// write a new file per country, with complete JSON
countries.forEach((country) => {
  fs.writeFile(
    "./data/" + country.alpha3Code + ".json",
    JSON.stringify(country),
    "utf8",
    (err) => {
      if (err) {
        console.log(err);
      } else {
      }
    }
  );
});

//
// create map with region -> [alpha2Code, ...] lookup
//
const regionIndex = new Map();

countries.forEach((country) => {
  // if region is not in map, add an empty map for it
  if (!regionIndex[country.region]) {
    regionIndex[country.region] = new Array();
  }

  // append 3 character country code to selected region
  regionIndex[country.region].push(country.alpha3Code);
});
fs.writeFile(
  "./data/regions.json",
  JSON.stringify(regionIndex),
  "utf8",
  (err) => {
    if (err) {
      console.log(err);
    }
  }
);

//
// create map with alpha3Code -> country summary details
//
const countriesIndex = countries.reduce((acc, country) => {
  return Object.assign({}, acc, {
    [country.alpha3Code]: {
      name: country.name,
      population: country.population,
      capital: country.capital,
      region: country.region,
      subregion: country.subregion,
      flags: country.flags,
    },
  });
}, {});

//
// country name index
//
const countryNameIndex = countries.reduce((acc, country) => {
  return Object.assign({}, acc, {
    [country.name]: [country.alpha3Code],
  });
}, {});

fs.writeFile(
  "./data/countries.json",
  JSON.stringify(countryNameIndex),
  "utf8",
  (err) => {
    if (err) {
      console.log(err);
    }
  }
);

//
// construct the combined index object
//
const index = {
  countries: countriesIndex,
  regions: regionIndex,
  countryNames: countryNameIndex,
};

//
// write the combined index to an index.json file
//
fs.writeFile(
  "./data/index.json",
  JSON.stringify(index, null, 3),
  "utf8",
  (err) => {
    if (err) {
      console.log(err);
    }
  }
);
