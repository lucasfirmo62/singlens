import React, { useEffect, useState } from 'react';
import './styles.css';
import CardTitle from '../../components/card-title';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { removeQuote } from '../../assistant';
import { findAllByAltText } from '@testing-library/react';


function Search() {

  var url = window.location.href

  var position = url.indexOf("search/");

  var wordMovie = url.substr(position + 7, 107);

  wordMovie = wordMovie.replace("-", " ")

  const [movies, setMovies] = useState([]);

  const titles = "https://api.npoint.io/485606789b28296238fd"

  useEffect(() => {
    fetch(titles)
      .then(response => response.json())
      .then(json => json)
      .then(async (data) => {
        setMovies(await data);
      })
  }, [])

  var user = removeQuote(localStorage.getItem('IdUser'))

  var userVerify = removeQuote(localStorage.getItem('user'))

  const [moviesTMDB, setmoviesTMDB] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=93296066cafd1a70fac5ed2532fda74f&language=pt-BR&query=${wordMovie}&page=1&include_adult=false`)
      .then(response => response.json())
      .then(json => json.results)
      .then(async (data) => {
        setmoviesTMDB(await data);
      })
  }, [])


  if (userVerify.length < 10) {
    window.location.replace(`/login`)
  }

  setTimeout(function () {
    document.getElementById('carousels').style.visibility = "visible"
    document.getElementById('load').style.display = "none"
  }, 2000);


  function searchOnAPI(idMovieSearch) {
    var x = 0
    var i = 0
    for (x in movies) {
      i = i + 1
      for (i in movies[x]) {
        if (movies[x][i].id == idMovieSearch) {
          return true
        }
      }
    }
  }



  return (
    <div className='content-search'>
      <Header />
      <div className='list-search'>
        {moviesTMDB.map((movie, index) => (
          (searchOnAPI(movie.id) === true) ?
            <li className="title-item" key={index}>
              <CardTitle
                id={movie.id}
              />
            </li>
            :
            null
        ))}

      </div>
    </div>
  );
}

export default Search;
