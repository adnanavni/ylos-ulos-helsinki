'use strict';

const info = document.getElementById('info');

// Nappia painaessa liikuntapaikat ilmestyvät funktion kautta kartalle
const liikuntaNappi = document.getElementById('liikunta');
liikuntaNappi.addEventListener('click', function () { remove(); liikunta() });

// Nappia painaessa uimapaikat ilmestyvät funktion kautta kartalle
const uimaNappi = document.getElementById('vesi');
uimaNappi.addEventListener('click', function () { remove(); uimaPaikat() });

// Funktio joka hakee ensin Helsingin alueelta sportsPlaceId:t, joiden avulla hakee myöhemmin tietoja liikuntapaikasta
// Kartasta painaessa muodostaa elementtejä jotta informaatio APIsta ilmestyisi sivulle, tulostaa ja käynnistää myös navigoinnin
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
                    lisaaKartalle(liikuntaPaikka.location.coordinates.wgs84.lon, liikuntaPaikka.location.coordinates.wgs84.lat, liikuntaPaikka.name, liikuntaIcon)
                        .on('click', function () {
                            liikuntaInfo(liikuntaPaikka);
                        });
                }).catch(function (err) {
                    console.log(err);
                });
        }
    }
}

//funktio joka tulostaa infoboxiin liikunta paikoista tiedot
function liikuntaInfo(data) {
    while (info.firstChild) {
        info.removeChild(info.firstChild)
    }

    const nimi = document.createElement('h3');
    nimi.textContent = data.name;
    info.appendChild(nimi);

    const tyyppi = document.createElement('p');
    tyyppi.textContent = 'Tyyppi:' + data.type.name;
    info.appendChild(tyyppi);

    if (data.email != undefined) {
        const sposti = document.createElement('p');
        sposti.textContent = 'Sähköposti: ' + data.email;
        info.appendChild(sposti);
    }

    if (data.phoneNumber != undefined) {
        const puh = document.createElement('p');
        puh.textContent = 'Puhelinnumero: ' + data.phoneNumber;
        info.appendChild(puh);
    }

    const osoite = document.createElement('p');
    osoite.textContent = 'Osoite: ' + data.location.address;
    info.appendChild(osoite);

    const linkki = document.createElement('a');
    linkki.href = data.www;
    linkki.textContent = 'Lisää tietoa täältä!';
    info.appendChild(linkki);

    const btn = document.createElement('button');
    btn.textContent = "Näytä reitti";
    btn.setAttribute("id", "navb");
    btn.onclick = function () {
        navigator.geolocation.getCurrentPosition(success, error, options);
        function success(pos) {
            if (supercontrol == null) {
                const crd = pos.coords;
                supercontrol = L.Routing.control({
                    waypoints: [
                        L.latLng(crd.latitude, crd.longitude),
                        L.latLng(data.location.coordinates.wgs84.lat, data.location.coordinates.wgs84.lon)
                    ], router: L.Routing.mapbox('sk.eyJ1IjoibW9pa29ubmEiLCJhIjoiY2t6eTZjMGtlMDhqejJvcGNzanEwcDZhayJ9.an_sHh9hmXUePnTLrVzyFA')
                    , createMarker: function () {
                        return null;
                    }, autoRoute: true
                }).addTo(map);

            }
            else {
                console.log(supercontrol.getWaypoints());
                supercontrol.spliceWaypoints(supercontrol.getWaypoints().length - 1, 1, [data.location.coordinates.wgs84.lat, data.location.coordinates.wgs84.lon]);
                map.closePopup();
                console.log(supercontrol.getWaypoints());
            }
        }
    }

    const br = document.createElement('br');
    info.appendChild(br);
    info.appendChild(btn);
}

// Funktio, joka hakee uimapaikat
// Kartasta painaessa muodostaa elementtejä jotta informaatio APIsta ilmestyisi sivulle, tulostaa ja käynnistää myös navigoinnin
function uimaPaikat() {
    fetch('https://iot.fvh.fi/opendata/uiras/uiras2_v1.json')
        .then(function (vastaus) {
            return vastaus.json();
        })
        .then(function (data) {
            for (const innerObject of Object.values(data.sensors)) {
                lisaaKartalle(innerObject.meta.lon, innerObject.meta.lat, innerObject.meta.name, uimaIcon)
                    .on('click', function () {
                        uimaPaikatInfo(innerObject);
                    });
            }
        });
}

// Funktio, joka tulostaa infoboxiin tiedot uimapaikoista ja lämpötilan
function uimaPaikatInfo(data) {

    let x = data.data.length - 1;

    while (info.firstChild) {
        info.removeChild(info.firstChild)
    }

    const nimi = document.createElement('h3');
    nimi.textContent = data.meta.name;
    info.appendChild(nimi);

    const lampotila = document.createElement('p');
    lampotila.textContent = 'Vedenlämpötila: ' + data.data[x].temp_water + ' °C';
    info.appendChild(lampotila);

    if (data.meta.site_url != "") {
        const linkki = document.createElement('a');
        linkki.href = data.meta.site_url;
        linkki.textContent = 'Lisää tietoa täältä!';
        info.appendChild(linkki);
    }

    const btn = document.createElement('button');
    btn.textContent = "Näytä reitti";
    btn.setAttribute("id", "navb");
    info.appendChild(btn);

    btn.onclick = function unav() {
        navigator.geolocation.getCurrentPosition(success, error, options);
        function success(pos) {
            const crd = pos.coords;
            if (supercontrol == null) {
                supercontrol = L.Routing.control({
                    waypoints: [
                        L.latLng(crd.latitude, crd.longitude),
                        L.latLng(data.meta.lat, data.meta.lon)
                    ], router: L.Routing.mapbox('sk.eyJ1IjoibW9pa29ubmEiLCJhIjoiY2t6eTZjMGtlMDhqejJvcGNzanEwcDZhayJ9.an_sHh9hmXUePnTLrVzyFA')
                    , createMarker: function () {
                        return null;
                    }
                }).addTo(map);
            }
            else {
                supercontrol.spliceWaypoints(supercontrol.getWaypoints().length - 1, 1, [data.meta.lat, data.meta.lon]);
                map.closePopup();
            }
        }
    }

    const br = document.createElement('br');
    info.appendChild(br);
    info.appendChild(btn);
}