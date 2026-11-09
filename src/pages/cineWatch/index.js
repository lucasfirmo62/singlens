import React, { useCallback, useEffect, useRef, useState } from 'react';
import './styles.css';
import Header from '../../components/header';
import { removeQuote } from '../../assistant';
import api from '../../api';

const AVATARS = {
  1: 'nPO29qu.jpeg',
  2: 'oYBkmhj.jpeg',
  3: '5Pcx3Vq.jpeg',
  4: 'vAP7kdO.jpeg',
  5: 'sZyMbsu.jpeg',
  6: 'mDLxGQ9.jpeg',
};

const Watch = () => {
  const [movieWatch, setMovie] = useState({});
  const [userUtility, setUserUtility] = useState({});
  const [participants, setParticipants] = useState([]);

  const redirecting = useRef(false);

  const idMovie =
    window.location.pathname.split('/watch/')[1]?.split('/')[0] || '';

  const userVerify = removeQuote(localStorage.getItem('user') || '');
  const idUser = removeQuote(localStorage.getItem('IdUser') || '');

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
        console.error('Erro ao buscar filme:', error);
      }
    };

    fetchMovie();
  }, [idMovie]);

  useEffect(() => {
    if (!idUser) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `https://brave-red-blazer.cyclic.app/auth/${idUser}`
        );

        if (!response.ok) {
          throw new Error('Não foi possível carregar os dados do usuário.');
        }

        const data = await response.json();
        setUserUtility(data);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };

    fetchUser();
  }, [idUser]);

  useEffect(() => {
    if (userUtility.cineWatch?.cineWatchState === 'true') {
      window.location.replace(`/cinewatch-play/${idMovie}`);
    }
  }, [userUtility.cineWatch?.cineWatchState, idMovie]);

  const runtime = movieWatch.runtime || 0;
  const timeH = String(Math.floor(runtime / 60)).padStart(2, '0');
  const timeM = String(runtime % 60).padStart(2, '0');
  const year = movieWatch.release_date?.substring(0, 4);

  const goCineWatch = useCallback(async () => {
    if (redirecting.current) return;

    redirecting.current = true;

    try {
      await api.post(
        `/auth/cinewatchpresession/${idUser}`,
        { cineWatchMovieId: idMovie },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      window.location.replace(`/cinewatch-play/${idMovie}`);
    } catch (error) {
      redirecting.current = false;
      console.error('Erro ao iniciar sessão:', error);
    }
  }, [idUser, idMovie]);

  const searchPeoplesCine = useCallback(async () => {
    try {
      const response = await fetch(
        `https://brave-red-blazer.cyclic.app/auth/cinewatch/${idMovie}`
      );

      if (!response.ok) {
        throw new Error('Não foi possível buscar os participantes.');
      }

      const data = await response.json();
      setParticipants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar participantes:', error);
    }
  }, [idMovie]);

  const verifyEnterCineWatch = useCallback(async () => {
    if (userUtility.cineWatchMovieId !== idMovie || redirecting.current) {
      return;
    }

    try {
      const response = await fetch(
        `https://brave-red-blazer.cyclic.app/auth/cinewatch/${idMovie}`
      );

      if (!response.ok) {
        throw new Error('Não foi possível verificar a sessão.');
      }

      const data = await response.json();

      if (!Array.isArray(data)) return;

      const sessionStarted = data.some(
        user => user.cineWatch?.cineWatchState === 'true'
      );

      if (sessionStarted) {
        await goCineWatch();
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
  }, [idMovie, userUtility.cineWatchMovieId, goCineWatch]);

  useEffect(() => {
    if (!idMovie) return;

    searchPeoplesCine();

    const timer = setInterval(() => {
      searchPeoplesCine();
    }, 2000);

    return () => clearInterval(timer);
  }, [idMovie, searchPeoplesCine]);

  useEffect(() => {
    if (!idMovie || userUtility.cineWatchMovieId !== idMovie) return;

    const timer = setInterval(() => {
      verifyEnterCineWatch();
    }, 1000);

    return () => clearInterval(timer);
  }, [idMovie, userUtility.cineWatchMovieId, verifyEnterCineWatch]);

  const enterSession = async () => {
    const cineMark = {
      cineWatchState: 'false',
      cineWatchTime: '0',
      cineWatchMovieId: idMovie,
    };

    try {
      await api.post(
        `/auth/cinewatchpresession/${idUser}`,
        { cineWatchMovieId: idMovie },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      await api.post(
        `/auth/cinewatch/${idUser}`,
        { cineWatch: cineMark },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      window.location.reload();
    } catch (error) {
      console.error('Erro ao entrar na sessão:', error);
    }
  };

  const exitSession = async () => {
    try {
      await api.post(
        `/auth/cinewatchpresession/${idUser}`,
        { cineWatchMovieId: '' },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      await api.post(
        `/auth/cinewatch/${idUser}`,
        { cineWatch: [] },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      window.location.reload();
    } catch (error) {
      console.error('Erro ao sair da sessão:', error);
    }
  };

  return (
    <div className="content-page-cinewatch">
      <div className="background-img-inside">
        {movieWatch.backdrop_path && (
          <img
            alt="Plano de fundo do filme"
            className="title-content"
            src={`https://image.tmdb.org/t/p/w1280/${movieWatch.backdrop_path}`}
          />
        )}
      </div>

      <div className="background-img-cine">
        <img
          alt="Plano de fundo do CineWatch"
          className="title-content"
          src="https://i.imgur.com/pfJ16n5.png"
        />
      </div>

      <Header />

      <div className="content-info-cine">
        <div className="apresentation-cine">
          <div className="title-movie-cine">
            {movieWatch.title}
          </div>

          <div className="info-cine">
            <div className="time-cine">
              {`${timeH}h e ${timeM}min`}
            </div>

            <div className="year-cine">
              {year}
            </div>
          </div>

          <div className="grade-cine">
            <div className="genres-cine">
              {movieWatch.genres?.map(genre => (
                <p key={genre.id}>{genre.name}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="button-cine">
          <a
            href={`/cinewatch-play/${idMovie}`}
            onClick={event => {
              event.preventDefault();
              goCineWatch();
            }}
          >
            Iniciar Sessão
          </a>
        </div>
      </div>

      <div className="painel-peoples">
        <div id="avatar"></div>

        <div className="card-people" id="card-people">
          {participants.map((participant, index) => {
            const avatar = AVATARS[participant.avatar];

            return (
              <div
                className="card-people"
                key={participant._id || participant.id || index}
              >
                <p>{participant.name}</p>

                {avatar && (
                  <img
                    className="avatar"
                    src={`https://i.imgur.com/${avatar}`}
                    alt={`Avatar de ${participant.name}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {userUtility.cineWatchMovieId === idMovie ? (
        <button
          type="button"
          className="exit-session"
          id="exit-session"
          onClick={exitSession}
        >
          <p>Cancelar</p>
        </button>
      ) : (
        <button
          type="button"
          className="enter-session"
          id="enter-session"
          onClick={enterSession}
        >
          <p>PRONTO PARA A SESSÃO</p>
        </button>
      )}
    </div>
  );
};

export default Watch;