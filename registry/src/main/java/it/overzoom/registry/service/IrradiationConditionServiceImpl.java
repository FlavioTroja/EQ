package it.overzoom.registry.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.model.IrradiationCondition;
import it.overzoom.registry.model.Measurement;
import it.overzoom.registry.model.Source;
import it.overzoom.registry.repository.IrradiationConditionRepository;
import it.overzoom.registry.repository.SourceRepository;

@Service
public class IrradiationConditionServiceImpl implements IrradiationConditionService {

    private final IrradiationConditionRepository icRepository;
    private final SourceRepository sourceRepository;
    private final MeasurementService measurementService;

    public IrradiationConditionServiceImpl(
            IrradiationConditionRepository icRepository,
            SourceRepository sourceRepository,
            MeasurementService measurementService) {
        this.icRepository = icRepository;
        this.sourceRepository = sourceRepository;
        this.measurementService = measurementService;
    }

    /**
     * Restituisce una pagina di IrradiationCondition associate alla Source
     * specificata.
     */
    @Override
    public List<IrradiationCondition> findBySourceId(String sourceId) throws ResourceNotFoundException {
        // Verifico che la Source esista
        sourceRepository.findById(sourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Source non trovata: " + sourceId));

        return icRepository.findBySourceId(sourceId);
    }

    /**
     * Restituisce una singola IrradiationCondition per ID (senza popolare le
     * misurazioni).
     */
    @Override
    public Optional<IrradiationCondition> findById(String id) {
        return icRepository.findById(id)
                .map(ic -> {
                    // opzionale: popolare le misurazioni a richiesta
                    List<Measurement> measurementPoints = measurementService.findByIrradiationConditionId(ic.getId());
                    ic.setMeasurementPoints(measurementPoints);
                    return ic;
                });
    }

    /**
     * Verifica se esiste un IrradiationCondition con quell'ID.
     */
    @Override
    public boolean existsById(String id) {
        return icRepository.existsById(id);
    }

    /**
     * Crea una nuova IrradiationCondition.
     * Il campo sourceId deve essere già valorizzato nell'oggetto passed.
     */
    @Override
    @Transactional
    public IrradiationCondition create(IrradiationCondition ic) throws ResourceNotFoundException, BadRequestException {
        String sourceId = ic.getSourceId();
        if (sourceId == null) {
            throw new BadRequestException("La IrradiationCondition deve avere un sourceId valido.");
        }

        // Verifico che la Source esista
        Source src = sourceRepository.findById(sourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Source non trovata: " + sourceId));

        // Inizializzo la lista di misurazioni
        ic.setMeasurementPoints(new java.util.ArrayList<>());
        IrradiationCondition saved = icRepository.save(ic);

        // Aggiorno anche la lista di IRRADIATION_CONDITIONS dentro la Source (se uso
        // DBRef)
        var existingList = src.getIrradiationConditions();
        if (existingList == null) {
            existingList = new java.util.ArrayList<>();
        }
        existingList.add(saved);
        src.setIrradiationConditions(existingList);
        sourceRepository.save(src);

        return saved;
    }

    /**
     * Partial update: modifica solo i campi non null della IrradiationCondition.
     */
    @Override
    public Optional<IrradiationCondition> partialUpdate(String id, IrradiationCondition condition) {
        return icRepository.findById(id)
                .map(existing -> {
                    if (condition.getName() != null)
                        existing.setName(condition.getName());
                    if (condition.getSetUpMeasure() != null)
                        existing.setSetUpMeasure(condition.getSetUpMeasure());
                    if (condition.getParameters() != null)
                        existing.setParameters(condition.getParameters());
                    if (condition.getCompletedMeasurements() != null)
                        existing.setCompletedMeasurements(condition.getCompletedMeasurements());

                    // gestisci anche le measurementPoints
                    if (condition.getMeasurementPoints() != null && !condition.getMeasurementPoints().isEmpty()) {
                        List<Measurement> updatedMeasurements = new ArrayList<>();
                        for (Measurement m : condition.getMeasurementPoints()) {
                            m.setIrradiationConditionId(existing.getId());
                            if (m.getId() != null) {
                                measurementService.partialUpdate(m.getId(), m)
                                        .ifPresent(updatedMeasurements::add);
                            } else {
                                m.setIrradiationConditionId(existing.getId());
                                updatedMeasurements.add(measurementService.create(m));
                            }
                        }
                        existing.setMeasurementPoints(updatedMeasurements);
                    }

                    return icRepository.save(existing);
                });
    }

    /**
     * Update completo: aggiorna tutti i campi di una IrradiationCondition
     * esistente.
     */
    @Override
    @Transactional
    public Optional<IrradiationCondition> update(IrradiationCondition ic)
            throws ResourceNotFoundException, BadRequestException {
        if (ic.getId() == null) {
            throw new BadRequestException("ID mancante per l'update della IrradiationCondition.");
        }

        return icRepository.findById(ic.getId())
                .map(existing -> {
                    existing.setSetUpMeasure(ic.getSetUpMeasure());
                    // Nel full update sostituiamo sempre la lista di parameters
                    existing.setParameters(ic.getParameters());
                    // Se volessi supportare l’eventuale cambio di sourceId, dovresti
                    // farlo qui con le opportune verifiche (rimuovere dalla vecchia source,
                    // aggiungere alla nuova).
                    return icRepository.save(existing);
                });
    }

    /**
     * Elimina una IrradiationCondition e tutte le misurazioni a essa collegate.
     */
    @Override
    @Transactional
    public void deleteById(String id) throws ResourceNotFoundException, BadRequestException {
        icRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Condizione non trovata: " + id));

        if (measurementService.existsByIrradiationConditionId(id)) {
            List<Measurement> measurements = measurementService.findByIrradiationConditionId(id);
            measurementService.deleteAll(measurements);
        }

        icRepository.deleteById(id);
    }

    /**
     * Verifica se esiste almeno una IrradiationCondition associata alla Source
     * specificata.
     */
    @Override
    public boolean existsBySourceId(String sourceId) {
        return icRepository.existsBySourceId(sourceId);
    }
}
