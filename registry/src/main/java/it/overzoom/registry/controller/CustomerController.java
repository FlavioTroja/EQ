package it.overzoom.registry.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.overzoom.registry.domain.Customer;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.service.CustomerServiceImpl;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/customer")
public class CustomerController {

    @Autowired
    private CustomerServiceImpl customerService;

    @GetMapping("/")
    public List<Customer> getAll() {
        return customerService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(@PathVariable(value = "id") String customerId)
            throws ResourceNotFoundException {

        return ResponseEntity.ok().body(customerService.getById(customerId));
    }

    @PostMapping("/")
    public Customer create(@Valid @RequestBody Customer customer) {
        return customerService.create(customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> update(
            @PathVariable(value = "id") String customerId,
            @Valid @RequestBody Customer customer) throws ResourceNotFoundException {

        return ResponseEntity.ok(customerService.update(customerId, customer));
    }
}
