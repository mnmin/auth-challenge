import { useEffect, useState } from 'react';
import './App.css';
import MovieForm from './components/MovieForm';
import UserForm from './components/UserForm';

const apiUrl = 'http://localhost:4000';

function App() {
  const [movies, setMovies] = useState([]);
  //const [registeredUser, setRegisteredUser] = useState('')

  useEffect(() => {
    fetch(`${apiUrl}/movie`)
      .then(res => res.json())
      .then(res => setMovies(res.data));
  }, []);

  const handleRegister = async ({ username, password }) => {
    
    await fetch(`${apiUrl}/user/register`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          username,
          password
      })
    })
    .then((res) => res.json())
    .then(data => {
      // actions after sucess or fail
      console.log('register complete', data)
    })
    
  };



const handleLogin = async ({ username, password }) => {
    
  await fetch(`${apiUrl}/user/login`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  })
  .then((res) => res.json())
  .then(data => {
    //actions after sucess or fail
    console.log('login complete', data)
    // save the token in loval storage so it can be used later
    localStorage.setItem('token', data.token)
 })

  };
  
  const handleCreateMovie = async ({ title, description, runtimeMins }) => {
    
  }

  return (
    <div className="App">
      <h1>Register</h1>
      <UserForm handleSubmit={handleRegister} />

      <h1>Login</h1>
      <UserForm handleSubmit={handleLogin} />

      <h1>Create a movie</h1>
      <MovieForm handleSubmit={handleCreateMovie} />

      <h1>Movie list</h1>
      <ul>
        {movies.map(movie => {
          return (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              <p>Description: {movie.description}</p>
              <p>Runtime: {movie.runtimeMins}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;