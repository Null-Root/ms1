package com.ms1.notificationservice.model;

public class Request {
    private String destUserId;
    private String serviceId;
    private String title;
    private String content;

    
    public String getDestUserId() {
        return destUserId;
    }
    public String getServiceId() {
        return serviceId;
    }
    public String getTitle() {
        return title;
    }
    public String getContent() {
        return content;
    }
}
