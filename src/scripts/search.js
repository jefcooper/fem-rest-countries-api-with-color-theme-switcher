//
// get reference to search input and attach handlers

import element from "./element-factory";

//
const searchInput = document.querySelector("[data-search-input]");
const regionSelect = document.querySelector("[data-region-select]");
const searchResults = document.querySelector("[data-search-results]");
let searchFilter;

console.log("initializing searchInput");

let regions;

if (searchInput) {
  regionSearch();
  performSearch();
}

// start simple with enter and click handler
searchInput?.addEventListener("keydown", async function (evt) {
  if (evt.key === "Enter") {
    performSearch();
  } else {
  }
});

async function performSearch() {
  const result = await countrySearch(searchInput.value);
  const filteredResult = result
    .filter((val) => !searchFilter || searchFilter.has(val[1]))
    .sort((a, b) => a[0].localeCompare(b[0]));
  fillSearchResults(filteredResult);
}

function fillSearchResults(result) {
  searchResults.innerText = "";
  result.forEach((country) => {
    const liEl = element("li").addTo(searchResults);
    element("a")
      .attribute("href", "/country.html?country=" + country[1])
      .text(country[0])
      .addTo(liEl);
  });
}

regionSelect?.addEventListener("change", (evt) => {
  if (evt.target.value === "all") {
    searchFilter = null;
  } else {
    searchFilter = new Set(regions[evt.target.value]);
  }
  performSearch();
});

async function countrySearch(name) {
  const result = await fetch("/api/countries?search=" + name);
  if (result.status !== 200) {
    return;
  } else {
    const data = await result.json();
    return data;
  }
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
}
