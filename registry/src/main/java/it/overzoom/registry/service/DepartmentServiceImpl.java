package it.overzoom.registry.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Department;
import it.overzoom.registry.model.Location;
import it.overzoom.registry.repository.DepartmentRepository;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private LocationService locationService;

    @Autowired
    private CustomerService customerService;

    @Override
    public Page<Department> findByLocationId(String locationId, Pageable pageable)
            throws ResourceNotFoundException, BadRequestException {

        Location location = locationService.findById(locationId);
        customerService.findById(location.getCustomerId());
        return departmentRepository.findByLocationId(location.getId(), pageable);
    }

    @Override
    public Department findById(String id) throws ResourceNotFoundException, BadRequestException {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reparto non trovato."));

        return department;
    }

    @Override
    public boolean existsById(String id) {
        return departmentRepository.existsById(id);
    }

    @Override
    public Department create(Department department) throws ResourceNotFoundException, BadRequestException {
        Location location = locationService.findById(department.getLocationId());
        department.setLocationId(location.getId());
        return departmentRepository.save(department);
    }

    // @Override
    // public Optional<Department> update(Department department) throws
    // ResourceNotFoundException, BadRequestException {
    // return this.findById(department.getId()).map(existingDepartment -> {
    // existingDepartment.setName(department.getName());
    // existingDepartment.setAddress(department.getAddress());
    // return existingDepartment;
    // }).map(this::create);
    // }

    // @Override
    // public Optional<Department> partialUpdate(String id, Department department)
    // throws ResourceNotFoundException, BadRequestException {
    // return this.findById(id)
    // .map(existingDepartment -> {
    // if (department.getName() != null) {
    // existingDepartment.setName(department.getName());
    // }
    // if (department.getAddress() != null) {
    // existingDepartment.setAddress(department.getAddress());
    // }
    // return existingDepartment;
    // })
    // .map(this::create);
    // }
}