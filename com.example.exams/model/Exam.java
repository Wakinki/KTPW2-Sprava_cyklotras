package com.example.exams.model;

public class Exam {

    private String id;
    private String name;
    private String date;
    private int capacity;
    private int registeredCount;
    private String status;

    public Exam(String id, String name, String date,
                int capacity, int registeredCount, String status) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.capacity = capacity;
        this.registeredCount = registeredCount;
        this.status = status;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getDate() { return date; }
    public int getCapacity() { return capacity; }
    public int getRegisteredCount() { return registeredCount; }
    public String getStatus() { return status; }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }
}