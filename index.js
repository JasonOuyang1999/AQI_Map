var map;
map = L.map('map').setView([24.168623223894397, 121.44559804615191], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '<a href="https://www.openstreetmap.org/">OpenStreetMap</a> ',
    maxZoom: 18,
}).addTo(map);
const popup = L.popup();
function onMapClick(e) {
  let lat = e.latlng.lat; // 緯度
  let lng = e.latlng.lng; // 經度
  popup
    .setLatLng(e.latlng)
    .setContent(`緯度：${lat}<br/>經度：${lng}`)
    .openOn(map);
}
map.on('click', onMapClick);
// 1.定義 marker 顏色，把這一段放在 getData() 前面
let iconColor;
// 2.我們取出綠、橘、紅三個顏色來代表口罩數量的不同狀態
const greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    // 3.只要更改上面這一段的 green.png 成專案裡提供的顏色如：red.png，就可以更改 marker 的顏色
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const orangeIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


const redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const yellowIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
function listStation(stations) 
{
  for(var i=0;i<stations.records.length;i++)
  {
    var stationCountry=stations.records[i].county;
    var stationAQI=stations.records[i].aqi;
    var stationSiteName=stations.records[i].sitename;
    var stationStatus=stations.records[i].status;
    
    if(stationAQI<=50)
      iconColor=greenIcon;
    else if(stationAQI>=51 && stationAQI <=100)
      iconColor=yellowIcon;
    else if(stationAQI>=101 &&stationAQI <=300)
      iconColor=orangeIcon;
    else 
      iconColor=redIcon;
    
    var marker2= new L.Marker(
      [stations.records[i].latitude,
      stations.records[i].longitude],
      {icon:iconColor},
      map,
      {title: stationCountry},
    );
    marker2.addTo(map);
    marker2.bindPopup("縣市 : "+stationCountry+"<br>測站名稱 : "+stationSiteName+"<br>空氣品質指標 : "+stationAQI+"<br>狀態 : "+stationStatus).openPopup();
  }  
}
  
fetch('https://data.epa.gov.tw/api/v2/aqx_p_432?limit=1000&api_key=8af15130-ab61-4185-88cc-56a9e7b00eb0&sort=ImportDate%20desc&format=json', { 
  method: 'GET'
})
.then(function(response) { return response.json(); })
.then(function(json) {
  // use the json
  listStation(json)
  console.log(json);
  
});

$.getJSON('https://d3hu5rc2ze6fj6.cloudfront.net/wms?Request=GetGeoJSON&Layers=ronnywang/%E9%84%89%E9%8E%AE%E5%B8%82%E5%8D%80%E8%A1%8C%E6%94%BF%E5%8D%80%E5%9F%9F%E7%95%8C%E7%B7%9A&sql=SELECT+%2A+FROM+this+ORDER+BY+_id_+ASC', function (r) {
    L.geoJSON(r, { color: "#333" }).addTo(map);
});
