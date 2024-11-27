var map = L.map('map').setView([47.9585, 14.7729], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

var marker = L.marker([47.9585, 14.7729]).addTo(map);
marker.bindPopup("<b>HTL Waidhofen an der Ybbs</b><br>Höhere Technische Lehranstalt").openPopup();
