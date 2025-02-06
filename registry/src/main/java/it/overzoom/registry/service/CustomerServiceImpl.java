package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.overzoom.registry.domain.Customer;
import it.overzoom.registry.repository.CustomerRepository;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserServiceImpl userService;

    public Page<Customer> findAll(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

    public Optional<Customer> findById(String customerId) {
        return customerRepository.findById(customerId);
    }

    public boolean existsById(String customerId) {
        return customerRepository.existsById(customerId);
    }

    public Customer create(Customer customer) {
        return customerRepository.save(customer);
    }

    public Optional<Customer> update(Customer customerDetails) {
        return this.findById(customerDetails.getId()).map(existingCustomer -> {
            existingCustomer.setName(customerDetails.getName());
            existingCustomer.setEmail(customerDetails.getEmail());
            existingCustomer.setPhone(customerDetails.getPhone());
            userService.findById(customerDetails.getEq().getId()).ifPresent(u -> existingCustomer.setEq(u));
            return existingCustomer;
        }).map(this::create);
    }

    public Optional<Customer> partialUpdate(String customerId, Customer customerDetails) {
        return this.findById(customerId)
                .map(existingCustomer -> {
                    if (customerDetails.getName() != null) {
                        existingCustomer.setName(customerDetails.getName());
                    }
                    if (customerDetails.getEmail() != null) {
                        existingCustomer.setEmail(customerDetails.getEmail());
                    }
                    if (customerDetails.getPhone() != null) {
                        existingCustomer.setPhone(customerDetails.getPhone());
                    }

                    return existingCustomer;
                })
                .map(this::create);
    }
}
