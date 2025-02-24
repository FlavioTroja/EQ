package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.overzoom.registry.model.Location;
import it.overzoom.registry.repository.LocationRepository;

@Service
public class LocationServiceImpl implements LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Override
    public Page<Location> findAll(Pageable pageable) {
        return locationRepository.findAll(pageable);
    }

    @Override
    public Optional<Location> findById(String id) {
        return locationRepository.findById(id);
    }

    @Override
    public Page<Location> findByUserId(String userId, Pageable pageable) {
        return locationRepository.findByUserId(userId, pageable);
    }

    @Override
    public boolean existsById(String id) {
        return locationRepository.existsById(id);
    }

    @Override
    public Location create(Location location) {
        return locationRepository.save(location);
    }

    @Override
    public Optional<Location> update(Location location) {
        return this.findById(location.getId()).map(existingLocation -> {
            existingLocation.setName(location.getName());
            existingLocation.setAddress(location.getAddress());
            return existingLocation;
        }).map(this::create);
    }

    @Override
    public Optional<Location> partialUpdate(String id, Location location) {
        return this.findById(id)
                .map(existingLocation -> {
                    if (location.getName() != null) {
                        existingLocation.setName(location.getName());
                    }
                    if (location.getAddress() != null) {
                        existingLocation.setAddress(location.getAddress());
                    }
                    return existingLocation;
                })
                .map(this::create);
    }
}