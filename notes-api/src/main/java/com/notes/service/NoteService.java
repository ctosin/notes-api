package com.notes.service;

import com.notes.dao.NoteDao;
import com.notes.model.Note;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    private static final Logger LOG = LoggerFactory.getLogger(NoteService.class);

    private final NoteDao noteDao;

    public NoteService(NoteDao noteDao) {
        this.noteDao = noteDao;
    }

    public Note create(String title, String content) {
        Note note = noteDao.save(title, content);
        LOG.info("Created note #{}: '{}'", note.getId(), note.getTitle());
        return note;
    }

    public List<Note> findAll() {
        List<Note> notes = noteDao.findAll();
        LOG.info("Fetched all notes (count: {})", notes.size());
        return notes;
    }

    public Optional<Note> findById(int id) {
        return noteDao.findById(id)
            .map(note -> {
                LOG.info("Fetched note #{}: '{}'", note.getId(), note.getTitle());
                return note;
            });
    }

    public Optional<Note> update(int id, String title, String content) {
        return noteDao.findById(id)
            .map(note -> {
                Optional.ofNullable(title).ifPresent(note::setTitle);
                Optional.ofNullable(content).ifPresent(note::setContent);
                note.setUpdatedAt(Instant.now());
                LOG.info("Updated note #{}: '{}'", note.getId(), note.getTitle());
                return note;
            });
    }

    public boolean delete(int id) {
        return noteDao.delete(id)
            .map(note -> {
                LOG.info("Deleted note #{}: '{}'", note.getId(), note.getTitle());
                return true;
            })
            .orElse(false);
    }
}
