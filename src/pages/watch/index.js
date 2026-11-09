
import React, { useEffect, useState } from 'react';
import './styles.css';
import Header from '../../components/header';
import { removeQuote } from '../../assistant';
import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai';
import { IoIosPeople } from 'react-icons/io';
import { BsFillPlayFill } from 'react-icons/bs';
import { RxReload } from 'react-icons/rx';

const API_URL = 'https://back-singlens.onrender.com';

const Watch = () => {
  const [movieWatch, setMovie] = useState({});
  const [userUtility, setUserUtility] = useState({
    resume: [],
    watchlist: []
  });
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);

  const url = window.location.pathname;
  const position = url.indexOf('watch/');
  const idMovie = position !== -1
    ? url.substring(position + 6).split('/')[0]
    : '';

  const userVerify = removeQuote(localStorage.getItem('user')) || '';
  const idUser = removeQuote(localStorage.getItem('IdUser')) || '';

  useEffect(() => {
    if (userVerify.length < 10) {
      window.location.replace('/login');
    }
  }, [userVerify]);

  useEffect(() => {
    if (!idMovie) return;

    const fetchMovie = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${idMovie}?api_key=93296066cafd1a70fac5ed2532fda74f&language=pt-BR`
        );

        if (!response.ok) {
          throw new Error('Não foi possível carregar o filme.');
        }

        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Erro ao carregar filme:', error);
      }
    };

    fetchMovie();
  }, [idMovie]);

  useEffect(() => {
    if (!idUser) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/${idUser}`);

        if (!response.ok) {
          throw new Error('Não foi possível carregar os dados do usuário.');
        }

        const data = await response.json();

        setUserUtility({
          ...data,
          resume: data.resume || [],
          watchlist: data.watchlist || []
        });
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    };

    fetchUser();
  }, [idUser]);

  const timeH = movieWatch.runtime
    ? Math.floor(movieWatch.runtime / 60)
    : 0;

  const timeM = movieWatch.runtime
    ? (`00${movieWatch.runtime % 60}`).slice(-2)
    : '00';

  const year = movieWatch.release_date
    ? movieWatch.release_date.substring(0, 4)
    : '';

  const userUtilityResume = userUtility.resume || [];
  const userUtilityList = userUtility.watchlist || [];

  const isInWatchlist = userUtilityList.includes(idMovie);

  const isInResume = userUtilityResume.some(
    movieMark => movieMark?.idMovie === idMovie
  );

  function goWatch() {
    window.location.replace(`/watch-play/${idMovie}`);
  }

  function goCineWatch() {
    window.location.replace(`/cinewatch/${idMovie}`);
  }

  async function reGoWatch() {
    try {
      const arrayResume = userUtilityResume.filter(
        movieMark => movieMark?.idMovie !== idMovie
      );

      const response = await fetch(
        `${API_URL}/auth/resume/${idUser}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            resume: arrayResume
          })
        }
      );

      if (!response.ok) {
        throw new Error('Não foi possível atualizar o histórico.');
      }

      setUserUtility(previous => ({
        ...previous,
        resume: arrayResume
      }));

      window.location.replace(`/watch-play/${idMovie}`);
    } catch (error) {
      console.error('Erro ao recomeçar filme:', error);
    }
  }

  async function setWachlist() {
    if (loadingWatchlist) return;

    setLoadingWatchlist(true);

    try {
      const arrayWatchlist = isInWatchlist
        ? userUtilityList.filter(movie => movie !== idMovie)
        : [idMovie, ...userUtilityList];

      const response = await fetch(
        `${API_URL}/auth/watchlist/${idUser}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            watchlist: arrayWatchlist
          })
        }
      );

      if (!response.ok) {
        throw new Error('Não foi possível atualizar sua lista.');
      }

      setUserUtility(previous => ({
        ...previous,
        watchlist: arrayWatchlist
      }));
    } catch (error) {
      console.error('Erro ao atualizar lista:', error);
    } finally {
      setLoadingWatchlist(false);
    }
  }

  return (
    <div className="content-page-watch">
      <div className="background-img">
        {movieWatch.backdrop_path ? (
          <img
            alt="Plano de fundo do filme"
            className="title-content"
            src={`https://image.tmdb.org/t/p/w1280/${movieWatch.backdrop_path}`}
          />
        ) : ''}
      </div>

      <Header />

      <div className="content-info">
        <div className="apresentation">
          <div className="synopsis">
            {movieWatch.overview}
          </div>

          <div className="buttons-page">
            {isInResume ? (
              <div className="resume-rewatch">
                <div className="button-watch-continue" onClick={goWatch}>
                  <span>
                    <BsFillPlayFill className="play-button-watch-page" />
                    Continuar
                  </span>
                </div>

                <div className="button-watch-init" onClick={reGoWatch}>
                  <span>
                    <RxReload className="play-button-watch-page" />
                    Recomeçar
                  </span>
                </div>

                <div className="separetor-continue"></div>
              </div>
            ) : (
              <div>
                <div className="button-watch-init" onClick={goWatch}>
                  <span>
                    <BsFillPlayFill className="play-button-watch-page" />
                    Assistir Agora
                  </span>
                </div>

                <div className="separetor"></div>
              </div>
            )}

            <div className="button-cinewatch" onClick={goCineWatch}>
              <span>
                <IoIosPeople className="cinewatch" />
                CineWatch
              </span>
            </div>
          </div>
        </div>

        <div className="title-movie">
          {movieWatch.title}
        </div>

        <div className="info">
          <div className="time">
            {`${timeH}h e ${timeM}min`}
          </div>

          <div className="year">
            {year}
          </div>
        </div>

        <div className="grade">
          <div className="genres">
            {movieWatch.genres &&
              movieWatch.genres.map(genre => (
                <p key={genre.id}>
                  {genre.name}
                </p>
              ))}
          </div>
        </div>

        <div className="watchlist-solo">
          <div
            className="button-wachlist-page"
            onClick={setWachlist}
            title={
              isInWatchlist
                ? 'Remover da sua Lista'
                : 'Adicionar à sua Lista'
            }
            aria-label={
              isInWatchlist
                ? 'Remover da sua Lista'
                : 'Adicionar à sua Lista'
            }
            aria-disabled={loadingWatchlist}
          >
            {isInWatchlist ? (
              <AiOutlineCheck className="add-list-page" />
            ) : (
              <AiOutlinePlus className="add-list-page" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
