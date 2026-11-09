import React, { useState } from 'react';
import './styles.css';
import api from '../../api';

const SignUp = () => {
    const avatars = {
        '1': 'nPO29qu.jpeg',
        '2': 'oYBkmhj.jpeg',
        '3': '5Pcx3Vq.jpeg',
        '4': 'vAP7kdO.jpeg',
        '5': 'sZyMbsu.jpeg',
        '6': 'mDLxGQ9.jpeg'
    };

    const [stage, setStage] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('1');
    const [loading, setLoading] = useState(false);

    function nextStage() {
        if (stage === 1) {
            if (!email.trim() || !name.trim()) {
                alert('Preencha seu email e nome para continuar.');
                return;
            }

            setStage(2);
            return;
        }

        if (stage === 2) {
            if (!password || !confirmPassword) {
                alert('Preencha os dois campos de senha.');
                return;
            }

            if (password !== confirmPassword) {
                alert('As senhas não coincidem.');
                return;
            }

            setStage(3);
        }
    }

    async function sendNewUser() {
        const data = {
            name: name.trim(),
            email: email.trim(),
            password,
            avatar: selectedAvatar
        };

        try {
            setLoading(true);

            await api.post('/auth/register', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            window.location.replace('/login');
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            alert('Não foi possível criar sua conta. Tente novamente.');
            setLoading(false);
        }
    }

    function selectAvatar(event) {
        setSelectedAvatar(event.currentTarget.id);
    }

    return (
        <div className="content-sign-up">
            <div
                id="load"
                className="loadingio-spinner-rolling-7fylwl190qh"
                style={{ display: loading ? 'block' : 'none' }}
            >
                <div className="ldio-qjgygy3qvv">
                    <div></div>
                </div>
            </div>

            <div className="boxer-sign-up">
                <div className="content-form-sign-up">

                    {stage === 1 && (
                        <div id="stage-one" className="stage-one">
                            <p>Crie Sua conta 1 de 3</p>

                            <div className="coll">
                                <input
                                    placeholder="Seu Email"
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={event => setEmail(event.target.value)}
                                />
                            </div>

                            <div className="coll">
                                <input
                                    placeholder="Seu nome ou apelido"
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={event => setName(event.target.value)}
                                />
                            </div>

                            <center>
                                <div
                                    className="button-big"
                                    role="button"
                                    tabIndex={0}
                                    onClick={nextStage}
                                    onKeyDown={event => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            nextStage();
                                        }
                                    }}
                                >
                                    PRÓXIMO
                                </div>
                            </center>
                        </div>
                    )}

                    {stage === 2 && (
                        <div id="stage-two" className="stage-two">
                            <p>Crie Sua conta 2 de 3</p>

                            <div className="coll">
                                <input
                                    placeholder="Crie sua senha"
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                />
                            </div>

                            <div className="coll">
                                <input
                                    placeholder="Digite novamente sua senha"
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={event => setConfirmPassword(event.target.value)}
                                />
                            </div>

                            <center>
                                <div
                                    className="button-big"
                                    role="button"
                                    tabIndex={0}
                                    onClick={nextStage}
                                    onKeyDown={event => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            nextStage();
                                        }
                                    }}
                                >
                                    PRÓXIMO
                                </div>
                            </center>
                        </div>
                    )}

                    {stage === 3 && (
                        <div id="stage-three" className="stage-three">
                            <p>Crie Sua conta 3 de 3</p>

                            <div className="avatars-select">
                                <p>Escolha seu avatar</p>

                                {Object.entries(avatars).map(([id, avatar]) => (
                                    <img
                                        key={id}
                                        onClick={selectAvatar}
                                        src={`https://i.imgur.com/${avatar}`}
                                        id={id}
                                        className="select-avatars"
                                        alt={`Selecionar avatar ${id}`}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={event => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                setSelectedAvatar(id);
                                            }
                                        }}
                                    />
                                ))}
                            </div>

                            <div id="user-preview" className="user-preview">
                                <img
                                    className="avatar"
                                    id="avatar-home"
                                    src={`https://i.imgur.com/${avatars[selectedAvatar]}`}
                                    alt="Avatar escolhido"
                                />
                                <p>Você</p>
                            </div>

                            <center>
                                <div
                                    className="button-big"
                                    role="button"
                                    tabIndex={0}
                                    onClick={sendNewUser}
                                    onKeyDown={event => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            sendNewUser();
                                        }
                                    }}
                                    aria-disabled={loading}
                                >
                                    CRIAR CONTA
                                </div>
                            </center>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SignUp;