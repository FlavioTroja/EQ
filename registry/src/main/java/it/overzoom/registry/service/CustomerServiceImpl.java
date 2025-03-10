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

    public boolean hasAccess(String customerId) throws ResourceNotFoundException {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));
        return SecurityUtils.isAdmin() || SecurityUtils.isCurrentUser(customer.getUserId());
    }

    @Override
    public Page<Customer> findAll(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

    @Override
    public Customer findById(String id) throws ResourceNotFoundException {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));

        List<Location> locations = locationRepository.findByCustomerId(id);
        locations.forEach(this::populateLocationData);
        customer.setLocations(locations);

        return customer;
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
    public Page<Customer> findByUserId(String userId, Pageable pageable) {
        return customerRepository.findByUserId(userId, pageable);
    }

    @Override
    public boolean existsById(String id) {
        return customerRepository.existsById(id);
    }

    @Override
    public Customer create(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public Customer update(Customer customer) throws ResourceNotFoundException, BadRequestException {
        Customer existingCustomer = this.findById(customer.getId());

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
    public Customer partialUpdate(String id, Customer customer)
            throws ResourceNotFoundException, BadRequestException {
        Customer existingCustomer = this.findById(customer.getId());
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
}