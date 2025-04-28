package it.overzoom.registry.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.overzoom.registry.dto.CustomerDTO;
import it.overzoom.registry.dto.LocationDTO;
import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.mapper.CustomerMapper;
import it.overzoom.registry.mapper.LocationMapper;
import it.overzoom.registry.model.Customer;
import it.overzoom.registry.model.Department;
import it.overzoom.registry.model.Location;
import it.overzoom.registry.model.Source;
import it.overzoom.registry.repository.CustomerRepository;
import it.overzoom.registry.repository.DepartmentRepository;
import it.overzoom.registry.repository.LocationRepository;
import it.overzoom.registry.repository.SourceRepository;
import it.overzoom.registry.security.SecurityUtils;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private SourceRepository sourceRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CustomerMapper customerMapper;

    @Autowired
    private LocationMapper locationMapper;

    public boolean hasAccess(String customerId) throws ResourceNotFoundException {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));
        return SecurityUtils.isAdmin() || SecurityUtils.isCurrentUser(customer.getUserId());
    }

    @Override
    public Page<CustomerDTO> findAll(Pageable pageable) {
        return customerRepository.findAll(pageable)
                .map(customerMapper::toDto)
                .map(dto -> {
                    List<LocationDTO> locDtos = locationRepository
                            .findByCustomerId(dto.getId())
                            .stream()
                            .map(locationMapper::toDto)
                            .collect(Collectors.toList());
                    dto.setLocations(locDtos);
                    return dto;
                });
    }

    @Override
    public CustomerDTO findById(String id) throws ResourceNotFoundException {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));

        List<Location> locations = locationRepository.findByCustomerId(id);
        locations.forEach(this::populateLocationData);
        customer.setLocations(locations);

        return customerMapper.toDto(customer);
    }

    private void populateLocationData(Location location) {
        List<Department> departments = departmentRepository.findByLocationId(location.getId());
        departments.forEach(this::populateDepartmentData);
        location.setDepartments(departments);
    }

    private void populateDepartmentData(Department department) {
        List<Source> sources = sourceRepository.findByDepartmentId(department.getId());
        department.setSources(sources);
    }

    @Override
    public Page<CustomerDTO> findByUserId(String userId, Pageable pageable) {
        return customerRepository.findByUserId(userId, pageable)
                .map(customerMapper::toDto)
                .map(dto -> {
                    List<LocationDTO> locDtos = locationRepository
                            .findByCustomerId(dto.getId())
                            .stream()
                            .map(locationMapper::toDto)
                            .collect(Collectors.toList());
                    dto.setLocations(locDtos);
                    return dto;
                });
    }

    @Override
    public boolean existsById(String id) {
        return customerRepository.existsById(id);
    }

    @Override
    public CustomerDTO create(Customer customer) {
        return customerMapper.toDto(customerRepository.save(customer));
    }

    @Override
    public CustomerDTO update(Customer customer) throws ResourceNotFoundException, BadRequestException {
        Customer existingCustomer = customerRepository.findById(customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));

        existingCustomer.setName(customer.getName());
        existingCustomer.setFiscalCode(customer.getFiscalCode());
        existingCustomer.setVatCode(customer.getVatCode());
        existingCustomer.setPec(customer.getPec());
        existingCustomer.setSdi(customer.getSdi());
        existingCustomer.setPaymentMethod(customer.getPaymentMethod());
        existingCustomer.setEmail(customer.getEmail());
        existingCustomer.setPhoneNumber(customer.getPhoneNumber());
        existingCustomer.setNotes(customer.getNotes());

        return this.create(existingCustomer);
    }

    @Override
    public CustomerDTO partialUpdate(String id, Customer customer)
            throws ResourceNotFoundException, BadRequestException {
        Customer existingCustomer = customerRepository.findById(customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));

        if (customer.getName() != null) {
            existingCustomer.setName(customer.getName());
        }
        if (customer.getFiscalCode() != null) {
            existingCustomer.setFiscalCode(customer.getFiscalCode());
        }
        if (customer.getVatCode() != null) {
            existingCustomer.setVatCode(customer.getVatCode());
        }
        if (customer.getPec() != null) {
            existingCustomer.setPec(customer.getPec());
        }
        if (customer.getSdi() != null) {
            existingCustomer.setSdi(customer.getSdi());
        }
        if (customer.getPaymentMethod() != null) {
            existingCustomer.setPaymentMethod(customer.getPaymentMethod());
        }
        if (customer.getEmail() != null) {
            existingCustomer.setEmail(customer.getEmail());
        }
        if (customer.getPhoneNumber() != null) {
            existingCustomer.setPhoneNumber(customer.getPhoneNumber());
        }
        if (customer.getNotes() != null) {
            existingCustomer.setNotes(customer.getNotes());
        }

        return this.create(existingCustomer);

    }

    @Override
    public void deleteById(String id) {
        customerRepository.deleteById(id);
    }

    @Override
    public List<CustomerDTO> findCustomersByMachine(String machineId) {
        List<Source> sources = sourceRepository.findByMachine_Id(machineId);

        Set<String> deptIds = sources.stream()
                .map(Source::getDepartmentId)
                .collect(Collectors.toSet());

        if (deptIds.isEmpty()) {
            return List.of();
        }

        List<Department> depts = departmentRepository.findByIdIn(List.copyOf(deptIds));

        Set<String> locIds = depts.stream()
                .map(Department::getLocationId)
                .collect(Collectors.toSet());

        if (locIds.isEmpty()) {
            return List.of();
        }

        List<Customer> customers = customerRepository
                .findDistinctByLocations_IdIn(List.copyOf(locIds));

        return customers.stream()
                .map(customerMapper::toDto)
                .collect(Collectors.toList());
    }
}