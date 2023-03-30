import React, { useState } from 'react';
import './App.css';
import 'h8k-components';

import { Movieform, Movieslist, Search } from './components';

const title = 'Favorite Movie Directory';

const sortMovieByDuration = (movieList) => {
  const sortedMovies = movieList.sort((b, a) => {
    const aDuration = a.duration.replace('Hrs', '');
    const bDuration = b.duration.replace('Hrs', '');
    return aDuration - bDuration;
  });
  return sortedMovies;
};

function App() {
  const [movieList, setMovieList] = useState([]);
  const [showedMovies, setShowedMovies] = useState([]);
  const [durationError, setDurationError] = useState(false);
  const [init, setInit] = useState(false);

  const addMovie = ({ name, rating, duration }) => {
    const minuntesPattern = /(\d+)m/;
    const timePattern = /(\d+\.?\d*)[h|m]$/;

    if (!name || !rating || !duration) {
      return;
    }

    if (rating < 1 || rating > 100) {
      return;
    }

    if (!timePattern.test(duration)) {
      setDurationError(true);
      return;
    }
    onInit();

    if (minuntesPattern.test(duration)) {
      // convert minutes to hours
      const minutes = parseInt(duration.match(minuntesPattern)[1]);
      const hours = minutes / 60;
      duration = hours.toFixed(1) + 'Hrs';
    } else {
      // change the h for Hrs
      duration = duration.replace('h', 'Hrs');
    }

    const newMovie = {
      name,
      rating,
      duration,
    };
    setMovieList(sortMovieByDuration([...movieList, newMovie]));
    setShowedMovies(sortMovieByDuration([...movieList, newMovie]));
  };

  const onInit = () => {
    setInit(true);
  };

  const searchMovie = (searchText = '') => {
    if (searchText.length < 2) return;
    onInit();
    const filteredMovies = movieList.filter((movie) => movie.name.toLowerCase().includes(searchText.toLowerCase()));
    setShowedMovies(filteredMovies);
  };

  return (
    <div>
      <h8k-navbar header={title} />
      <div className='layout-row justify-content-center mt-100'>
        <div className='w-30 mr-75'>
          <Movieform addMovie={addMovie} setDurationError={setDurationError} durationError={durationError} />
        </div>

        <div className='layout-column w-30'>
          <Search onSearch={searchMovie} />
          {init && (
            <>
              <Movieslist list={showedMovies} />
              {showedMovies.length === 0 && (
                <div data-testid='noResult'>
                  <h3 className='text-center'>No Results Found</h3>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
