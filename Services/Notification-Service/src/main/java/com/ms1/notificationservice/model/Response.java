package com.ms1.notificationservice.model;

import java.util.List;

public class Response {
    private String status;
    private String message;
    private List<Notification> notifications;

    public Response() {}

    public void setStatus(String status) {
        this.status = status;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }
}
