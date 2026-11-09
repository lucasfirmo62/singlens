import React, { useEffect, useState } from 'react';
import './styles.css';
import { BsFillPlayFill } from 'react-icons/bs';
import { removeQuote } from '../../assistant';

const CardLitleTitlePoster = ({ id }) => {
  const [movie, setMovie] = useState({});
  const [userUtility, setUserUtility] = useState({});
  
  const idUser = removeQuote(localStorage.getItem('IdUser'));
  const backdropUndefined = removeQuote(localStorage.getItem('undefined-image'));

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=93296066cafd1a70fac5ed2532fda74f&language=pt-BR`;

    fetch(url)
      .then(response => response.json())
      .then(data => setMovie(data))
      .catch(error => console.error('Erro ao buscar filme:', error));
  }, [id]);

  useEffect(() => {
    const url = `https://brave-red-blazer.cyclic.app/auth/${idUser}`;

    fetch(url)
      .then(response => response.json())
      .then(data => setUserUtility(data))
      .catch(error => console.error('Erro ao buscar dados do usuário:', error));
  }, [idUser]);

  const userUtilityResume = userUtility?.resume || [];

  const infoResume = userUtilityResume.find(
    movieMark => movieMark?.idMovie === id
  );

  const posterMovieTitle = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : backdropUndefined;

  function goWatch() {
    window.location.replace(`/watch-play/${id}`);
  }

  return (
    <div className='content-card-movie'>
      <a href={`/watch/${id}`}>
        <div className='solo-back-poster-little'>
          <img
            src={posterMovieTitle}
            className='backdrop-poster-little'
            alt={movie.title || 'Pôster do filme'}
          />
        </div>
      </a>

      <div className='bar'>
        <div className='little-rating-movie'></div>

        {infoResume ? (
          <div>
            <BsFillPlayFill
              onClick={goWatch}
              className='resume-movie'
            />

            <p
              className='watch-now-title-resume-little'
              onClick={goWatch}
              title={`Continuar ${movie.title}`}
            >
              Continuar
            </p>

            <div className='current-percentage-background'>
              <div
                style={{ width: `${infoResume.currentTimeMovie}%` }}
                className='current-percentage'
              ></div>
            </div>
          </div>
        ) : (
          <div>
            <BsFillPlayFill
              onClick={goWatch}
              className='play-movie-little'
            />

            <p
              className='watch-now-title-little'
              onClick={goWatch}
            >
              Assistir
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardLitleTitlePoster;