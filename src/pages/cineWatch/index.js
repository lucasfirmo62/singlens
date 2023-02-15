import React, { useEffect, useState } from 'react';
import './styles.css';
import Header from '../../components/header'
import { removeQuote } from '../../assistant';
import { AiOutlinePlus } from 'react-icons/ai';
import { AiOutlineCheck } from 'react-icons/ai';
import api from '../../api';


const Watch = () => {

  const [movieWatch, setMovie] = useState([]);
  const [filmBy, setFilmBy] = useState([]);
  const [userUtility, setUserUtility] = useState([]);

  var backdropUndefined = removeQuote(localStorage.getItem('undefined-image'))
  console.log(backdropUndefined)
  var backdrop;


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

  function goCineWatch() {
    var cineMark = {
      cineWatchState: "true",
      cineWatchTime: "0",
      cineWatchMovieId: idMovie
    };

    const data = {
      cineWatch: cineMark
    }

    api.post(`/auth/cinewatchpresession/${idUser}`, { cineWatchMovieId: idMovie }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })

    window.location.replace(`/cinewatch-play/${idMovie}`)
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

    if(userUtility.cineWatch?.cineWatchState === "true"){
      window.location.replace(`/cinewatch-play/${idMovie}`)
    }


  var UserUtilityList = userUtility.watchlist;
  var UserUtilityResume = userUtility.resume;

  async function searchPeoplesCine() {

    var userContent;


    var xmlhttp = new XMLHttpRequest();
    var url = `https://brave-red-blazer.cyclic.app/auth/cinewatch/${idMovie}`;

    var avatarOne = "nPO29qu.jpeg";
    var avatarTwo = "oYBkmhj.jpeg";
    var avatarThree = "5Pcx3Vq.jpeg";
    var avatarFour = "vAP7kdO.jpeg";
    var avatarFive = "sZyMbsu.jpeg";
    var avatarSix = "mDLxGQ9.jpeg";

    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        userContent = JSON.parse(this.responseText);
        var x = 0
        var litsUsers = '';
        var litsUsersImg = '';
        for (x = 0; x < userContent.length; x++) {
          if (userContent[x].avatar === "1") {
            litsUsers += `<contentCardPeople><div className='card-people' id='card-people'><p>${userContent[x].name}</p><img className='avatar' src="https://i.imgur.com/${avatarOne}"/></div></contentCardPeople>`
          }
          if (userContent[x].avatar === "2") {
            litsUsers += `<contentCardPeople><div className='card-people' id='card-people'><p>${userContent[x].name}</p><img className='avatar' src="https://i.imgur.com/${avatarTwo}"/></div></contentCardPeople>`
          }
          if (userContent[x].avatar === "3") {
            litsUsers += `<contentCardPeople><div className='card-people' id='card-people'><p>${userContent[x].name}</p><img className='avatar' src="https://i.imgur.com/${avatarThree}"/></div></contentCardPeople>`
          }
          if (userContent[x].avatar === "4") {
            litsUsers += `<contentCardPeople><div className='card-people' id='card-people'><p>${userContent[x].name}</p><img className='avatar' src="https://i.imgur.com/${avatarFour}"/></div></contentCardPeople>`
          }
          if (userContent[x].avatar === "5") {
            litsUsers += `<contentCardPeople><div className='card-people' id='card-people'><p>${userContent[x].name}</p><img className='avatar' src="https://i.imgur.com/${avatarFive}"/></div></contentCardPeople>`
          }
          if (userContent[x].avatar === "6") {
            litsUsers += `<contentCardPeople><div className='card-people' id='card-people'><p>${userContent[x].name}</p><img className='avatar' src="https://i.imgur.com/${avatarSix}"/></div></contentCardPeople>`
          }
        }
        document.getElementById("card-people").innerHTML = litsUsers
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

  async function verifyEnterCineWatch() {

    var userContent;


    var xmlhttp = new XMLHttpRequest();
    var url = `https://brave-red-blazer.cyclic.app/auth/cinewatch/${idMovie}`;

    var avatarOne = "nPO29qu.jpeg"

    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        userContent = JSON.parse(this.responseText);
        var x = 0
        for (x = 0; x < userContent.length; x++) {
          if ((userContent[x].cineWatch?.cineWatchState === "true") && userUtility.cineWatchMovieId === idMovie) {
            goCineWatch()
          }
        }
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }


  async function enterSession() {

    var cineMark = {
      cineWatchState: "false",
      cineWatchTime: "0",
      cineWatchMovieId: idMovie
    };

    const data = {
      cineWatch: cineMark
    }

    api.post(`/auth/cinewatchpresession/${idUser}`, { cineWatchMovieId: idMovie }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })

    api.post(`/auth/cinewatch/${idUser}`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    })

    window.location.reload(false);

  }

  async function exitSession() {


    var cineMark = [];

    const data = {
      cineWatch: cineMark
    }

    api.post(`/auth/cinewatchpresession/${idUser}`, { cineWatchMovieId: "" }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })

    api.post(`/auth/cinewatch/${idUser}`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    })

    window.location.reload(false);

  }

  startTimerVerify()

  var timerStatusCine;

  function startTimerVerify() {
    timerStatusCine = setInterval(function () {
      verifyEnterCineWatch()
    }, 1000);
  }


  startTimer()

  var timer;

  function startTimer() {
    timer = setInterval(function () {
      searchPeoplesCine()
    }, 2000);
  }


  return (
    <div className='content-page-cinewatch'>
      <div className='background-img-inside'>
        {movieWatch.backdrop_path ? <img
          alt="background"
          className="title-content"
          src={`https://image.tmdb.org/t/p/w1280/${movieWatch.backdrop_path}`}
        /> : ""}
      </div>
      <div className='background-img-cine'>
        <img
          alt="background"
          className="title-content"
          src={`https://i.imgur.com/pfJ16n5.png`}
        />
      </div>
      <Header />
      <div className='content-info-cine'>
        <div className='apresentation-cine'>
          <div className='title-movie-cine'>{movieWatch.title}</div>
          <div className='info-cine'>
            <div className='time-cine'>{`${timeH}h e ${timeM}min`}</div>
            <div className='year-cine'>{year}</div>
          </div>
          <div className='grade-cine'>
            <div className='genres-cine'>
              {movieWatch.genres && movieWatch.genres.map((genre, index) => {
                if (index !== movieWatch.genres.length - 1) {
                  return <p>{genre.name}</p>
                }
                return <p>{genre.name}</p>
              })}
            </div>
          </div>
        </div>
        <div className='button-cine' onClick={goCineWatch}><a>Iniciar Sessão</a></div>
      </div>
      <div className='painel-peoples'>
        <div id='avatar'></div>
        <div className='card-people' id='card-people'></div>
      </div>
      {(userUtility.cineWatchMovieId === idMovie) ?
        <div className='exit-session' id="exit-session" onClick={exitSession}><p>Cancelar</p></div>
        :
        <div className='enter-session' id="enter-session" onClick={enterSession}><p>PRONTO PARA A SESSÃO</p></div>
      }
    </div>
  )
}

export default Watch;