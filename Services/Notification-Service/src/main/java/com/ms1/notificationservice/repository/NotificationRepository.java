package com.ms1.notificationservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.ms1.notificationservice.model.User;

public interface NotificationRepository extends MongoRepository<User, String> {

    @Query(value = "{ userId: ?0 }")
    public User findByUserId(String userId);

    @Query(value = "{ userId: ?0 }", exists = true)
    public boolean existByUserId(String userId);
}