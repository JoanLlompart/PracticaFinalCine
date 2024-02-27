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
        movies.forEach(async movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            const image = document.createElement('img');
            image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            image.alt = movie.title;
            image.setAttribute('data-trailer-id', movie.id); // Agregar el ID del trailer como atributo de datos

            // Agregar evento de clic a la imagen
            image.addEventListener('click', () => {
                const trailerId = image.getAttribute('data-trailer-id');
                displayMovieInfo(trailerId);
            });

            const title = document.createElement('h2');
            title.textContent = movie.title;
            movieCard.appendChild(image);
            movieCard.appendChild(title);
            movieContainer.appendChild(movieCard);
        });

    } catch (error) {
        console.error('Error al obtener las películas:', error);
    }
}

// Función para obtener los nombres de género a partir de los identificadores de género
async function getGenreNames(genreIds) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=es`);
        const data = await response.json();
        const genres = data.genres;

        return genreIds.map(genreId => {
            const genre = genres.find(genre => genre.id === genreId);
            return genre ? genre.name : 'Desconocido';
        }).join(', ');
    } catch (error) {
        console.error('Error al obtener los nombres de género:', error);
        return 'Desconocido';
    }
}

// Función para mostrar la información de una película en el modal
async function displayMovieInfo(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es`);
        const movie = await response.json();

        const modalTitle = document.querySelector('#movieModalLabel');
        modalTitle.textContent = movie.title;

        const modalBody = document.querySelector('#movieModalBody');
        modalBody.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="img-fluid">
            <p style="font-size: 16px; color: #333; margin-top: 10px;"><strong>Descripción:</strong> ${movie.overview}</p>
            <p style="font-size: 14px; color: #333;"><strong>Género:</strong> ${await getGenreNames(movie.genres.map(genre => genre.id))}</p>
            <p style="font-size: 14px; color: #333;"><strong>Valoración:</strong> ${movie.vote_average}</p>
            <div id="trailerPlayer"></div>
        `;

        if (movie.videos?.results && movie.videos.results.length > 0) {
            const trailerKey = movie.videos.results[0].key;
            const trailerPlayer = document.getElementById('trailerPlayer');
            trailerPlayer.innerHTML = `
                <iframe width="100%" height="315" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe>
            `;
        } else {
            modalBody.innerHTML += '<p style="font-size: 14px; color: #666;">No se encontró trailer disponible</p>';
        }

        $('#movieModal').modal('show'); // Muestra el modal
    } catch (error) {
        console.error('Error al obtener la información de la película:', error);
    }
}


// Llamar a la función para obtener las películas cuando la página se cargue
document.addEventListener('DOMContentLoaded', fetchMovies);
