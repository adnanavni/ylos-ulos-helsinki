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

    const liikuntaNappi = document.getElementById('liikunta');
    liikuntaNappi.addEventListener('click', () => liikunta(), { once: true });

    const uimaPaikat = document.getElementById('vesi');
    uimaPaikat.addEventListener('click', () => vesisto(), { once: true });
}

// Funktio, joka ajetaan, jos paikkatietojen hakemisessa tapahtuu virhe
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Käynnistetään paikkatietojen haku
navigator.geolocation.getCurrentPosition(success, error, options);

// Funktio joka hakee ensin Helsingin alueelta sportsPlaceId:t, joiden avulla hakee myöhemmin tietoja liikuntapaikasta
async function liikunta() {
    const proxy = 'https://api.allorigins.win/get?url=';
    const haku = 'http://lipas.cc.jyu.fi/api/sports-places?searchString=helsinki';
    const url = proxy + encodeURIComponent(haku);


    const vastaus = await fetch(url);
    const data = await vastaus.json();
    const liikuntaPaikkaId = JSON.parse(data.contents);
    liikuntaKartalle(liikuntaPaikkaId);

    function liikuntaKartalle(data) {
        for (let i = 0; i < data.length; i++) {
            fetch('https://api.allorigins.win/get?url=http://lipas.cc.jyu.fi/api/sports-places/' + data[i].sportsPlaceId)
                .then(function (vastaus) {
                    return vastaus.json();
                }).
                then(function (data) {
                    const liikuntaPaikka = JSON.parse(data.contents);
                    console.log(liikuntaPaikka);
                    lisaaKartalle(liikuntaPaikka.location.coordinates.wgs84.lon, liikuntaPaikka.location.coordinates.wgs84.lat, liikuntaPaikka.name);
                });
        }
    }
}

// Funktio, joka hakee uimapaikat
function vesisto() {
    fetch('https://iot.fvh.fi/opendata/uiras/uiras-meta.json')
        .then(function (vastaus) {
            return vastaus.json();
        })
        .then(function (data) {
            console.log(data);
            for (const innerObject of Object.values(data)) {
                lisaaKartalle(innerObject.lon, innerObject.lat, innerObject.name);
            }
        });

}

// Funktio, jonka avulla voi lisätä pisteitä kartalle
function lisaaKartalle(longitude, latitude, nimi) {
    return L.marker([latitude, longitude]).
        addTo(map).bindPopup(nimi);
}
