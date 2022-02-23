'use strict';

const info = document.getElementById('info');

// Nappia painaessa liikuntapaikat ilmestyvät funktion kautta kartalle
const liikuntaNappi = document.getElementById('liikunta');
liikuntaNappi.addEventListener('click', function(){remove();liikunta()} );

// Nappia painaessa uimapaikat ilmestyvät funktion kautta kartalle
const uimaNappi = document.getElementById('vesi');
uimaNappi.addEventListener('click', function(){remove();uimaPaikat()});

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

                            const btn = document.createElement('button');
                            btn.textContent = "Näytä reitti";
                            btn.setAttribute("id", "navb");
                            btn.onclick = function () {
                                navigator.geolocation.getCurrentPosition(success, error, options);
                                function success(pos) {
                                    const crd = pos.coords;
                                    L.Routing.control({
                                        waypoints: [
                                            L.latLng(crd.latitude, crd.longitude),
                                            L.latLng(liikuntaPaikka.location.coordinates.wgs84.lat, liikuntaPaikka.location.coordinates.wgs84.lon)

                                        ], router: L.Routing.mapbox('sk.eyJ1IjoibW9pa29ubmEiLCJhIjoiY2t6eTZjMGtlMDhqejJvcGNzanEwcDZhayJ9.an_sHh9hmXUePnTLrVzyFA')
                                    }).addTo(map);

                                }
                            }
                            // btn.setAttribute("onclick",navigointi());
                            const br = document.createElement('br');
                            info.appendChild(br);
                            info.appendChild(btn);
                            function navigointi() {
                                navigator.geolocation.getCurrentPosition(success, error, options);
                                function success(pos) {
                                    const crd = pos.coords;
                                    L.Routing.control({
                                        waypoints: [
                                            L.latLng(crd.latitude, crd.longitude),
                                            L.latLng(liikuntaPaikka.location.coordinates.wgs84.lat, liikuntaPaikka.location.coordinates.wgs84.lon)

                                        ]
                                    }).addTo(map);

                                }
                            }

                        });
                }).catch(function (err) {
                    console.log(err);
                });
        }
    }
}

// Funktio, joka hakee uimapaikat
// Kartasta painaessa muodostaa elementtejä jotta informaatio APIsta ilmestyisi sivulle, tulostaa ja käynnistää myös navigoinnin
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
                        lampotila.textContent = 'Vedenlämpötila: ' + innerObject.data[x].temp_water + ' °C';
                        info.appendChild(lampotila);
                        const btn = document.createElement('button');
                        btn.textContent = "Näytä reitti";
                        btn.setAttribute("id", "navb");
                        info.appendChild(btn);
                        if (innerObject.meta.site_url != "") {
                            const linkki = document.createElement('a');
                            linkki.href = innerObject.meta.site_url;
                            linkki.textContent = innerObject.meta.site_url;
                            info.appendChild(linkki);
                        }

                        btn.onclick = function unav() {
                            navigator.geolocation.getCurrentPosition(success, error, options);
                            function success(pos) {
                                const crd = pos.coords;
                                L.Routing.control({
                                    waypoints: [
                                        L.latLng(crd.latitude, crd.longitude),
                                        L.latLng(innerObject.meta.lat, innerObject.meta.lon)

                                    ], router: L.Routing.mapbox('sk.eyJ1IjoibW9pa29ubmEiLCJhIjoiY2t6eTZjMGtlMDhqejJvcGNzanEwcDZhayJ9.an_sHh9hmXUePnTLrVzyFA')
                                }).addTo(map);

                            }
                        }
                    });
            }

        }).catch(function (err) {
            console.log(err);
        });

}