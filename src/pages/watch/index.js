import React, { useEffect, useState } from 'react';
import './styles.css';
import Header from '../../components/header'
import { removeQuote } from '../../assistant';
import { AiOutlinePlus } from 'react-icons/ai';
import { AiOutlineCheck } from 'react-icons/ai';
import { IoIosPeople } from 'react-icons/io';
import { BsFillPlayFill } from 'react-icons/bs';
import { RxReload } from 'react-icons/rx';
import api from '../../api';


const Watch = () => {

  const [movieWatch, setMovie] = useState([]);
  const [filmBy, setFilmBy] = useState([]);
  const [userUtility, setUserUtility] = useState([]);


  var url = window.location.href

  var position = url.indexOf("watch/");

  var idMovie = url.substr(position + 6, 100);

  var userVerify = removeQuote(localStorage.getItem('user'))

  if (userVerify.length < 10) {
    window.location.replace(`/login`)
  }


  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${idMovie}?api_key=93296066cafd1a70fac5ed2532fda74f&language=pt-BR`
    fetch(url)
      .then(response => response.json())
      .then(json => json)
      .then(async (data) => {
        setMovie(await data);
      })
  }, [])

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${idMovie}/credits?api_key=93296066cafd1a70fac5ed2532fda74f&language=pt-BR`
    fetch(url)
      .then(response => response.json())
      .then(json => json)
      .then(async (data) => {
        setFilmBy(await data);
      })
  }, [])

  var timeH = 0;
  var timeM = 0;

  var hour = 0;
  var min = 0;

  if (movieWatch.runtime) {
    hour = Math.floor(movieWatch.runtime / 60);
    min = movieWatch.runtime % 60;
    timeH = (`${hour}`).slice(-2);
    timeM = (`00${min}`).slice(-2);
  }

  var year;

  if (movieWatch.release_date) {
    year = movieWatch.release_date.substr(0, 4)
  }

  function goWatch() {
    window.location.replace(`/watch-play/${idMovie}`)
  }

  function reGoWatch() {

    var arrayResume = userUtility.resume;
    var idmv = idMovie

    const result = arrayResume.find(movieMark => movieMark.idMovie === idmv)

    const index = arrayResume.indexOf(result);
    if (index > -1) {
      arrayResume.splice(index, 1);
    }

    const data = { resume: arrayResume }

    api.post(`/auth/resume/${idUser}`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    })

    window.location.replace(`/watch-play/${idMovie}`)
  }


  function goCineWatch() {
    window.location.replace(`/cinewatch/${idMovie}`)
  }

  var idUser = removeQuote(localStorage.getItem('IdUser'))

  useEffect(() => {
    const url = `https://brave-red-blazer.cyclic.app/auth/${idUser}`
    fetch(url)
      .then(response => response.json())
      .then(json => json)
      .then(async (data) => {
        setUserUtility(await data);
      })
  }, [])

  var UserUtilityResume;

  UserUtilityResume = userUtility.resume;

  console.log(UserUtilityResume)

  var UserUtilityList = userUtility.watchlist;


  async function setWachlist() {

    var userContent;

    var xmlhttp = new XMLHttpRequest();
    var url = `https://brave-red-blazer.cyclic.app/auth/${idUser}`;

    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        userContent = JSON.parse(this.responseText);
        add(userContent)
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

  async function add(userContent) {

    var arrayWatchlist = userContent.watchlist;

    if (arrayWatchlist.includes(idMovie) === true) {
      const index = arrayWatchlist.indexOf(idMovie);
      if (index > -1) {
        arrayWatchlist.splice(index, 1);
      }
    } else {
      arrayWatchlist.unshift(idMovie)
    }

    const data = {
      watchlist: arrayWatchlist
    }

    api.post(`/auth/watchlist/${idUser}`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }



  return (
    <div className='content-page-watch'>
      <div className='background-img'>
        {movieWatch.backdrop_path ? <img
          alt="background"
          className="title-content"
          src={`https://image.tmdb.org/t/p/w1280/${movieWatch.backdrop_path}`}
        /> : ""}
      </div>
      <Header />
      <div className='content-info'>
        <div className='apresentation'>
          <div className='synopsis'>{movieWatch.overview}</div>
          <div className='buttons-page'>
            {(UserUtilityResume?.find(movieMark => movieMark?.idMovie === idMovie)) ?
              <div className='resume-rewatch'>
                <div className='button-watch-continue' onClick={goWatch}><a><BsFillPlayFill className='play-button-watch-page' />Continuar</a></div>
                <div className='button-watch-init' onClick={reGoWatch}><a><RxReload className='play-button-watch-page' />Recomeçar</a></div>
                <div className='separetor-continue'></div>
              </div>
              :
              <div>
                <div className='button-watch-init' onClick={goWatch}><a><BsFillPlayFill className='play-button-watch-page' />Assistir Agora</a></div>
                <div className='separetor'></div>
              </div>
            }
            <div className='button-cinewatch' onClick={goCineWatch}><a><IoIosPeople className='cinewatch' />CineWatch</a></div>
          </div>
        </div>
        <div className='title-movie'>{movieWatch.title}</div>
        <div className='info'>
          <div className='time'>{`${timeH}h e ${timeM}min`}</div>
          <div className='year'>{year}</div>
        </div>
        <div className='grade'>
          <div className='genres'>
            {movieWatch.genres && movieWatch.genres.map((genre, index) => {
              if (index !== movieWatch.genres.length - 1) {
                return <p>{genre.name}</p>
              }
              return <p>{genre.name}</p>
            })}
          </div>
        </div>
        {
          (UserUtilityList?.includes(idMovie) === true) ?
            <div className='watchlist-solo'>
              <div className='button-wachlist-page' onClick={setWachlist} title='Remover da sua Lista'>
                <AiOutlineCheck className='add-list-page' />
              </div>
            </div>
            :
            <div className='watchlist-solo'>
              <div className='button-wachlist-page' onClick={setWachlist} title='Adicionar à sua Lista'>
                <AiOutlinePlus className='add-list-page' />
              </div>
            </div>
        }
      </div>
    </div>
  )
}

export default Watch;