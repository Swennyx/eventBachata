
const card = document.getElementById('event');

var map = L.map('map').setView([46.166667, -1.150000], 5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

fetch("http://localhost:3000/event")
.then(res => res.json())
.then(data => {
    console.log(data);
    // Recupere le dernier element pour son ID
    let dernierElement = data.reduce((max, element) => {
        return element.id > max.id ? element : max;
    }, { id: -Infinity });


    data.forEach(element => {
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
        let availability = card.querySelectorAll('.card .availability[data-available-spots="' + element.available_spots + '"]');
        
        // Appliquer la couleur et le texte pour chaque élément individuellement
        availability.forEach(item => {
            if (element.available_spots > 0) {
                item.style.color = 'green';
                item.textContent = "Place disponible";
            } else {
                item.style.color = 'red';
                item.textContent = "Place indisponible";
            }
        });

        // Ajouter le marqueur sur la carte
        let marker = L.marker([element.location.latitude, element.location.longitude]).addTo(map);
        marker.bindPopup(`
            <img src="${element.photo}" alt="Image de l'événement" style="object-fit: cover;width: 100%;">
            <p>${element.title}</p>
        `);
        console.log(marker);
    });
})
.catch(err => console.error(err));

const form = document.getElementById('event-form');

// Lors de la soumission du formulaire
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche l'envoi par défaut du formulaire

    // Récupérer les données du formulaire
    const formData = new FormData(form);
    const photo = formData.get('photo'); // Récupérer la photo
    const title = formData.get('title');
    const city = formData.get('city');
    const date = formData.get('date');
    const description = formData.get('description');
    const placesDisponibles = formData.has('places_disponibles');

    // **Surligné : Récupérer l'ID du dernier événement et ajouter 1 à cet ID**
    fetch("http://localhost:3000/event")
    .then(res => res.json())
    .then(data => {
        let dernierElement = data.reduce((max, element) => {
            return element.id > max.id ? element : max;
        }, { id: -Infinity });
        
        let nouvelID = dernierElement.id + 1;  // **Surligné : Ajouter 1 à l'ID du dernier événement**

        // Construire l'objet événement à envoyer
        const newEvent = {
            id: parseInt(nouvelID),  // **Surligné : Utiliser l'ID incrémenté**
            photo: photo.name, // Nom du fichier
            dates: [date], // Liste des dates
            title: `${title}`, // Titre simple basé sur les villes
            location: {
                city: city,
                country: "France", // Exemple, tu peux ajouter un champ pour le pays si nécessaire
                latitude: 48.8566, // Exemple, remplace avec des données réelles
                longitude: 2.3522
            },
            available_spots: placesDisponibles,
            price: 50, // Exemple de prix, tu peux ajouter un champ pour le prix si nécessaire
            description: description,
            organizer: "Organisateur de l'événement" // Exemple d'organisateur
        };

        // Envoyer les données au serveur json-server
        fetch('http://localhost:3000/event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEvent) // Convertir l'objet en JSON
        })
        .then(response => response.json())
        .then(data => {
            console.log('Événement ajouté :', data);
            alert('Événement ajouté avec succès !');
            // Réinitialiser le formulaire après soumission
            form.reset();
        })
        .catch(error => {
            console.error('Erreur :', error);
            alert('Une erreur est survenue.');
        });
    })
    .catch(err => console.error('Erreur lors de la récupération des événements:', err));
});