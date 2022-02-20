'use strict'
const saa = document.getElementById("saa");
fetch('https://api.openweathermap.org/data/2.5/weather?q=Helsinki&lang=fi&appid=2a8607984de34f45ad05ca18692bb135')
.then(function (resp){ return resp.json() })
.then(function (data) {
  console.log(data);
  const el= document.createElement("p");
  const tuntuu= document.createElement("p");
  const rise= document.createElement("p");
  const set= document.createElement("p");
  const yeet= document.createElement("p");
  const img= document.createElement("img");
  img.setAttribute("src","http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png");
  img.setAttribute("alt",data.weather[0].description)
  const temp = data.main.temp - 273.15;
  const temp2 = data.main.feels_like - 273.15;
  rise.textContent="Aurinko nousee klo: "+time(data.sys.sunrise);
  set.textContent="Aurinko laskee klo: "+time(data.sys.sunset);
  el.textContent="Lämpötila: "+temp.toFixed(2)+"°C";
  tuntuu.textContent= "Tuntuu kuin: "+temp2.toFixed(2)+"°C";
  yeet.textContent=data.weather[0].description;
  saa.appendChild(img);
  saa.appendChild(el);
  saa.appendChild(tuntuu);
  saa.appendChild(yeet);
  saa.appendChild(rise);
  saa.appendChild(set);
  console.log(time(data.sys.sunset));
 
})
.catch(function (err) {
  console.log(err);
});
function time(yeet){
    let date = new Date(yeet * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}
