'use strict';

const info = document.getElementById('info');
const seuraavaNappi = document.getElementById('seuraava');
const edellinenNappi = document.getElementById('edellinen');
let indeksi = 0;
let i = 0;

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
        hakuInfo(data);
        seuraavaNappi.addEventListener('click', () => hakuInfo(data));
        edellinenNappi.addEventListener('click', () => hakuInfoNeg(data));
    }).catch(function (error) {
        console.log(error);
    });
});

// Funktio, joka tulostaa infoboxiin haun ekan tapahtuman, napista seuraavan
function hakuInfo(data) {
    while (info.firstChild) {
        info.removeChild(info.firstChild);
    }
    const a = document.createElement('article');
    info.appendChild(a);

    const tulokset = document.createElement('p');
    tulokset.textContent = `Tuloksia jäljellä: ${data.data.length - indeksi - 1} `;
    a.appendChild(tulokset);

    const nimi = document.createElement('h2');
    nimi.textContent = 'Tapahtuma: ' + data.data[indeksi].name.fi;
    a.appendChild(nimi);

    const pvm = document.createElement('p');
    pvm.textContent = new Date(data.data[indeksi].start_time);
    a.appendChild(pvm);

    if (data.data[indeksi].short_description = ! null) {
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


    indeksi++;
}

// Funktio, joka tulostaa infoboxiin haun ekan tapahtuman, napista edellisen
function hakuInfoNeg(data) {
    while (info.firstChild) {
        info.removeChild(info.firstChild);
    }
    const a = document.createElement('article');
    info.appendChild(a);

    const tulokset = document.createElement('p');
    tulokset.textContent = `Tuloksia jäljellä: ${data.data.length - indeksi + 1} `;
    a.appendChild(tulokset);

    const nimi = document.createElement('h2');
    nimi.textContent = 'Tapahtuma: ' + data.data[indeksi].name.fi;
    a.appendChild(nimi);

    const pvm = document.createElement('p');
    pvm.textContent = new Date(data.data[indeksi].start_time);
    a.appendChild(pvm);

    if (data.data[indeksi].short_description = ! null) {
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

    indeksi--;
}

const todayEvents = document.getElementById('tapahtumatTanaan')
todayEvents.addEventListener('click', () => tapahtumatTanaan(), { once: true });

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

    tanaanInfo(jarjestys);
    seuraavaNappi.addEventListener('click', () => tanaanInfo(jarjestys));
    edellinenNappi.addEventListener('click', () => tanaanInfoNeg(jarjestys));

    for (let i = 0; i < 100; i++) {
        lisaaKartalle(jarjestys[i].location.lon, jarjestys[i].location.lat, jarjestys[i].name.fi).on('click', () => tanaanInfo(jarjestys));
    }

}

// Funktio, joka tulostaa infoboxiin tiedot tapahtumasta, lisää myös kartalle sijainnin, napista seuraavan tapahtuman tiedot
function tanaanInfo(data) {
    while (info.firstChild) {
        info.removeChild(info.firstChild);
    }

    const a = document.createElement('article');
    info.appendChild(a);

    const nimi = document.createElement('h2');
    nimi.textContent = 'Tapahtuma: ' + data[i].name.fi;
    a.appendChild(nimi);

    const pvm = document.createElement('p');
    pvm.textContent = new Date(data[i].event_dates.starting_day);
    a.appendChild(pvm);

    const description = document.createElement('p');
    description.innerHTML = data[i].description.intro;
    a.appendChild(description);

    if (data[i].info_url != null) {
        const url = document.createElement('a')
        url.href = data[i].info_url
        url.textContent = 'Lisää tietoa täältä!'
        a.appendChild(url);
    }
    i++;

}

// Funktio, joka tulostaa infoboxiin tiedot tapahtumasta, lisää myös kartalle sijainnin, napista edellisen tapahtuman tiedot
function tanaanInfoNeg(data) {
    if (i >= 0 && i <= data.length)
        while (info.firstChild) {
            info.removeChild(info.firstChild);
        }

    const a = document.createElement('article');
    info.appendChild(a);

    const nimi = document.createElement('h2');
    nimi.textContent = 'Tapahtuma: ' + data[i].name.fi;
    a.appendChild(nimi);

    const pvm = document.createElement('p');
    pvm.textContent = new Date(data[i].event_dates.starting_day);
    a.appendChild(pvm);

    const description = document.createElement('p');
    description.innerHTML = data[i].description.body;
    a.appendChild(description);

    if (data[i].info_url != null) {
        const url = document.createElement('a')
        url.href = data[i].info_url
        url.textContent = 'Lisää tietoa täältä!'
        a.appendChild(url);
    }
    i--;
}
