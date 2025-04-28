package it.overzoom.registry.mapper;

import org.mapstruct.Mapper;

import it.overzoom.registry.dto.LocationDTO;
import it.overzoom.registry.model.Location;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    LocationDTO toDto(Location location);

}
