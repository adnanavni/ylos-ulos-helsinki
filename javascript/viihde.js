'use strict';


const proxy = 'https://api.allorigins.win/get?url=';
const tapahtumaApi = 'https://open-api.myhelsinki.fi/v1/places/?tags_search=';
const hakukohde = proxy + encodeURIComponent(tapahtumaApi);

const hotlahaku = document.getElementById('haeHotlat');
hotlahaku.addEventListener('click', () => hotellit(), { once: true });

const raflahaku = document.getElementById('haeRaflat');
raflahaku.addEventListener('click', () => raflat(), { once: true });

const baarihaku = document.getElementById('haeBaarit');
baarihaku.addEventListener('click', () => baarit(), { once: true });

const clubihaku = document.getElementById('haeYokerhot');
clubihaku.addEventListener('click', () => clubit(), { once: true });

const saunahaku = document.getElementById('haeSaunat');
saunahaku.addEventListener('click', () => saunat(), { once: true });


function saunat(){
  fetch(hakukohde+'Sauna').then(function(vastaus){
    return vastaus.json();
  }).then(function(data){
    console.log(JSON.parse(data.contents));
  });
}

function clubit(){
  fetch(hakukohde+'Club,Nightclub').then(function(vastaus){
    return vastaus.json();
  }).then(function(data){
    console.log(JSON.parse(data.contents));
  });
}

function baarit(){
  fetch(hakukohde+'Bar').then(function(vastaus){
    return vastaus.json();
  }).then(function(data){
    console.log(JSON.parse(data.contents));
  });
}
function raflat(){
  fetch(hakukohde+'Restaurant').then(function(vastaus){
    return vastaus.json();
  }).then(function(data){
    console.log(JSON.parse(data.contents));
  });
}
function hotellit(){
  fetch(hakukohde+'Hotel').then(function(vastaus){
    return vastaus.json();
  }).then(function(data){
    console.log(JSON.parse(data.contents));
  });
}