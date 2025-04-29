package it.overzoom.registry.mapper;

import org.mapstruct.Mapper;

import it.overzoom.registry.dto.MeasurementDTO;
import it.overzoom.registry.model.Measurement;

@Mapper(componentModel = "spring")
public interface MeasurementMapper {
    MeasurementDTO toDto(Measurement entity);
    Measurement    toEntity(MeasurementDTO dto);
}
