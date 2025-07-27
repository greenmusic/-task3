import React from 'react';

function UsersList({ users, currentUser, subscriptions, onSubscribe, onUnsubscribe }) {
  return (
    <div style={{ color: 'white', marginTop: 32, width: '100%', maxWidth: 500 }}>
      <h2>Пользователи</h2>
      {users.length === 0 && <div>Пользователей нет.</div>}
      {users.map((user, idx) => {
        if (user.email === currentUser.email) return null;
        const isSubscribed = subscriptions.includes(user.email);
        return (
          <div key={idx} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, marginBottom: 8, background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{user.email}</span>
            {isSubscribed ? (
              <button onClick={() => onUnsubscribe(user.email)}>Отписаться</button>
            ) : (
              <button onClick={() => onSubscribe(user.email)}>Подписаться</button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default UsersList; 