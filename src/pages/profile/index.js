import React, { useEffect, useState } from 'react';
import './styles.css';

import Header from '../../components/header';
import Footer from '../../components/footer';
import { removeQuote } from '../../assistant';
import api from '../../api';
import { AiOutlineCheck } from 'react-icons/ai';

const avatars = {
  '1': 'nPO29qu.jpeg',
  '2': 'oYBkmhj.jpeg',
  '3': '5Pcx3Vq.jpeg',
  '4': 'vAP7kdO.jpeg',
  '5': 'sZyMbsu.jpeg',
  '6': 'mDLxGQ9.jpeg'
};

function Profile() {
  const user = removeQuote(localStorage.getItem('IdUser'));
  const userVerify = removeQuote(localStorage.getItem('user'));

  const [userUtility, setUserUtility] = useState({});
  const [selectedAvatar, setSelectedAvatar] = useState('1');
  const [newName, setNewName] = useState('');
  const [showNameAlert, setShowNameAlert] = useState(false);

  useEffect(() => {
    if (userVerify.length < 10) {
      window.location.replace('/login');
    }
  }, [userVerify]);

  useEffect(() => {
    fetch(`https://back-singlens.onrender.com/auth/${user}`)
      .then(response => response.json())
      .then(data => {
        setUserUtility(data);

        if (data.avatar && avatars[data.avatar]) {
          setSelectedAvatar(data.avatar);
        }
      })
      .catch(error => {
        console.error('Erro ao carregar perfil:', error);
      });
  }, [user]);

  async function updateAvatar(newAvatarSet) {
    try {
      const response = await fetch(
        `https://back-singlens.onrender.com/auth/${user}`
      );

      if (response.ok) {
        const data = {
          avatar: newAvatarSet
        };

        await api.post(`/auth/watchlist/${user}`, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        setSelectedAvatar(newAvatarSet);
        setUserUtility(prev => ({
          ...prev,
          avatar: newAvatarSet
        }));
      }
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
    }
  }

  function selectAvatar(event) {
    const avatarId = event.currentTarget.id;
    updateAvatar(avatarId);
  }

  async function updateName() {
    if (newName.trim().length <= 1) {
      setShowNameAlert(true);
      return;
    }

    setShowNameAlert(false);

    try {
      const response = await fetch(
        `https://back-singlens.onrender.com/auth/${user}`
      );

      if (response.ok) {
        const data = {
          name: newName.trim()
        };

        await api.post(`/auth/watchlist/${user}`, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        setUserUtility(prev => ({
          ...prev,
          name: newName.trim()
        }));

        setNewName('');
      }
    } catch (error) {
      console.error('Erro ao atualizar nome:', error);
    }
  }

  return (
    <div className="content">
      <Header />

      <div className="content-profile">
        <div className="box-perfil">
          <div className="form">
            <center>
              <div className="name">
                <img
                  className="avatar"
                  id="avatar-home"
                  src={`https://i.imgur.com/${avatars[selectedAvatar]}`}
                  alt="Avatar selecionado"
                />
              </div>
            </center>

            <div className="name">
              Seu nome:
              <input
                id="nameSet"
                type="text"
                placeholder={userUtility.name || 'Seu nome'}
                value={newName}
                onChange={event => setNewName(event.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={updateName}
              className="button-profile"
              aria-label="Salvar nome"
            >
              <AiOutlineCheck />
            </button>

            {showNameAlert && (
              <p id="alert-name" className="alert-name">
                Escolha um nome maior
              </p>
            )}

            <div className="name">
              Seu email: {userUtility.email}
            </div>
          </div>
        </div>

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
                  updateAvatar(id);
                }
              }}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
