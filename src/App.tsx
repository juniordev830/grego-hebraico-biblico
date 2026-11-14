import { useMemo, useState } from 'react';
import { cards } from './cards.ts';
import type { Card, Kind, Language } from './cards.ts';
import { dateKey } from './dates.ts';
import { grade, optionsFor, queue } from './review.ts';
import type { Grade, Review } from './review.ts';
import { useLocalState } from './storage.ts';

type Attempt = { card: string; date: string; choice: Grade };
type State = { reviews: Record<string, Review>; history: Attempt[] };
type Exercise = { card: Card; options: string[]; selected?: string };
const initial: State = { reviews: {}, history: [] };
const labels = { grego: 'Grego koiné', hebraico: 'Hebraico bíblico' };
const cardById = new Map(cards.map(card => [card.id, card]));

export default function App() {
  const today = dateKey();
  const [language, setLanguage] = useState<Language>('grego');
  const [kind, setKind] = useState<Kind>('alphabet');
  const [mode, setMode] = useState<'cards' | 'exercise' | 'table'>('cards');
  const [state, setState, storageError] = useLocalState('idiomas-v1', initial);
  const [hidden, setHidden] = useState<string[]>([]);
  const [revealed, show] = useState(false);
  const [exercise, setExercise] = useState<Exercise>();
  const deck = useMemo(() => cards.filter(card => card.language === language && card.kind === kind), [language, kind]);
  const due = queue(deck, state.reviews, today);
  const current = due.find(card => !hidden.includes(card.id));
  const attempts = Object.values(state.reviews).reduce((sum, review) => sum + review.attempts, 0);
  const correct = Object.values(state.reviews).reduce((sum, review) => sum + review.correct, 0);

  function resetPractice() {
    setHidden([]);
    show(false);
    setExercise(undefined);
  }

  function record(card: Card, choice: Grade) {
    setState(previous => ({ reviews: { ...previous.reviews, [card.id]: grade(previous.reviews[card.id], choice, today) },
      history: [{ card: card.id, date: today, choice }, ...previous.history].slice(0, 100) }));
    setHidden(previous => [...previous, card.id]);
  }

  const learnLanguage = language === 'grego' ? 'grc' : 'hbo';
  const word = (card: Card) => <bdi lang={learnLanguage} dir={language === 'hebraico' ? 'rtl' : 'ltr'}>{card.script}</bdi>;

  return <div className="split">
    <div className="stack">
      <section className="panel form">
        <div className="two collapse">
          <label>Idioma<select value={language} onChange={e => {setLanguage(e.target.value as Language); resetPractice();}}>
            {Object.entries(labels).map(([key, label]) => <option value={key} key={key}>{label}</option>)}
          </select></label>
          <label>Conteúdo<select value={kind} onChange={e => {setKind(e.target.value as Kind); resetPractice();}}>
            <option value="alphabet">Alfabeto</option><option value="words">Vocabulário</option>
          </select></label>
        </div>
        <div className="row" aria-label="Modo de estudo">
          <button aria-pressed={mode === 'cards'} onClick={() => { setMode('cards'); resetPractice(); }}>Flashcards</button>
          <button aria-pressed={mode === 'exercise'} onClick={() => { setMode('exercise'); resetPractice(); }}>Exercício</button>
          <button aria-pressed={mode === 'table'} onClick={() => setMode('table')}>Consultar lista</button>
        </div>
      </section>
      <section className="panel stack">
        {mode === 'table' && <><h2>{kind === 'alphabet' ? 'Alfabeto' : 'Vocabulário'}</h2>
          <ul className="list">{deck.map(card => <li className="subtle letter-row" key={card.id}><div className="letter">{word(card)}</div>
            <div><strong>{card.name} · {card.transliteration}</strong><p>{card.sound}</p>{card.reference && <small>{card.reference}</small>}</div>
          </li>)}</ul>
        </>}
        {mode === 'cards' && <><h2>Flashcards de revisão</h2>
          {current ? <div className="review-card stack">
            <div className="letter large-letter">{word(current)}</div>
            <p className="muted">Tente lembrar {kind === 'alphabet' ? 'o nome e o som' : 'o significado'}.</p>
            {revealed ? <>
              <div role="status"><h3>{current.name} · {current.transliteration}</h3><p>{current.sound}</p><p className="muted">{current.reference}</p></div>
              <div className="row"><button onClick={() => {record(current, 'repetir'); show(false);}}>Repetir hoje</button>
                <button className="primary" onClick={() => {record(current, 'lembrei'); show(false);}}>Lembrei</button></div>
            </> : <button className="primary" onClick={() => show(true)}>Revelar</button>}
          </div> : <><p>Você revisou os cartões disponíveis neste baralho por enquanto.</p>
            {due.length > 0 && <button onClick={() => setHidden([])}>Rever cartões de hoje</button>}</>}
        </>}
        {mode === 'exercise' && <><h2>Reconhecimento</h2>
          {!exercise ? <button className="primary" onClick={() => {
            const card = deck[Math.floor(Math.random() * deck.length)];
            setExercise({ card, options: optionsFor(card, deck) });
          }}>Gerar pergunta</button> : <>
            <div className="letter large-letter">{word(exercise.card)}</div>
            <div className="two collapse">{exercise.options.map(option => <button key={option} disabled={exercise.selected !== undefined} onClick={() => {
              setExercise({ ...exercise, selected: option });
              record(exercise.card, option === exercise.card.name ? 'lembrei' : 'repetir');
            }}>{option}</button>)}</div>
            {exercise.selected && <><p role="status">{exercise.selected === exercise.card.name ? 'Correto' : 'Revise'} · {exercise.card.name} ({exercise.card.transliteration})</p>
              <button onClick={() => setExercise(undefined)}>Próximo exercício</button></>}
          </>}
        </>}
        <p className="muted">As pronúncias escritas são aproximações didáticas. Há diferenças entre tradições; confira as fontes em cada idioma.</p>
        <div className="row">
          <a href="https://www.billmounce.com/greek-alphabet">Alfabeto grego</a>
          <a href="https://hebrew.billmounce.com/BasicsBiblicalHebrew-01.pdf">Alfabeto hebraico</a>
          <a href="https://www.STEPBible.org">STEP Bible</a>
        </div>
        {storageError && <p className="error" role="alert">{storageError}</p>}
      </section>
    </div>
    <aside className="panel stack">
      <h2>Seu desempenho</h2>
      <div className="three">
        <div className="stat">A revisar<strong>{due.length}</strong></div>
        <div className="stat">Tentativas<strong>{attempts}</strong></div>
        <div className="stat">Acertos<strong>{attempts ? Math.round(correct * 100 / attempts) : 0}%</strong></div>
      </div>
      <h3>Últimas revisões</h3>
      {!state.history.length && <p className="muted">Revise um cartão para começar seu histórico.</p>}
      <ul className="list">{state.history.slice(0, 12).map((item, index) => <li className="subtle" key={item.card + ':' + index}>
        <strong>{cardById.get(item.card)?.name ?? item.card} · {item.choice === 'lembrei' ? 'Lembrado' : 'A repetir'}</strong>
        <small> · {item.date.split('-').reverse().join('/')}</small>
      </li>)}</ul>
    </aside>
  </div>;
}
