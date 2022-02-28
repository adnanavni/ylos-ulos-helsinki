'use strict';

const info = document.getElementById('infotapahtuma');
const seuraavaNappi = document.getElementById('seuraava');
const edellinenNappi = document.getElementById('edellinen');

// Tapahtumien hakeminen avainsanalla
const tapahtumaHaku = document.getElementById('hakukentta');
const tapahtumaHakusana = document.getElementById('hakusana');
const tapahtumaApi = 'https://api.hel.fi/linkedevents/v1/search/?type=event&q=';

tapahtumaHaku.addEventListener('submit', function (evt) {
    evt.preventDefault();
    let search = tapahtumaHakusana.value.split(' ').join('+');
    let tapahtumat = '';
    tapahtumat = tapahtumaApi + search;

    fetch(tapahtumat).then(function (vastaus) {
        return vastaus.json();
    }).then(function (data) {
        indeksi = -1;
        hakuInfo(data);
        seuraavaNappi.addEventListener('click', () => hakuInfo(data));
        edellinenNappi.addEventListener('click', () => hakuInfoNeg(data));
    }).catch(function (error) {
        console.log(error);
    });
});

let indeksi = -1;
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

    pvm.innerHTML = paiva.getDate() + ' / ' + paiva.getMonth() + ' / ' + paiva.getFullYear() + ' <br> Klo: ' + paiva.getHours() + '.' + minuutit;
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

// Funktio, joka tulostaa infoboxiin haun ekan tapahtuman, napista edellisen
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

    pvm.innerHTML = paiva.getDate() + ' / ' + paiva.getMonth() + ' / ' + paiva.getFullYear() + ' <br> Klo: ' + paiva.getHours() + '.' + minuutit;
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

const todayEvents = document.getElementById('tapahtumat')
todayEvents.addEventListener('click', () => tapahtumatTanaan(), { once: true });

//Funktio, joka hakee tämänpäiväiset tapahtumat ja lisää ne kartalle
async function tapahtumatTanaan() {
    const proxy = 'https://api.allorigins.win/get?url=';
    const haku = 'http://open-api.myhelsinki.fi/v1/events/';
    const url = proxy + encodeURIComponent(haku);

    const vastaus = await fetch(url);
    const data = await vastaus.json();
    const tapahtumat = JSON.parse(data.contents);
    const jarjestys = tapahtumat.data.filter(a => a.event_dates.starting_day && new Date().getTime() < new Date(a.event_dates.starting_day)
        .getTime()).sort((a, b) => new Date(a.event_dates.starting_day) - new Date(b.event_dates.starting_day));
    for (let i = 0; i < 100; i++) {
        lisaaKartalle(jarjestys[i].location.lon, jarjestys[i].location.lat, jarjestys[i].name.fi, tapahtumaIcon).on('click', () => tanaanInfo(jarjestys[i]));
    }
}

// Funktio, joka tulostaa infoboxiin tiedot tapahtumasta, tulostaa ja käynnistää myös navigoinnin
function tanaanInfo(data) {
    while (info.firstChild) {
        info.removeChild(info.firstChild);
    }

    const a = document.createElement('article');
    info.appendChild(a);

    const nimi = document.createElement('h2');
    nimi.textContent = 'Tapahtuma: ' + data.name.fi;
    a.appendChild(nimi);

    const pvm = document.createElement('p');
    const paiva = new Date(data.event_dates.starting_day);
    let minuutit = `${paiva.getMinutes()}`;

    if (minuutit.endsWith('0', 1)) {
        minuutit += '0';
    }
    pvm.innerHTML = paiva.getDate() + ' / ' + paiva.getMonth() + ' / ' + paiva.getFullYear() + ' <br> Klo: ' + paiva.getHours() + '.' + minuutit;
    a.appendChild(pvm);

    const description = document.createElement('p');
    description.innerHTML = data.description.intro;
    a.appendChild(description);

    if (data.info_url != null) {
        const url = document.createElement('a')
        url.href = data.info_url
        url.textContent = 'Lisää tietoa täältä!'
        a.appendChild(url);
    }

    const btn = document.createElement('button');
    btn.textContent = "Näytä reitti";
    btn.setAttribute("id", "navb");
    info.appendChild(btn);
    btn.onclick = function () {
        navigator.geolocation.getCurrentPosition(success, error, options);
        function success(pos) {
            const crd = pos.coords;
            L.Routing.control({
                waypoints: [
                    L.latLng(crd.latitude, crd.longitude),
                    L.latLng(data.location.lat, data.location.lon)

                ], router: L.Routing.mapbox('sk.eyJ1IjoibW9pa29ubmEiLCJhIjoiY2t6eTZjMGtlMDhqejJvcGNzanEwcDZhayJ9.an_sHh9hmXUePnTLrVzyFA')
            }).addTo(map);
        }
    }
}