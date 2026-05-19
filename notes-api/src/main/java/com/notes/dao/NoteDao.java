package com.notes.dao;

import com.notes.model.Note;

import java.util.List;
import java.util.Optional;

public interface NoteDao {
    Note save(String title, String content);

    List<Note> findAll();

    Optional<Note> findById(int id);

    Optional<Note> delete(int id);
}
