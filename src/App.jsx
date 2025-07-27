import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import CreatePost from './CreatePost';
import UsersList from './UsersList';
import './App.css';

function EditPostModal({ post, onSave, onClose }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(post.tags || []);
  const [visibility, setVisibility] = useState(post.visibility);

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...post, title, content, visibility, tags });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <form onSubmit={handleSubmit} style={{ background: '#222', padding: 24, borderRadius: 8, minWidth: 320 }}>
        <h2 style={{color: 'white'}}>Редактировать пост</h2>
        <input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ display: 'block', marginBottom: 8 }}
        />
        <textarea
          placeholder="Текст поста"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          style={{ display: 'block', marginBottom: 8 }}
        />
        <div style={{ marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Добавить тег"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            style={{ width: 200, marginRight: 8 }}
          />
          <button onClick={handleAddTag} type="button">Добавить</button>
        </div>
        <div style={{ marginBottom: 8 }}>
          {tags.map(tag => (
            <span key={tag} style={{ display: 'inline-block', background: '#444', color: '#7ff', padding: '2px 8px', borderRadius: 8, marginRight: 6, marginBottom: 4 }}>
              {tag} <button type="button" onClick={() => handleRemoveTag(tag)} style={{ marginLeft: 4, color: '#f77', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </span>
          ))}
        </div>
        <div style={{ color: 'white', marginBottom: 8 }}>
          <label style={{ marginRight: 12 }}>
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={visibility === 'public'}
              onChange={() => setVisibility('public')}
            />
            Публичный
          </label>
          <label style={{ marginRight: 12 }}>
            <input
              type="radio"
              name="visibility"
              value="subscribers"
              checked={visibility === 'subscribers'}
              onChange={() => setVisibility('subscribers')}
            />
            Для подписчиков
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="request"
              checked={visibility === 'request'}
              onChange={() => setVisibility('request')}
            />
            Только по запросу
          </label>
        </div>
        <button type="submit">Сохранить</button>
        <button type="button" onClick={onClose}>Отмена</button>
      </form>
    </div>
  );
}

function TagFilter({ tags, selectedTag, onSelect }) {
  const uniqueTags = Array.from(new Set(tags.flat())).filter(Boolean);
  return (
    <div class="block-filter">
      <span style={{ color: '#1746a0'}}>Сортировать по тегу: </span>
      <button onClick={() => onSelect('')} style={{ fontWeight: !selectedTag ? 'bold' : 'normal' }}>Все</button>
      {uniqueTags.map(tag => (
        <button key={tag} onClick={() => onSelect(tag)} style={{ marginLeft: 8, fontWeight: selectedTag === tag ? 'bold' : 'normal' }}>{tag}</button>
      ))}
    </div>
  );
}

function Comments({ post,posts,currentUser }) {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
   
    if (!post.comments) 
    post.comments = []; 
    
    post.comments.push({
      author: currentUser.login,
      text: comment,
      date: new Date().toLocaleString()
    });
      localStorage.setItem('posts',JSON.stringify(posts.map(p => p === post.original ? post : p)));
      setComment('');
    }
  };

  return (
    <div style={{ marginTop: 12, background: '#181818', borderRadius: 8, padding: 8 }}>
      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Комментарии:</div>
      {post.comments && post.comments.length > 0 ? (
        post.comments.map((c, idx) => (
          <div key={idx} style={{ marginBottom: 6 }}>
            <span style={{ color: '#7ff' }}>{c.author}</span>: {c.text}
            <span style={{ color: '#aaa', fontSize: 11, marginLeft: 8 }}>{c.date}</span>
          </div>
        ))
      ) : (
        <div style={{ color: '#888', fontSize: 13 }}>Комментариев нет</div>
      )}
      <form onSubmit={handleSubmit} style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <input
          type="text"
          placeholder="Ваш комментарий"
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
}

function Home({ user, posts, users, subscriptions, onSubscribe, onUnsubscribe, onEdit, onDelete }) {
  const [editingPost, setEditingPost] = useState(null);
  const [selectedTag, setSelectedTag] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterType, setFilterType] = useState('public'); // 'public' | 'subscribers' | 'request'
  // При изменении posts или filterType пересчитываем filteredPosts
  useEffect(() => {
    let result = posts;
    
    if (filterType === 'public') {
      result = posts.filter(post => post.author === user.email || post.visibility != 'subscribers');
    } else if (filterType === 'subscribers') {
      result = posts.filter(post => subscriptions.includes(post.author) && post.visibility != 'public');
    }
    
    setFilteredPosts(result);
  }, [posts, filterType, user.email, subscriptions]); // Зависимости

  const  visiblePosts = filteredPosts.filter(post => !selectedTag || (post.tags && post.tags.includes(selectedTag)))
  const allTags = [...new Set(visiblePosts.flatMap(post => post.tags || []))];
  return (
    <>
    <div style={{display: 'flex', justifyContent: 'space-around'}}>

      <div style={{ marginTop: 16, width: '100%', maxWidth: 500 }}>
      <TagFilter tags={allTags} selectedTag={selectedTag} onSelect={setSelectedTag} />
        <h2>Посты блога</h2>
        <div style={{marginBottom: 8}}>
          <button onClick={() => setFilterType('public')}>Публичные</button>
          <button onClick={() => setFilterType('subscribers')} style={{ marginLeft: 8 }}>На кого подписан</button>
        </div>
        <div>
        {visiblePosts.length === 0 && <div>Постов пока нет.</div>}
        {visiblePosts.map((post, idx) => ( <>
          <div key={idx} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, marginBottom: 16, background: '#222', position: 'relative' }}>
          {(post.visibility != 'request' || post.author === user.email) ? ( <>
            <h3 style={{ color: 'white', margin: 0 }}>{post.title}</h3>
            <div style={{ fontSize: 14, color: '#aaa', marginBottom: 8 }}>Автор: {users.find(u => u.email === post.author)?.login || post.author}, {post.date}</div>
            <div style={{ color: 'white', whiteSpace: 'pre-wrap' }}>{post.content}</div>
            {post.tags && post.tags.length > 0 && (
              <div style={{ fontSize: 12, color: '#7ff', marginTop: 4 }}>Теги: {post.tags.join(', ')}</div>
            )}
            {post.visibility === 'subscribers' && <div style={{ color: '#ffb', fontSize: 12 }}>Для подписчиков</div>}
            {post.author === user.email && (
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                <button onClick={() => setEditingPost(post)}>Редактировать</button>
                <button onClick={() => onDelete(post)} style={{ marginLeft: 8 }}>Удалить</button>
              </div>
            )}
            <Comments post={post} posts={posts} currentUser={user} />
            </>
          ) : ( <>
            <h3 style={{ color: 'white', margin: 0 }}>{post.title}</h3>
            <div style={{ fontSize: 14, color: '#aaa', marginBottom: 8 }}>Автор: {users.find(u => u.email === post.author)?.login || post.author}, {post.date}</div>
            <div style={{ color: 'white' }}>Пост только по запросу</div>
            </>)}
          </div>
          </>
        ))}
        </div>
      </div>
      <UsersList users={users} currentUser={user} subscriptions={subscriptions} onSubscribe={onSubscribe} onUnsubscribe={onUnsubscribe} />
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onSave={edited => { onEdit(edited); setEditingPost(null); }}
          onClose={() => setEditingPost(null)}
        />
      )}
      </div>
    </>
  );
}

function PublicFeed({ posts, user, onEdit, onDelete, users }) {
  const [editingPost, setEditingPost] = useState(null);
  const publicPosts = posts.filter(post => post.visibility === 'public');
  return (
    <div style={{ marginTop: 32, width: '100%', maxWidth: 500 }}>
      <h2>Публичные посты</h2>
      {publicPosts.length === 0 && <div>Публичных постов пока нет.</div>}
      {publicPosts.map((post, idx) => (
        <div key={idx} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, marginBottom: 16, background: '#222', position: 'relative' }}>
          <h3 style={{ margin: 0 }}>{post.title}</h3>
          <div style={{ fontSize: 14, color: '#aaa', marginBottom: 8 }}>Автор: {users.find(u => u.email === post.author)?.login || post.author}, {post.date}</div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{post.content}</div>
          {post.author === user?.email && (
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
              <button onClick={() => setEditingPost(post)}>Редактировать</button>
              <button onClick={() => onDelete(post)} style={{ marginLeft: 8 }}>Удалить</button>
            </div>
          )}
          <Comments post={post} currentUser={user} />
        </div>
      ))}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onSave={edited => { onEdit(edited); setEditingPost(null); }}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
}

function MainMenu({ onLogout }) {
  return (
    <nav style={{ marginBottom: 20,marginTop: 20 }}>
      <Link to="/">
        <button>Главная</button>
      </Link>
      <Link to="/create">
        <button style={{ marginLeft: 8 }}>Создать пост</button>
      </Link>
      <button style={{ marginLeft: 8 }} onClick={onLogout}>Выйти</button>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  let [posts, setPosts] = useState(JSON.parse(localStorage.getItem('posts')) ?? []);
 // const [users, setUsers] = useState([]); // список всех пользователей
  const [subscriptions, setSubscriptions] = useState([]); // email-ы, на кого подписан текущий пользователь
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  let users = (JSON.parse(localStorage.getItem('users')) ?? []);

  // Загружаем localStorage пользоватей
  useEffect(() => {
    const email = localStorage.getItem('email');
    if(email){
      const foundUser = users.find(u => u.email === email);
      setUser(foundUser);
    }
  }, []);

  // Загружаем подписки из localStorage при входе пользователя
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem('subscriptions_' + user.email);
      if (saved) {
        setSubscriptions(JSON.parse(saved));
      } else {
        setSubscriptions([]);
      }
    }
  }, [user]);

  // Сохраняем подписки в localStorage при изменении
  useEffect(() => {
    if (user) {
      localStorage.setItem('subscriptions_' + user.email, JSON.stringify(subscriptions));
    }
  }, [subscriptions, user]);


  const UpdatePosts = () => {
    setPosts(JSON.parse(localStorage.getItem('posts')));
  }

  const handleLogout = () => {
    setUser(null);
    // setSubscriptions([]);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    navigate('/login'); // Переход на страницу входа после выхода
  };

  const handleCreatePost = (post) => {
    // Добавление нового элемента
    posts.unshift({ ...post, author: user.email, date: new Date().toLocaleString()});
    localStorage.setItem('posts',JSON.stringify(posts));
    UpdatePosts();
  };

  const handleEditPost = (editedPost) => {
    posts = posts.map(p => p === editedPost.original ? editedPost : (p.date === editedPost.date && p.author === editedPost.author ? editedPost : p));
    localStorage.setItem('posts',JSON.stringify(posts));
    UpdatePosts();
  };

  const handleDeletePost = (post) => {
    posts = posts.filter(p => !(p.date === post.date && p.author === post.author));
    localStorage.setItem('posts',JSON.stringify(posts));
    UpdatePosts();
  };

  const handleSubscribe = (email) => {
    setSubscriptions(prev => prev.includes(email) ? prev : [...prev, email]);
  };

  const handleUnsubscribe = (email) => {
    setSubscriptions(prev => prev.filter(e => e !== email));
  };

  const handleAddComment = (post, comment) => {
    setPosts(prev => prev.map(p =>
      p === post || (p.date === post.date && p.author === post.author)
        ? { ...p, comments: [...(p.comments || []), comment] }
        : p
    ));
  };

  // handleRegister и handleLogin для регистрации и входа
  const handleRegister = (foundUser) => {
    setUser(foundUser);
    navigate('/login');
  };

  const handleLogin = (foundUser) => {
    setUser(foundUser);
  };

  return (
    <>
      {user ? (
        <>
          <MainMenu onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home user={user} posts={posts} users={users} subscriptions={subscriptions} onSubscribe={handleSubscribe} onUnsubscribe={handleUnsubscribe} onEdit={handleEditPost} onDelete={handleDeletePost} />} />
            <Route path="/create" element={<CreatePost onCreate={handleCreatePost} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (  <>
      <div className="form-client">
        <div className="form-button">
          <button onClick={() => navigate('/login')} >Вход</button>
          <button onClick={() => navigate('/register')}>Регистрация</button>
        </div>
        <Routes>
          <Route path="/login" element={
            <>
              {loginError && <div style={{ color: 'red', marginBottom: 8 }}>{loginError}</div>}
              <Login onLogin={handleLogin} onError={!!loginError} />
            </>
          } />
          <Route path="/register" element={
            <>
              <Register onRegister={handleRegister} />
            </>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      </>
      )}
    </>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
