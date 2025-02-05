package it.overzoom.registry.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.overzoom.registry.domain.Customer;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.repository.CustomerRepository;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserServiceImpl userService;

    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    public Customer getById(String customerId) throws ResourceNotFoundException {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found for this id :: " + customerId));

    }

    public Customer create(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer update(String customerId, Customer customerDetails) throws ResourceNotFoundException {
        Customer customer = getById(customerId);

        customer.setName(customerDetails.getName());
        userService.findById(customerDetails.getUser().getId()).ifPresent(u -> customer.setUser(u));

        return customerRepository.save(customer);
    }

}
