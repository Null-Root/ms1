package com.ms1.notificationservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ms1.notificationservice.model.Notification;
import com.ms1.notificationservice.model.User;
import com.ms1.notificationservice.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    NotificationRepository notificationRepository;

    public void addUserNotification(String userId, Notification notification) {
        // Check if User Document already exists
        boolean docExists = notificationRepository.existByUserId(userId);

        // Create User Document if not
        if (!docExists) {
            User userDoc = new User();
            userDoc.setUserId(userId);
            userDoc.setNotifications(new ArrayList<>());
            notificationRepository.insert(userDoc);
        }

        // Get Existing User Document and add notification
        User userDoc = notificationRepository.findByUserId(userId);
        userDoc.getNotifications().add(notification);

        // Update Document on DB
        notificationRepository.save(userDoc);
    }

    public List<Notification> getUserNotifications(String appId, String userId) {
        // Check and Get User Document
        User userDoc = notificationRepository.findByUserId(userId);
        List<Notification> filtered_notifications = userDoc.getNotifications()
                                                .stream()
                                                .filter(notification -> notification.getAppId().equals(appId))
                                                .collect(Collectors.toList());

        // Remove Notifications
        for (Notification notification : filtered_notifications) {
            userDoc.getNotifications().remove(notification);
        }

        // Update Document on DB
        notificationRepository.save(userDoc);

        // Return Result
        return filtered_notifications;
    }
}
