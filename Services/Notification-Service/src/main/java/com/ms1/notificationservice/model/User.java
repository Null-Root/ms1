package com.ms1.notificationservice.model;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user-specific")
public class User {

    @Id
    private ObjectId id;
    private String userId;
    private List<Notification> notifications;

    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public List<Notification> getNotifications() {
        return notifications;
    }
    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    
}
