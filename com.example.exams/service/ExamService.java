package com.example.exams.service;

import org.springframework.stereotype.Service;
import com.example.exams.model.Exam;

import java.util.*;

@Service
public class ExamService {

    private Map<String, Exam> exams = new HashMap<>();

    public ExamService() {
        exams.put("e1", new Exam(
                "e1",
                "Algoritmy",
                "2026-01-10",
                20,
                18,
                "PUBLISHED"
        ));
    }

    public List<Exam> getAll() {
        return new ArrayList<>(exams.values());
    }

    public Optional<Exam> findById(String id) {
        return Optional.ofNullable(exams.get(id));
    }

    public Optional<String> updateCapacity(String id, int newCapacity) {
        Exam exam = exams.get(id);

        if (exam == null) return Optional.of("NOT_FOUND");

        if (newCapacity < exam.getRegisteredCount()) {
            return Optional.of("CAPACITY_TOO_LOW");
        }

        exam.setCapacity(newCapacity);
        return Optional.empty();
    }
}