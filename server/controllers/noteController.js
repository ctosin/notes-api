const ErrorHandler = require('../utils/errorHandler');

const notes = [];
let nextId = 1;

exports.createNote = (req, res, next) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return next(new ErrorHandler("Title and content are required", 400));
    }

    const isoDate = new Date().toISOString()

    const note = {
        id: nextId++,
        title,
        content,
        createdAt: isoDate,
        updatedAt: isoDate,
    };

    notes.push(note);
    console.log(`[Notes] Created note #${note.id}: "${note.title}"`);

    res.status(201).json({ success: true, note });
};

exports.getAllNotes = (req, res) => {
    console.log(`[Notes] Fetched all notes (count: ${notes.length})`);
    res.status(200).json({ success: true, count: notes.length, notes });
};

exports.getNoteById = (req, res, next) => {
    const note = notes.find(n => n.id === parseInt(req.params.id));

    if (!note) {
        return next(new ErrorHandler("Note not found", 404));
    }

    console.log(`[Notes] Fetched note #${note.id}: "${note.title}"`);
    res.status(200).json({ success: true, note });
};

exports.updateNote = (req, res, next) => {
    const index = notes.findIndex(n => n.id === parseInt(req.params.id));

    if (index === -1) {
        return next(new ErrorHandler("Note not found", 404));
    }

    const { title, content } = req.body;
    const note = notes[index];

    if (title) note.title = title;
    if (content) note.content = content;
    note.updatedAt = new Date().toISOString();

    console.log(`[Notes] Updated note #${note.id}: "${note.title}"`);
    res.status(200).json({ success: true, note });
};

exports.deleteNote = (req, res, next) => {
    const index = notes.findIndex(n => n.id === parseInt(req.params.id));

    if (index === -1) {
        return next(new ErrorHandler("Note not found", 404));
    }

    const [deleted] = notes.splice(index, 1);
    console.log(`[Notes] Deleted note #${deleted.id}: "${deleted.title}"`);

    res.status(200).json({ success: true, message: `Note #${deleted.id} deleted` });
};
