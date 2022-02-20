'use strict';

const info = document.getElementById('info');

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

    const uimaNappi = document.getElementById('vesi');
    uimaNappi.addEventListener('click', () => uimaPaikat(), { once: true });

    //tapahtumat();
}

// Funktio, joka ajetaan, jos paikkatietojen hakemisessa tapahtuu virhe
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Käynnistetään paikkatietojen haku
navigator.geolocation.getCurrentPosition(success, error, options);

// Funktio joka hakee ensin Helsingin alueelta sportsPlaceId:t, joiden avulla hakee myöhemmin tietoja liikuntapaikasta
// Kartasta painaessa muodostaa elementtejä jotta informaatio APIsta ilmestyisi sivulle
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
                    lisaaKartalle(liikuntaPaikka.location.coordinates.wgs84.lon, liikuntaPaikka.location.coordinates.wgs84.lat, liikuntaPaikka.name)
                        .on('click', function () {

                            while (info.firstChild) {
                                info.removeChild(info.firstChild)
                            }

                            const nimi = document.createElement('h3');
                            nimi.textContent = liikuntaPaikka.name;
                            info.appendChild(nimi);

                            const tyyppi = document.createElement('p');
                            tyyppi.textContent = 'Tyyppi:' + liikuntaPaikka.type.name;
                            info.appendChild(tyyppi);

                            if (liikuntaPaikka.email != undefined) {
                                const sposti = document.createElement('p');
                                sposti.textContent = 'Sähköposti: ' + liikuntaPaikka.email;
                                info.appendChild(sposti);
                            }

                            if (liikuntaPaikka.phoneNumber != undefined) {
                                const puh = document.createElement('p');
                                puh.textContent = 'Puhelinnumero: ' + liikuntaPaikka.phoneNumber;
                                info.appendChild(puh);
                            }

                            const osoite = document.createElement('p');
                            osoite.textContent = 'Osoite: ' + liikuntaPaikka.location.address;
                            info.appendChild(osoite);

                            const linkki = document.createElement('a');
                            linkki.href = liikuntaPaikka.www;
                            linkki.textContent = liikuntaPaikka.www;
                            info.appendChild(linkki);
                        });
                });
        }
    }
}

// Funktio, joka hakee uimapaikat
// Kartasta painaessa muodostaa elementtejä jotta informaatio APIsta ilmestyisi sivulle
function uimaPaikat() {
    fetch('https://iot.fvh.fi/opendata/uiras/uiras2_v1.json')
        .then(function (vastaus) {
            return vastaus.json();
        })
        .then(function (data) {
            console.log(data);
            for (const innerObject of Object.values(data.sensors)) {
                let x = innerObject.data.length - 1;
                console.log(innerObject);
                lisaaKartalle(innerObject.meta.lon, innerObject.meta.lat, innerObject.meta.name)
                    .on('click', function () {

                        while (info.firstChild) {
                            info.removeChild(info.firstChild)
                        }

                        const nimi = document.createElement('h3');
                        nimi.textContent = innerObject.meta.name;
                        info.appendChild(nimi);

                        const lampotila = document.createElement('p');
                        lampotila.textContent = 'Tämänhetkinen veden lämpötila on: ' + innerObject.data[x].temp_water + ' °C';
                        info.appendChild(lampotila);

                        if (innerObject.meta.site_url != "") {
                            const linkki = document.createElement('a');
                            linkki.href = innerObject.meta.site_url;
                            linkki.textContent = innerObject.meta.site_url;
                            info.appendChild(linkki);
                        }
                    });
            }
        });

}

// Funktio, joka hakee tämänpäivän tapahtumat
async function tapahtumatTanaan() {
    const proxy = 'https://api.allorigins.win/get?url=';
    const haku = 'http://open-api.myhelsinki.fi/swagger.json';
    const url = proxy + encodeURIComponent(haku);

    const vastaus = await fetch(url);
    const data = await vastaus.json();
    const tapahtumat = JSON.parse(data.contents);
    console.log(tapahtumat);

    const pvmjarjestys = tapahtumat.data.filter(a => a.event_dates.starting_day && new Date().getTime() < new Date(a.event_dates.starting_day).getTime()).sort((a, b) => new Date(a.event_dates.starting_day) - new Date(b.event_dates.starting_day));
    console.log(pvmjarjestys);

    for (let i = 0; i < pvmjarjestys.length; i++) {

        if (dateIsToday(new Date(pvmjarjestys[i].event_dates.starting_day))) {
            console.log(pvmjarjestys[i].name.fi + pvmjarjestys[i].event_dates.starting_day);
        }
    }
}

//tapahtumien hakeminen avainsanalla
function tapahtumienHaku() {
    const tapahtumaHaku = document.getElementById('hakukentta');
    const tapahtumaHakusana = document.getElementById('hakusana');
    const tapahtumaApi = 'https://api.hel.fi/linkedevents/v1/search/?type=event&q=';

    tapahtumaHaku.addEventListener('submit', function (evt) {
        evt.preventDefault();
        let search = tapahtumaHakusana.value.split(' ').join('+');
        let tapahtumat = '';
        tapahtumat = tapahtumaApi + search;

        function haku() {
            fetch(tapahtumat).then(function (vastaus) {
                return vastaus.json();
            }).then(function (data) {
                console.log(data);
            })
        } haku();
    })

}


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