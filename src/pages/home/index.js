import React, { useEffect, useState } from 'react';
import './styles.css';

import SimpleCarouselTitles from '../../components/simple-carousel';
import SimpleCarouselPoster from '../../components/simple-carousel-poster';
import SimpleLittleCarouselPoster from '../../components/simple-little-carousel-poster';
import MyList from '../../components/MyList';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Resume from '../../components/Resume';

import { removeQuote } from '../../assistant';

function App() {
  const user = removeQuote(localStorage.getItem('IdUser'));
  const userVerify = removeQuote(localStorage.getItem('user'));

  const [loading, setLoading] = useState(false);
  const [carouselsVisible, setCarouselsVisible] = useState(false);

  if(userVerify === null || user == null){
    window.location.replace('/sign-up');
  }

  if(user === "ul"){
    window.location.replace('/sign-up');
  }

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(true);
    }, 100);

    const carouselTimer = setTimeout(() => {
      setCarouselsVisible(true);
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(carouselTimer);
    };
  }, []);

  return (
    <div className="content">
      <div
        id="load"
        className="loadingio-spinner-rolling-7fylwl190qh"
        style={{ display: loading ? 'block' : 'none' }}
      >
        <div className="ldio-qjgygy3qvv">
          <div></div>
        </div>
      </div>

      <Header />

      <div
        className="carousels"
        id="carousels"
        style={{ visibility: carouselsVisible ? 'visible' : 'hidden' }}
      >
        <SimpleCarouselTitles
          name="Acabou de Chegar..."
          titles="https://api.npoint.io/65737b8c3c5f4364b75e"
        />

        <Resume
          name="Continuar Assistindo"
          titles={`https://back-singlens.onrender.com/auth/${user}`}
        />

        <MyList
          name="Minha Lista"
          titles={`https://back-singlens.onrender.com/auth/${user}`}
        />

        <SimpleCarouselTitles
          name="Estrangeiros"
          titles="https://api.npoint.io/fb2310e0c170aeaea064"
        />

        <SimpleCarouselPoster
          name="Grandes Obras"
          titles="https://api.npoint.io/5fce3c9ba24692626762"
        />

        <SimpleCarouselTitles
          name="Bons filmes Noir"
          titles="https://api.npoint.io/f46409bca7760ba6a7d6"
        />

        <SimpleLittleCarouselPoster
          name="Menos de 90 minutos"
          titles="https://api.npoint.io/55562f5f6bde87e66682"
        />

        <SimpleCarouselTitles
          name="Aclamados Desconhecidos"
          titles="https://api.npoint.io/d725e3865721de91ddd6"
        />

        <SimpleCarouselTitles
          name="Comédias e um pouco mais"
          titles="https://api.npoint.io/8b263560be76a3cab3b3"
        />

        <SimpleCarouselTitles
          name="Faroestes empolgantes"
          titles="https://api.npoint.io/1033048702d202f92407"
        />
      </div>

      <Footer />
    </div>
  );
}

export default App;
