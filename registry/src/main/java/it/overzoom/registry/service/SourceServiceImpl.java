package it.overzoom.registry.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.Source;
import it.overzoom.registry.repository.IrradiationConditionRepository;
import it.overzoom.registry.repository.SourceRepository;

@Service
public class SourceServiceImpl implements SourceService {

    private final SourceRepository sourceRepository;
    private final IrradiationConditionRepository irradiationConditionRepository;

    public SourceServiceImpl(
            SourceRepository sourceRepository,
            IrradiationConditionRepository irradiationConditionRepository) {
        this.sourceRepository = sourceRepository;
        this.irradiationConditionRepository = irradiationConditionRepository;
    }

    /**
     * Restituisce una pagina di Source filtrate per departmentId
     */
    @Override
    public List<Source> findByDepartmentId(String departmentId)
            throws ResourceNotFoundException, BadRequestException {
        // (Puoi eventualmente verificare che departmentId esista in un altro
        // repository,
        // ma se non hai un repository Department, salta questa verifica.)
        return sourceRepository.findByDepartmentId(departmentId);
    }

    /**
     * Recupera una singola Source per ID (senza popolare ancora le condizioni)
     */
    @Override
    public Source findById(String id) throws ResourceNotFoundException, BadRequestException {
        return sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sorgente non trovata: " + id));
    }

    @Override
    public boolean existsById(String id) {
        return sourceRepository.existsById(id);
    }

    /**
     * Crea una nuova Source (initialmente senza alcuna IrradiationCondition).
     */
    @Override
    public Source create(Source source) throws ResourceNotFoundException, BadRequestException {
        // azzera la lista (per sicurezza)
        source.setIrradiationConditions(null);
        source.setCompletedIrradiationConditions(0);

        return sourceRepository.save(source);
    }

    /**
     * Partial update: modifica solo i campi non null del JSON ricevuto.
     */
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
                    if (source.getPhantom() != null) {
                        existingSource.setPhantom(source.getPhantom());
                    }
                    if (source.getLoad() != null) {
                        existingSource.setLoad(source.getLoad());
                    }
                    if (source.getDepartmentId() != null) {
                        existingSource.setDepartmentId(source.getDepartmentId());
                    }
                    if (source.getMachineId() != null) {
                        existingSource.setMachineId(source.getMachineId());
                    }
                    // non toccare ossessionatamente il campo "completedMeasurements"
                    return sourceRepository.save(existingSource);
                });
    }

    /**
     * Update “completo” (quando il client manda l’oggetto intero).
     */
    @Override
    public Optional<Source> update(Source source) {
        return sourceRepository.findById(source.getId())
                .map(existingSource -> {
                    existingSource.setSn(source.getSn());
                    existingSource.setExpirationDate(source.getExpirationDate());
                    existingSource.setPhantom(source.getPhantom());
                    existingSource.setLoad(source.getLoad());
                    existingSource.setDepartmentId(source.getDepartmentId());
                    existingSource.setMachineId(source.getMachineId());
                    existingSource.setCompletedIrradiationConditions(source.getCompletedIrradiationConditions());
                    return sourceRepository.save(existingSource);
                });
    }

    /**
     * Cancella la Source solo se non esistono ancora condizione di irradiazione
     * legate a essa.
     */
    @Override
    @Transactional
    public void deleteById(String id) throws BadRequestException, ResourceNotFoundException {
        // verifichiamo che esista
        sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sorgente non trovata: " + id));

        // se esistono condizioni collegate, lancio BadRequest
        if (irradiationConditionRepository.existsBySourceId(id)) {
            throw new BadRequestException(
                    "Impossibile cancellare la sorgente perché ci sono ancora condizioni di irradiazione associate.");
        }

        sourceRepository.deleteById(id);
    }

    @Override
    public boolean existsByDepartmentId(String departmentId) {
        return sourceRepository.existsByDepartmentId(departmentId);
    }
}
