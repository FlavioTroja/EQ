package it.overzoom.registry.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.overzoom.registry.dto.LocationDTO;
import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.mapper.LocationMapper;
import it.overzoom.registry.model.Customer;
import it.overzoom.registry.model.Department;
import it.overzoom.registry.model.Location;
import it.overzoom.registry.repository.CustomerRepository;
import it.overzoom.registry.repository.DepartmentRepository;
import it.overzoom.registry.repository.LocationRepository;

@Service
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;
    private final DepartmentRepository departmentRepository;
    private final CustomerRepository customerRepository;
    private final LocationMapper locationMapper;

    public LocationServiceImpl(LocationRepository locationRepository,
            DepartmentRepository departmentRepository,
            CustomerRepository customerRepository,
            LocationMapper locationMapper) {
        this.locationRepository = locationRepository;
        this.departmentRepository = departmentRepository;
        this.customerRepository = customerRepository;
        this.locationMapper = locationMapper;
    }

    @Override
    public Page<LocationDTO> findByCustomerId(String customerId, Pageable pageable)
            throws ResourceNotFoundException, BadRequestException {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));
        return locationRepository.findByCustomerId(customer.getId(), pageable)
                .map(locationMapper::toDto);
    }

    @Override
    public List<LocationDTO> findByCustomerId(String customerId)
            throws ResourceNotFoundException, BadRequestException {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));
        return locationRepository.findByCustomerId(customer.getId()).stream()
                .map(locationMapper::toDto).collect(Collectors.toList());
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
        Customer customer = customerRepository.findById(location.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));
        location.setCustomerId(customer.getId());
        return locationRepository.save(location);
    }

    @Override
    public Location update(Location location) throws ResourceNotFoundException, BadRequestException {
        Location existingLocation = this.findById(location.getId());

        existingLocation.setName(location.getName());
        existingLocation.setAddress(location.getAddress());
        existingLocation.setCity(location.getCity());
        existingLocation.setProvince(location.getProvince());
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

    @Override
    @Transactional
    public void deleteById(String id) throws BadRequestException, ResourceNotFoundException {
        if (!locationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Location non trovata.");
        }
        // Blocca se ci sono dipartimenti associati
        if (departmentRepository.existsByLocationId(id)) {
            throw new BadRequestException(
                    "Impossibile cancellare la sede perché ci sono dei dipartimenti ad essa associati.");
        }
        locationRepository.deleteById(id);
    }
}