package com.ms1.notificationservice.model;

public class Request {
    private String destUserId;
    private String appId;
    private String title;
    private String content;

    
    public String getDestUserId() {
        return destUserId;
    }
    public String getAppId() {
        return appId;
    }
    public String getTitle() {
        return title;
    }
    public String getContent() {
        return content;
    }
}
