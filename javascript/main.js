'use strict';

// Käytetään leaflet.js -kirjastoa näyttämään sijainti kartalla (https://leafletjs.com/)
const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);


// Asetukset paikkatiedon hakua varten (valinnainen)
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

// Funktio, joka ajetaan, kun paikkatiedot on haettu
function success(pos) {
    const crd = pos.coords;

    map.setView([crd.latitude, crd.longitude], 13);

    L.marker([crd.latitude, crd.longitude]).addTo(map)
        .bindPopup('Olen tässä.')
        .openPopup();

}

// Funktio, joka ajetaan, jos paikkatietojen hakemisessa tapahtuu virhe
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Käynnistetään paikkatietojen haku
navigator.geolocation.getCurrentPosition(success, error, options);

// Funktio, jonka avulla voi lisätä pisteitä kartalle
function lisaaKartalle(longitude, latitude, nimi) {
    return L.marker([latitude, longitude]).
        addTo(map).bindPopup(nimi);
}

//Funktio, joka selvittää päivämäärän
function pvm(a) {
    const today = new Date()
    const ms = Math.abs(today.getTime() - a.getTime())
    if (ms < 86400000) {
        return true
    } else {
        return false
    }
}