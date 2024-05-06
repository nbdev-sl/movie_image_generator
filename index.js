const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const movieName = req.query.movie_name;
  const releaseYear = req.query.year;

  // Replace 'YOUR_API_KEY' with your actual TMDb API key
  const apiKey = '2ee83c2ba4b1171fcc71b24225987fd8';
  const baseurl = 'https://api.themoviedb.org/3/search/movie';
  const params = { api_key: apiKey, query: movieName };

  try {
    const response = await axios.get(baseurl, { params });
    const results = response.data.results;

    let filteredResults = results;

    // Filter by release year if provided
    if (releaseYear) {
      filteredResults = results.filter(movie => {
        const releaseDate = new Date(movie.release_date);
        return releaseDate.getFullYear() === parseInt(releaseYear);
      });
    }

    if (filteredResults.length > 0) {
      const movieInfo = filteredResults[0]; // Take the first movie
      const {
        title,
        release_date,
        poster_path,
        backdrop_path,
        vote_count,
      } = movieInfo;

      // Constructing image URLs
      const baseImageUrl = 'https://image.tmdb.org/t/p/';
      const posterUrl = poster_path ? `${baseImageUrl}w300${poster_path}` : null; // Adjust the size as needed
      const backdropUrl = backdrop_path ? `${baseImageUrl}w1280${backdrop_path}` : null; // Adjust the size as needed

      const movie = {
        title,
        release_date,
        poster_url: posterUrl,
        backdrop_url: backdropUrl,
        vote_count,
      };

      res.json(movie);
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error) {
    console.error('Error fetching movie data:', error); // Log the error
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
