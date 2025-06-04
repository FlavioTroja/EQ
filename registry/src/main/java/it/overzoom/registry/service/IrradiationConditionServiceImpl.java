package it.overzoom.registry.service;

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
import it.overzoom.registry.repository.MeasurementRepository;
import it.overzoom.registry.repository.SourceRepository;

@Service
public class IrradiationConditionServiceImpl implements IrradiationConditionService {

    private final IrradiationConditionRepository icRepository;
    private final SourceRepository sourceRepository;
    private final MeasurementRepository measurementRepository;

    public IrradiationConditionServiceImpl(
            IrradiationConditionRepository icRepository,
            SourceRepository sourceRepository,
            MeasurementRepository measurementRepository) {
        this.icRepository = icRepository;
        this.sourceRepository = sourceRepository;
        this.measurementRepository = measurementRepository;
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
                    List<Measurement> measurements = measurementRepository.findByIrradiationConditionId(ic.getId());
                    ic.setMeasurements(measurements);
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
        ic.setMeasurements(new java.util.ArrayList<>());
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
    @Transactional
    public Optional<IrradiationCondition> partialUpdate(String id, IrradiationCondition ic)
            throws ResourceNotFoundException {
        return icRepository.findById(id)
                .map(existing -> {
                    if (ic.getSetUpMeasure() != null) {
                        existing.setSetUpMeasure(ic.getSetUpMeasure());
                    }
                    // Se parameters non è null (cioè il client ha inviato un array),
                    // rimpiazziamo la lista; altrimenti lasciamo quella esistente.
                    if (ic.getParameters() != null) {
                        existing.setParameters(ic.getParameters());
                    }
                    // Non tocchiamo sourceId a meno che non serva veramente
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

        if (measurementRepository.existsByIrradiationConditionId(id)) {
            List<Measurement> measurements = measurementRepository.findByIrradiationConditionId(id);
            measurementRepository.deleteAll(measurements);
        }

        icRepository.deleteById(id);
    }
}
