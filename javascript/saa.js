'use strict'

const saa = document.getElementById("saa");

// Sää apin hakeminen ja saatu data tulostetaan funktion avulla sivulle
fetch('https://api.openweathermap.org/data/2.5/weather?q=Helsinki&lang=fi&appid=2a8607984de34f45ad05ca18692bb135')
  .then(function (resp) { return resp.json() })
  .then(function (data) {
    info(data);
  })
  .catch(function (err) {
    console.log(err);
  });


//funktio, jossa tulostetaan saatu data DOM elementtien avulla tietoa karusellin sää artikkeliin
function info(data) {
  const el = document.createElement("p");
  const tuntuu = document.createElement("p");
  const rise = document.createElement("p");
  const set = document.createElement("p");
  const yeet = document.createElement("p");
  const img = document.createElement("img");

  const temp = data.main.temp - 273.15;
  const temp2 = data.main.feels_like - 273.15;

  img.setAttribute("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
  img.setAttribute("alt", data.weather[0].description);

  el.textContent = "Lämpötila: " + temp.toFixed(2) + "°C";
  tuntuu.textContent = "Tuntuu kuin: " + temp2.toFixed(2) + "°C";
  rise.textContent = "Aurinko nousee klo: " + time(data.sys.sunrise);
  set.textContent = "Aurinko laskee klo: " + time(data.sys.sunset);
  yeet.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);

  saa.appendChild(yeet);
  saa.appendChild(img);
  saa.appendChild(el);
  saa.appendChild(tuntuu);
  saa.appendChild(rise);
  saa.appendChild(set);
}

// funktio, jolla saadaan fetchatun datan aika luettavaan muotoon
function time(yeet) {
  let date = new Date(yeet * 1000);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let seconds = "0" + date.getSeconds();
  let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return formattedTime;
}
