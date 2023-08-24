package com.ms1.notificationservice.controller;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.ms1.notificationservice.model.Notification;
import com.ms1.notificationservice.model.Request;
import com.ms1.notificationservice.model.Response;
import com.ms1.notificationservice.service.NotificationService;
import com.ms1.notificationservice.utility.ValidateResult;
import com.ms1.notificationservice.utility.Validator;
import com.ms1.notificationservice.utility.Validator.SupportedDataType;

@RestController
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    NotificationService notificationService;

    @RequestMapping(method = RequestMethod.POST, value = "/notification")
    public Response addNotification(@RequestBody Request request) {

        // Check Inputs
        ValidateResult areInputsValid = Validator.isValid(
            List.of(
                request.getTitle(),
                request.getContent(),
                request.getAppId(),
                request.getDestUserId()
            ),
            List.of(
                SupportedDataType.NO_CAST,
                SupportedDataType.NO_CAST,
                SupportedDataType.NO_CAST,
                SupportedDataType.NO_CAST
            )
        );

        if (!areInputsValid.isStatus()) {
            Response res = new Response();
            res.setStatus("failed");
            res.setMessage(areInputsValid.getMessage());
            return res;
        }

        // Create Notification Object
        Notification notification = new Notification();
        notification.setTitle(request.getTitle());
        notification.setContent(request.getContent());
        notification.setAppId(request.getAppId());

        notificationService.addUserNotification(request.getDestUserId(), notification);


        // Return Success
        Response res = new Response();
        res.setStatus("success");
        res.setMessage("Notification Added");
        return res;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/notification/{appId}/{userId}")
    public Response getNotifications(@PathVariable String appId, @PathVariable String userId) {
        List<Notification> notifications = notificationService.getUserNotifications(appId, userId);

        Response res = new Response();
        res.setStatus("success");
        res.setMessage("Notification Consumed");
        res.setNotifications(notifications);
        return res;
    }

    @RequestMapping("/notification/sse/{appId}/{userId}")
    public SseEmitter liveNotifications(@PathVariable String appId, @PathVariable String userId) {
        SseEmitter emitter = new SseEmitter();
        ExecutorService executor = Executors.newSingleThreadExecutor();

        executor.execute(() -> {
            // Check Notification every 5s
            try {
                List<Notification> notifications = notificationService.getUserNotifications(appId, userId);
                if (!notifications.isEmpty()) {
                    emitter.send(notifications);
                }
                Thread.sleep(5000);
            } catch (Exception e) {
                e.printStackTrace();
                emitter.completeWithError(e);
            }
        });

        executor.shutdown();

        return emitter;
    }
}
