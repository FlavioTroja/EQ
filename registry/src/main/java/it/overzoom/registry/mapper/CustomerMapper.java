package it.overzoom.registry.mapper;

import it.overzoom.registry.dto.CustomerDTO;
import it.overzoom.registry.model.Customer;
import it.overzoom.registry.model.PaymentMethod;

public class CustomerMapper {

    public static CustomerDTO toDto(Customer customer) {
        if (customer == null) {
            return null;
        }
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setUserId(customer.getUserId());
        dto.setName(customer.getName());
        dto.setFiscalCode(customer.getFiscalCode());
        dto.setVatCode(customer.getVatCode());
        dto.setPec(customer.getPec());
        dto.setSdi(customer.getSdi());
        if (customer.getPaymentMethod() != null) {
            dto.setPaymentMethod(customer.getPaymentMethod().toString());
        }
        dto.setEmail(customer.getEmail());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setNotes(customer.getNotes());
        return dto;
    }

    public static Customer toEntity(CustomerDTO dto) {
        if (dto == null) {
            return null;
        }
        Customer customer = new Customer();
        customer.setId(dto.getId());
        customer.setUserId(dto.getUserId());
        customer.setName(dto.getName());
        customer.setFiscalCode(dto.getFiscalCode());
        customer.setVatCode(dto.getVatCode());
        customer.setPec(dto.getPec());
        customer.setSdi(dto.getSdi());
        if (dto.getPaymentMethod() != null) {

            customer.setPaymentMethod(PaymentMethod.valueOf(dto.getPaymentMethod()));
        }
        customer.setEmail(dto.getEmail());
        customer.setPhoneNumber(dto.getPhoneNumber());
        customer.setNotes(dto.getNotes());
        return customer;
    }
}
