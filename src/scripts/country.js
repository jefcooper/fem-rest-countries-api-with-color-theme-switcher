import element from "./element-factory";

const searchParams = new URLSearchParams(location.search);
const country = searchParams.get("country");

const countryName = document.querySelector("[data-country-name]");
const countryFlag = document.querySelector("[data-country-flag]");
const countryNativeName = document.querySelector("[data-country-native-name]");
const countryPopulation = document.querySelector("[data-country-population]");
const countryRegion = document.querySelector("[data-country-region]");
const countrySubregion = document.querySelector("[data-country-subregion]");
const countryCapital = document.querySelector("[data-country-capital]");
const countryTopLevelDomain = document.querySelector(
  "[data-country-top-level-domain]"
);
const countryCurrencies = document.querySelector("[data-country-currencies]");
const countryLanguages = document.querySelector("[data-country-languages]");
const countryBorderCountries = document.querySelector(
  "[data-country-border-countries]"
);

if (country) {
  loadCountry(country);
}

let countries;

async function getCountryIndex() {
  if (!countries) {
    const response = await fetch("/api/countries");
    if (response.status === 200) {
      const data = await response.json();
      countries = data.reduce((acc, [name, code]) => {
        return Object.assign({}, acc, {
          [code]: [name],
        });
      }, {});
    }
  }
  return countries;
}

async function loadCountry(country) {
  const response = await fetch("/api/countries/" + country);

  if (response.status !== 200) {
    console.log("error: " + response.status);
  } else {
    const data = await response.json();

    countryName.innerText = data.name;
    countryFlag.setAttribute("src", data.flag);

    countryNativeName.innerText = data.nativeName;
    countryPopulation.innerText = data.population;
    countryRegion.innerText = data.region;
    countrySubregion.innerText = data.subregion;
    countryCapital.innerText = data.capital;
    countryTopLevelDomain.innerText = data.topLevelDomain.join(", ");
    countryCurrencies.innerText = data.currencies
      .map(({ code, name }) => name + "(" + code + ")")
      .join(", ");
    countryLanguages.innerText = data.languages.map((el) => el.name).join(", ");
    //countryBorderCountries.innerText = data.borders.join(", ");
    const borderList = element("ul").addTo(countryBorderCountries);
    const countryIndex = await getCountryIndex();
    Array.from(data.borders).forEach((code) => {
      const liEl = element("li").addTo(borderList);
      element("a")
        .attribute("href", "/country.html?country=" + code)
        .text(countryIndex[code])
        .addTo(liEl);
    });
  }
}
