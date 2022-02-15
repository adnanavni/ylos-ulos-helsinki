// Asetukset paikkatiedon hakua varten (valinnainen)
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

// Funktio, joka ajetaan, kun paikkatiedot on haettu
/*function success(pos) {
    const crd = pos.coords;

    // Tulostetaan paikkatiedot konsoliin
    /*console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    // Käytetään leaflet.js -kirjastoa näyttämään sijainti kartalla (https://leafletjs.com/)
    const map = L.map('map').setView([crd.latitude, crd.longitude], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([crd.latitude, crd.longitude]).addTo(map)
        .bindPopup('Olen tässä.')
        .openPopup();
}
*/

// Funktio, joka ajetaan, jos paikkatietojen hakemisessa tapahtuu virhe
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Käynnistetään paikkatietojen haku
//navigator.geolocation.getCurrentPosition(success, error, options);



const proxy = 'https://api.allorigins.win/get?url=';
const haku = 'http://lipas.cc.jyu.fi/api/sports-places?searchString=helsinki';
const url = proxy + encodeURIComponent(haku);


fetch(url).
    then(function (vastaus) {
        return vastaus.json();
    }).
    then(function (data) {
        //console.log(JSON.parse(data.contents));
        const liikuntaPaikkaId = JSON.parse(data.contents);
        liikuntaKartalle(liikuntaPaikkaId);

    });



/*function liikunnanID(yeet) {
    let paikat = [];
    for (let i = 0; i < yeet.length; i++) {
        paikat[i] = yeet[i].sportsPlaceId;
    }
}*/
const map = L.map('map').setView([60.2217983711028, 24.992837036259], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

function liikuntaKartalle(yeet) {
    let paikat = [];
    for (let i = 0; i < yeet.length; i++) {
        paikat[i] = yeet[i].sportsPlaceId;
    }
    console.log(paikat);
    for (let i = 0; i < paikat.length; i++) {

        fetch('https://api.allorigins.win/get?url=http://lipas.cc.jyu.fi/api/sports-places/' + paikat[i])
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

function lisaaKartalle(longitude, latitude, nimi) {
    return L.marker([latitude, longitude]).
        addTo(map).bindPopup(nimi);

}