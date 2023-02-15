import React, { useEffect, useState, useContext } from 'react';
import './styles.css';
import { removeQuote } from '../../assistant';
import api from '../../api';


const Login = () => {

    // var userVerify = removeQuote(localStorage.getItem('user'));

    // console.log(userVerify)

    const [movieWatch, setMovie] = useState([]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginOption, setLoginOption] = useState(1);

    async function handleLogin(e) {
        e.preventDefault();

        switch (loginOption) {
            case '1':
                const data = {
                    email: email,
                    password: password
                }

                try {
                    const info_data = await api.post('/auth/authenticate', data);

                    localStorage.setItem('user', JSON.stringify(info_data.data.token));

                    localStorage.setItem('undefined-image', JSON.stringify("BoK9thR.png"))

                    localStorage.setItem('IdUser', JSON.stringify(info_data.data.user._id));
                    localStorage.setItem('nameUser', JSON.stringify(info_data.data.user.name));

                    window.location.replace(`/`)


                } catch (err) {
                    alert('Falha no login, tente novamente. mais tarde');
                }

                break;
            default:
                alert('Falha no login, tente novamente. agora!');
        }
    }


    useEffect(() => {
        const url = `https://api.themoviedb.org/3/movie/550?api_key=93296066cafd1a70fac5ed2532fda74f&language=pt-BR`
        fetch(url)
            .then(response => response.json())
            .then(json => json)
            .then(async (data) => {
                setMovie(await data);
            })
    }, [])


    return (
        <div className='content-login'>
            <div className='boxer-login'>
                <p>Entre Agora</p>
                <div class="mask1">
                    <img src="https://www.themoviedb.org/t/p/original/ouxbEPWdQiZDTV5ziJYrqG2DuBw.jpg" alt="Cinque Terre" width="600" height="400"/>
                </div>

                <div class="mask2">
                    <img src="https://www.themoviedb.org/t/p/original/AkrH4l7cwI4Ejnq0yNDskaJuJEr.jpg" alt="Cinque Terre" width="600" height="400"/>
                </div>
                <div className='content-form'>
                    <form onSubmit={handleLogin}>
                        <div className='coll'>
                            <input
                                placeholder='Email'
                                id="email"
                                type="text"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                            />
                        </div>
                        <div className='coll'>
                            <input type="password"
                                placeholder='Senha'
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            <div className='coll'>
                                <center>
                                    <button
                                        type="submit"
                                        value={1}
                                        onClick={(e) => setLoginOption(e.currentTarget.value)}
                                        className="button-login"
                                    >
                                        ENTRAR
                                    </button>
                                </center>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;