'use strict';

let yeet;
let indeksi = -1;
const info = document.getElementById('infotapahtuma');
const seuraavaNappi = document.getElementById('seuraava');
const edellinenNappi = document.getElementById('edellinen');
seuraavaNappi.addEventListener('click', () => hakuInfo(yeet));
edellinenNappi.addEventListener('click', () => hakuInfoNeg(yeet));

// Tapahtumien hakeminen avainsanalla
const tapahtumaHaku = document.getElementById('hakukentta');
const tapahtumaHakusana = document.getElementById('hakusana');
const tapahtumaApi = 'https://api.hel.fi/linkedevents/v1/search/?type=event&q=';

tapahtumaHaku.addEventListener('submit', function (evt) {
    evt.preventDefault();
    indeksi = -1;
    let search = tapahtumaHakusana.value.split(' ').join('+');
    let tapahtumat = '';
    tapahtumat = tapahtumaApi + search;

    fetch(tapahtumat).then(function (vastaus) {
        return vastaus.json();
    }).then(function (data) {
        yeet = data;
        indeksi = -1;
        hakuInfo(data);
    }).catch(function (error) {
        console.log(error);
    });
});

// Funktio, joka tulostaa infoboxiin haun ekan tapahtuman, napista seuraavan
function hakuInfo(data) {
    indeksi++;
    if (indeksi > data.data.length - 1) {
        indeksi = 0;
    }
    if (indeksi < 0) {
        indeksi = data.data.length - 1;
    }
    while (info.firstChild) {
        info.removeChild(info.firstChild);
    }
    if (data.data.length) {
        const a = document.createElement('article');
        info.appendChild(a);

        const tulokset = document.createElement('p');
        tulokset.textContent = "Tuloksia jäljellä: " + (indeksi + 1) + "/" + data.data.length;
        a.appendChild(tulokset);

        const nimi = document.createElement('h2');
        nimi.textContent = 'Tapahtuma: ' + data.data[indeksi].name.fi;
        a.appendChild(nimi);

        const pvm = document.createElement('p');
        const paiva = new Date(data.data[indeksi].start_time);
        let minuutit = `${paiva.getMinutes()}`;

        if (minuutit.endsWith('0', 1)) {
            minuutit += '0';
        }

        pvm.innerHTML = paiva.getDate() + '.' + (paiva.getMonth() + 1) + '.' + paiva.getFullYear() + ' <br> Klo: ' + paiva.getHours() + '.' + minuutit;
        a.appendChild(pvm);

        if (data.data[indeksi].short_description != null) {
            const description = document.createElement('p');
            description.innerHTML = data.data[indeksi].short_description.fi;
            a.appendChild(description);
        }

        if (data.data[indeksi].info_url != null) {
            const url = document.createElement('a');
            url.href = data.data[indeksi].info_url.fi
            url.textContent = 'Lisää tietoa täältä!';
            a.appendChild(url);
        }
    }
    else {
        const a = document.createElement('article');
        info.appendChild(a);
        const h2 = document.createElement('h2');
        h2.textContent = "Tapahtumia ei löytynyt!";
        a.appendChild(h2);
    }
}

// Funktio, joka tulosta edellisen tapahtuman
function hakuInfoNeg(data) {
    indeksi--;
    if (indeksi > data.data.length - 1) {
        indeksi = 0;
    }
    if (indeksi < 0) {
        indeksi = data.data.length - 1;
    }
    while (info.firstChild) {
        info.removeChild(info.firstChild);
    }
    const a = document.createElement('article');
    info.appendChild(a);

    const tulokset = document.createElement('p');
    tulokset.textContent = "Tuloksia jäljellä: " + (indeksi + 1) + "/" + data.data.length;
    a.appendChild(tulokset);

    const nimi = document.createElement('h2');
    nimi.textContent = 'Tapahtuma: ' + data.data[indeksi].name.fi;
    a.appendChild(nimi);

    const pvm = document.createElement('p');
    const paiva = new Date(data.data[indeksi].start_time);
    let minuutit = `${paiva.getMinutes()}`;

    if (minuutit.endsWith('0', 1)) {
        minuutit += '0';
    }

    pvm.innerHTML = paiva.getDate() + '.' + paiva.getMonth() + '.' + paiva.getFullYear() + ' <br> Klo: ' + paiva.getHours() + '.' + minuutit;
    a.appendChild(pvm);

    if (data.data[indeksi].short_description != null) {
        const description = document.createElement('p');
        description.innerHTML = data.data[indeksi].short_description.fi;
        a.appendChild(description);
    }

    if (data.data[indeksi].info_url != null) {
        const url = document.createElement('a');
        url.href = data.data[indeksi].info_url.fi
        url.textContent = 'Lisää tietoa täältä!';
        a.appendChild(url);
    }
}

//Napista pisteet kartalle ja tiedot infoboxiin
const todayEvents = document.getElementById('tapahtumat')
todayEvents.addEventListener('click', () => tapahtumatTanaan().then(function (jarjestys) {
    for (let i = 0; i < 100; i++) {
        lisaaKartalle(jarjestys[i].location.lon, jarjestys[i].location.lat, jarjestys[i].name.fi, tapahtumaIcon).on('click', function () {

            while (info.firstChild) {
                info.removeChild(info.firstChild);
            }
            const a = document.createElement('article');
            info.appendChild(a);

            const nimi = document.createElement('h2');
            nimi.textContent = 'Tapahtuma: ' + jarjestys[i].name.fi;
            a.appendChild(nimi);

            const pvm = document.createElement('p');
            const paiva = new Date(jarjestys[i].event_dates.starting_day);
            let minuutit = `${paiva.getMinutes()}`;

            if (minuutit.endsWith('0', 1)) {
                minuutit += '0';
            }

            pvm.innerHTML = paiva.getDate() + '.' + (paiva.getMonth() + 1) + '.' + paiva.getFullYear() + ' <br> Klo: ' + paiva.getHours() + '.' + minuutit;
            a.appendChild(pvm);

            const description = document.createElement('p');
            description.innerHTML = jarjestys[i].description.intro;
            a.appendChild(description);

            if (jarjestys[i].info_url != null) {
                const url = document.createElement('a')
                url.href = jarjestys[i].info_url
                url.textContent = 'Lisää tietoa täältä!'
                a.appendChild(url);
            }

            //Nappi, jonka avulla käynnistetään navigointi omasta paikasta valittuun paikkaan
            const btn = document.createElement('button');
            btn.textContent = "Näytä reitti";
            btn.setAttribute("id", "navb");
            info.appendChild(btn);
            btn.onclick = function () {
                navigator.geolocation.getCurrentPosition(success, error, options);
                function success(pos) {
                    const crd = pos.coords;
                    if (supercontrol == null) {
                        supercontrol = L.Routing.control({
                            waypoints: [
                                L.latLng(crd.latitude, crd.longitude),
                                L.latLng(jarjestys[i].location.lat, jarjestys[i].location.lon)

                            ], router: L.Routing.mapbox('sk.eyJ1IjoibW9pa29ubmEiLCJhIjoiY2t6eTZjMGtlMDhqejJvcGNzanEwcDZhayJ9.an_sHh9hmXUePnTLrVzyFA')
                            , createMarker: function () {
                                return null;
                            }
                        }).addTo(map);
                    }
                    else {
                        supercontrol.spliceWaypoints(supercontrol.getWaypoints().length - 1, 1, [jarjestys[i].location.lat, jarjestys[i].location.lon]);
                        map.closePopup();
                    }
                }
            }
        });
    }

}), { once: true });

//Funktio, joka hakee tämänpäiväiset tapahtumat
async function tapahtumatTanaan() {
    const proxy = 'https://api.allorigins.win/get?url=';
    const haku = 'http://open-api.myhelsinki.fi/v1/events/';
    const url = proxy + encodeURIComponent(haku);

    const vastaus = await fetch(url);
    const data = await vastaus.json();
    const tapahtumat = JSON.parse(data.contents);
    const jarjestys = tapahtumat.data.filter(a => a.event_dates.starting_day && new Date().getTime() < new Date(a.event_dates.starting_day)
        .getTime()).sort((a, b) => new Date(a.event_dates.starting_day) - new Date(b.event_dates.starting_day));
    return jarjestys;
}
