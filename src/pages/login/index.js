import React, { useState } from 'react';
import './styles.css';
import api from '../../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin(e) {
        e.preventDefault();

        const data = {
            email,
            password
        };

        try {
            const info_data = await api.post('/auth/authenticate', data);

            localStorage.setItem('user', JSON.stringify(info_data.data.token));
            localStorage.setItem('undefined-image', JSON.stringify('BoK9thR.png'));
            localStorage.setItem('IdUser', JSON.stringify(info_data.data.user._id));
            localStorage.setItem('nameUser', JSON.stringify(info_data.data.user.name));

            window.location.replace('/');
        } catch (err) {
            alert('Falha no login, tente novamente mais tarde.');
        }
    }

    return (
        <div className="content-login">
            <div className="boxer-login">
                <p>Entre Agora</p>

                <div className="mask1">
                    <img
                        src="https://www.themoviedb.org/t/p/original/ouxbEPWdQiZDTV5ziJYrqG2DuBw.jpg"
                        alt="Imagem de destaque do filme"
                        width="600"
                        height="400"
                    />
                </div>

                <div className="mask2">
                    <img
                        src="https://www.themoviedb.org/t/p/original/AkrH4l7cwI4Ejnq0yNDskaJuJEr.jpg"
                        alt="Imagem de destaque do filme"
                        width="600"
                        height="400"
                    />
                </div>

                <div className="content-form">
                    <form onSubmit={handleLogin}>
                        <div className="coll">
                            <input
                                placeholder="Email"
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="coll">
                            <input
                                type="password"
                                placeholder="Senha"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <div className="coll">
                                <center>
                                    <button
                                        type="submit"
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
    );
};

export default Login;