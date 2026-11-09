
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles.css';

import { FaPlay, FaPause } from 'react-icons/fa';
import {
  BsArrowsAngleExpand,
  BsArrowsAngleContract
} from 'react-icons/bs';
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
  MdOutlineSubtitles
} from 'react-icons/md';
import { BiArrowBack } from 'react-icons/bi';

import { removeQuote } from '../../assistant';
import api from '../../api';

function getMovieId() {
  const path = window.location.pathname;
  const position = path.indexOf('watch-play/');

  return position !== -1
    ? path.substring(position + 11).split('/')[0]
    : '';
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return '00:00:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return [hours, minutes, remainingSeconds]
    .map(value => String(value).padStart(2, '0'))
    .join(':');
}

function timeToSeconds(time) {
  const parts = time.split(':').map(Number);

  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return 0;
  }

  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

function usePlayerState(videoRef, idMovie) {
  const [userUtility, setUserUtility] = useState({ resume: [] });
  const [playerState, setPlayerState] = useState({
    playing: false,
    percentage: 0
  });

  const lastSavedTime = useRef('');
  const idUser = removeQuote(localStorage.getItem('IdUser') || '');

  const [subtitleText, setSubtitleText] = useState('');
  const [subtitleEnabled, setSubtitleEnabled] = useState(true);

  // Verifica se o usuário está autenticado.
  useEffect(() => {
    const userVerify = removeQuote(localStorage.getItem('user') || '');

    if (userVerify.length < 10) {
      window.location.replace('/login');
    }
  }, []);

  // Busca os dados do usuário.
  useEffect(() => {
    if (!idUser) return;

    let active = true;

    api.get(`/auth/${idUser}`)
      .then(response => {
        if (!active) return;

        const data = response.data || {};
        setUserUtility({
          ...data,
          resume: Array.isArray(data.resume) ? data.resume : []
        });
      })
      .catch(error => {
        console.error('Erro ao buscar dados do usuário:', error);
      });

    return () => {
      active = false;
    };
  }, [idUser]);

  // Recupera o ponto em que o usuário parou de assistir.
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !userUtility.resume.length) return;

    const savedMovie = userUtility.resume.find(
      movie => movie?.idMovie === idMovie
    );

    if (!savedMovie || !Number.isFinite(Number(savedMovie.timeMovie))) {
      return;
    }

    const restorePosition = () => {
      video.currentTime = Number(savedMovie.timeMovie);
    };

    if (video.readyState >= 1) {
      restorePosition();
    } else {
      video.addEventListener('loadedmetadata', restorePosition, {
        once: true
      });
    }

    return () => {
      video.removeEventListener('loadedmetadata', restorePosition);
    };
  }, [userUtility.resume, videoRef, idMovie]);

  // Carrega o arquivo de legendas.
  useEffect(() => {
    if (!idMovie) return;

    let active = true;

    fetch(
      `https://raw.githubusercontent.com/moviesSubtitlesSrt/Movies-Subtitles/main/${idMovie}.txt`
    )
      .then(response => {
        if (!response.ok) {
          throw new Error('Legenda não encontrada');
        }

        return response.text();
      })
      .then(text => {
        if (active) {
          setSubtitleText(text);
        }
      })
      .catch(() => {
        if (active) {
          setSubtitleText('');
        }
      });

    return () => {
      active = false;
    };
  }, [idMovie]);

  // Inicia a reprodução automaticamente.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPlayerState(previous => ({
        ...previous,
        playing: true
      }));
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  // Controla a reprodução e a pausa.
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (playerState.playing) {
      video.play().catch(() => {
        setPlayerState(previous => ({
          ...previous,
          playing: false
        }));
      });
    } else {
      video.pause();
    }
  }, [videoRef, playerState.playing]);

  const playPause = useCallback(() => {
    setPlayerState(previous => ({
      ...previous,
      playing: !previous.playing
    }));
  }, []);

  // Localiza a legenda correspondente ao tempo atual.
  const updateSubtitle = useCallback((currentTime) => {
    if (!subtitleEnabled || !subtitleText) {
      const subtitleElement = document.getElementById('subtitle-render');

      if (subtitleElement) {
        subtitleElement.style.display = 'none';
      }

      return;
    }

    const subtitleElement = document.getElementById('subtitle-render');

    if (!subtitleElement) return;

    const blocks = subtitleText.split(/\r?\n\r?\n/);
    let currentSubtitle = '';

    for (const block of blocks) {
      const lines = block.split(/\r?\n/);
      const timeLine = lines.find(line => line.includes('-->'));

      if (!timeLine) continue;

      const times = timeLine.split('-->').map(value => value.trim());
      const startTime = timeToSeconds(times[0].replace(',', '.').split('.')[0]);
      const endTime = timeToSeconds(times[1].replace(',', '.').split('.')[0]);

      if (currentTime >= startTime && currentTime <= endTime) {
        currentSubtitle = lines
          .filter(line => line !== timeLine && !/^\d+$/.test(line.trim()))
          .join(' ')
          .trim();

        break;
      }
    }

    if (currentSubtitle) {
      subtitleElement.textContent = currentSubtitle;
      subtitleElement.style.display = 'block';
      subtitleElement.style.animation = 'none';

      if (currentSubtitle.length > 43) {
        subtitleElement.style.animation =
          'subtitleRenderHidden 0s 1.2s forwards';
      } else if (currentSubtitle.length > 30) {
        subtitleElement.style.animation =
          'subtitleRenderHidden 0s 0.7s forwards';
      } else if (currentSubtitle.length > 20) {
        subtitleElement.style.animation =
          'subtitleRenderHidden 0s 0.6s forwards';
      } else if (currentSubtitle.length > 1) {
        subtitleElement.style.animation =
          'subtitleRenderHidden 0s 0.3s forwards';
      }
    } else {
      subtitleElement.style.display = 'none';
    }
  }, [subtitleEnabled, subtitleText]);

  // Atualiza o tempo e salva o progresso do filme.
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;

    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }

    const currentTime = video.currentTime;
    const duration = video.duration;
    const currentPercentage = (currentTime / duration) * 100;

    const currentTimeElement = document.getElementById('current-time-show');
    const timeLeftElement = document.getElementById('time-left-show');

    if (currentTimeElement) {
      currentTimeElement.textContent = formatTime(currentTime);
    }

    if (timeLeftElement) {
      timeLeftElement.textContent = formatTime(duration);
    }

    updateSubtitle(currentTime);

    setPlayerState(previous => ({
      ...previous,
      percentage: currentPercentage
    }));

    const date = new Date();
    const second = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    const shouldSave =
      (second === 30 || second === 59) && milliseconds <= 250;

    const saveKey = `${date.getMinutes()}-${second}`;

    if (!shouldSave || lastSavedTime.current === saveKey || !idUser) {
      return;
    }

    lastSavedTime.current = saveKey;

    const currentResume = Array.isArray(userUtility.resume)
      ? [...userUtility.resume]
      : [];

    const existingIndex = currentResume.findIndex(
      movie => movie?.idMovie === idMovie
    );

    if (currentPercentage >= 98) {
      const updatedResume = currentResume.filter(
        movie => movie?.idMovie !== idMovie
      );

      setUserUtility(previous => ({
        ...previous,
        resume: updatedResume
      }));

      api.post(`/auth/resume/${idUser}`, {
        resume: updatedResume
      }).catch(error => {
        console.error('Erro ao salvar progresso:', error);
      });

      return;
    }

    const resumeMark = {
      idMovie,
      currentTimeMovie: currentPercentage,
      timeMovie: currentTime
    };

    if (existingIndex !== -1) {
      currentResume.splice(existingIndex, 1);
    }

    currentResume.unshift(resumeMark);

    setUserUtility(previous => ({
      ...previous,
      resume: currentResume
    }));

    api.post(`/auth/resume/${idUser}`, {
      resume: currentResume
    }).catch(error => {
      console.error('Erro ao salvar progresso:', error);
    });
  }, [
    videoRef,
    updateSubtitle,
    userUtility.resume,
    idMovie,
    idUser
  ]);

  // Altera a posição do vídeo pela barra de progresso.
  const handleChangePercentage = useCallback((event) => {
    const video = videoRef.current;

    if (!video || !Number.isFinite(video.duration)) return;

    const timeClick = Number(event.target.value);

    video.currentTime = (video.duration / 100) * timeClick;

    setPlayerState(previous => ({
      ...previous,
      percentage: timeClick
    }));
  }, [videoRef]);

  const toggleSubtitles = useCallback(() => {
    setSubtitleEnabled(previous => !previous);
  }, []);

  return {
    playerState,
    playPause,
    handleTimeUpdate,
    handleChangePercentage,
    toggleSubtitles,
    subtitleEnabled
  };
}

const PlayerVideo = () => {
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const countRef = useRef(0);
  const contentRef = useRef(null);

  const [movieWatch, setMovie] = useState({});
  const [play, setPlay] = useState({ movies: [] });
  const [filmBy, setFilmBy] = useState([]);
  const [cast, setCast] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const idMovie = getMovieId();

  const {
    playerState,
    playPause,
    handleTimeUpdate,
    handleChangePercentage,
    toggleSubtitles,
    subtitleEnabled
  } = usePlayerState(videoRef, idMovie);

  // Busca as informações do filme.
  useEffect(() => {
    if (!idMovie) return;

    const url = `https://api.themoviedb.org/3/movie/${idMovie}?api_key=93296066cafd1a70fac5ed2532fda74f&language=pt-BR`;

    fetch(url)
      .then(response => response.json())
      .then(data => setMovie(data))
      .catch(error => {
        console.error('Erro ao buscar filme:', error);
      });
  }, [idMovie]);

  // Busca a equipe técnica.
  useEffect(() => {
    if (!idMovie) return;

    const url = `https://api.themoviedb.org/3/movie/${idMovie}/credits?api_key=93296066cafd1a70fac5ed2532fda74f&language=pt-BR`;

    fetch(url)
      .then(response => response.json())
      .then(data => setFilmBy(Array.isArray(data.crew) ? data.crew : []))
      .catch(error => {
        console.error('Erro ao buscar equipe técnica:', error);
      });
  }, [idMovie]);

  // Busca o elenco.
  useEffect(() => {
    if (!idMovie) return;

    const url = `https://api.themoviedb.org/3/movie/${idMovie}/credits?api_key=93296066cafd1a70fac5ed2532fda74f&language=pt-BR`;

    fetch(url)
      .then(response => response.json())
      .then(data => setCast(Array.isArray(data.cast) ? data.cast : []))
      .catch(error => {
        console.error('Erro ao buscar elenco:', error);
      });
  }, [idMovie]);

  // Busca os links dos vídeos.
  useEffect(() => {
    const url = 'https://api.npoint.io/485606789b28296238fd';

    fetch(url)
      .then(response => response.json())
      .then(data => setPlay(data))
      .catch(error => {
        console.error('Erro ao buscar vídeos:', error);
      });
  }, []);

  const linkWatch = play.movies?.find(
    movie => String(movie.id) === String(idMovie)
  )?.watch;

  // Controla a tela cheia.
  const openFullscreen = useCallback(() => {
    const element = contentRef.current;

    if (!element) return;

    if (!document.fullscreenElement) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  // Exibe os controles quando o mouse se movimenta.
  useEffect(() => {
    const handleMouseMove = () => {
      const optionsBar = document.getElementById('options-bar');
      const positionBack = document.getElementById('position-back');
      const subtitle = document.getElementById('subtitle-render');

      if (optionsBar) optionsBar.style.display = 'block';
      if (positionBack) positionBack.style.display = 'block';
      if (subtitle) subtitle.style.top = '67%';

      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        if (optionsBar) optionsBar.style.display = 'none';
        if (positionBack) positionBack.style.display = 'none';
        if (subtitle) subtitle.style.top = '85%';
      }, 5000);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timerRef.current);
    };
  }, []);

  // Atalhos do teclado.
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.code === 'Space') {
        event.preventDefault();
        playPause();
      }

      if (event.key.toLowerCase() === 'f') {
        openFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playPause, openFullscreen]);

  // Navegação do elenco e da equipe técnica.
  const next = () => {
    const box = document.querySelector('.crew-cast');

    if (!box) return;

    box.scrollBy({
      top: 0,
      left: 500,
      behavior: 'smooth'
    });

    if (countRef.current < 5) {
      countRef.current += 1;
    }

    const leftArrow = document.getElementById('low1');
    const rightArrow = document.getElementById('low2');

    if (leftArrow && countRef.current !== 0) {
      leftArrow.style.visibility = 'visible';
    }

    if (rightArrow && countRef.current >= 5) {
      rightArrow.style.visibility = 'hidden';
    }
  };

  const previous = () => {
    const box = document.querySelector('.crew-cast');

    if (!box) return;

    box.scrollBy({
      top: 0,
      left: -500,
      behavior: 'smooth'
    });

    if (countRef.current > 0) {
      countRef.current -= 1;
    }

    const leftArrow = document.getElementById('low1');
    const rightArrow = document.getElementById('low2');

    if (leftArrow && countRef.current <= 0) {
      leftArrow.style.visibility = 'hidden';
    }

    if (rightArrow && countRef.current <= 4) {
      rightArrow.style.visibility = 'visible';
    }
  };

  const goBack = () => {
    window.location.replace(`/watch/${idMovie}`);
  };

  return (
    <div
      className="content-video-player"
      id="content-video-player"
      ref={contentRef}
    >
      <div
        id="load"
        className="loadingio-spinner-rolling-7fylwl190qh"
      >
        <div className="ldio-qjgygy3qvv">
          <div></div>
        </div>
      </div>

      <video
        className="video-player"
        ref={videoRef}
        src={linkWatch}
        onTimeUpdate={handleTimeUpdate}
        onClick={playPause}
        onDoubleClick={openFullscreen}
        onLoadedData={() => {
          const loading = document.getElementById('load');

          if (loading) {
            loading.style.display = 'none';
          }
        }}
        id="videoServerWatch"
      />

      <div className="position-back" id="position-back">
        <div
          className="back-title"
          onClick={goBack}
          title="Voltar"
          role="button"
          tabIndex={0}
          onKeyDown={event => {
            if (event.key === 'Enter') goBack();
          }}
        >
          <BiArrowBack className="back-title-arrow" />
        </div>
      </div>

      <div className="options-bar" id="options-bar">
        <div className="crew-cast">
          <button
            id="low1"
            onClick={previous}
            className="btnPreviousW"
            type="button"
          >
            <MdOutlineArrowBackIosNew className="arrows" />
          </button>

          <div className="directing">
            <ul className="list-persons">
              {filmBy
                .filter(director => director.job === 'Director')
                .map((director, index) => (
                  <li className="title-item" key={director.id || index}>
                    <div className="card-person">
                      <img
                        className="img-person"
                        src={`https://image.tmdb.org/t/p/w92/${director.profile_path}`}
                        alt={director.name || 'Diretor'}
                      />

                      <div className="name-person">
                        {director.name}
                      </div>

                      <div className="working">
                        {director.job}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          <div className="casting">
            <ul className="list-persons">
              {cast.slice(0, 10).map((actor, index) => (
                <li className="title-item" key={actor.id || index}>
                  <div className="card-person">
                    <img
                      className="img-person"
                      src={`https://image.tmdb.org/t/p/w92/${actor.profile_path}`}
                      alt={actor.name || 'Ator'}
                    />

                    <div className="name-person">
                      {actor.name}
                    </div>

                    <div className="working">
                      {actor.character}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button
            className="btnNextW"
            id="low2"
            onClick={next}
            type="button"
          >
            <MdOutlineArrowForwardIos className="arrows" />
          </button>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          onChange={handleChangePercentage}
          value={playerState.percentage}
          className="progress-video"
          aria-label="Progresso do vídeo"
        />

        <div className="buttons">
          <div className="title-movie-watch">
            {movieWatch.title}
          </div>

          <div
            className="current-time-show"
            id="current-time-show"
          >
            00:00:00
          </div>

          <div
            onClick={playPause}
            id="play-pause"
            className="play-pause"
            role="button"
            tabIndex={0}
            onKeyDown={event => {
              if (event.key === 'Enter') playPause();
            }}
          >
            {playerState.playing ? <FaPause /> : <FaPlay />}
          </div>

          <div className="time-left-show" id="time-left-show">
            00:00:00
          </div>

          <div
            className="back-subtitle"
            onClick={toggleSubtitles}
            title="Áudio e Legenda"
            role="button"
            tabIndex={0}
            onKeyDown={event => {
              if (event.key === 'Enter') toggleSubtitles();
            }}
          >
            <MdOutlineSubtitles className="subtitle-info" />
          </div>

          <div
            className="fullscreen"
            onClick={openFullscreen}
            role="button"
            tabIndex={0}
            onKeyDown={event => {
              if (event.key === 'Enter') openFullscreen();
            }}
          >
            {isFullscreen
              ? <BsArrowsAngleContract className="fullscreen-into" />
              : <BsArrowsAngleExpand className="fullscreen-into" />
            }
          </div>
        </div>
      </div>

      <div>
        {subtitleEnabled && (
          <div
            className="subtitle-render"
            id="subtitle-render"
          />
        )}
      </div>
    </div>
  );
};

export default PlayerVideo;
