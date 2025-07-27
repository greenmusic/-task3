import React, { useState } from 'react';

function CreatePost({ onCreate }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [visibility, setVisibility] = useState('public'); // public, subscribers, request
  const [message, setMessage] = useState('');

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
    if (title && content) {
      onCreate && onCreate({ title, content, visibility, tags });
      setTitle('');
      setContent('');
      setTags([]);
      setTagInput('');
      setVisibility('public');
      setMessage('Пост опубликован!');
    } else {
      setMessage('Заполните все поля!');
    }
  };

  return (
    <form class="form-client" onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <h2>Создать пост</h2>
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
        style={{ display: 'block', marginBottom: 8}}
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
      <div style={{ marginBottom: 8 }}>
        <label style={{ color: '#1746a0', marginRight: 12 }}>
          <input
            type="radio"
            name="visibility"
            value="public"
            checked={visibility === 'public'}
            onChange={() => setVisibility('public')}
          />
          Публичный
        </label>
        <label style={{ color: '#1746a0', marginRight: 12 }}>
          <input
            type="radio"
            name="visibility"
            value="subscribers"
            checked={visibility === 'subscribers'}
            onChange={() => setVisibility('subscribers')}
          />
          Для подписчиков
        </label>
        <label  style={{ color: '#1746a0'}}>
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
      <button type="submit">Опубликовать</button>
      <div>{message}</div>
    </form>
  );
}

export default CreatePost; 