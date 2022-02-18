const imgCtr = document.querySelector('div#dog-image-container');
const breedListEl = document.querySelector('ul#dog-breeds');
const breedSelectorEl = document.querySelector('select#breed-dropdown');
let breedList = [];

async function apiCall(url) {
    const resp = await fetch(url);
    const json = await resp.json();

    if (resp.ok && resp.status === 200) {
        return json;
    }

    let err = new Error();
    err = {
        ...err,
        ...{
            message: resp.message || 'something went wrong',
            code: resp.status || ''
        }
    };

    throw err;
}

function renderDogImages(data) {
    data.message.forEach(url => {
        const imgEl = document.createElement('img');
        imgEl.src = url;
        imgCtr.appendChild(imgEl);
    });
}

async function fetchDogImg() {
    try {
        const images = await apiCall('https://dog.ceo/api/breeds/image/random/4');
        renderDogImages(images);
    } catch (err) {
        console.debug('Failed fetching dog images', err);
    }
}

function renderBreedList(breedNames) {
    breedNames.forEach(breedName => {
        const breedEl = document.createElement('li');
        breedEl.textContent = breedName;
        breedEl.addEventListener('click', e => (e.target.style.color = 'red'));
        breedListEl.appendChild(breedEl);
    });
}

async function fetchBreedList() {
    try {
        const breedResp = await apiCall('https://dog.ceo/api/breeds/list/all');
        breedList = Object.keys(breedResp.message);
        renderBreedList(breedList);
    } catch (err) {
        console.debug('Failed fetching breed list', err);
    }
}

function renderBreedSelectOptions() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    for (const letter of alphabet) {
        const breedOptionEl = document.createElement('option');
        breedOptionEl.value = letter;
        breedOptionEl.textContent = letter;
        breedSelectorEl.appendChild(breedOptionEl);
    }
}

function addbreedSelectEventListener() {
    breedSelectorEl.addEventListener('change', e => {
        breedListEl.innerHTML = '';
        if (e.target.value === '') {
            renderBreedList(breedList);
            return;
        }
        const filteredBreeds = breedList.filter(breedName => breedName[0] === e.target.value);
        renderBreedList(filteredBreeds);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchDogImg();
    fetchBreedList();
    renderBreedSelectOptions();
    addbreedSelectEventListener();
});
