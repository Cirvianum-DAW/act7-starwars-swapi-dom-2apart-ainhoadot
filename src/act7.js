import swapi from './swapi.js';

// Funció asíncrona per establir el capçalera de la pel·lícula
async function setMovieHeading(movieId, titleSelector, infoSelector, directorSelector) {
  // Obtenim els elements del DOM amb QuerySelector
  const title = document.querySelector(titleSelector); // Seleccioneu l'element del títol amb el selector proporcionat
  const info = document.querySelector(infoSelector); // Seleccioneu l'element de la informació amb el selector proporcionat
  const director = document.querySelector(directorSelector); // Seleccioneu l'element del director amb el selector proporcionat

  // Obtenim la informació de la pel·lícula des de SWAPI (Star Wars API)
  const movieInfo = await swapi.getMovieInfo(movieId); // Obté la informació de la pel·lícula utilitzant l'identificador de la pel·lícula

  // Injectem les dades de la pel·lícula als elements del DOM
  title.innerHTML = movieInfo.name; // Insereix el títol de la pel·lícula al seu element corresponent
  info.innerHTML = `Episode ${movieInfo.episodeID} - ${movieInfo.release}`; // Insereix informació de l'episodi i la data de llançament al seu element corresponent
  director.innerHTML = `Director: ${movieInfo.director}`; // Insereix el director de la pel·lícula al seu element corresponent
}

// -------------------------------------------------------------------------------------

// Funció asíncrona per inicialitzar el desplegable de selecció de pel·lícules
async function initMovieSelect(selector) {
  // Seleccionem l'element del desplegable amb el selector proporcionat
  const selectElement = document.querySelector(selector);

  // Seleccionem una llista ordenada de les pel·lícules des de SWAPI (Star Wars API)
  const movies = await swapi.listMoviesSorted();

  // Creem una opció per defecte i l'afegim al desplegable
  const defaultOption = document.createElement('option');
  defaultOption.text = 'Selecciona una pel·lícula';
  defaultOption.value = '';
  selectElement.appendChild(defaultOption);

  // Per cada pel·lícula, creem una opció i l'afegim al desplegable
  movies.forEach(movie => {
    const option = document.createElement('option');
    option.text = movie.name;
    option.value = movie.episodeID;
    selectElement.appendChild(option);
  });
}

// -------------------------------------------------------------------------------------

// Funció per eliminar tots els tokens de personatge
function deleteAllCharacterTokens() {
  // Seleccionem el block de la llista on es mostren els tokens dels personatges
  const listWrapper = document.querySelector('.list__wrapper');
  
  // Eliminem tot el contingut del block de la llista, buidant-lo
  listWrapper.innerHTML = '';
}

// -------------------------------------------------------------------------------------

// Funció asíncrona per afegir un esdeveniment de canvi al selector de planeta d'origen
async function addChangeEventToSelectHomeworld() {
  // Seleccionem l'element del selector de planeta d'origen
  const homeworldSelector = document.querySelector('#select-homeworld');

  // Afegim un esdeveniment de canvi a l'element del selector de planeta d'origen
  homeworldSelector.addEventListener('change', async (event) => {
    // Obtenim el planeta seleccionat
    const selectedPlanet = event.target.value;
    // Obtenim l'ID de la pel·lícula seleccionada
    const selectedMovieId = parseInt(document.querySelector('#select-movie').value);

    // Comprovem si s'ha seleccionat un planeta i una pel·lícula
    if (selectedPlanet && selectedMovieId) {
      // Eliminem totes les fitxes de personatges existents
      deleteAllCharacterTokens();

      // Obtenim la informació dels personatges i els planetes d'origen de la pel·lícula seleccionada
      const movieInfo = await swapi.getMovieCharactersAndHomeworlds(selectedMovieId);

      // Filtrar els personatges pel planeta d'origen seleccionat
      const charactersFromSelectedPlanet = movieInfo.characters.filter(character => character.homeworld === selectedPlanet);

      // Creem les fitxes dels personatges del planeta seleccionat
      charactersFromSelectedPlanet.forEach(character => {
        createCharacterToken(character);
      });
    }
  });
}

// -------------------------------------------------------------------------------------

// Funció asíncrona per crear una fitxa de personatge
async function createCharacterToken(character) {
  // Seleccionem l'envoltori de la llista on es mostrarà la fitxa de personatge
  const listWrapper = document.querySelector('.list__wrapper');

  // Creem un element per a la fitxa de personatge (li)
  const characterToken = document.createElement('li');
  characterToken.classList.add('list__item', 'item', 'character-token'); // Afegim classes CSS a la fitxa

  // Creem una imatge per al personatge
  const characterImage = document.createElement('img');
  characterImage.classList.add('character__image'); // Afegim una classe CSS a la imatge
  // Establim la font de la imatge utilitzant la URL de SWAPI i l'ID del personatge
  characterImage.src = `/public/assets/people/${character.url.split('/')[5]}.jpg`;
  console.log(characterImage.src); // Imprimim la font de la imatge per a comprovació

  // Creem un títol per al nom del personatge
  const characterName = document.createElement('h2');
  characterName.classList.add('character__name'); // Afegim una classe CSS al títol
  characterName.textContent = character.name; // Assignem el nom del personatge com a contingut del títol

  // Creem un element per al naixement del personatge
  const characterBirth = document.createElement('div');
  characterBirth.classList.add('character__birth'); // Afegim una classe CSS a l'element
  characterBirth.innerHTML = `<strong>Any de naixement:</strong> ${character.birth_year}`; // Assignem el naixement del personatge com a contingut de l'element

  // Creem un element per al color d'ulls del personatge
  const characterEye = document.createElement('div');
  characterEye.classList.add('character__eye'); // Afegim una classe CSS a l'element
  characterEye.innerHTML = `<strong>Color dels ulls:</strong> ${character.eye_color}`; // Assignem el color dels ulls del personatge com a contingut de l'element

  // Creem un element per al gènere del personatge
  const characterGender = document.createElement('div');
  characterGender.classList.add('character__gender'); // Afegim una classe CSS a l'element
  characterGender.innerHTML = `<strong>Gènere:</strong> ${character.gender}`; // Assignem el gènere del personatge com a contingut de l'element

  // Creem un element per al planeta d'origen del personatge
  const characterHome = document.createElement('div');
  characterHome.classList.add('character__home'); // Afegim una classe CSS a l'element
  characterHome.innerHTML = `<strong>Planeta d'origen:</strong> ${character.homeworld}`; // Assignem el planeta d'origen del personatge com a contingut de l'element

  // Afegim tots els elements creats com a fills de la fitxa de personatge
  characterToken.appendChild(characterImage);
  characterToken.appendChild(characterName);
  characterToken.appendChild(characterBirth);
  characterToken.appendChild(characterEye);
  characterToken.appendChild(characterGender);
  characterToken.appendChild(characterHome);

  // Afegim la fitxa de personatge a l'envoltori de la llista
  listWrapper.appendChild(characterToken);
}

// -------------------------------------------------------------------------------------

function _addDivChild(parent, className, html) { }

// -------------------------------------------------------------------------------------

// Funció asíncrona per establir els callbacks del selector de pel·lícules
async function setMovieSelectCallbacks() {
  // Seleccionem l'element del selector de pel·lícules
  const selectElement = document.querySelector('#select-movie');

  // Afegim un esdeveniment de canvi a l'element del selector de pel·lícules
  selectElement.addEventListener('change', async (event) => {
    // Obtenim l'ID de l'episodi seleccionat convertit a un nombre enter
    const selectedEpisodeId = parseInt(event.target.value);

    // Definim els selectores del títol, la informació i el director de la pel·lícula
    const titleSelector = '.movie__title';
    const infoSelector = '.movie__info';
    const directorSelector = '.movie__director';

    // Comprovem si s'ha seleccionat un episodi
    if (selectedEpisodeId) {
      // Convertim l'ID de l'episodi seleccionat a l'ID de la pel·lícula corresponent utilitzant una funció interna
      const selectedMovieId = _filmIdToEpisodeId(selectedEpisodeId);

      // Obtenim la informació de la pel·lícula i dels personatges amb els seus planetes d'origen
      const movieInfo = await swapi.getMovieCharactersAndHomeworlds(selectedMovieId);

      // Seleccionem els elements del títol, la informació i el director de la pel·lícula
      const titleElement = document.querySelector(titleSelector);
      const infoElement = document.querySelector(infoSelector);
      const directorElement = document.querySelector(directorSelector);

      // Actualitzem els elements amb la informació de la pel·lícula
      titleElement.innerHTML = movieInfo.name;
      infoElement.innerHTML = `Episodi ${movieInfo.episodeID} - ${movieInfo.release}`;
      directorElement.innerHTML = `Director: ${movieInfo.director}`;

      // Seleccionem l'element del selector del planeta d'origen
      const homeworldSelector = document.querySelector('#select-homeworld');
      homeworldSelector.innerHTML = '';

      // Afegim una opció per defecte al selector del planeta d'origen
      const defaultOption = document.createElement('option');
      defaultOption.text = 'Selecciona un planeta d\'origen';
      defaultOption.value = '';
      homeworldSelector.appendChild(defaultOption);

      // Eliminem duplicats i ordenem els planetes d'origen dels personatges
      const homeworlds = _removeDuplicatesAndSort(movieInfo.characters.map(character => character.homeworld));

      // Afegim opcions per a cada planeta d'origen al selector
      homeworlds.forEach(homeworld => {
        const option = document.createElement('option');
        option.text = homeworld; 
        option.value = homeworld; 
        homeworldSelector.appendChild(option);
      });

      // Eliminem totes les fitxes de personatges existents
      deleteAllCharacterTokens();
    } else {
      // Si no s'ha seleccionat cap episodi, netegem els elements del títol, la informació i el director de la pel·lícula
      const titleElement = document.querySelector(titleSelector);
      const infoElement = document.querySelector(infoSelector);
      const directorElement = document.querySelector(directorSelector);

      titleElement.innerHTML = '';
      infoElement.innerHTML = '';
      directorElement.innerHTML = '';

      // Netegem l'element del selector del planeta d'origen
      const homeworldSelector = document.querySelector('#select-homeworld');
      homeworldSelector.innerHTML = '';

      // Eliminem totes les fitxes de personatges existents
      deleteAllCharacterTokens();
    }
  });
}

// ------------------------------------------------------------------------------------

async function _handleOnSelectMovieChanged(event) { }

// -------------------------------------------------------------------------------------

// "https://swapi.dev/api/films/1/" --> Episode_id = 4 (A New Hope)
// "https://swapi.dev/api/films/2/" --> Episode_id = 5 (The Empire Strikes Back)
// "https://swapi.dev/api/films/3/" --> Episode_id = 6 (Return of the Jedi)
// "https://swapi.dev/api/films/4/" --> Episode_id = 1 (The Phantom Menace
// "https://swapi.dev/api/films/5/" --> Episode_id = 2 (Attack of the Clones)
// "https://swapi.dev/api/films/6/" --> Episode_id = 3 (Revenge of the Sith)

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

// -------------------------------------------------------------------------------------

function _setMovieHeading({ name, episodeID, release, director }) { }

// -------------------------------------------------------------------------------------

function _populateHomeWorldSelector(homeworlds) { }

// -------------------------------------------------------------------------------------

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

// -------------------------------------------------------------------------------------

const act7 = {
  setMovieHeading,
  setMovieSelectCallbacks,
  initMovieSelect,
  deleteAllCharacterTokens,
  addChangeEventToSelectHomeworld,
};

export default act7;
