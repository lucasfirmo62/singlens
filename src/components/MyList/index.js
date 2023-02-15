import React, { useEffect, useState } from 'react';
import './styles.css';
import CardTitle from '../../components/card-title';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { MdOutlineArrowForwardIos } from 'react-icons/md';



const MyList = ({ name, titles }) => {

  const [movies, setMovies] = useState([]);


  useEffect(() => {
    fetch(titles)
      .then(response => response.json())
      .then(json => json.watchlist)
      .then(async (data) => {
        setMovies(await data);
      })
  }, [])

  const box = document.querySelector('.list');
  var count = 0;

  const leftA = document.getElementById("low1");
  const rigthA = document.getElementById("low2");

  function next() {
    box.scrollBy({
      top: 0,
      left: 870,
      behavior: 'smooth'
    });

    if (count <= 4) {
      count++;
    }

    if (count !== 0) {
      leftA.style.visibility = "visible";
    }

    if (count >= 5) {
      rigthA.style.visibility = "hidden";
    }
  }

  function previous() {
    box.scrollBy({
      top: 0,
      left: -870,
      behavior: 'smooth'
    });

    if (count >= 0) {
      count--;
    }

    if (count <= 0) {
      leftA.style.visibility = "hidden";
    }

    if (count <= 4) {
      rigthA.style.visibility = "visible";
    }
  }

  return (
    <div>
      {(movies.length === 0) ?
      
        null
      :
      <div>
      <div>{name}</div>
    <div className='content-simple-carousel'>
      <button id="low" onClick={previous} className="btnPreviousR">
      <MdOutlineArrowBackIosNew onClick={previous} id="low2" className='arrows'/>
      </button>
      <ul className="list">
        {movies.map((movie, index) => (
          <li className="title-item" key={index}>
            <CardTitle
              id={movie}
            />
          </li>
        ))}
      </ul>
      <button className="btnNextR" id="low" onClick={next}>
        <MdOutlineArrowForwardIos onClick={next} id="low2" className='arrows'/>
      </button>
    </div>
    </div>
    }
    </div>
  )
}

export default MyList;