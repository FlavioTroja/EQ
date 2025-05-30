package it.overzoom.registry.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Source;
import it.overzoom.registry.repository.SourceRepository;

@Service
public class SourceServiceImpl implements SourceService {

    private final SourceRepository sourceRepository;

    public SourceServiceImpl(SourceRepository sourceRepository) {
        this.sourceRepository = sourceRepository;
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

    // @Override
    // public Optional<Source> update(Source source) throws
    // ResourceNotFoundException, BadRequestException {
    // return this.findById(source.getId()).map(existingSource -> {
    // existingSource.setName(source.getName());
    // existingSource.setAddress(source.getAddress());
    // return existingSource;
    // }).map(this::create);
    // }

    // @Override
    // public Optional<Source> partialUpdate(String id, Source source)
    // throws ResourceNotFoundException, BadRequestException {
    // return this.findById(id)
    // .map(existingSource -> {
    // if (source.getName() != null) {
    // existingSource.setName(source.getName());
    // }
    // if (source.getAddress() != null) {
    // existingSource.setAddress(source.getAddress());
    // }
    // return existingSource;
    // })
    // .map(this::create);
    // }
}