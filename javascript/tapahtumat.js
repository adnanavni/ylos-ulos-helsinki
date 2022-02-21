'use strict';

const info = document.getElementById('info');
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
        console.log(data);
        console.log(data.data[0].location["@id"]);
        hakuInfo(data);
        const seuraavaNappi = document.getElementById('seuraava');
        seuraavaNappi.addEventListener('click', () => hakuInfo(data));
    }).catch(function (error) {
        console.log(error);
    });
});

function hakuInfo(data) {
    while (info.firstChild) {
        info.removeChild(info.firstChild);
    }
    const a = document.createElement('article');
    info.appendChild(a);

    const tulokset = document.createElement('p');
    tulokset.textContent = `Tuloksia jäljellä: ${data.data.length - i - 1} `;
    a.appendChild(tulokset);

    const nimi = document.createElement('h2');
    nimi.textContent = 'Tapahtuma: ' + data.data[i].name.fi;
    a.appendChild(nimi);

    const pvm = document.createElement('p');
    pvm.textContent = new Date(data.data[i].start_time);
    a.appendChild(pvm);

    const description = document.createElement('div');
    description.innerHTML = data.data[i].description.fi;
    a.appendChild(description);

    i++;
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
    console.log(tapahtumat);

    const pvmjarjestys = tapahtumat.data.filter(a => a.event_dates.starting_day && new Date().getTime() < new Date(a.event_dates.starting_day).getTime()).sort((a, b) => new Date(a.event_dates.starting_day) - new Date(b.event_dates.starting_day))
    for (let i = 0; i < pvmjarjestys.length; i++) {
        if (pvm(new Date(pvmjarjestys[i].event_dates.starting_day))) {
            console.log(pvmjarjestys[i].name.fi + pvmjarjestys[i].event_dates.starting_day);
        }
    }
}



