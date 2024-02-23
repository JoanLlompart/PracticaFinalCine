
// JavaScript para consumir la API y mostrar las imágenes de las películas
const apiKey = '94b49414abe2bf22eaea7d2de2623815'; // Reemplaza 'TU_API_KEY' con tu clave de API

// Función para obtener las imágenes de películas de la API
async function fetchMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es`);
        const data = await response.json();
        const movies = data.results;

        const movieContainer = document.getElementById('movie-container');

        // Limpiar el contenedor antes de agregar nuevas películas
        movieContainer.innerHTML = '';

        // Iterar sobre las películas y crear tarjetas para cada una
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            const image = document.createElement('img');
            image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            image.alt = movie.title;

            movieCard.appendChild(image);
            movieContainer.appendChild(movieCard);
        });
    } catch (error) {
        console.error('Error al obtener las películas:', error);
    }
}

// Llamar a la función para obtener las películas cuando la página se cargue
document.addEventListener('DOMContentLoaded', fetchMovies);