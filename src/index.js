import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener(
  'input',
  debounce(onCountrySearch, DEBOUNCE_DELAY)
);
function onCountrySearch() {
  const countryName = countryInput.value.trim();
  if (!countryName) {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
    return;
  }
  fetchCountries(countryName)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        countryInfo.innerHTML = '';
        countryList.innerHTML = '';
        return;
      }
      if (countries.length >= 2) {
        const countryListMarkup = countries.map(country =>
          createMarkupList(country)
        );
        countryList.innerHTML = countryListMarkup.join('');
        countryInfo.innerHTML = '';
      }
      if (countries.length === 1) {
        const countryInfoMarkup = countries.map(country =>
          createMarkupInfo(country)
        );
        countryInfo.innerHTML = countryInfoMarkup.join('');
        countryList.innerHTML = '';
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      countryInfo.innerHTML = '';
      countryList.innerHTML = '';
      return error;
    });
}
function createMarkupList({ name, flags }) {
  return `<li>
  <img src="${flags.svg}"
  alt"${name.official}" width="30" />
  <span>${name.official}</span
  </li>`;
}

function createMarkupInfo({ name, capital, population, flags, languages }) {
  return `<h1><img src="${flags.svg}" alt="${name.official}" width="50" >
        ${name.official}</h1>
      <p><span>Capital:</span> ${capital}</p>
      <p><span>Population:</span> ${population}</p>
      <p><span>Languages:</span> ${Object.values(languages)}</p>`;
}
