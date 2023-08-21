package com.ms1.notificationservice.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ms1.notificationservice.model.Notification;
import com.ms1.notificationservice.model.Request;
import com.ms1.notificationservice.service.NotificationService;

@RestController
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    NotificationService notificationService;

    @RequestMapping(method = RequestMethod.POST, value = "/notification")
    public void addNotification(@RequestBody Request request) {
        Notification notification = new Notification();
        notification.setTitle(request.getTitle());
        notification.setContent(request.getContent());
        notification.setServiceId(request.getServiceId());

        notificationService.addUserNotification(request.getDestUserId(), notification);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/notification/{serviceId}/{userId}")
    public List<Notification> getNotifications(@PathVariable String serviceId, @PathVariable String userId) {
        return notificationService.getUserNotifications(serviceId, userId);
    }
}
