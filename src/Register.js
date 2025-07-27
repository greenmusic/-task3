import React, { useState } from 'react';
import bcrypt from 'bcryptjs'; 

function Register({ onRegister }) {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (login && email && password) {
     // Хэширование пароля 
     const hashedPassword = await bcrypt.hash(password, 10);

     const userData = {
      login: login,
       email: email,
       password: hashedPassword
     };

      // Получение текущего массива из localStorage
      let usersLocalStorage = (JSON.parse(localStorage.getItem('users')) ?? []);
      if(usersLocalStorage.find(u => u.email === email)){
        setMessage('Пользователь с таким email уже зарегистрирован');
        return false;
      }
      // Добавление нового элемента
      usersLocalStorage.push(userData);

      localStorage.setItem('users',JSON.stringify(usersLocalStorage));
      // Сохраняем информацию о том, что пользователь залогинен
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('email', email);
       
      onRegister(userData);

      setMessage('Регистрация успешна!');
      } else {
        setMessage('Заполните все поля!');
      }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>
      <input
        type="text"
        placeholder="Логин"
        value={login}
        onChange={e => setLogin(e.target.value)}
      />
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
      <button type="submit">Зарегистрироваться</button>
      <div>{message}</div>
    </form>
  );
}

export default Register; 