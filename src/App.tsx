import React from 'react';
import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

interface Note {
  id: number;
  title: string;
  content: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "test note 1",
      content: "bla bla note1",
    },
    {
      id: 2,
      title: "test note 2 ",
      content: "bla bla note2",
    },
    {
      id: 3,
      title: "test note 3",
      content: "bla bla note3",
    },
    {
      id: 4,
      title: "test note 4 ",
      content: "bla bla note4",
    },
    {
      id: 5,
      title: "test note 5",
      content: "bla bla note5",
    },
    {
      id: 6,
      title: "test note 6",
      content: "bla bla note6",
    },
    {
      id: 7,
      title: "test note 7",
      content: "bla bla note7",
    },
    {
      id: 8,
      title: "test note 8",
      content: "bla bla note8",
    }
  ]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleAddNote = (event: React.FormEvent) => {
    event.preventDefault();
    const newNote: Note = {
      id: notes.length + 1,
      title: title,
      content: content,
    };
    setNotes([...notes, newNote]);
    setTitle('');
    setContent('');
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdateNote = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNote) return;
    const updatedNote: Note = {
      id: selectedNote.id,
      title: title,
      content: content,
    };
    const updatedNotes = notes.map((note) => (note.id === selectedNote.id ? updatedNote : note));
    setNotes(updatedNotes);
    setTitle('');
    setContent('');
    setSelectedNote(null);
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setSelectedNote(null);
  }

  return (
    <div className="AppContainer">
      <form className="NoteForm" onSubmit={(event) => (selectedNote ? handleUpdateNote(event) : handleAddNote(event))}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" rows={10} required />
        {selectedNote ? (
          <div className='EditButtons'>
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
        
      </form>

      <div className="NotesGrid">
        {notes.map((note) => (
          <div className="Note" key={note.id} onClick={() => handleNoteClick(note)}>
            <div className="NoteHeader">
              <button>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default App;