import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import CardTitle from '../../components/card-title';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

const CarouselSimple = ({ name, titles }) => {
  const [movies, setMovies] = useState([]);
  const [count, setCount] = useState(0);

  const carouselRef = useRef(null);

  const carouselName = (name || '').substring(0, 3);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (carouselRef.current) {
        carouselRef.current.style.display = 'flex';
        carouselRef.current.style.marginLeft = '-70px';
        carouselRef.current.style.overflow = 'hidden';
        carouselRef.current.style.whiteSpace = 'nowrap';
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetch(titles)
      .then(response => response.json())
      .then(json => {
        if (isMounted) {
          setMovies(json.recents || []);
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
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      top: 0,
      left: 870,
      behavior: 'smooth'
    });

    setCount(current => Math.min(current + 1, 5));
  }

  function previous() {
    if (!carouselRef.current) return;

    carouselRef.current.scrollBy({
      top: 0,
      left: -870,
      behavior: 'smooth'
    });

    setCount(current => Math.max(current - 1, 0));
  }

  return (
    <div>
      <div>{name}</div>

      <div className="content-simple-carousel">
        <button
          id="low"
          onClick={previous}
          className="btnPreviousR"
          style={{ visibility: count === 0 ? 'hidden' : 'visible' }}
        >
          <MdOutlineArrowBackIosNew className="arrows" />
        </button>

        <ul
          id={carouselName}
          className={carouselName}
          ref={carouselRef}
        >
          {movies.map((movie, index) => (
            <li className="title-item" key={movie.id || index}>
              <CardTitle id={movie.id} />
            </li>
          ))}
        </ul>

        <button
          className="btnNextR"
          id="low"
          onClick={next}
          style={{ visibility: count >= 5 ? 'hidden' : 'visible' }}
        >
          <MdOutlineArrowForwardIos className="arrows" />
        </button>
      </div>
    </div>
  );
};

export default CarouselSimple;