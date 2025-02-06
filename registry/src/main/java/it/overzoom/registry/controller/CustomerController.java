package it.overzoom.registry.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.overzoom.registry.domain.Customer;
import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.service.CustomerServiceImpl;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/customers")
public class CustomerController {

    private static final Logger LOG = LoggerFactory.getLogger(CustomerController.class);

    @Autowired
    private CustomerServiceImpl customerService;

    @GetMapping("")
    public ResponseEntity<List<Customer>> findAll(
            Pageable pageable) {
        LOG.debug("REST request to get a page of Customers");
        Page<Customer> page = customerService.findAll(pageable);
        return ResponseEntity.ok().body(page.getContent());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(@PathVariable(value = "id") String customerId)
            throws ResourceNotFoundException {
        LOG.debug("REST request to get User : {}", customerId);
        Customer customer = customerService.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato per questo id :: " + customerId));

        return ResponseEntity.ok().body(customer);
    }

    @PostMapping("")
    public ResponseEntity<Customer> create(@Valid @RequestBody Customer customer)
            throws BadRequestException, URISyntaxException {
        LOG.debug("REST request to save Customer : {}", customer);
        if (customer.getId() != null) {
            throw new BadRequestException("Un nuovo cliente non può già avere un ID");
        }
        customer = customerService.create(customer);
        return ResponseEntity.created(new URI("/api/customers/" + customer.getId())).body(customer);
    }

    @PutMapping("")
    public ResponseEntity<Customer> update(@Valid @RequestBody Customer customer)
            throws BadRequestException, ResourceNotFoundException {
        LOG.debug("REST request to update Customer : {}", customer);
        if (customer.getId() == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!customerService.existsById(customer.getId())) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }

        Customer updateCustomer = customerService.update(customer).orElseThrow(
                () -> new ResourceNotFoundException("Cliente non trovato con questo ID :: " + customer.getId()));

        return ResponseEntity.ok().body(updateCustomer);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Customer> partialUpdate(@PathVariable(value = "id") String customerId,
            @RequestBody Customer customer) throws BadRequestException, ResourceNotFoundException {
        LOG.debug("REST request to partial update Customer : {}", customer);
        if (customerId == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!customerService.existsById(customerId)) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }

        Customer updateCustomer = customerService.partialUpdate(customerId, customer)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato con questo ID :: " + customerId));

        return ResponseEntity.ok().body(updateCustomer);
    }

}
