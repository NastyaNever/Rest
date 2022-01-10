package com.example.demo.service;


import com.example.demo.entity.Role;

import java.util.HashSet;
import java.util.List;

public interface RoleService {

    List<Role> getListRole();

    void add(Role role);

    void update(Role role);

    Role getById(long id);

    Role getByName(String roleName);

    public HashSet getRoleSet(String[] role);
}