import React, { useEffect, useState } from 'react';
import './styles.css';
import SimpleCarouselTitles from '../../components/simple-carousel';
import MyList from '../../components/MyList';
import Header from '../../components/header'
import Resume from '../../components/Resume'
import { removeQuote } from '../../assistant';
import Footer from '../../components/footer';
import api from '../../api';
import { AiOutlineCheck } from 'react-icons/ai';




function Profile() {

  var user = removeQuote(localStorage.getItem('IdUser'))

  var userVerify = removeQuote(localStorage.getItem('user'))

  const [userUtility, setuserUtility] = useState([]);

  useEffect(() => {
    fetch(`http://192.168.1.9:8080/auth/${user}`)
      .then(response => response.json())
      .then(json => json)
      .then(async (data) => {
        setuserUtility(await data);
      })
  }, [])

  var avatarOne = "nPO29qu.jpeg";
  var avatarTwo = "oYBkmhj.jpeg";
  var avatarThree = "5Pcx3Vq.jpeg";
  var avatarFour = "vAP7kdO.jpeg";
  var avatarFive = "sZyMbsu.jpeg";
  var avtarSix = "mDLxGQ9.jpeg";



  if (userVerify.length < 10) {
    window.location.replace(`/login`)
  }

  var linkAvatar = ''

  function avatarRender(){
    if (userUtility.avatar === "1") {
      linkAvatar = avatarOne
    }
    if (userUtility.avatar === "2") {
      linkAvatar = avatarTwo
    }
    if (userUtility.avatar === "3") {
      linkAvatar = avatarThree
    }
    if (userUtility.avatar === "4") {
      linkAvatar = avatarFour
    }
    if (userUtility.avatar === "5") {
      linkAvatar = avatarFive
    }
    if (userUtility.avatar === "6") {
      linkAvatar = avtarSix
    }

  }

  avatarRender()


  function selectAvatar(avt){
    updateAvatar(avt.target.id)
    console.log(avt.target.id)
    if(avt.target.id === "1"){
      document.getElementById('avatar-home').src = `https://i.imgur.com/${avatarOne}`
    }
    if(avt.target.id === "2"){
      document.getElementById('avatar-home').src = `https://i.imgur.com/${avatarTwo}`
    }
    if(avt.target.id === "3"){
      document.getElementById('avatar-home').src = `https://i.imgur.com/${avatarThree}`
    }
    if(avt.target.id === "4"){
      document.getElementById('avatar-home').src = `https://i.imgur.com/${avatarFour}`
    }
    if(avt.target.id === "5"){
      document.getElementById('avatar-home').src = `https://i.imgur.com/${avatarFive}`
    }
    if(avt.target.id === "6"){
      document.getElementById('avatar-home').src = `https://i.imgur.com/${avtarSix}`
    }
  }


  function updateAvatar(newAvatarSet) {

    var userContent;

    var xmlhttp = new XMLHttpRequest();
    var url = `http://192.168.1.9:8080/auth/${user}`;

    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        userContent = JSON.parse(this.responseText);
        const data = {
          avatar: newAvatarSet
        }
    
        api.post(`/auth/watchlist/${user}`, data, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    avatarRender()
  }


  function updateName() {
    var newName = document.getElementById('nameSet').value
    console.log(newName)

    if(newName.length <= 1){
      document.getElementById('alert-name').style.display = 'block'
    }else{
      document.getElementById('alert-name').style.display = 'none'
      var userContent;

    var xmlhttp = new XMLHttpRequest();
    var url = `http://192.168.1.9:8080/auth/${user}`;

    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        userContent = JSON.parse(this.responseText);
        const data = {
          name: newName
        }
    
        api.post(`/auth/watchlist/${user}`, data, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    }

    
  }



  return (
    <div className='content'>
      <Header />
      <div className='content-profile'>
        <div className='box-perfil'>
          <div className='form'>
            <center><div className='name'><img className='avatar' id='avatar-home' src={`https://i.imgur.com/${linkAvatar}`}></img></div></center>
            <div className='name'>Seu nome: <input id='nameSet' type="text" placeholder={userUtility.name}></input></div>
            <div onClick={updateName} className='button-profile'><a><AiOutlineCheck /></a></div>
            <p id='alert-name' className='alert-name'>Escolha um nome maior</p>
            <div className='name'>Seu email: {userUtility.email}</div>
          </div>
        </div>
        <div className='avatars-select'>
          <p>Escolha seu avatar</p>
          <img onClick={(e) => selectAvatar(e)} src={`https://i.imgur.com/${avatarOne}`} id='1' value='1' className='select-avatars' />
          <img onClick={(e) => selectAvatar(e)} src={`https://i.imgur.com/${avatarTwo}`} id='2' value='2' className='select-avatars' />
          <img onClick={(e) => selectAvatar(e)} src={`https://i.imgur.com/${avatarThree}`} id='3' value='3' className='select-avatars' />
          <img onClick={(e) => selectAvatar(e)} src={`https://i.imgur.com/${avatarFour}`} id='4' value='4' className='select-avatars' />
          <img onClick={(e) => selectAvatar(e)} src={`https://i.imgur.com/${avatarFive}`} id='5' value='5' className='select-avatars' />
          <img onClick={(e) => selectAvatar(e)} src={`https://i.imgur.com/${avtarSix}`} id='6' value='6' className='select-avatars' />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
