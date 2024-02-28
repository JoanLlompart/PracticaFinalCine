const apiKey = '94b49414abe2bf22eaea7d2de2623815';
let currentMovieId;

async function fetchMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es`);
        const data = await response.json();
        const movies = data.results;

        const movieContainer = document.getElementById('movie-container');
        movieContainer.innerHTML = '';

        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            const image = document.createElement('img');
            image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            image.alt = movie.title;
            image.dataset.trailerId = movie.id; // Utilizar dataset en lugar de setAttribute

            image.addEventListener('click', () => {
                const trailerId = image.dataset.trailerId; // Utilizar dataset para obtener el valor
                currentMovieId = trailerId;
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

async function searchByDate() {
    try {
        const dateInput = document.getElementById('dateInput').value;
        console.log(dateInput);
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es&release_date.gte=${dateInput}&release_date.lte=${dateInput}`);
        const data = await response.json();
        const movies = data.results;
        console.log(movies);
        const movieContainer = document.getElementById('movie-container');
        movieContainer.innerHTML = '';

        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            const image = document.createElement('img');
            image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            image.alt = movie.title;
            image.dataset.trailerId = movie.id; // Utilizar dataset en lugar de setAttribute

            image.addEventListener('click', () => {
                const trailerId = image.dataset.trailerId; // Utilizar dataset para obtener el valor
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

async function displayMovieInfo(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es`);
        const movie = await response.json();

        const modalTitle = document.querySelector('#movieModalLabel');
        modalTitle.textContent = movie.title;

        const modalBody = document.querySelector('#movieModalBody');
        modalBody.innerHTML = `
        <div class="d-flex">
        <div class="image">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="img-fluid">
        </div>
        <div class="information">
            <p style="font-size: 16px; color: #333; margin-top: 10px;"><strong>Descripción:</strong> ${movie.overview}</p>
            <p style="font-size: 14px; color: #333;"><strong>Género:</strong> ${await getGenreNames(movie.genres.map(genre => genre.id))}</p>
            <p style="font-size: 14px; color: #333;"><strong>Valoración:</strong> ${movie.vote_average}</p>
            <p style="font-size: 14px; color: #333;"><strong>Popularidad:</strong> ${movie.popularity}</p>
            <p style="font-size: 14px; color: #333;"><strong>Fecha de lanzamiento:</strong> ${movie.release_date}</p>
            <p style="font-size: 14px; color: #333;"><strong>Revenue:</strong> ${movie.revenue}</p>
            <div id="trailerPlayer"></div>
        </div>
    </div>

        `;

        const trailerPlayer = document.getElementById('trailerPlayer');
        trailerPlayer.innerHTML = `
            <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${movieId}" frameborder="0" allowfullscreen></iframe>
        `;

        // Llama a la función openTrailerModal después de que se ha mostrado el modal
        openTrailerModal(movieId);


        $('#movieModal').modal('show');
    } catch (error) {
        console.error('Error al obtener la información de la película:', error);
    }
}

async function openTrailerModal(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const trailerKey = data.results[0].key;
            const trailerUrl = `https://www.youtube.com/embed/${trailerKey}`;

            const trailerPlayer = document.getElementById('trailerPlayer');
            trailerPlayer.innerHTML = `
                <iframe width="100%" height="200" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>
            `;
        } else {
            console.error('No se encontraron trailers para esta película.');
        }
    } catch (error) {
        console.error('Error al obtener el trailer de la película:', error);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    fetchMovies();

    // Agregar un evento click al botón de búsqueda por fecha
    const searchByDateBtn = document.getElementById('searchByDateBtn');
    searchByDateBtn.addEventListener('click', searchByDate);
});
