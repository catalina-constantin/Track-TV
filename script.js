async function fetchTrendingMovies() {
    try {
        const response = await fetch('https://ghibliapi.vercel.app/films');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched movies:', data);
        localStorage.setItem('trendingMovies', JSON.stringify(data));
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

fetchTrendingMovies();