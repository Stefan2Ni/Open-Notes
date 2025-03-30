import React from 'react';
import { useState, useEffect } from 'react';
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
  const [notes, setNotes] = useState<Note[]>([]);
  const fetchNotes = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/notes"
      );

      const notes: Note[] =
        await response.json();

      setNotes(notes);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchNotes();
  }, []);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    noteId: null,
    title: '',
    content: ''
  })

  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5001/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );
      const newNote = await response.json();
      setNotes([...notes, newNote]);
      setTitle('');
      setContent('');
    } catch (e) {
      console.log(e);
    }
  };

  const deleteNote = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();
    try {
      // Make the DELETE request to the backend
      const response = await fetch(`http://localhost:5001/notes/${noteId}`, {
        method: "DELETE",
      });
      
      // Check if the deletion was successful
      if (response.ok) {
        // Only update the UI if the backend deletion succeeded
        const updatedNotes = notes.filter((note) => note.id !== noteId);
        setNotes(updatedNotes);
      } else {
        console.error("Failed to delete note on the server");
      }
    } catch (e) {
      console.error("Error deleting note:", e);
    }
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

  const saveEditedNote = async () => {
    if (modal.noteId === null) return;
    // Validate that title and content are not empty
    if (!modal.title.trim() || !modal.content.trim()) {
      alert("Title and content cannot be empty!");
      return;
    }

    try {
      await fetch(`http://localhost:5001/notes/${modal.noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: modal.title,
          content: modal.content,
        }),
      })
      const updatedNotes = notes.map((note) => (note.id === modal.noteId ? { ...note, title: modal.title, content: modal.content } : note));
      setNotes(updatedNotes);
      closeEditModal();
    } catch (e) {
      console.log(e);
    }
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