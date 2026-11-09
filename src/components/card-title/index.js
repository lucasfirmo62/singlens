import React, { useEffect, useState } from 'react';
import './styles.css';
import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai';
import { BsFillPlayFill } from 'react-icons/bs';
import { removeQuote } from '../../assistant';
import api from '../../api';

const CardTitle = ({ id }) => {
  const [movie, setMovie] = useState({});
  const [reviews, setReviews] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [userUtility, setUserUtility] = useState({
    watchlist: [],
    resume: []
  });

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
    const url = `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=93296066cafd1a70fac5ed2532fda74f&language=en-US&page=1`;

    fetch(url)
      .then(response => response.json())
      .then(data => setReviews(data.results || []))
      .catch(error => console.error('Erro ao buscar avaliações:', error));
  }, [id]);

  useEffect(() => {
    const url = 'https://api.npoint.io/485606789b28296238fd';

    fetch(url)
      .then(response => response.json())
      .then(data => setAllMovies(data.movies || []))
      .catch(error => console.error('Erro ao buscar filmes:', error));
  }, []);

  useEffect(() => {
    if (!idUser) return;

    const url = `https://brave-red-blazer.cyclic.app/auth/${idUser}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setUserUtility({
          watchlist: data.watchlist || [],
          resume: data.resume || []
        });
      })
      .catch(error => console.error('Erro ao buscar dados do usuário:', error));
  }, [idUser]);

  const posterMovie = allMovies.find(
    item => String(item.id) === String(id)
  )?.poster;

  const backdrop = posterMovie
    ? `https://i.imgur.com/${posterMovie}`
    : backdropUndefined;

  const userUtilityList = userUtility.watchlist || [];
  const userUtilityResume = userUtility.resume || [];

  const infoResume = userUtilityResume.find(
    movieMark => movieMark?.idMovie === id
  );

  const ratings = reviews
    .map(review => Number(review.author_details?.rating))
    .filter(rating => Number.isFinite(rating) && rating > 0);

  const averageRating = ratings.length > 0
    ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length
    : null;

  const ratingMovie = averageRating !== null
    ? ((Number(movie.vote_average || 0) + averageRating) / 2).toFixed(1)
    : Number(movie.vote_average || 0).toFixed(1);

  function goWatch() {
    window.location.replace(`/watch-play/${id}`);
  }

  async function setWachlist() {
    try {
      const response = await fetch(
        `https://brave-red-blazer.cyclic.app/auth/${idUser}`
      );

      if (!response.ok) {
        throw new Error('Não foi possível buscar a watchlist.');
      }

      const userContent = await response.json();
      const arrayWatchlist = [...(userContent.watchlist || [])];

      const index = arrayWatchlist.indexOf(id);

      if (index > -1) {
        arrayWatchlist.splice(index, 1);
      } else {
        arrayWatchlist.unshift(id);
      }

      await api.post(`/auth/watchlist/${idUser}`, {
        watchlist: arrayWatchlist
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setUserUtility(previous => ({
        ...previous,
        watchlist: arrayWatchlist
      }));
    } catch (error) {
      console.error('Erro ao atualizar watchlist:', error);
    }
  }

  return (
    <div className='content-card-movie'>
      <a href={`/watch/${id}`}>
        <div className='solo-back'>
          <img
            src={backdrop}
            className='backdrop'
            alt={movie.title || 'Pôster do filme'}
          />
        </div>
      </a>

      <div className='bar'>
        <div className='rating-movie' title='Crítica Agregada'>
          {ratingMovie.substring(0, 3)}
        </div>

        {infoResume ? (
          <div>
            <BsFillPlayFill
              onClick={goWatch}
              className='resume-movie'
            />

            <p
              className='watch-now-title-resume'
              onClick={goWatch}
              title={`Continuar ${movie.title}`}
            >
              Continue assistindo
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
              className='play-movie'
            />

            <p
              className='watch-now-title'
              onClick={goWatch}
            >
              Assistir agora
            </p>
          </div>
        )}

        <div
          className='button-wachlist'
          onClick={setWachlist}
        >
          {userUtilityList.includes(id) ? (
            <AiOutlineCheck className='add-list' />
          ) : (
            <AiOutlinePlus className='add-list' />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardTitle;