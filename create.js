
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
        
        let nouvelID = parseInt(dernierElement.id) + 1;  // **Surligné : Ajouter 1 à l'ID du dernier événement**

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
        window.location.href="index.html"
    })
    .catch(err => console.error('Erreur lors de la récupération des événements:', err));
});