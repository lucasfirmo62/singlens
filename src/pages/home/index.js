import React, { useEffect, useState } from 'react';
import './styles.css';
import SimpleCarouselTitles from '../../components/simple-carousel';
import MyList from '../../components/MyList';
import Header from '../../components/header'
import Footer from '../../components/footer'
import Resume from '../../components/Resume'
import { removeQuote } from '../../assistant';


function App() {

  var user = removeQuote(localStorage.getItem('IdUser'))

  var userVerify = removeQuote(localStorage.getItem('user'))

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`http://192.168.1.9:8080/auth/${user}`)
      .then(response => response.json())
      .then(json => json.watchlist)
      .then(async (data) => {
        setMovies(await data);
      })
  }, [])

  const UserUtilityList = movies.watchlist;


  if (userVerify.length < 10) {
    window.location.replace(`/login`)
  }

  setTimeout(function() {
    document.getElementById('carousels').style.visibility = "visible"
    document.getElementById('load').style.display = "none"
  }, 2000);



  return (
    <div className='content'>
      <div id='load' className="loadingio-spinner-rolling-7fylwl190qh"><div className="ldio-qjgygy3qvv">
        <div></div>
      </div></div>
      <Header />
      <div className='carousels' id='carousels'>
        <SimpleCarouselTitles
          name={"Titulos recentes"}
          titles={"https://api.npoint.io/65737b8c3c5f4364b75e"}
        />
        <Resume
          name={"Continuar Assistindo"}
          titles={`http://192.168.1.9:8080/auth/${user}`}
        />
        <SimpleCarouselTitles
          name={"Estrangeiros"}
          titles={"https://api.npoint.io/fb2310e0c170aeaea064"}
        />
        <SimpleCarouselTitles
          name={"Titulos recentes"}
          titles={"https://api.npoint.io/65737b8c3c5f4364b75e"}
        />
        <MyList
          name={"Minha Lista"}
          titles={`http://192.168.1.9:8080/auth/${user}`}
        />
      </div>
      <Footer/>
    </div>
  );
}

export default App;