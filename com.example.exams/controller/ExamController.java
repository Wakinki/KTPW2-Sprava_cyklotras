package com.example.exams.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import com.example.exams.service.ExamService;
import com.example.exams.dto.ExamsResponseDto;
import com.example.exams.model.Exam;

import java.util.*;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin // umožní volání z jiného portu (frontend)
public class ExamController {

    private final ExamService service;

    public ExamController(ExamService service) {
        this.service = service;
    }

    // GET /api/exams
    @GetMapping
    public ResponseEntity<ExamsResponseDto> getExams(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        // zde by probíhala autentizace podle tokenu
        List<Exam> exams = service.getAll();

        return ResponseEntity.ok(
                new ExamsResponseDto(exams, List.of())
        );
    }

    // PUT /api/exams/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExam(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {

        int newCapacity = (int) body.get("capacity");

        Optional<String> error = service.updateCapacity(id, newCapacity);

        if (error.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "reason", "Kapacita nesmí být nižší než počet přihlášených"
                    ));
        }

        Exam updated = service.findById(id).get();

        return ResponseEntity.ok(updated);
    }
}