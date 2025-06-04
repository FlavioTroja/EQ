package it.overzoom.registry.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Source;
import it.overzoom.registry.repository.IrradiationConditionRepository;
import it.overzoom.registry.repository.SourceRepository;

@Service
public class SourceServiceImpl implements SourceService {

    private final IrradiationConditionRepository irradiationConditionRepository;
    private final SourceRepository sourceRepository;

    public SourceServiceImpl(SourceRepository sourceRepository,
            IrradiationConditionRepository irradiationConditionRepository) {
        this.sourceRepository = sourceRepository;
        this.irradiationConditionRepository = irradiationConditionRepository;
    }

    @Override
    public Page<Source> findByDepartmentId(String departmentId, Pageable pageable)
            throws ResourceNotFoundException, BadRequestException {

        return sourceRepository.findByDepartmentId(departmentId, pageable);
    }

    @Override
    public Source findById(String id) throws ResourceNotFoundException, BadRequestException {
        Source source = sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sorgente non trovato."));

        return source;
    }

    @Override
    public boolean existsById(String id) {
        return sourceRepository.existsById(id);
    }

    @Override
    public Source create(Source source) throws ResourceNotFoundException, BadRequestException {
        return sourceRepository.save(source);
    }

    @Override
    public Optional<Source> partialUpdate(String id, Source source) {
        return sourceRepository.findById(id)
                .map(existingSource -> {
                    if (source.getSn() != null) {
                        existingSource.setSn(source.getSn());
                    }
                    if (source.getExpirationDate() != null) {
                        existingSource.setExpirationDate(source.getExpirationDate());
                    }
                    return existingSource;
                })
                .map(sourceRepository::save);
    }

    @Override
    public Optional<Source> update(Source source) {
        return sourceRepository.findById(source.getId()).map(existingSource -> {
            existingSource.setSn(source.getSn());
            existingSource.setExpirationDate(source.getExpirationDate());
            return existingSource;
        }).map(sourceRepository::save);
    }

    @Override
    @Transactional
    public void deleteById(String id) throws BadRequestException, ResourceNotFoundException {
        sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sorgente non trovata."));
        if (irradiationConditionRepository.existsBySourceId(id)) {
            throw new BadRequestException(
                    "Impossibile cancellare la sorgente perché ci sono condizioni di irradiazione già registrate.");
        }
        sourceRepository.deleteById(id);
    }
}