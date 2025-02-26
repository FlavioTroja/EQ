package it.overzoom.registry.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Customer;
import it.overzoom.registry.model.Department;
import it.overzoom.registry.model.Location;
import it.overzoom.registry.repository.DepartmentRepository;
import it.overzoom.registry.repository.LocationRepository;

@Service
public class LocationServiceImpl implements LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CustomerService customerService;

    @Override
    public Page<Location> findByCustomerId(String customerId, Pageable pageable)
            throws ResourceNotFoundException, BadRequestException {
        Customer customer = customerService.findById(customerId);
        return locationRepository.findByCustomerId(customer.getId(), pageable);
    }

    @Override
    public Location findById(String id) throws ResourceNotFoundException, BadRequestException {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sede non trovata."));

        List<Department> deps = departmentRepository.findByLocationId(id);
        location.setDepartments(deps);

        return location;
    }

    @Override
    public boolean existsById(String id) {
        return locationRepository.existsById(id);
    }

    @Override
    public Location create(Location location) throws ResourceNotFoundException, BadRequestException {
        Customer customer = customerService.findById(location.getCustomerId());
        location.setCustomerId(customer.getId());
        return locationRepository.save(location);
    }

    @Override
    public Location update(Location location) throws ResourceNotFoundException, BadRequestException {
        Location existingLocation = this.findById(location.getId());

        existingLocation.setName(location.getName());
        existingLocation.setAddress(location.getAddress());

        return this.create(existingLocation);
    }

    @Override
    public Location partialUpdate(String id, Location location)
            throws ResourceNotFoundException, BadRequestException {
        Location existingLocation = this.findById(location.getId());

        if (location.getName() != null) {
            existingLocation.setName(location.getName());
        }
        if (location.getAddress() != null) {
            existingLocation.setAddress(location.getAddress());
        }

        return this.create(existingLocation);
    }
}