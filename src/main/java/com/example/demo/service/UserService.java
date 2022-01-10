package com.example.demo.service;


import com.example.demo.entity.User;

import java.util.List;


public interface UserService {
    void saveUser(User user);

    void updateUser(User user);

    User show(long id);

    void removeUserById(long id);

    List<User> getAllUsers();

    User findByUserName(String name);

}