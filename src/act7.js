import swapi from './swapi.js';

//Exemple d'inicialització de la llista de pel·lícules. Falten dades!
async function setMovieHeading(movieId, titleSelector, infoSelector, directorSelector) {
  // Obtenim els elements del DOM amb QuerySelector
  const title = document.querySelector(titleSelector);
  const info = document.querySelector(infoSelector);
  const director = document.querySelector(directorSelector);

  // Obtenim la informació de la pelicula
  const movieInfo = await swapi.getMovieInfo(movieId);

  // Injectem
  title.innerHTML = movieInfo.name;
  info.innerHTML = `Episode ${movieInfo.episodeID} - ${movieInfo.release}`;
  director.innerHTML = `Director: ${movieInfo.director}`;
}

async function initMovieSelect(selector) {

  const selectElement = document.querySelector(selector);

  const movies = await swapi.listMoviesSorted();

  const defaultOption = document.createElement('option');
  defaultOption.text = 'Selecciona una película';
  defaultOption.value = '';
  selectElement.appendChild(defaultOption);

  movies.forEach(movie => {
    const option = document.createElement('option');
    option.text = movie.name;
    option.value = movie.episodeID;
    selectElement.appendChild(option);
  });

}

function deleteAllCharacterTokens() {
  const listWrapper = document.querySelector('.list__wrapper');
  listWrapper.innerHTML = ''; 
}


async function addChangeEventToSelectHomeworld() {
  const homeworldSelector = document.querySelector('#select-homeworld');

  homeworldSelector.addEventListener('change', async (event) => {
    const selectedPlanet = event.target.value;
    const selectedMovieId = parseInt(document.querySelector('#select-movie').value);

    if (selectedPlanet && selectedMovieId) {
      // Eliminar totes les fitxes de personatges
      deleteAllCharacterTokens();

      // Obtenir informació dels personatges de la pel·lícula seleccionada
      const movieInfo = await swapi.getMovieCharactersAndHomeworlds(selectedMovieId);

      // Filtrar els personatges pel planeta seleccionat
      const charactersFromSelectedPlanet = movieInfo.characters.filter(character => character.homeworld === selectedPlanet);

      // Crear les fitxes dels personatges del planeta seleccionat
      charactersFromSelectedPlanet.forEach(character => {
        createCharacterToken(character);
      });
    }
  });
}

async function createCharacterToken(character) {
  const listWrapper = document.querySelector('.list__wrapper');

  const characterToken = document.createElement('li');
  characterToken.classList.add('list__item', 'item', 'character-token');

  const characterImage = document.createElement('img');
  characterImage.classList.add('character__image');
  characterImage.src = `/public/assets/people/${character.url.split('/')[5]}.jpg`;
  console.log(characterImage.src);

  const characterName = document.createElement('h2');
  characterName.classList.add('character__name');
  characterName.textContent = character.name;

  const characterBirth = document.createElement('div');
  characterBirth.classList.add('character__birth');
  characterBirth.innerHTML = `<strong>Birth Year:</strong> ${character.birth_year}`;

  const characterEye = document.createElement('div');
  characterEye.classList.add('character__eye');
  characterEye.innerHTML = `<strong>Eye color:</strong> ${character.eye_color}`;

  const characterGender = document.createElement('div');
  characterGender.classList.add('character__gender');
  characterGender.innerHTML = `<strong>Gender:</strong> ${character.gender}`;

  const characterHome = document.createElement('div');
  characterHome.classList.add('character__home');
  characterHome.innerHTML = `<strong>Home World:</strong> ${character.homeworld}`;

  characterToken.appendChild(characterImage);
  characterToken.appendChild(characterName);
  characterToken.appendChild(characterBirth);
  characterToken.appendChild(characterEye);
  characterToken.appendChild(characterGender);
  characterToken.appendChild(characterHome);

  listWrapper.appendChild(characterToken);
}


function _addDivChild(parent, className, html) { }

async function setMovieSelectCallbacks() {
  const selectElement = document.querySelector('#select-movie');

  selectElement.addEventListener('change', async (event) => {
    const selectedEpisodeId = parseInt(event.target.value);

    const titleSelector = '.movie__title';
    const infoSelector = '.movie__info';
    const directorSelector = '.movie__director';

    if (selectedEpisodeId) {
      const selectedMovieId = _filmIdToEpisodeId(selectedEpisodeId);

      const movieInfo = await swapi.getMovieCharactersAndHomeworlds(selectedMovieId);

      const titleElement = document.querySelector(titleSelector);
      const infoElement = document.querySelector(infoSelector);
      const directorElement = document.querySelector(directorSelector);

      titleElement.innerHTML = movieInfo.name;
      infoElement.innerHTML = `Episode ${movieInfo.episodeID} - ${movieInfo.release}`;
      directorElement.innerHTML = `Director: ${movieInfo.director}`;

      const homeworldSelector = document.querySelector('#select-homeworld');
      homeworldSelector.innerHTML = '';

      const defaultOption = document.createElement('option');
      defaultOption.text = 'Selecciona un homeworld';
      defaultOption.value = '';
      homeworldSelector.appendChild(defaultOption);

      const homeworlds = _removeDuplicatesAndSort(movieInfo.characters.map(character => character.homeworld));

      homeworlds.forEach(homeworld => {
        const option = document.createElement('option');
        option.text = homeworld; 
        option.value = homeworld; 
        homeworldSelector.appendChild(option);
      });

      deleteAllCharacterTokens();
    } else {
      const titleElement = document.querySelector(titleSelector);
      const infoElement = document.querySelector(infoSelector);
      const directorElement = document.querySelector(directorSelector);

      titleElement.innerHTML = '';
      infoElement.innerHTML = '';
      directorElement.innerHTML = '';

      const homeworldSelector = document.querySelector('#select-homeworld');
      homeworldSelector.innerHTML = '';

      deleteAllCharacterTokens();
    }
  });
}

async function _handleOnSelectMovieChanged(event) { }

function _filmIdToEpisodeId(episodeId) {
  const episodeToMovieIDs = [
    { m: 1, e: 4 },
    { m: 2, e: 5 },
    { m: 3, e: 6 },
    { m: 4, e: 1 },
    { m: 5, e: 2 },
    { m: 6, e: 3 },
  ];

  for (const mapping of episodeToMovieIDs) {
    if (mapping.e === episodeId) {
      return mapping.m;
    }
  }

  return null;
}

// "https://swapi.dev/api/films/1/" --> Episode_id = 4 (A New Hope)
// "https://swapi.dev/api/films/2/" --> Episode_id = 5 (The Empire Strikes Back)
// "https://swapi.dev/api/films/3/" --> Episode_id = 6 (Return of the Jedi)
// "https://swapi.dev/api/films/4/" --> Episode_id = 1 (The Phantom Menace)
// "https://swapi.dev/api/films/5/" --> Episode_id = 2 (Attack of the Clones)
// "https://swapi.dev/api/films/6/" --> Episode_id = 3 (Revenge of the Sith)


function _setMovieHeading({ name, episodeID, release, director }) { }

function _populateHomeWorldSelector(homeworlds) { }

/**
 * Funció auxiliar que podem reutilitzar: eliminar duplicats i ordenar alfabèticament un array.
 */
function _removeDuplicatesAndSort(elements) {
  // Al crear un Set eliminem els duplicats
  const set = new Set(elements);
  // tornem a convertir el Set en un array
  const array = Array.from(set);
  // i ordenem alfabèticament
  return array.sort(swapi._compareByName);
}

const act7 = {
  setMovieHeading,
  setMovieSelectCallbacks,
  initMovieSelect,
  deleteAllCharacterTokens,
  addChangeEventToSelectHomeworld,
};

export default act7;
