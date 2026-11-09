
import React, { useEffect, useState } from 'react';
import './styles.css';
import Header from '../../components/header';
import { removeQuote } from '../../assistant';
import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai';
import { IoIosPeople } from 'react-icons/io';
import { BsFillPlayFill } from 'react-icons/bs';
import { RxReload } from 'react-icons/rx';
import api from '../../api';

const Watch = () => {
  const [movieWatch, setMovie] = useState([]);
  const [userUtility, setUserUtility] = useState([]);

  const [toogleRemove, setToogleRemove] = useState(true);
  const [removeMovie, setRemove] = useState(
    <AiOutlineCheck className="add-list-page" />
  );

  useEffect(() => {
    setRemove(
      toogleRemove
        ? <AiOutlineCheck className="add-list-page" />
        : <AiOutlinePlus className="add-list-page" />
    );
  }, [toogleRemove]);

  const [toogleAdd, setToogleAdd] = useState(true);
  const [addMovie, setAdd] = useState(
    <AiOutlinePlus className="add-list-page" />
  );

  useEffect(() => {
    setAdd(
      toogleAdd
        ? <AiOutlinePlus className="add-list-page" />
        : <AiOutlineCheck className="add-list-page" />
    );
  }, [toogleAdd]);

  const url = window.location.href;
  const position = url.indexOf("watch/");
  const idMovie = url.substring(position + 6, position + 106);

  const userVerify = removeQuote(localStorage.getItem('user'));

  const idUser = removeQuote(localStorage.getItem('IdUser'));

  if (userVerify.length < 10) {
    window.location.replace('/login');
  }

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${idMovie}?api_key=93296066cafd1a70fac5ed2532fda74f&language=pt-BR`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setMovie(data);
      });
  }, [idMovie]);

  const timeH = movieWatch.runtime
    ? Math.floor(movieWatch.runtime / 60)
    : 0;

  const timeM = movieWatch.runtime
    ? (`00${movieWatch.runtime % 60}`).slice(-2)
    : '00';

  const year = movieWatch.release_date
    ? movieWatch.release_date.substring(0, 4)
    : '';

  function goWatch() {
    window.location.replace(`/watch-play/${idMovie}`);
  }

  function reGoWatch() {
    const arrayResume = userUtility.resume || [];
    const idmv = idMovie;

    const result = arrayResume.find(
      movieMark => movieMark.idMovie === idmv
    );

    const index = arrayResume.indexOf(result);

    if (index > -1) {
      arrayResume.splice(index, 1);
    }

    const data = { resume: arrayResume };

    api.post(`/auth/resume/${idUser}`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    window.location.replace(`/watch-play/${idMovie}`);
  }

  function goCineWatch() {
    window.location.replace(`/cinewatch/${idMovie}`);
  }

  useEffect(() => {
    const url = `https://back-singlens.onrender.com/auth/${idUser}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setUserUtility(data);
      });
  }, [idUser]);

  const UserUtilityResume = userUtility.resume;
  const UserUtilityList = userUtility.watchlist;

  async function setWachlist() {
    setToogleAdd(stateAdd => !stateAdd);
    setToogleRemove(stateRMV => !stateRMV);

    const url = `https://back-singlens.onrender.com/auth/${idUser}`;

    try {
      const response = await fetch(url);

      if (response.status === 200) {
        const userContent = await response.json();
        await add(userContent);
      }
    } catch (error) {
      console.error('Erro ao acessar a lista:', error);
    }
  }

  async function add(userContent) {
    const arrayWatchlist = userContent.watchlist || [];

    if (arrayWatchlist.includes(idMovie)) {
      const index = arrayWatchlist.indexOf(idMovie);

      if (index > -1) {
        arrayWatchlist.splice(index, 1);
      }
    } else {
      arrayWatchlist.unshift(idMovie);
    }

    const data = {
      watchlist: arrayWatchlist
    };

    await api.post(`/auth/watchlist/${idUser}`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  return (
    <div className="content-page-watch">
      <div className="background-img">
        {movieWatch.backdrop_path ? (
          <img
            alt="background"
            className="title-content"
            src={`https://image.tmdb.org/t/p/w1280/${movieWatch.backdrop_path}`}
          />
        ) : ""}
      </div>

      <Header />

      <div className="content-info">
        <div className="apresentation">
          <div className="synopsis">
            {movieWatch.overview}
          </div>

          <div className="buttons-page">
            {UserUtilityResume?.find(
              movieMark => movieMark?.idMovie === idMovie
            ) ? (
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
              movieWatch.genres.map((genre, index) => (
                <p key={`${genre.id}-${index}`}>
                  {genre.name}
                </p>
              ))}
          </div>
        </div>

        {UserUtilityList?.includes(idMovie) === true ? (
          <div className="watchlist-solo">
            <div
              className="button-wachlist-page"
              onClick={setWachlist}
              title="Remover da sua Lista"
            >
              {removeMovie}
            </div>
          </div>
        ) : (
          <div className="watchlist-solo">
            <div
              className="button-wachlist-page"
              onClick={setWachlist}
              title="Adicionar à sua Lista"
            >
              {addMovie}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watch;
