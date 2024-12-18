console.log('connecté')
//Search Params
const url = new URL(window.location.href)
console.log(url)
const params = new URLSearchParams(url.search);
console.log(params)
const id = params.get('id');
console.log(id)

let detailContainer = document.getElementById("detail")

fetch("http://localhost:3000/event")
.then(response => response.json())
.then(data => {
    let users = data
    console.log(users)
    const user = users.find(user => user.id === parseInt(id))
    console.log(user)
    detailContainer.innerHTML += `
       <div class="card-Detail">
           <div class="card-image">
            <img src="${user.photo}" alt="Image de l'événement">
        </div>
        <div class="card-content">
            <h2 class="title">${user.title}</h2>
            <p class="dates">Dates : ${user.dates}</p>
            <p class="location">Localisation : ${user.location.city}</p>
            <p class="availability">Places disponibles : ${user.available_spots}</p>
            <p class="prix">Prix : ${user.price} €</p>
            <p class="descriptionDetail">Description : ${user.description}
        </div>
        </div>
        `
        let availabilityElement = detailContainer.querySelector('.card-content .availability');

    if (user.available_spots > 0) {
      availabilityElement.style.color = 'green';
      availabilityElement.textContent = "Place disponible";
    } else {
      availabilityElement.style.color = 'red';
      availabilityElement.textContent = "Place indisponible";
    }
  
})
.catch(err => console.error(err));
