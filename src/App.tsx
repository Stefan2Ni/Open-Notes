import React from 'react';
import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

interface Note {
  id: number;
  title: string;
  content: string;
}

interface ModalState {
  isOpen: boolean;
  noteId: number | null;
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
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    noteId: null,
    title: '',
    content: ''
  })

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

  const deleteNote = (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);
  };

  const openEditModal = (note: Note) => {
    setModal({
      isOpen: true,
      noteId: note.id,
      title: note.title,
      content: note.content
    });
  };

  const closeEditModal = () => {
    setModal({
      isOpen: false,
      noteId: null,
      title: '',
      content: ''
    });
  };

  const saveEditedNote = () => {
    if (modal.noteId === null) return;
    // Validate that title and content are not empty
    if (!modal.title.trim() || !modal.content.trim()) {
      alert("Title and content cannot be empty!");
      return;
    }

    const updatedNotes = notes.map((note) => (note.id === modal.noteId ? { ...note, title: modal.title, content: modal.content } : note));
    setNotes(updatedNotes);
    closeEditModal();
  };

  return (
    <div className="AppContainer">
      <form className="NoteForm" onSubmit={(event) =>  handleAddNote(event)}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" rows={10} required />
        
        <button type="submit">Add Note</button>
        
        
      </form>

      <div className="NotesGrid">
        {notes.map((note) => (
          <div className="Note" key={note.id} onClick={() => openEditModal(note)}>
            <div className="NoteHeader">
              <button onClick={(event) => {
                deleteNote(event, note.id);
              }}>
                x
              </button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
      
      {modal.isOpen && (
        <div className="ModalOverlay">
          <div className="Modal">
            <h2>Edit Note</h2>
            <input
              value={modal.title}
              onChange={(e) => setModal({...modal, title: e.target.value})}
              placeholder="Title"
              className="ModalInput"
              required
            />
            <textarea
              value={modal.content}
              onChange={(e) => setModal({...modal, content: e.target.value})}
              placeholder="Content"
              rows={15}
              className="ModalTextarea"
              required
            />
            <div className="ModalButtons">
              <button onClick={closeEditModal} className="CancelButton">Cancel</button>
              <button onClick={saveEditedNote} className="SaveButton">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;