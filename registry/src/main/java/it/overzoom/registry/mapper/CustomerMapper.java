package it.overzoom.registry.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import it.overzoom.registry.dto.CustomerDTO;
import it.overzoom.registry.model.Customer;
import it.overzoom.registry.model.PaymentMethod;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    @Mapping(source = "paymentMethod", target = "paymentMethod", qualifiedByName = "enumToString")
    CustomerDTO toDto(Customer customer);

    /**
     * Ignoro locations perché CustomerDTO non le contiene
     */
    @Mapping(source = "paymentMethod", target = "paymentMethod", qualifiedByName = "stringToEnum")
    @Mapping(target = "locations", ignore = true)
    Customer toEntity(CustomerDTO dto);

    @Named("enumToString")
    default String enumToString(PaymentMethod pm) {
        return pm != null ? pm.name() : null;
    }

    @Named("stringToEnum")
    default PaymentMethod stringToEnum(String pm) {
        return pm != null ? PaymentMethod.valueOf(pm) : null;
    }
}
