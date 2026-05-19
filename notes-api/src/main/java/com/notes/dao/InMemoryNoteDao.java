package com.notes.dao;

import com.notes.model.Note;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

@Repository
public class InMemoryNoteDao implements NoteDao {

    private final List<Note> notes = new CopyOnWriteArrayList<>();
    private final AtomicInteger counter = new AtomicInteger(1);

    @Override
    public Note save(String title, String content) {
        Note note = new Note(counter.getAndIncrement(), title, content, Instant.now());
        notes.add(note);
        return note;
    }

    @Override
    public List<Note> findAll() {
        return notes;
    }

    @Override
    public Optional<Note> findById(int id) {
        return notes.stream()
            .filter(n -> n.getId() == id)
            .findFirst();
    }

    @Override
    public Optional<Note> delete(int id) {
        return findById(id).map(note -> {
            notes.remove(note);
            return note;
        });
    }
}
