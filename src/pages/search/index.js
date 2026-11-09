import React, { useEffect, useState } from 'react';
import './styles.css';

import CardTitle from '../../components/card-title';
import Header from '../../components/header';
import { removeQuote } from '../../assistant';

function Search() {
  const position = window.location.pathname.indexOf('search/');
  const wordMovie = decodeURIComponent(
    window.location.pathname.substring(position + 7)
  ).replace('-', ' ');

  const [movies, setMovies] = useState([]);
  const [moviesTMDB, setMoviesTMDB] = useState([]);

  const titles = 'https://api.npoint.io/485606789b28296238fd';

  const userVerify = removeQuote(localStorage.getItem('user'));

  useEffect(() => {
    if (userVerify.length < 10) {
      window.location.replace('/login');
    }
  }, [userVerify]);

  useEffect(() => {
    fetch(titles)
      .then(response => response.json())
      .then(data => {
        setMovies(data);
      })
      .catch(error => {
        console.error('Erro ao carregar lista de filmes:', error);
      });
  }, [titles]);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=93296066cafd1a70fac5ed2532fda74f&language=pt-BR&query=${encodeURIComponent(wordMovie)}&page=1&include_adult=false`
    )
      .then(response => response.json())
      .then(data => {
        setMoviesTMDB(data.results || []);
      })
      .catch(error => {
        console.error('Erro ao pesquisar filmes:', error);
      });
  }, [wordMovie]);

  function searchOnAPI(idMovieSearch) {
    return Object.values(movies).some(group => {
      if (!Array.isArray(group)) {
        return false;
      }

      return group.some(movie => {
        return String(movie.id) === String(idMovieSearch);
      });
    });
  }

  return (
    <div className="content-search">
      <Header />

      <div className="list-search">
        {moviesTMDB.map(movie => (
          searchOnAPI(movie.id) ? (
            <li className="title-item" key={movie.id}>
              <CardTitle id={movie.id} />
            </li>
          ) : null
        ))}
      </div>
    </div>
  );
}

export default Search;