'use strict';

const info = document.getElementById('info');

const proxy = 'https://api.allorigins.win/get?url=';
const tapahtumaApi = 'https://open-api.myhelsinki.fi/v1/places/?tags_search=';
const hakukohde = proxy + encodeURIComponent(tapahtumaApi);

const hotlahaku = document.getElementById('haeHotlat');
hotlahaku.addEventListener('click', () =>{remove(); hotellit()});

const raflahaku = document.getElementById('haeRaflat');
raflahaku.addEventListener('click', () =>{ remove();raflat()});

const baarihaku = document.getElementById('haeBaarit');
baarihaku.addEventListener('click', () => {remove();baarit()});

const clubihaku = document.getElementById('haeYokerhot');
clubihaku.addEventListener('click', () => {remove();clubit()});

const saunahaku = document.getElementById('haeSaunat');
saunahaku.addEventListener('click', () =>{remove(); saunat()});

// Funktio, joka hakee sauna tägillä dataa apista ja lisää pisteet kartalle
function saunat() {
  fetch(hakukohde + 'Sauna').then(function (vastaus) {
    return vastaus.json();
  }).then(function (data) {
    const saunat = JSON.parse(data.contents);

    for (let i = 0; i < saunat.data.length; i++) {
      lisaaKartalle(saunat.data[i].location.lon, saunat.data[i].location.lat, saunat.data[i].name.fi).on('click', () => infoBoxi(saunat, [i]));
    }
  });
}

// Funktio, joka hakee clubi ja nightclub tägillä dataa apista ja lisää pisteet kartalle
function clubit() {
  fetch(hakukohde + 'Club,Nightclub').then(function (vastaus) {
    return vastaus.json();
  }).then(function (data) {
    const clubit = JSON.parse(data.contents);

    for (let i = 0; i < clubit.data.length; i++) {
      lisaaKartalle(clubit.data[i].location.lon, clubit.data[i].location.lat, clubit.data[i].name.fi).on('click', () => infoBoxi(clubit, [i]));
    }
  });
}

// Funktio, joka hakee bar tägillä dataa apista ja lisää pisteet kartalle
function baarit() {
  fetch(hakukohde + 'Bar').then(function (vastaus) {
    return vastaus.json();
  }).then(function (data) {
    const baarit = JSON.parse(data.contents);

    for (let i = 0; i < baarit.data.length; i++) {
      lisaaKartalle(baarit.data[i].location.lon, baarit.data[i].location.lat, baarit.data[i].name.fi).on('click', () => infoBoxi(baarit, [i]));
    }
  });
}

// Funktio, joka hakee restaurant tägillä dataa apista ja lisää pisteet kartalle
function raflat() {
  fetch(hakukohde + 'Restaurant').then(function (vastaus) {
    return vastaus.json();
  }).then(function (data) {
    const raflat = JSON.parse(data.contents);
    for (let i = 0; i < raflat.data.length; i++) {
      lisaaKartalle(raflat.data[i].location.lon, raflat.data[i].location.lat, raflat.data[i].name.fi).on('click', () => infoBoxi(raflat, [i]));
    }
  });
}

// Funktio, joka hakee hotel tägillä dataa apista ja lisää pisteet kartalle
function hotellit() {
  fetch(hakukohde + 'Hotel').then(function (vastaus) {
    return vastaus.json();
  }).then(function (data) {
    const hotellit = JSON.parse(data.contents);
    for (let i = 0; i < hotellit.data.length; i++) {
      lisaaKartalle(hotellit.data[i].location.lon, hotellit.data[i].location.lat, hotellit.data[i].name.fi).on('click', () => infoBoxi(hotellit, [i]));
    }
  });
}


// Funktio, joka asettaa saadun datan ja sen indeksin infoboxiin.
function infoBoxi(data, [n]) {

  while (info.firstChild) {
    info.removeChild(info.firstChild);
  }

  const a = document.createElement('article');
  info.appendChild(a);

  const nimi = document.createElement('h2');
  nimi.textContent = data.data[n].name.fi;
  a.appendChild(nimi);

  const osoite = document.createElement('p');
  osoite.textContent = data.data[n].location.address.street_address + ', ' + data.data[n].location.address.locality;
  a.appendChild(osoite);

  const description = document.createElement('p');
  description.textContent = data.data[n].description.body;
  a.appendChild(description);

  const tiedot = document.createElement('a');
  tiedot.href = data.data[n].info_url;
  tiedot.textContent = 'Lisää tietoa täältä!';
  a.appendChild(tiedot);

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
          L.latLng(data.data[n].location.lat, data.data[n].location.lon)
        ], router: L.Routing.mapbox('sk.eyJ1IjoibW9pa29ubmEiLCJhIjoiY2t6eTZjMGtlMDhqejJvcGNzanEwcDZhayJ9.an_sHh9hmXUePnTLrVzyFA')
      }).addTo(map);
    }
  }
}