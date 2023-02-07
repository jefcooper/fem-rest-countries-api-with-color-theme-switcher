import element from "./element-factory";

const searchParams = new URLSearchParams(location.search);
const country = searchParams.get("country");
const region = searchParams.get("region");

const backButton = document.querySelector("[data-country-back]");
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

console.log("referrer: " + document.referrer);
const referrer = document.referrer;

if (country) {
  loadCountry(country);
}

if (backButton) {
  console.log("referrer: " + document.referrer);
  backButton.addEventListener("click", (evt) => {
    console.log("back: " + referrer);
    history.pushState({}, null, referrer);
    //location.assign(referrer);
    //history.back();
  });
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
    countryPopulation.innerText = Number.parseInt(
      data.population,
      10
    ).toLocaleString();
    countryRegion.innerText = data.region;
    countrySubregion.innerText = data.subregion;
    countryCapital.innerText = data.capital;
    countryTopLevelDomain.innerText = data.topLevelDomain.join(", ");
    countryCurrencies.innerText = data.currencies
      .map(({ code, name }) => name + " (" + code + ")")
      .join(", ");
    countryLanguages.innerText = data.languages.map((el) => el.name).join(", ");
    //countryBorderCountries.innerText = data.borders.join(", ");
    const borderList = element("ul")
      .class("country__border-list")
      .addTo(countryBorderCountries);
    const countryIndex = await getCountryIndex();
    if (data.borders) {
      Array.from(data.borders).forEach((code) => {
        const liEl = element("li").addTo(borderList);
        element("a")
          .attribute("href", "/country.html?country=" + code)
          .class("country__border-country btn btn--primary")
          .text(countryIndex[code])
          .addTo(liEl);
      });
    }
  }
}
