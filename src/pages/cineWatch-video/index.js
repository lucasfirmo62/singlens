import React, { useState, useRef, useEffect } from 'react';
import './styles.css';
import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa';
import { BsArrowsAngleExpand } from 'react-icons/bs';
import { BsArrowsAngleContract } from 'react-icons/bs';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { MdOutlineSubtitles } from 'react-icons/md';
import { BiArrowBack } from 'react-icons/bi';
import { removeQuote } from '../../assistant';
import api from '../../api';

var stateResume = false
var stateSubtitle = false
var verifySub = ''
var vidvrf = 0

function usePlayerState($VideoPlayer) {

  const [userUtility, setUserUtility] = useState([]);
  const [cineUtility, setcineUtility] = useState([]);


  var idUser = removeQuote(localStorage.getItem('IdUser'))

  useEffect(() => {
    const url = `http://192.168.1.9:8080/auth/${idUser}`
    fetch(url)
      .then(response => response.json())
      .then(json => json)
      .then(async (data) => {
        setUserUtility(await data);
      })
  }, [])
  
  var UserCineResume = userUtility.cineWatchMovieId;
  var percentageTimeResume;
  var secoundTimeResume;

  var url = window.location.href

  var position = url.indexOf("watch-play/");
  var idmv = url.substr(position + 11, 100);
  var aux


  useEffect(() => {
    const url = `http://192.168.1.9:8080/auth/cinewatch/${idmv}`
    fetch(url)
      .then(response => response.json())
      .then(json => json)
      .then(async (data) => {
        setcineUtility(await data);
      })
  }, [])

  setTimeout(function() {

  if (UserCineResume === idmv) {
    if (stateResume === false) {
      var x = 0;
      for(x = 0; x < cineUtility.length; x++){
        if(cineUtility[x].cineWatch.cineWatchTime > 0)
        $VideoPlayer.current.currentTime = cineUtility[x].cineWatch.cineWatchTime
        $VideoPlayer.current.currentTime += 2
        stateResume = true
        playPause()
      }
    }
  }

}, 200);




  var userVerify = removeQuote(localStorage.getItem('user'))

  if (userVerify.length < 10) {
    window.location.replace(`/login`)
  }

  const [playerState, setPlayerState] = useState({ playing: false, percentage: 0 });

  useEffect(() => {
    playerState.playing ? $VideoPlayer.current.play() : $VideoPlayer.current.pause()
  }, [
    $VideoPlayer,
    playerState.playing
  ]);


  function playPause() {
    setPlayerState({
      ...playerState,
      playing: !playerState.playing,

    })
  }

  function searchByEnter(stringSubtitle, enter) {
    var x = 0
    for (x in stringSubtitle) {
      if (stringSubtitle[x] === enter) {
        return x;
      }
    }
    console.log("não foi encontrado")
  }

  function searchNumber(stringSubtitle) {
    var x = 0
    for (x in stringSubtitle) {
      if ((stringSubtitle[x] === '\n')) {
        return x + 1;
      }
    }
    console.log("não foi encontrado")
  }

  var timeVerify = '0'
  var currentSubSaver = ''
  function subtitle(ctime) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var indexTime = this.responseText
        if (indexTime.indexOf(`--> ${ctime}`) === false) {
          document.getElementById('subtitle-render').style.display = 'none';
        }
        if (indexTime.includes(`--> ${ctime}`) === true) {

          var verifyReloadSub = indexTime.indexOf(`--> ${ctime}`)
          var stringSearch = indexTime.substr(verifyReloadSub)
          if (stringSearch.indexOf(`\n${ctime}`)) {
            var initx = searchByEnter(stringSearch, '\n')
            initx = initx
            stringSearch = stringSearch.substr(initx, searchNumber(stringSearch))
            var endx = searchByEnter(stringSearch, '\n')
            stringSearch = stringSearch.replace(/[^a-z^A-Z^ãêéèóáàôóòêõẽÉÔçÇíîìú^ÁÀÂÓÒÔÉÈÊÌÍÎÙÚÛÃÕŨĨẼ.?!^,-]/g, '\n')
            var posCut = stringSearch.indexOf("\n,\n")
            stringSearch = stringSearch.substr(0, posCut)
            document.getElementById("subtitle-render").innerHTML = stringSearch
            document.getElementById('subtitle-render').style.display = 'block';
            if((stringSearch.length > 30) && (stringSearch.length < 43)){
              document.getElementById('subtitle-render').style.animation = 'subtitleRenderHidden 0s 0.7s forwards';
            }if((stringSearch.length > 1) && (stringSearch.length <= 20)){
              document.getElementById('subtitle-render').style.animation = 'subtitleRenderHidden 0s 0.3s forwards';
            }if((stringSearch.length > 20) && (stringSearch.length <= 30)){
              document.getElementById('subtitle-render').style.animation = 'subtitleRenderHidden 0s 0.6s forwards';
            }if((stringSearch.length > 43)){
              document.getElementById('subtitle-render').style.animation = 'subtitleRenderHidden 0s 1.2s forwards';
            }
          }
        }
        if (indexTime.includes(`\n${ctime}`) === true) {
          var posTime = indexTime.indexOf(ctime)
          var stringSearch = indexTime.substr(posTime)
          var teste = indexTime.substr(posTime, 30)
          //console.log(teste)
          var initx = searchByEnter(stringSearch, '\n')
          initx = initx
          stringSearch = stringSearch.substr(initx, searchNumber(stringSearch))
          var endx = searchByEnter(stringSearch, '\n')
          stringSearch = stringSearch.replace(/[^a-z^A-Z^ãêéèóáàôóòêõẽÉÔçÇíîìú^ÁÀÂÓÒÔÉÈÊÌÍÎÙÚÛÃÕŨĨẼ.?!^,-]/g, '\n')
          var posCut = stringSearch.indexOf("\n,\n")
          stringSearch = stringSearch.substr(0, posCut)
          document.getElementById("subtitle-render").innerHTML = stringSearch
          document.getElementById('subtitle-render').style.animation = 'subtitleRenderShow 0s 0s forwards';
        }
      }
    };
    xhttp.open("GET", `https://raw.githubusercontent.com/moviesSubtitlesSrt/Movies-Subtitles/main/${idmv}.txt`, true);
    xhttp.send();
    timeVerify = ctime
  }


  function handleTimeUpdate() {



    var currentPercentage = ($VideoPlayer.current.currentTime / $VideoPlayer.current.duration) * 100;


    var hour = Math.floor($VideoPlayer.current.currentTime / 3600);
    var mins = Math.floor($VideoPlayer.current.currentTime / 60);
    var secs = Math.floor($VideoPlayer.current.currentTime % 60);
    var tenths = $VideoPlayer.current.currentTime % 1;

    var hourLeft = Math.floor($VideoPlayer.current?.duration / 3600);
    var minsLeft = Math.floor($VideoPlayer.current?.duration / 60);
    var secsLeft = Math.floor($VideoPlayer.current?.duration % 60);



    if (hour < 10) {
      hour = "0" + hour;
    }
    if (mins < 10) {
      mins = "0" + mins;
    }
    if ((mins >= 60) && (mins < 120)) {
      mins = mins - 60;
      if (mins < 10) {
        mins = "0" + mins;
      }
    }
    if ((mins >= 120) && (mins < 180)) {
      mins = mins - 120;
      if (mins < 10) {
        mins = "0" + mins;
      }
    }
    if ((mins >= 180) && (mins < 240)) {
      mins = mins - 180;
      if (mins < 10) {
        mins = "0" + mins;
      }
    }
    if (secs < 10) {
      secs = "0" + secs;
    }

    tenths = tenths.toString()
    tenths = tenths.substr(2, 3)
    

    var currentTranform = hour + ":" + mins + ":" + secs
    currentTranform = currentTranform.toString()
    var lasSub = subtitle(currentTranform)


    document.getElementById("current-time-show").innerHTML = hour + ":" + mins + ":" + secs;
    document.getElementById("time-left-show").innerHTML = hourLeft + ":" + minsLeft + ":" + secsLeft;


    const d = new Date();

    var secountSave = d.getSeconds();

    var millisecondSave = d.getMilliseconds();

    var arrayResume = userUtility.cineWatch;



    if (millisecondSave <= 250) {

      if (currentPercentage >= 98) {

        const result = arrayResume.find(movieMark => movieMark.cineWatchMovieId === idmv)

        const index = arrayResume.indexOf(result);
        if (index > -1) {
          arrayResume.splice(index, 1);
        }

        const data = { cineWatch: arrayResume }

        api.post(`/auth/cinewatch/${idUser}`, data, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        return;
      }
      if (userUtility.cineWatchMovieId === idmv) {

        var cineMark = {
          cineWatchState: "true",
          cineWatchTime: $VideoPlayer.current.currentTime,
          cineWatchMovieId: idmv
        };
    
        const data = {
          cineWatch: cineMark
        }

        api.post(`/auth/cinewatch/${idUser}`, data, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
      } 
      // else {
      //   console.log("hello ladies")
      //   var cineMark = {
      //     cineWatchState: "true",
      //     cineWatchTime: $VideoPlayer.current.currentTime,
      //     cineWatchMovieId: idmv
      //   };
    
      //   const data = {
      //     cineWatch: cineMark
      //   }

      //   api.post(`/auth/cinewatch/${idUser}`, data, {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     }
      //   })
      // }



    }


    setPlayerState({
      ...playerState,
      percentage: currentPercentage,
    })
  }


  function handleChangePercentage(changeInput) {

    const timeClick = changeInput.target.value
    $VideoPlayer.current.currentTime = ($VideoPlayer.current.duration / 100) * timeClick;

    setPlayerState({
      ...playerState,
      percentage: timeClick,
    })

  }

  return {
    playerState,
    playPause,
    handleTimeUpdate,
    handleChangePercentage,
  }

}


const CineWatchPlayerVideo = () => {

  const $VideoPlayer = useRef(null);
  const [movieWatch, setMovie] = useState([]);
  const [play, setPlay] = useState([]);
  const [filmBy, setFilmBy] = useState([]);
  const [cast, setCast] = useState([])




  const {
    playerState,
    playPause,
    handleTimeUpdate,
    handleChangePercentage,
  } = usePlayerState($VideoPlayer)

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
      .then(json => json.crew)
      .then(async (data) => {
        setFilmBy(await data);
      })
  }, [])

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${idMovie}/credits?api_key=93296066cafd1a70fac5ed2532fda74f&language=pt-BR`
    fetch(url)
      .then(response => response.json())
      .then(json => json.cast)
      .then(async (data) => {
        setCast(await data);
      })
  }, [])


  var url = window.location.href

  var position = url.indexOf("watch-play/");

  var idMovie = url.substr(position + 11, 100);

  useEffect(() => {
    const url = `https://api.npoint.io/485606789b28296238fd`
    fetch(url)
      .then(response => response.json())
      .then(json => json)
      .then(async (data) => {
        setPlay(await data);
      })
  }, [])

  var u = 0
  var linkWatch

  for (u in play.movies) {
    if (play.movies[u].id == idMovie) {
      linkWatch = play.movies[u].watch;
    }
  }


  var elem = document.getElementById("content-video-player");
  function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  var timer;

  function mouseStopped() {
    document.getElementById('options-bar').style.display = 'none';
    document.getElementById('position-back').style.display = 'none'
    document.getElementById('subtitle-render').style.top = '85%'
  }

  window.addEventListener("mousemove", function () {
    document.getElementById('options-bar').style.display = 'block';
    document.getElementById('position-back').style.display = 'block';
    document.getElementById('subtitle-render').style.top = '67%'

    clearTimeout(timer);
    timer = setTimeout(mouseStopped, 5000);
  });

  document.addEventListener('keydown', function (event) {
    if (event == 32) {
      playPause();
    }
    if (event == 70) {
      openFullscreen();
    }
  });

  const box = document.querySelector('.crew-cast');
  var count = 0;

  const leftA = document.getElementById("low1");
  const rigthA = document.getElementById("low2");

  function next() {
    box.scrollBy({
      top: 0,
      left: 500,
      behavior: 'smooth'
    });

    if (count <= 4) {
      count++;
    }

    if (count !== 0) {
      leftA.style.visibility = "visible";
    }

    if (count >= 5) {
      rigthA.style.visibility = "hidden";
    }
  }

  function previous() {
    box.scrollBy({
      top: 0,
      left: -500,
      behavior: 'smooth'
    });

    if (count >= 0) {
      count--;
    }

    if (count <= 0) {
      leftA.style.visibility = "hidden";
    }

    if (count <= 4) {
      rigthA.style.visibility = "visible";
    }
  }

    async function exitSession() {

      var idUser = removeQuote(localStorage.getItem('IdUser'))


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

    window.location.replace(`/cinewatch/${idMovie}`)

  }

  
  function goBack() {
    exitSession()
  }

  function subtitleSatteSet(){
    if(stateSubtitle === true ){
      stateSubtitle = false
      return
    }

    if(stateSubtitle === false){
      stateSubtitle = true
      return
    }
  }

  return (
    <div className='content-video-player' id='content-video-player'>
      <video
        className="video-player"
        ref={$VideoPlayer}
        src={linkWatch}
        onTimeUpdate={handleTimeUpdate}
        onClick={playPause}
        onDoubleClick={openFullscreen}
        id="videoServerWatch"
      >
      </video>
      <div className='position-back' id='position-back'>
        <div className='back-title' onClick={goBack} title='Voltar'>
          <BiArrowBack className='back-title-arrow' />
        </div>
      </div>
      <div className='options-bar' id='options-bar'>
        <div className='crew-cast'>
          <button id="low" onClick={previous} className="btnPreviousW">
            <MdOutlineArrowBackIosNew onClick={previous} id="low2" className='arrows' />
          </button>
          <div className='directing'>
            <ul className="list-persons">
              {filmBy.map((directors, index) => (
                <li className="title-item" key={index}>
                  {
                    (directors.job == "Director") ?
                      <div className='card-person'>
                        <img className='img-person' src={`https://image.tmdb.org/t/p/w92/${directors.profile_path}`} />
                        <div className='name-person'>
                          {directors.name}
                        </div>
                        <div className='working'>
                          {directors.job}
                        </div>
                      </div> : null
                  }
                </li>
              ))}
            </ul>
          </div>
          <div className='casting'>
            <ul className="list-persons">
              {cast.slice(0, 10).map((actors, index) => (
                <li className="title-item" key={index}>
                  {
                    <div className='card-person'>
                      <img className='img-person' src={`https://image.tmdb.org/t/p/w92/${actors.profile_path}`} />
                      <div className='name-person'>
                        {actors.name}
                      </div>
                      <div className='working'>
                        {actors.character}
                      </div>

                    </div>
                  }
                </li>
              ))}
            </ul>
          </div>
          <button className="btnNextW" id="low" onClick={next}>
            <MdOutlineArrowForwardIos onClick={next} id="low2" className='arrows' />
          </button>
        </div>
        <input
          type='range'
          min='0'
          max='100'
          onChange={handleChangePercentage}
          value={playerState.percentage}
          className='progress-video'
        />
        <div className='buttons'>
          <div className='title-movie-watch'>
            {movieWatch.title}
          </div>
          <div className='current-time-show' id='current-time-show'></div>
          <div onClick={playPause} id='play-pause' className='play-pause'>
            {playerState.playing ? <FaPause /> : <FaPlay />}
          </div>
          <div className='time-left-show' id='time-left-show'></div>
          <div className='back-subtitle' onClick={subtitleSatteSet} title='Áudio e Legenda'>
            <MdOutlineSubtitles className='subtitle-info' />
          </div>
          <div className='fullscreen' onClick={openFullscreen}>
            {elem ? <BsArrowsAngleContract className='fullscreen-into' /> : <BsArrowsAngleExpand className='fullscreen-into' />}
          </div>
        </div>
      </div>
      <div>
        {(stateSubtitle === true) ?
        <div className='subtitle-render' id='subtitle-render'></div>
        :
        <div></div>
        }
      </div>
    </div>
  )
}

export default CineWatchPlayerVideo;