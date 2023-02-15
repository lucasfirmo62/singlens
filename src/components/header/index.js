import React, { useEffect, useState } from 'react';
import './styles.css';
import { exitAccount, removeQuote } from '../../assistant';
import { useNavigate } from 'react-router-dom';



const Header = () => {

  const history = useNavigate();

  var user = removeQuote(localStorage.getItem('nameUser'))

  var token;

  token = removeQuote(localStorage.getItem('user'))

  var url = window.location.href
  var position = url.indexOf("search/");
  var wordMovie = url.substr(position + 7, 107);

  console.log(wordMovie)

  if (wordMovie.length <= 0) {
    window.location.replace("/")
  }

  setTimeout(function () {
    if (url.includes("search/")) {
      var searchInputVerify = document.getElementById('source')
      wordMovie = wordMovie.replace(/[-]/g, " ")
      document.getElementById('source').value = wordMovie
      searchInputVerify.focus()
    }
  }, 100);



  function goOn() {
    window.location.replace("/")
  }

  function goOnProfile() {
    window.location.replace("/profile")
  }

  function setSearchChange() {
    setTimeout(function () {
      var x = document.getElementById("source").value;
      x = x.replace(/[ ]/g, "-")
      window.location.replace(`/search/${x}`)
    }, 1300);
  }

  return (
    <div className='header-content'>
      <div><input type='text' className='input-search' placeholder='Digite o filme que deseja' id="source" onChange={() => setSearchChange()} /></div>
      <div onClick={goOn}><p>Inicio</p></div>
      <div><p>Somente para você</p></div>
      <div onClick={goOnProfile}><p>{`Olá ${user}`}</p></div>
      <div onClick={token = exitAccount}><p>Sair</p></div>
    </div>
  )
}

export default Header;