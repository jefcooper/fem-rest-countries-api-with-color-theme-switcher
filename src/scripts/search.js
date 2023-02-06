//
// get reference to search input and attach handlers

import element from "./element-factory";

//
// elements from web page
//
const searchInput = document.querySelector("[data-search-input]");
const regionSelect = document.querySelector("[data-region-select]");
const searchResults = document.querySelector("[data-search-results]");

//
// state variables
//
let searchFilter;
let regions;
let timer;
let countryIndexData;

console.log("initializing searchInput");

// obtain current URL search parameter if present at page load
let filterRegion = new URLSearchParams(location.search).get("region");

// perform page-load initialization
initializeSearchLibrary();

/**
 * First time initialization on page load
 */
function initializeSearchLibrary() {
  if (searchInput) {
    regionSearch();
    performSearch();
  }
}

//
// search input keyboard event listener
//
searchInput?.addEventListener("keydown", async function (evt) {
  if (evt.key === "Enter") {
    performSearch();
  } else if (evt.key === "Escape") {
    searchInput.value = "";
    performSearch();
  } else {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      performSearch();
    }, 750);
  }
});

//
// region select dropdown change event listener
//
regionSelect?.addEventListener("change", (evt) => {
  const updatedUrl =
    location.origin + location.pathname + "?region=" + evt.target.value;
  history.pushState({}, null, updatedUrl);
  history.scrollRestoration = "manual";
  updateRegionFilter(evt.target.value);
  performSearch();
});

window.addEventListener("popstate", (evt) => {
  const newRegion = new URLSearchParams(location.search).get("region");
  regionSelect.value = newRegion;
  updateRegionFilter(newRegion);
  performSearch();
});
/**
 * performSearch - search based on region filter and text input in search box
 */
async function performSearch() {
  const result = await countrySearch(searchInput.value);
  const filteredResult = result
    .filter((val) => !searchFilter || searchFilter.has(val[1]))
    .sort((a, b) => a[0].localeCompare(b[0]));
  fillSearchResults(filteredResult, await countryIndex());
}

function updateRegionFilter(regionName) {
  if (!regionName || regionName === "all") {
    searchFilter = null;
  } else {
    searchFilter = new Set(regions[regionName]);
  }
}

async function countrySearch(name) {
  const result = await fetch("/api/countries?search=" + name);
  if (result.status !== 200) {
    return;
  } else {
    const data = await result.json();
    return data;
  }
}

async function countryIndex() {
  if (!countryIndexData) {
    const response = await fetch("/api/country-index");
    if (response.status === 200) {
      countryIndexData = await response.json();
    } else {
      console.log("error: " + response.status);
    }
  }
  return countryIndexData;
}

async function regionSearch() {
  const result = await fetch("/api/regions");
  if (result.status !== 200) {
  } else {
    const data = await result.json();
    regions = data;
    initializeRegionOptions(regions);
  }
}

function initializeRegionOptions(data) {
  regionSelect.innerText = "";
  const regionNames = Object.entries(regions)
    .map(([region, names]) => region)
    .sort();
  element("option")
    .text("Filter by Region")
    .attribute("value", "all")
    .addTo(regionSelect);
  regionNames.forEach((name) => {
    element("option").text(name).attribute("value", name).addTo(regionSelect);
  });
  if (filterRegion) {
    regionSelect.value = filterRegion;
    updateRegionFilter(filterRegion);
  }
}

/**
 * fillSearchResults - dynamically create the results section of the page
 */
function fillSearchResults(result, countryIndex) {
  searchResults.innerText = "";
  result.forEach((country) => {
    const liEl = element("li").class("card").addTo(searchResults);
    const aEl = element("a")
      .attribute("href", "/country.html?country=" + country[1])
      .addTo(liEl);
    element("img")
      .class("card__flag")
      .attribute("src", countryIndex[country[1]].flag)
      .attribute("loading", "lazy")
      .addTo(aEl);
    const cardInfoEl = element("div").class("card__info").addTo(aEl);
    element("h2").text(country[0]).class("heading--2").addTo(cardInfoEl);
    const dl = element("dl").addTo(cardInfoEl);
    element("dt").text("Population").class("label--1").addTo(dl);
    element("dd")
      .text(
        Number.parseInt(
          countryIndex[country[1]].population,
          10
        ).toLocaleString()
      )
      .class("text--1")
      .addTo(dl);
    element("dt").text("Region").class("label--1").addTo(dl);
    element("dd")
      .text(countryIndex[country[1]].region)
      .class("text--1")
      .addTo(dl);
    element("dt").text("Capital").class("label--1").addTo(dl);
    element("dd")
      .text(countryIndex[country[1]].capital || "none")
      .class("text--1")
      .addTo(dl);
  });
}
