package it.overzoom.registry.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Department;
import it.overzoom.registry.repository.DepartmentRepository;
import it.overzoom.registry.repository.SourceRepository;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final SourceRepository sourceRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository,
            SourceRepository sourceRepository) {
        this.departmentRepository = departmentRepository;
        this.sourceRepository = sourceRepository;
    }

    @Override
    public List<Department> findByLocationId(String locationId)
            throws ResourceNotFoundException, BadRequestException {

        return departmentRepository.findByLocationId(locationId);
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
    @Transactional
    public Department create(Department department) throws ResourceNotFoundException, BadRequestException {
        return departmentRepository.save(department);
    }

    @Override
    public Optional<Department> update(Department department) {
        return departmentRepository.findById(department.getId()).map(existingDepartment -> {
            existingDepartment.setName(department.getName());
            return existingDepartment;
        }).map(departmentRepository::save);
    }

    @Override
    public Optional<Department> partialUpdate(String id, Department department) {
        return departmentRepository.findById(id)
                .map(existingDepartment -> {
                    if (department.getName() != null) {
                        existingDepartment.setName(department.getName());
                    }
                    return existingDepartment;
                })
                .map(departmentRepository::save);
    }

    @Override
    @Transactional
    public void deleteById(String id) throws BadRequestException, ResourceNotFoundException {
        departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reparto non trovato."));

        if (sourceRepository.existsByDepartmentId(id)) {
            throw new BadRequestException(
                    "Impossibile cancellare il reparto perché ci sono delle sorgenti ad esso collegate.");
        }

        departmentRepository.deleteById(id);
    }
}