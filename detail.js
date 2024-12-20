// ------Search Params ---------
const url = new URL(window.location.href);
console.log(url);
const params = new URLSearchParams(url.search);
console.log(params);
const id = params.get("id");
console.log(id);

let detailContainer = document.getElementById("detail");
// ---------Fetch pour afficher les détails sur la page---------
fetch("http://localhost:3000/event")
  .then((response) => response.json())
  .then((data) => {
    let users = data;
    console.log(users);
    const user = users.find((user) => user.id == id);
    console.log(user);
    detailContainer.innerHTML += `
       <div class="card-Detail">
           <div class="card-image">
            <img src="${user.photo}" alt="Image de l'événement">
        </div>
        <div class="card-content">
            <h2 class="title">${user.title}</h2>
            <h5 class="dates">Dates : ${user.dates}</h5>
            <h5 class="location">Localisation : ${user.location.city}</h5>
            <h3 class="organisateur">Organisateur : ${user.organizer}</h3>
            <p class="descriptionDetail">Description : ${user.description}</p>
            <p class="prix">Prix : ${user.price} €</p>
            <p class="availability">Places disponibles : ${user.available_spots}</p>
        </div>
        </div>
        `;
    let availabilityElement = detailContainer.querySelector(
      ".card-content .availability"
    );

    if (user.available_spots > 0) {
      availabilityElement.style.color = "green";
      availabilityElement.textContent = "Place disponible";
    } else {
      availabilityElement.style.color = "red";
      availabilityElement.textContent = "Place indisponible";
    }
  })
  .catch((err) => console.error(err));

// -----------Btn Delete -------------
const btnDelete = document.getElementById("btn-delete");

btnDelete
  .addEventListener("click", () => {
    if (!id) {
      alert("L'ID de l'événement est introuvable.");
      return;
    }
    const confirmation = confirm(
      "Êtes-vous sûr de vouloir supprimer cet événement ?"
    );

    fetch(`http://localhost:3000/event/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Supprimé avec succès !");
      })
      .catch((error) => {
        console.error("Erreur :", error);
      });
    window.location.href = "index.html";
  })
  .catch((err) =>
    console.error("Erreur lors de la récupération des événements:", err)
  );
