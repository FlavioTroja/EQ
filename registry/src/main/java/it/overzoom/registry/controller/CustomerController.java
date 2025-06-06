package it.overzoom.registry.controller;

import java.net.URI;
import java.net.URISyntaxException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.overzoom.registry.dto.CustomerDTO;
import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Customer;
import it.overzoom.registry.security.SecurityUtils;
import it.overzoom.registry.service.CustomerService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registry/customers")
public class CustomerController {

    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("")
    public ResponseEntity<Page<CustomerDTO>> findAll(Pageable pageable) throws ResourceNotFoundException {
        log.info("REST request to get a page of Customers");
        Page<CustomerDTO> page = !SecurityUtils.isAdmin()
                ? customerService.findByUserId(SecurityUtils.getCurrentUserId(), pageable)
                : customerService.findAll(pageable);
        return ResponseEntity.ok().body(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> findById(@PathVariable("id") String customerId)
            throws ResourceNotFoundException, BadRequestException {

        if (!customerService.hasAccess(customerId)) {
            throw new BadRequestException("Non hai i permessi per accedere a questo cliente.");
        }

        CustomerDTO customer = customerService.findById(customerId);
        return ResponseEntity.ok(customer);
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> create(@Valid @RequestBody CustomerDTO dto)
            throws BadRequestException, URISyntaxException, ResourceNotFoundException {
        log.info("REST request to save Customer : {}", dto);
        if (dto.getId() != null) {
            throw new BadRequestException("Un nuovo cliente non può già avere un ID");
        }
        dto.setUserId(SecurityUtils.getCurrentUserId());
        CustomerDTO result = customerService.createWithNested(dto);
        return ResponseEntity
                .created(new URI("/api/registry/customers/" + result.getId()))
                .body(result);
    }

    @PutMapping("")
    public ResponseEntity<CustomerDTO> update(@Valid @RequestBody Customer customer)
            throws BadRequestException, ResourceNotFoundException {
        log.info("REST request to update Customer: " + customer.toString());
        if (customer.getId() == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!customerService.existsById(customer.getId())) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }

        CustomerDTO updateCustomer = customerService.update(customer);

        return ResponseEntity.ok().body(updateCustomer);
    }

    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CustomerDTO> partialUpdate(@PathVariable("id") String id,
            @RequestBody Customer customer) throws BadRequestException, ResourceNotFoundException {
        log.info("REST request to partial update Customer: " + customer.toString());
        if (id == null) {
            throw new BadRequestException("ID invalido.");
        }
        if (!customerService.existsById(id)) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }

        CustomerDTO updateCustomer = customerService.partialUpdate(id, customer);

        return ResponseEntity.ok().body(updateCustomer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable("id") String customerId)
            throws ResourceNotFoundException, BadRequestException {

        if (!customerService.existsById(customerId)) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }
        customerService.deleteById(customerId);
        return ResponseEntity.noContent().build();
    }

}
