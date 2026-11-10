
import React, { useEffect, useState } from 'react';
import './styles.css';

import CardTitlePoster from '../card-title-poster';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

const SuperCarousel = ({ name, titles }) => {

  const [movies, setMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    fetch(titles)
      .then(response => response.json())
      .then(json => {
        if (isMounted) {
          setMovies(json.recents || []);
          setActiveIndex(0);
        }
      })
      .catch(error => {
        console.error('Erro ao carregar os filmes:', error);
      });

    return () => {
      isMounted = false;
    };
  }, [titles]);

  function next() {
    setActiveIndex(current =>
      Math.min(current + 1, movies.length - 1)
    );
  }

  function previous() {
    setActiveIndex(current =>
      Math.max(current - 1, 0)
    );
  }

  function getPosition(index) {
    const difference = index - activeIndex;

    if (difference === 0) return 'center';
    if (difference === -1) return 'left-one';
    if (difference === 1) return 'right-one';
    if (difference === -2) return 'left-two';
    if (difference === 2) return 'right-two';

    return 'hidden';
  }

  return (
    <section className="super-carousel">

      <div className="super-carousel-heading">
      </div>

      <div className="super-carousel-stage">

        <button
          className="super-carousel-button previous"
          onClick={previous}
          disabled={activeIndex === 0}
          aria-label="Filmes anteriores"
        >
          <MdOutlineArrowBackIosNew />
        </button>

        <div className="super-carousel-gallery">

          {movies.map((movie, index) => {

            const position = getPosition(index);

            return (
              <div
                key={movie.id || index}
                className={`super-carousel-card ${position}`}
                onClick={() => setActiveIndex(index)}
              >
                <div className="super-carousel-card-inner">
                  <CardTitlePoster id={movie.id} />
                </div>
              </div>
            );
          })}

        </div>

        <button
          className="super-carousel-button next"
          onClick={next}
          disabled={activeIndex === movies.length - 1 || movies.length === 0}
          aria-label="Próximos filmes"
        >
          <MdOutlineArrowForwardIos />
        </button>

      </div>

      <div className="super-carousel-pagination">
        <span>
          {String(activeIndex + 1).padStart(2, '0')}
        </span>

        <div className="super-carousel-progress">
          <div
            style={{
              width: `${movies.length > 0
                ? ((activeIndex + 1) / movies.length) * 100
                : 0}%`
            }}
          />
        </div>

        <span>
          {String(movies.length).padStart(2, '0')}
        </span>
      </div>

    </section>
  );
};

export default SuperCarousel;
