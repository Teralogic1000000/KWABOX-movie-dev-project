// TMDB API Service Configuration
// API Key is hardcoded for development

const TMDB_API_KEY = "e42f6d532f4992bd62b7098a7e58f4a1"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

// Image size configurations
export const IMAGE_SIZES = {
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    original: "original",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
}

// Helper function to build image URL
export const getImageUrl = (path, type = "poster", size = "medium") => {
  if (!path) return "/abstract-movie-poster.png"
  const sizeString = IMAGE_SIZES[type][size]
  return `${TMDB_IMAGE_BASE_URL}/${sizeString}${path}`
}

// API request helper
const fetchFromTMDB = async (endpoint, params = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
  url.searchParams.append("api_key", TMDB_API_KEY)

  Object.keys(params).forEach((key) => {
    url.searchParams.append(key, params[key])
  })

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.statusText}`)
  }
  return response.json()
}

// Get popular movies
export const getPopularMovies = async (page = 1) => {
  return fetchFromTMDB("/movie/popular", { page })
}

// Get trending movies
export const getTrendingMovies = async (timeWindow = "week") => {
  return fetchFromTMDB(`/trending/movie/${timeWindow}`)
}

// Search movies
export const searchMovies = async (query, page = 1) => {
  return fetchFromTMDB("/search/movie", { query, page })
}

// Get movie details
export const getMovieDetails = async (movieId) => {
  return fetchFromTMDB(`/movie/${movieId}`, { append_to_response: "videos,credits" })
}

// Get movie videos (trailers)
export const getMovieVideos = async (movieId) => {
  return fetchFromTMDB(`/movie/${movieId}/videos`)
}

// Get top rated movies
export const getTopRatedMovies = async (page = 1) => {
  return fetchFromTMDB("/movie/top_rated", { page })
}

// Get now playing movies
export const getNowPlayingMovies = async (page = 1) => {
  return fetchFromTMDB("/movie/now_playing", { page })
}

// Get upcoming movies
export const getUpcomingMovies = async (page = 1) => {
  return fetchFromTMDB("/movie/upcoming", { page })
}

// ======================================================
// === NEW FUNCTIONS ADDED FOR GENRE FILTERING ===
// ======================================================

// 1. Get List of Official Genres (Action, Comedy, Horror, etc.)
export const getMovieGenres = async () => {
  return fetchFromTMDB("/genre/movie/list")
}

// 2. Get Movies by Genre ID
export const getMoviesByGenre = async (genreId, page = 1) => {
  return fetchFromTMDB("/discover/movie", { 
    with_genres: genreId,
    page: page,
    sort_by: 'popularity.desc' // Show most popular movies of that genre first
  })
}