import React, { useEffect, useRef, useState, useCallback } from 'react';
import './styles.css';

import Header from '../../components/header';
import Footer from '../../components/footer';

const HOLES = 6;
const GAME_TIME = 30;
const MAX_AMMO = 6;
const MAX_LIVES = 3;

const TARGETS = {
  bandit: { emoji: '🦹', points: 10, label: 'Bandido' },
  bottle: { emoji: '🍾', points: 5, label: 'Garrafa' },
  civilian: { emoji: '👩‍🌾', points: -10, label: 'Inocente' }
};

function pickType() {
  const r = Math.random();
  if (r < 0.55) return 'bandit';
  if (r < 0.8) return 'bottle';
  return 'civilian';
}

function Profile() {
  const [status, setStatus] = useState('idle'); // idle | playing | over
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [ammo, setAmmo] = useState(MAX_AMMO);
  const [time, setTime] = useState(GAME_TIME);
  const [reloading, setReloading] = useState(false);
  const [spots, setSpots] = useState(Array(HOLES).fill(null));
  const [flash, setFlash] = useState(null); // { index, kind }
  const [best, setBest] = useState(() => {
    try {
      return Number(localStorage.getItem('westernBest')) || 0;
    } catch {
      return 0;
    }
  });

  const spotsRef = useRef(Array(HOLES).fill(null));
  const timeouts = useRef(new Set());
  const scoreRef = useRef(0);

  const addTimeout = (fn, ms) => {
    const id = setTimeout(() => {
      timeouts.current.delete(id);
      fn();
    }, ms);
    timeouts.current.add(id);
    return id;
  };

  const clearAllTimeouts = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current.clear();
  };

  const syncSpots = () => setSpots([...spotsRef.current]);

  const addScore = useCallback(delta => {
    scoreRef.current = Math.max(0, scoreRef.current + delta);
    setScore(scoreRef.current);
  }, []);

  function startGame() {
    clearAllTimeouts();
    spotsRef.current = Array(HOLES).fill(null);
    scoreRef.current = 0;
    setSpots(Array(HOLES).fill(null));
    setScore(0);
    setLives(MAX_LIVES);
    setAmmo(MAX_AMMO);
    setTime(GAME_TIME);
    setReloading(false);
    setStatus('playing');
  }

  // Cronômetro
  useEffect(() => {
    if (status !== 'playing') return;
    const interval = setInterval(() => {
      setTime(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  // Fim de jogo
  useEffect(() => {
    if (status !== 'playing') return;
    if (time <= 0 || lives <= 0) {
      clearAllTimeouts();
      spotsRef.current = Array(HOLES).fill(null);
      setSpots(Array(HOLES).fill(null));
      setStatus('over');
      if (scoreRef.current > best) {
        setBest(scoreRef.current);
        try {
          localStorage.setItem('westernBest', String(scoreRef.current));
        } catch {}
      }
    }
  }, [time, lives, status, best]);

  // Gerador de alvos
  useEffect(() => {
    if (status !== 'playing') return;

    let active = true;

    const spawn = () => {
      if (!active) return;

      const empty = spotsRef.current
        .map((s, i) => (s ? null : i))
        .filter(i => i !== null);

      if (empty.length > 0) {
        const index = empty[Math.floor(Math.random() * empty.length)];
        const type = pickType();
        const id = Math.random();
        spotsRef.current[index] = { id, type };
        syncSpots();

        const life = 1100 + Math.random() * 500;
        addTimeout(() => {
          const current = spotsRef.current[index];
          if (current && current.id === id) {
            spotsRef.current[index] = null;
            syncSpots();
            if (type === 'bandit') {
              setLives(l => l - 1); // bandido fugiu
              setFlash({ index, kind: 'escape' });
              addTimeout(() => setFlash(null), 300);
            }
          }
        }, life);
      }

      const next = 450 + Math.random() * 400;
      addTimeout(spawn, next);
    };

    addTimeout(spawn, 500);

    return () => {
      active = false;
      clearAllTimeouts();
    };
  }, [status]);

  const reload = useCallback(() => {
    if (status !== 'playing' || reloading || ammo === MAX_AMMO) return;
    setReloading(true);
    addTimeout(() => {
      setAmmo(MAX_AMMO);
      setReloading(false);
    }, 1100);
  }, [status, reloading, ammo]);

  // Tecla R recarrega
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'r' || e.key === 'R') reload();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reload]);

  function shoot(index) {
    if (status !== 'playing' || reloading) return;

    if (ammo <= 0) {
      setFlash({ index, kind: 'click' });
      addTimeout(() => setFlash(null), 250);
      return;
    }

    setAmmo(a => a - 1);

    const target = spotsRef.current[index];
    if (!target) {
      setFlash({ index, kind: 'miss' });
      addTimeout(() => setFlash(null), 250);
      return;
    }

    spotsRef.current[index] = null;
    syncSpots();

    if (target.type === 'civilian') {
      addScore(TARGETS.civilian.points);
      setLives(l => l - 1);
      setFlash({ index, kind: 'bad' });
    } else {
      addScore(TARGETS[target.type].points);
      setFlash({ index, kind: 'hit' });
    }
    addTimeout(() => setFlash(null), 300);
  }

  return (
    <div className="content">
      <Header />

      <div className="content-only">
        <style>{`
          .wst-wrap { max-width: 760px; margin: 0 auto; padding: 16px; color: #3b2412; font-family: 'Georgia', serif; user-select: none; }
          .wst-title { text-align: center; font-size: 2rem; letter-spacing: 2px; margin: 0 0 4px; color: #f4d9a0; text-shadow: 2px 2px 0 #5a2d0c; }
          .wst-sub { text-align: center; margin: 0 0 14px; color: #e8c88a; font-size: .95rem; }
          .wst-hud { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; background: #f4d9a0; border: 4px solid #6b3a14; border-radius: 8px; padding: 8px 14px; font-weight: bold; }
          .wst-field { position: relative; margin-top: 12px; border: 4px solid #6b3a14; border-radius: 8px; overflow: hidden; background: linear-gradient(#f7b267 0%, #f4845f 45%, #d9a05b 45%, #c68642 100%); }
          .wst-sun { position: absolute; top: 14px; right: 40px; font-size: 2.6rem; }
          .wst-cactus { position: absolute; bottom: 8px; font-size: 2rem; opacity: .85; pointer-events: none; }
          .wst-grid { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 34px 20px 24px; }
          .wst-hole { position: relative; height: 110px; display: flex; align-items: flex-end; justify-content: center; cursor: crosshair; border: none; background: transparent; padding: 0; }
          .wst-barrel { position: absolute; bottom: 0; width: 100%; height: 48px; background: repeating-linear-gradient(90deg, #8b5a2b 0 14px, #6b3a14 14px 16px); border-radius: 8px; border: 3px solid #4a2610; z-index: 2; }
          .wst-target { font-size: 3.4rem; line-height: 1; margin-bottom: 30px; z-index: 1; animation: wst-pop .15s ease-out; }
          @keyframes wst-pop { from { transform: translateY(40px) scale(.7); } to { transform: translateY(0) scale(1); } }
          .wst-flash { position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 3; font-weight: bold; font-size: 1.1rem; text-shadow: 1px 1px 0 #fff; animation: wst-up .3s ease-out; pointer-events: none; }
          @keyframes wst-up { from { opacity: 1; transform: translate(-50%, 10px); } to { opacity: 0; transform: translate(-50%, -20px); } }
          .wst-overlay { position: absolute; inset: 0; background: rgba(40, 20, 8, .82); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #f4d9a0; padding: 20px; z-index: 5; }
          .wst-overlay h2 { margin: 0 0 8px; font-size: 1.8rem; }
          .wst-overlay p { margin: 4px 0; max-width: 420px; }
          .wst-btn { margin-top: 14px; padding: 10px 22px; font-size: 1.05rem; font-weight: bold; font-family: inherit; color: #fff; background: #a63d1a; border: 3px solid #5a1f0a; border-radius: 6px; cursor: pointer; }
          .wst-btn:hover { background: #c14a22; }
          .wst-btn:disabled { opacity: .5; cursor: not-allowed; }
          .wst-bar { display: flex; justify-content: center; margin-top: 12px; }
          @media (max-width: 520px) { .wst-target { font-size: 2.6rem; } .wst-hole { height: 90px; } }
        `}</style>

        <div className="wst-wrap">
          <h1 className="wst-title">🤠 TIRO NO VELHO OESTE</h1>
          <p className="wst-sub">Acerte os bandidos, estoure as garrafas e poupe os inocentes!</p>

          <div className="wst-hud">
            <span>⭐ Pontos: {score}</span>
            <span>⏱️ Tempo: {Math.max(time, 0)}s</span>
            <span>❤️ {'❤️'.repeat(Math.max(lives, 0)) || '💀'}</span>
            <span>
              🔫 {reloading ? 'Recarregando...' : `${ammo}/${MAX_AMMO}`}
            </span>
            <span>🏆 Recorde: {best}</span>
          </div>

          <div className="wst-field">
            <div className="wst-sun">☀️</div>
            <div className="wst-cactus" style={{ left: 6 }}>🌵</div>
            <div className="wst-cactus" style={{ right: 6 }}>🌵</div>

            <div className="wst-grid">
              {spots.map((spot, i) => (
                <button
                  key={i}
                  className="wst-hole"
                  onMouseDown={() => shoot(i)}
                  aria-label={`Barril ${i + 1}`}
                >
                  {spot && (
                    <span className="wst-target" key={spot.id}>
                      {TARGETS[spot.type].emoji}
                    </span>
                  )}
                  {flash && flash.index === i && (
                    <span className="wst-flash">
                      {flash.kind === 'hit' && '💥 Acertou!'}
                      {flash.kind === 'bad' && '😱 Inocente!'}
                      {flash.kind === 'miss' && '💨 Errou'}
                      {flash.kind === 'click' && '*click* sem balas!'}
                      {flash.kind === 'escape' && '🏃 Fugiu!'}
                    </span>
                  )}
                  <div className="wst-barrel" />
                </button>
              ))}
            </div>

            {status === 'idle' && (
              <div className="wst-overlay">
                <h2>Bem-vindo, xerife!</h2>
                <p>🦹 Bandido: +10 &nbsp; 🍾 Garrafa: +5 &nbsp; 👩‍🌾 Inocente: −10 e perde uma vida.</p>
                <p>Se um bandido fugir, você também perde uma vida.</p>
                <p>Recarregue com o botão ou a tecla <b>R</b>.</p>
                <button className="wst-btn" onClick={startGame}>Começar o duelo</button>
              </div>
            )}

            {status === 'over' && (
              <div className="wst-overlay">
                <h2>{lives <= 0 ? '💀 Fim de jogo!' : '🌅 O sol se pôs!'}</h2>
                <p>Sua pontuação: <b>{score}</b></p>
                <p>{score >= best && score > 0 ? '🏆 Novo recorde!' : `Recorde: ${best}`}</p>
                <button className="wst-btn" onClick={startGame}>Jogar de novo</button>
              </div>
            )}
          </div>

          <div className="wst-bar">
            <button
              className="wst-btn"
              onClick={reload}
              disabled={status !== 'playing' || reloading || ammo === MAX_AMMO}
            >
              🔄 Recarregar (R)
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;