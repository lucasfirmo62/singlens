import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import CardTitleResume from '../../components/card-title-resume';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

const Resume = ({ name, titles }) => {
  const [movies, setMovies] = useState([]);
  const [count, setCount] = useState(0);

  const carouselRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    fetch(titles)
      .then(response => response.json())
      .then(json => {
        if (isMounted) {
          setMovies(json.resume || []);
        }
      })
      .catch(error => {
        console.error('Erro ao carregar os filmes em andamento:', error);
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
      {movies.length > 0 && (
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

            <ul className="list" ref={carouselRef}>
              {movies.map((movie, index) => (
                <li className="title-item" key={movie.idMovie || index}>
                  <CardTitleResume id={movie.idMovie} />
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
      )}
    </div>
  );
};

export default Resume;