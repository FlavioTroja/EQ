package it.overzoom.registry.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import it.overzoom.registry.dto.SourceDTO;
import it.overzoom.registry.model.Source;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = { MeasurementMapper.class })
public interface SourceMapper {

    SourceDTO toDto(Source entity);

    Source toEntity(SourceDTO dto);
}
