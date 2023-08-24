package com.ms1.notificationservice.utility;

public class ValidateResult {
    private boolean status;
    private String message;
    
    public ValidateResult(boolean status, String message) {
        this.status = status;
        this.message = message;
    }

    public boolean isStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}
