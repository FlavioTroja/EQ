package it.overzoom.registry.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public Page<Department> findByLocationId(String locationId, Pageable pageable)
            throws ResourceNotFoundException, BadRequestException {

        return departmentRepository.findByLocationId(locationId, pageable);
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

    @Override
    @Transactional
    public void deleteById(String id) throws BadRequestException, ResourceNotFoundException {
        // 1) Verifico l'esistenza del reparto
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reparto non trovato."));

        // 2) Controllo che non ci siano sorgenti collegate
        if (sourceRepository.existsByDepartmentId(id)) {
            throw new BadRequestException(
                    "Impossibile cancellare il reparto perché ci sono delle sorgenti ad esso collegate.");
        }

        // 3) Cancello
        departmentRepository.deleteById(id);
    }
}