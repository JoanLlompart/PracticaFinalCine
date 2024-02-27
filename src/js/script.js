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
                // Abrir ventana modal o reproducir el trailer
                window.open(`https://www.youtube.com/watch?v=${trailerId}`, '_blank');
            });

            const title = document.createElement('h2');
            title.textContent = movie.title;

            const description = document.createElement('p');
            description.textContent = truncateDescription(movie.overview, 100);

            const genre = document.createElement('h3');
            genre.textContent = 'Género: ' + await getGenreNames(movie.genre_ids);
            genre.classList.add('movie-card');

            //const duration = document.createElement('p');
            //duration.textContent = 'Duración: ' + movie.runtime + ' minutos';

            const rating = document.createElement('p');
            rating.textContent = 'Valoración: ' + movie.vote_average;

            const readMoreLink = document.createElement('a');
            readMoreLink.textContent = 'Leer más';
            readMoreLink.href = '#'; // Agrega aquí el enlace a la descripción completa
            readMoreLink.onclick = function () {
                alert(movie.overview); // Muestra la descripción completa en una ventana emergente
                return false; // Evita que el enlace redirija a una nueva página
            };

            description.appendChild(readMoreLink);

            movieCard.appendChild(image);
            movieCard.appendChild(title);
            movieCard.appendChild(rating);
            movieCard.appendChild(genre);
            //movieCard.appendChild(duration);
            movieCard.appendChild(description);

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

// Función para truncar la descripción a un número específico de caracteres
function truncateDescription(description, maxLength) {
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
    }
    return description;
}

// Agrega un manejador de eventos click a las imágenes de las películas para abrir el modal con la información
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('movie-img')) {
        const movieId = event.target.dataset.movieId;
        displayMovieInfo(movieId);
    }
});

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
            <p><strong>Descripción:</strong> ${movie.overview}</p>
            <p><strong>Género:</strong> ${await getGenreNames(movie.genres.map(genre => genre.id))}</p>
            <p><strong>Valoración:</strong> ${movie.vote_average}</p>
            <p><strong>Trailer:</strong> <a href="https://www.youtube.com/watch?v=${movie.videos.results[0].key}" target="_blank">Ver Trailer</a></p>
        `;

        $('#movieModal').modal('show'); // Muestra el modal
    } catch (error) {
        console.error('Error al obtener la información de la película:', error);
    }
}

// Llamar a la función para obtener las películas cuando la página se cargue
document.addEventListener('DOMContentLoaded', fetchMovies);
