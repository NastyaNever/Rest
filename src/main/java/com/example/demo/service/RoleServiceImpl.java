package com.example.demo.service;


import com.example.demo.entity.Role;
import com.example.demo.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

import java.util.Optional;
import java.util.Set;

@Service
public class RoleServiceImpl implements RoleService{

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public List<Role> getListRole() {
        return roleRepository.findAll();
    }

    @Override
    public void add(Role role) {
        roleRepository.save(role);
    }

    @Override
    public void update(Role role) {
        roleRepository.save(role);
    }

    @Override
    public Role getById(long id) {
        Role role = null;
        Optional<Role> optional = Optional.of(roleRepository.getById(id));
        if (optional.isPresent()){
            role = optional.get();
        }
        return  role;
    }

    @Override
    public Role getByName(String name) {
        Role role = null;
        Optional<Role> optional = Optional.ofNullable(roleRepository.findRoleByName(name));
        if (optional.isPresent()){
            role = optional.get();
        }
        return  role;
    }

    @Override
    public HashSet getRoleSet(String[] roles){
        Set<Role> roleSet = new HashSet<>();
        for (String role : roles) {
            roleSet.add(roleRepository.findRoleByName(role));
        }
        return (HashSet) roleSet;
    }
}