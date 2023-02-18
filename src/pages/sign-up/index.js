import React, { useEffect, useState, useContext } from 'react';
import './styles.css';
import { removeQuote } from '../../assistant';
import api from '../../api';


const SignUp = () => {

    var avatarOne = "nPO29qu.jpeg";
    var avatarTwo = "oYBkmhj.jpeg";
    var avatarThree = "5Pcx3Vq.jpeg";
    var avatarFour = "vAP7kdO.jpeg";
    var avatarFive = "sZyMbsu.jpeg";
    var avtarSix = "mDLxGQ9.jpeg";

    var nameUSer = document.getElementById('name')?.value

    var avatarUserAtribute = '';


    function selectAvatar(avt) {
        avatarUserAtribute = avt.target.id
        console.log(avt.target.id)
        if (avt.target.id === "1") {
            document.getElementById('avatar-home').src = `https://i.imgur.com/${avatarOne}`
        }
        if (avt.target.id === "2") {
            document.getElementById('avatar-home').src = `https://i.imgur.com/${avatarTwo}`
        }
        if (avt.target.id === "3") {
            document.getElementById('avatar-home').src = `https://i.imgur.com/${avatarThree}`
        }
        if (avt.target.id === "4") {
            document.getElementById('avatar-home').src = `https://i.imgur.com/${avatarFour}`
        }
        if (avt.target.id === "5") {
            document.getElementById('avatar-home').src = `https://i.imgur.com/${avatarFive}`
        }
        if (avt.target.id === "6") {
            document.getElementById('avatar-home').src = `https://i.imgur.com/${avtarSix}`
        }
    }

    async function sendNewUser() {
        var name = document.getElementById('name').value
        var email = document.getElementById('email').value
        var password = document.getElementById('password').value
        var avatar = avatarUserAtribute

        if(avatar === ''){
            avatar = '1'
        }

        const data = {
            name,
            email,
            password,
            avatar
        }

        api.post(`/auth/register`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })


        document.getElementById('load').style.display = "block"


        setTimeout(function () {
            document.getElementById('load').style.display = "none"
            window.location.replace(`/login`)
        }, 2000);

    }

    async function stage(step) {
        if (step === "1") {
            document.getElementById('stage-one').style.display = 'none'
            document.getElementById('stage-two').style.display = 'block'
            nameUSer = document.getElementById('name').value
        }
        if (step === "2") {
            document.getElementById('stage-two').style.display = 'none'
            document.getElementById('stage-three').style.display = 'block'
        }
        if (step === "3") {
            document.getElementById('stage-three').style.display = 'none'
            sendNewUser()
        }
    }


    return (
        <div className='content-sign-up'>
            <div id='load' className="loadingio-spinner-rolling-7fylwl190qh"><div className="ldio-qjgygy3qvv">
                <div></div>
            </div></div>
            <div className='boxer-sign-up'>
                <div className='content-form-sign-up'>
                    <div id='stage-one' className='stage-one'>
                        <p>Crie Sua conta 1 de 3</p>
                        <div className='coll'>
                            <input
                                placeholder='Seu Email'
                                id="email"
                                type="text"

                            />
                        </div>
                        <div className='coll'>
                            <input
                                placeholder='Seu nome ou apelido'
                                id="name"
                                type="text"
                            />
                        </div>
                        <center>
                            <div
                                value={1}
                                className="button-big"
                                onClick={() => stage("1")}
                            >
                                PRÓXIMO
                            </div>
                        </center>
                    </div>
                    <div id='stage-two' className='stage-two'>
                        <p>Crie Sua conta 2 de 3</p>
                        <div className='coll'>
                            <input
                                placeholder='Crie sua senha'
                                id="password"
                                type="password"

                            />
                        </div>
                        <div className='coll'>
                            <input
                                placeholder='Digite novamente sua senha'
                                id="consfirm-password"
                                type="password"
                            />
                        </div>
                        <center>
                            <div
                                value={1}
                                className="button-big"
                                onClick={() => stage("2")}
                            >
                                PRÓXIMO
                            </div>
                        </center>
                    </div>
                    <div id='stage-three' className='stage-three'>
                        <p>Crie Sua conta 3 de 3</p>
                        <div className='avatars-select'>
                            <p>Escolha seu avatar</p>
                            <img onClick={(e) => selectAvatar(e)} src={`https://i.imgur.com/${avatarOne}`} id='1' value='1' className='select-avatars' />
                            <img onClick={(e) => selectAvatar(e)} src={`https://i.imgur.com/${avatarTwo}`} id='2' value='2' className='select-avatars' />
                            <img onClick={(e) => selectAvatar(e)} src={`https://i.imgur.com/${avatarThree}`} id='3' value='3' className='select-avatars' />
                            <img onClick={(e) => selectAvatar(e)} src={`https://i.imgur.com/${avatarFour}`} id='4' value='4' className='select-avatars' />
                            <img onClick={(e) => selectAvatar(e)} src={`https://i.imgur.com/${avatarFive}`} id='5' value='5' className='select-avatars' />
                            <img onClick={(e) => selectAvatar(e)} src={`https://i.imgur.com/${avtarSix}`} id='6' value='6' className='select-avatars' />
                        </div>
                        <div id='user-preview' className='user-preview'>
                            <img className='avatar' id='avatar-home' src={`https://i.imgur.com/${avatarOne}`}></img>
                            <p>Você</p>
                        </div>
                        <center>
                            <div
                                value={1}
                                className="button-big"
                                onClick={() => stage("3")}
                            >
                                CRIAR CONTA
                            </div>
                        </center>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp;