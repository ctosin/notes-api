package com.notes.controller;

import com.notes.model.ApiResponse;
import com.notes.model.Note;
import com.notes.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createNote(@RequestBody Map<String, String> body) {
        String title = body.get("title");
        String content = body.get("content");

        if (!StringUtils.hasText(title) || !StringUtils.hasText(content)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Title and content are required"));
        }

        return ResponseEntity.status(201).body(ApiResponse.ok(noteService.create(title, content)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllNotes() {
        return ResponseEntity.ok(ApiResponse.ok(noteService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Note>> getNoteById(@PathVariable int id) {
        return noteService.findById(id)
            .map(note -> ResponseEntity.ok(ApiResponse.ok(note)))
            .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.error("Note not found")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Note>> updateNote(@PathVariable int id, @RequestBody Map<String, String> body) {
        return noteService.update(id, body.get("title"), body.get("content"))
            .map(note -> ResponseEntity.ok(ApiResponse.ok(note)))
            .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.error("Note not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteNote(@PathVariable int id) {
        if (!noteService.delete(id)) {
            return ResponseEntity.status(404).body(ApiResponse.error("Note not found"));
        }

        return ResponseEntity.ok(ApiResponse.ok("Note #" + id + " deleted"));
    }
}
