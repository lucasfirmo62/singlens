import React, { useEffect, useState } from 'react';
import './styles.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { AiOutlineCheck } from 'react-icons/ai';
import { BsFillPlayFill } from 'react-icons/bs';
import { removeQuote } from '../../assistant';
import api from '../../api';



const CardTitle = ({ id }) => {

  var UserUtilityList;
  var UserUtilityResume;
  const [movie, setMovie] = useState([]);
  const [reviews, setRewviews] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [userUtility, setUserUtility] = useState([]);

  const [toogleRemove, setToogleRemove] = React.useState(true);

  const [removeMovie, setRemove] = React.useState(<AiOutlineCheck className='add-list' />);
  React.useEffect(() => {
    setRemove((stateRMV) => toogleRemove ? <AiOutlineCheck className='add-list' /> : <AiOutlinePlus className='add-list' />);
  }, [toogleRemove]);

  const [toogleAdd, setToogleAdd] = React.useState(true);

  const [addMovie, setAdd] = React.useState(<AiOutlinePlus className='add-list' />);
  React.useEffect(() => {
    setAdd((stateAdd) => toogleAdd ? <AiOutlinePlus className='add-list' /> : <AiOutlineCheck className='add-list' />);
  }, [toogleAdd]);

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=93296066cafd1a70fac5ed2532fda74f&language=pt-BR`
    fetch(url)
      .then(response => response.json())
      .then(json => json)
      .then(async (data) => {
        setMovie(await data);
      })
  }, [])


  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=93296066cafd1a70fac5ed2532fda74f&language=en-US&page=1`
    fetch(url)
      .then(response => response.json())
      .then(json => json)
      .then(async (data) => {
        setRewviews(await data);
      })
  }, [])

  useEffect(() => {
    const url = `https://api.npoint.io/485606789b28296238fd`
    fetch(url)
      .then(response => response.json())
      .then(json => json)
      .then(async (data) => {
        setAllMovies(await data);
      })
  }, [])

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

  UserUtilityList = userUtility.watchlist;
  UserUtilityResume = userUtility.resume;

  var backdropUndefined = removeQuote(localStorage.getItem('undefined-image'))

  var u = 0
  var posterMovie = backdropUndefined;
  for (u in allMovies.movies) {
    if (allMovies.movies[u].id == id) {
      posterMovie = allMovies.movies[u].poster;
    }
  }
  var backdrop = `https://i.imgur.com/${posterMovie}`

  function goWatch() {
    window.location.replace(`/watch-play/${id}`)
  }

  var x = 0
  var ratingMovie = 0
  var countRating = 0;

  if (reviews) {
    for (x in reviews.results) {
      ratingMovie += reviews.results[x].author_details.rating;
      if (reviews.results[x].author_details.rating > 0) {
        countRating++;
      }
      if (reviews.results[x].author_details.rating == "NaN") {
        ratingMovie = movie.vote_average;
        return
      }
    }
    ratingMovie = ratingMovie / countRating;
    ratingMovie = (movie.vote_average + ratingMovie) / 2
    ratingMovie = String(ratingMovie)
  }

  async function setWachlist(statusShow) {
    
    setToogleAdd(stateAdd => !stateAdd)
    setToogleRemove(stateRMV => !stateRMV)

    var user = removeQuote(localStorage.getItem('IdUser'))

    var userContent;

    var xmlhttp = new XMLHttpRequest();
    var url = `https://brave-red-blazer.cyclic.app/auth/${user}`;

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
    var user = removeQuote(localStorage.getItem('IdUser'))

    var arrayWatchlist = userContent.watchlist;

    if (arrayWatchlist.includes(id) === true) {
      const index = arrayWatchlist.indexOf(id);
      if (index > -1) {
        arrayWatchlist.splice(index, 1);
      }
    } else {
      arrayWatchlist.unshift(id)
    }

    const data = {
      watchlist: arrayWatchlist
    }

    api.post(`/auth/watchlist/${user}`, data, {
      headers: {
        'Content-Type': 'application/json',
      }
    })

  }

  var infoResume;

  if (UserUtilityResume?.find(movieMark => movieMark?.idMovie === id)) {
    infoResume = UserUtilityResume?.find(movieMark => movieMark?.idMovie === id)
  }




  return (
    <div className='content-card-movie'>
      <a href={`/watch/${id}`}>
        <div className='solo-back'>
          <img
            src={(backdrop) ? backdrop : backdropUndefined}
            className='backdrop'
          />
        </div>
      </a>
      <div className='bar'>
        <div className='rating-movie' title='Crítica Agregada'>{ratingMovie.substring(0, 3)}</div>
        {
          (UserUtilityResume?.find(movieMark => movieMark?.idMovie === id)) ?
            <div>
              <BsFillPlayFill onClick={goWatch} className='resume-movie' />
              <p className='watch-now-title-resume' onClick={goWatch} title={`Continuar ${movie.title}`}>Continue assistindo</p>
              <div className='current-percentage-background'>
                <div style={{ width: `${infoResume?.currentTimeMovie}%` }} className='current-percentage'></div>
              </div>
            </div>
            :
            <div>
              <BsFillPlayFill onClick={goWatch} className='play-movie' />
              <p className='watch-now-title' onClick={goWatch}>Assistir agora</p>
            </div>
        }
        {
          (UserUtilityList?.includes(id) === true) ?
              <div className='button-wachlist' onClick={() => setWachlist(0)}>
                {removeMovie}
              </div>
            :
              <div className='button-wachlist' onClick={() => setWachlist(1)}>
                {addMovie}
              </div>
        }
      </div>
    </div>
  )
}

export default CardTitle;