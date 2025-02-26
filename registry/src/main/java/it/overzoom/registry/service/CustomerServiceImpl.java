package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Customer;
import it.overzoom.registry.repository.CustomerRepository;
import it.overzoom.registry.security.SecurityUtils;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    private static boolean hasAccess(Customer customer) throws ResourceNotFoundException {
        return SecurityUtils.isAdmin() || SecurityUtils.isCurrentUser(customer.getUserId());
    }

    @Override
    public Page<Customer> findAll(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

    @Override
    public Customer findById(String id) throws ResourceNotFoundException, BadRequestException {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));

        if (!hasAccess(customer)) {
            throw new BadRequestException("Non hai i permessi per accedere a questo cliente.");
        }

        return customer;
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
    public Optional<Customer> update(Customer customer) {
        return this.findById(customer.getId()).map(existingCustomer -> {
            existingCustomer.setName(customer.getName());
            existingCustomer.setFiscalCode(customer.getFiscalCode());
            existingCustomer.setVatCode(customer.getVatCode());
            existingCustomer.setPec(customer.getPec());
            existingCustomer.setSdi(customer.getSdi());
            existingCustomer.setPaymentMethod(customer.getPaymentMethod());
            existingCustomer.setEmail(customer.getEmail());
            existingCustomer.setPhoneNumber(customer.getPhoneNumber());
            existingCustomer.setNotes(customer.getNotes());
            return existingCustomer;
        }).map(this::create);
    }

    @Override
    public Optional<Customer> partialUpdate(String id, Customer customer) {
        return this.findById(id)
                .map(existingCustomer -> {
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
                    return existingCustomer;
                })
                .map(this::create);
    }

    @Override
    public void deleteById(String id) {
        customerRepository.deleteById(id);
    }
}