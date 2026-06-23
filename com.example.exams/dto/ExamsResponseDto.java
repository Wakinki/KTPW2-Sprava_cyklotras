package com.example.exams.dto;

import java.util.List;
import com.example.exams.model.Exam;

public class ExamsResponseDto {

    private List<Exam> exams;
    private List<Object> registrations; // zatím prázdné

    public ExamsResponseDto(List<Exam> exams, List<Object> registrations) {
        this.exams = exams;
        this.registrations = registrations;
    }

    public List<Exam> getExams() {
        return exams;
    }

    public List<Object> getRegistrations() {
        return registrations;
    }
}
