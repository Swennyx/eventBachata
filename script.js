const card = document.getElementById("event");
const btnCreate = document.getElementById("btn-create");

btnCreate.addEventListener("click", () => {
  window.location.href = "createevent.html";
});

var map = L.map("map").setView([46.166667, -1.15], 5);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

fetch("http://localhost:3000/event")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    // Recupere le dernier element pour son ID
    let dernierElement = data.reduce(
      (max, element) => {
        return element.id > max.id ? element : max;
      },
      { id: -Infinity }
    );

    data.forEach((element) => {
      card.innerHTML += `
        <div class="card">
            <a href="detail.html?id=${element.id}">
                <div class="card-image">
                    <img src="${element.photo}" alt="Image de l'événement">
                </div>
                <div class="card-content">
                    <h2 class="title">${element.title}</h2>
                    <p class="dates">Dates : ${element.dates}</p>
                    <p class="location">Localisation : ${element.location.city}</p>
                    <p class="availability" data-available-spots="${element.available_spots}">Places disponibles : ${element.available_spots}</p>
                </div>
            </a>
        </div>
        `;

      // Sélectionner l'élément de disponibilité pour chaque carte
      let availability = card.querySelectorAll(
        '.card .availability[data-available-spots="' +
          element.available_spots +
          '"]'
      );

      // Appliquer la couleur et le texte pour chaque élément individuellement
      availability.forEach((item) => {
        if (element.available_spots > 0) {
          item.style.color = "green";
          item.textContent = "Place disponible";
        } else {
          item.style.color = "red";
          item.textContent = "Place indisponible";
        }
      });

      // Ajouter le marqueur sur la carte
      let marker = L.marker([
        element.location.latitude,
        element.location.longitude,
      ]).addTo(map);
      marker.bindPopup(`
            <a href="detail.html?id=${element.id}">
            <img src="${element.photo}" alt="Image de l'événement" style="object-fit: cover;width: 100%;">
            </a>
            <p>${element.title}</p>
        `);
      console.log(marker);
    });
  })
  .catch((err) => console.log(err));
fetch("http://localhost:3000/event")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((element) => {
      let marker = L.marker([
        element.location.latitude,
        element.location.longitude,
      ]).addTo(map);
      marker.bindPopup(`
             <a href="detail.html?id=${element.id}">
            <img src="${element.photo}" alt="Image de l'événement" style="object-fit: cover;width: 100%;">
            </a>
            <p>${element.title}</p>
        `);
    });
  })
  .catch((err) => console.error(err));
