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

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Customer;
import it.overzoom.registry.security.SecurityUtils;
import it.overzoom.registry.service.CustomerServiceImpl;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/customers")
public class CustomerController {

    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);

    @Autowired
    private CustomerServiceImpl customerService;

    @GetMapping("")
    public ResponseEntity<List<Customer>> findAll(Pageable pageable) throws ResourceNotFoundException {
        log.info("REST request to get a page of Customers");
        Page<Customer> page = SecurityUtils.isAdmin()
                ? customerService.findByUserId(SecurityUtils.getCurrentUserId(), pageable)
                : customerService.findAll(pageable);
        return ResponseEntity.ok().body(page.getContent());
    }

    @PostMapping("")
    public ResponseEntity<Customer> create(@Valid @RequestBody Customer customer)
            throws BadRequestException, URISyntaxException, ResourceNotFoundException {
        log.info("REST request to save Customer : " + customer.toString());
        if (customer.getId() != null) {
            throw new BadRequestException("Un nuovo cliente non può già avere un ID");
        }
        if (!SecurityUtils.isAdmin()) {
            customer.setUserId(SecurityUtils.getCurrentUserId());
        }
        customer = customerService.create(customer);
        return ResponseEntity.created(new URI("/api/registry/customers/" + customer.getId())).body(customer);
    }

    @PutMapping("")
    public ResponseEntity<Customer> update(@Valid @RequestBody Customer customer)
            throws BadRequestException, ResourceNotFoundException {
        log.info("REST request to update Customer: " + customer.toString());
        if (customer.getId() == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!customerService.existsById(customer.getId())) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }

        Customer updateCustomer = customerService.update(customer)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cliente non trovato con questo ID :: " + customer.getId()));

        return ResponseEntity.ok().body(updateCustomer);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Customer> partialUpdate(@PathVariable(value = "id") String id,
            @RequestBody Customer customer) throws BadRequestException, ResourceNotFoundException {
        log.info("REST request to partial update Customer: " + customer.toString());
        if (id == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!customerService.existsById(id)) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }

        Customer updateCustomer = customerService.partialUpdate(id, customer)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato con questo ID :: " + id));

        return ResponseEntity.ok().body(updateCustomer);
    }
}
