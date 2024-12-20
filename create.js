// ------Formulaire récupération de donnée ------
const form = document.getElementById("event-form");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Récupérer les données du formulaire
  const formData = new FormData(form);
  const photo = formData.get("photo"); // Récupérer la photo
  const title = formData.get("title");
  const city = formData.get("city");
  const date = formData.get("date");
  const description = formData.get("description");
  const placesDisponibles = formData.has("places_disponibles");
  // Récupérer l'ID du dernier événement et ajouter 1 à cet ID
  fetch("http://localhost:3000/event")
    .then((res) => res.json())
    .then((data) => {
      let dernierElement = data.reduce(
        (max, element) => {
          return element.id > max.id ? element : max;
        },
        { id: -Infinity }
      );

      let nouvelID = (parseInt(dernierElement.id) + 1).toString(); // Ajouter 1 à l'ID du dernier événement
      // Construire l'objet événement à envoyer
      const newEvent = {
        id: nouvelID,
        photo: photo.name,
        dates: [date],
        title: `${title}`,
        location: {
          city: city,
          country: "France",
          latitude: 48.8566,
          longitude: 2.3522,
        },
        available_spots: placesDisponibles,
        price: 50,
        description: description,
        organizer: "Organisateur de l'événement",
      };
      console.log(newEvent);
      // --------Method POST du Formulaire -----------------
      fetch("http://localhost:3000/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent), // Convertir l'objet en JSON
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Événement ajouté :", data);
          alert("Événement ajouté avec succès !");
          form.reset();
        })
        .catch((error) => {
          console.log("Erreur :", error);
          alert("Une erreur est survenue.");
        });
      window.location.href = "index.html";
    })
    .catch((err) =>
      console.error("Erreur lors de la récupération des événements:", err)
    );
});
