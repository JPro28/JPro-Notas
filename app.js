// Elementos del DOM
const noteInput = document.getElementById('noteInput');
const addBtn = document.getElementById('addBtn');
const notesList = document.getElementById('notesList');
const searchInput = document.getElementById('searchInput');

// Cargar notas desde localStorage
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Mostrar notas
function renderNotes(filteredNotes = null) {
    const notesToRender = filteredNotes || notes;
    notesList.innerHTML = notesToRender.map(note => `
        <li class="note">
            <span>${note.text}</span>
            <button class="deleteBtn" data-id="${note.id}">🗑️</button>
        </li>
    `).join('');

    // Añadir event listeners a los botones de eliminar
    document.querySelectorAll('.deleteBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            notes = notes.filter(note => note.id !== id);
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes();
        });
    });
}

// Añadir nueva nota
addBtn.addEventListener('click', () => {
    const text = noteInput.value.trim();
    if (text) {
        notes.push({ id: Date.now(), text });
        localStorage.setItem('notes', JSON.stringify(notes));
        noteInput.value = '';
        renderNotes();
    }
});

// Buscar notas
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredNotes = notes.filter(note => 
        note.text.toLowerCase().includes(searchTerm)
    );
    renderNotes(filteredNotes);
});

// Inicializar
renderNotes();

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registrado'))
            .catch(err => console.log('Error SW:', err));
    });
}