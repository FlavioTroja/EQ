package it.overzoom.registry.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private final CustomerRepository customerRepository;
    private final LocationRepository locationRepository;
    private final DepartmentRepository departmentRepository;
    private final SourceRepository sourceRepository;

    public CustomerServiceImpl(
            CustomerRepository customerRepository,
            LocationRepository locationRepository,
            DepartmentRepository departmentRepository,
            SourceRepository sourceRepository) {
        this.customerRepository = customerRepository;
        this.locationRepository = locationRepository;
        this.departmentRepository = departmentRepository;
        this.sourceRepository = sourceRepository;
    }

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
    public Customer findById(String customerId) throws ResourceNotFoundException {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato"));
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
    @Transactional
    public Customer createWithNested(Customer customer) {
        customer.setLocations(Collections.emptyList());
        customer = customerRepository.save(customer);

        List<Location> savedLocs = new ArrayList<>();
        for (Location loc : customer.getLocations()) {
            loc.setCustomerId(customer.getId());
            loc.setDepartments(Collections.emptyList());
            loc = locationRepository.save(loc);

            List<Department> savedDeps = new ArrayList<>();
            for (Department dep : loc.getDepartments()) {
                dep.setLocationId(loc.getId());
                dep.setSources(Collections.emptyList());
                dep = departmentRepository.save(dep);

                List<Source> savedSrcs = new ArrayList<>();
                for (Source src : dep.getSources()) {
                    src.setDepartmentId(dep.getId());
                    savedSrcs.add(sourceRepository.save(src));
                }
                dep.setSources(savedSrcs);
                savedDeps.add(departmentRepository.save(dep));
            }
            loc.setDepartments(savedDeps);
            savedLocs.add(locationRepository.save(loc));
        }

        customer.setLocations(savedLocs);
        customer = customerRepository.save(customer);

        return customer;
    }

    @Override
    @Transactional
    public Customer update(Customer customer) throws ResourceNotFoundException, BadRequestException {
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

        return customerRepository.save(existingCustomer);
    }

    @Override
    @Transactional
    public Customer partialUpdate(String id, Customer customer)
            throws ResourceNotFoundException, BadRequestException {
        Customer existingCustomer = customerRepository.findById(id)
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

        return customerRepository.save(existingCustomer);

    }

    @Override
    @Transactional
    public void deleteById(String id) throws BadRequestException, ResourceNotFoundException {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }
        if (locationRepository.existsByCustomerId(id)) {
            throw new BadRequestException(
                    "Impossibile cancellare il cliente perché ci sono delle sedi ad esso associate.");
        }
        customerRepository.deleteById(id);
    }

    @Override
    public List<Customer> findCustomersByMachine(String machineId) {
        List<Source> sources = sourceRepository.findByMachineId(machineId);

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

        List<Location> locs = locationRepository.findByIdIn(List.copyOf(locIds));

        Set<String> custIds = locs.stream()
                .map(Location::getCustomerId)
                .collect(Collectors.toSet());

        if (custIds.isEmpty()) {
            return List.of();
        }

        List<Customer> customers = customerRepository.findByIdIn(List.copyOf(custIds));
        if (customers.isEmpty()) {
            return List.of();
        }

        return customers;
    }
}