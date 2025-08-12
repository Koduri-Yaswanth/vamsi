package com.courier.dto;

import com.courier.model.Feedback;

public class FeedbackResponse {
    private boolean success;
    private String message;
    private Feedback feedback;

    public FeedbackResponse() {}

    public FeedbackResponse(boolean success, String message, Feedback feedback) {
        this.success = success;
        this.message = message;
        this.feedback = feedback;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Feedback getFeedback() {
        return feedback;
    }

    public void setFeedback(Feedback feedback) {
        this.feedback = feedback;
    }
} 