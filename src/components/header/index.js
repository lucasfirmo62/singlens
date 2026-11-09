import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import { exitAccount, removeQuote } from '../../assistant';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const searchTimeout = useRef(null);

  const user = removeQuote(localStorage.getItem('nameUser'));

  useEffect(() => {
    const url = window.location.pathname;
    const position = url.indexOf('/search/');

    if (position !== -1) {
      const wordMovie = url.substring(position + 8, position + 115);

      if (wordMovie.length <= 0) {
        window.location.replace('/');
        return;
      }

      const formattedWord = wordMovie.replace(/[-]/g, ' ');

      setSearchTerm(formattedWord);

      const timeout = setTimeout(() => {
        const searchInput = document.getElementById('source');

        if (searchInput) {
          searchInput.focus();
        }
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  function goOn() {
    window.location.replace('/');
  }

  function goOnProfile() {
    window.location.replace('/profile');
  }

  function setSearchChange(value) {
    setSearchTerm(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      const formattedValue = value.replace(/[ ]/g, '-');
      window.location.replace(`/search/${formattedValue}`);
    }, 1300);
  }

  return (
    <div className="header-content">
      <div>
        <input
          type="text"
          className="input-search"
          placeholder="Digite o filme que deseja"
          id="source"
          value={searchTerm}
          onChange={(event) => setSearchChange(event.target.value)}
        />
      </div>

      <div onClick={goOn}>
        <p>Inicio</p>
      </div>

      <div>
        <p>Somente para você</p>
      </div>

      <div onClick={goOnProfile}>
        <p>{`Olá ${user}`}</p>
      </div>

      <div onClick={exitAccount}>
        <p>Sair</p>
      </div>
    </div>
  );
};

export default Header;