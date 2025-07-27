import React, { useState } from 'react';
import bcrypt from 'bcryptjs';

function Login({ onLogin, onError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      let usersLocalStorage = (JSON.parse(localStorage.getItem('users')) ?? []);
      const foundUser = usersLocalStorage.find(u => u.email === email);

      if(foundUser){
        // хэширование для введенного пароля
        const isMatch = await bcrypt.compare(password, foundUser.password);
          if (isMatch) {
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('email', email);
              onLogin(foundUser)
              return true; // Успешная авторизация
          } else {
              setMessage('Пользователь с таким email не найден');
          }
      } else {
        return false; // Пользователь не найден
      }


    } else {
      setMessage('Заполните все поля!');
    }





  };

  React.useEffect(() => {
    if (onError) setMessage('');
  }, [onError]);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Вход</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Войти</button>
      <div>{message}</div>
    </form>
  );
}

export default Login; 