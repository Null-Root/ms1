package com.ms1.notificationservice.model;

public class Notification {

    // Notification Title
    private String title;

    // Notification Content
    private String content;
    
    // App ID that will consume the notification
    private String appId;

    public Notification() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }
}
