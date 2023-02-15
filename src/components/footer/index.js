import React, { useEffect, useState } from 'react';
import './styles.css';
import { exitAccount, removeQuote } from '../../assistant';


const Footer = () => {

  var user = removeQuote(localStorage.getItem('nameUser'))

  var token;

  token = removeQuote(localStorage.getItem('user'))

  var url = window.location.href
  var position = url.indexOf("search/");
  var wordMovie = url.substr(position + 7, 107);
  
  console.log(wordMovie)

  if(wordMovie.length <= 0){
    window.location.replace("/")
  }

  setTimeout(function () {
    if (url.includes("search/")) {
      var searchInputVerify = document.getElementById('source')
      wordMovie = wordMovie.replace(/[-]/g," ")
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
    var x = document.getElementById("source").value;
    x = x.replace(/[ ]/g,"-")
    window.location.replace(`/search/${x}`)
  }

  return (
    <div className='footer-content'>
      <div className='coll'><p>Quem Somos?</p></div>
      <div className='coll'><p>Singlens, viva o cinema © Todos os direitos reservados</p></div>
      <div className='coll'><p>Termos</p></div>
    </div>
  )
}

export default Footer;