package it.overzoom.registry.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import it.overzoom.registry.model.IrradiationCondition;
import it.overzoom.registry.model.Measurement;
import it.overzoom.registry.model.Source;
import it.overzoom.registry.repository.IrradiationConditionRepository;
import it.overzoom.registry.repository.MeasurementRepository;
import it.overzoom.registry.repository.SourceRepository;

@Service
public class IrradiationConditionServiceImpl implements IrradiationConditionService {

    private final IrradiationConditionRepository icRepo;
    private final SourceRepository sourceRepo;
    private final MeasurementRepository mRepo;

    public IrradiationConditionServiceImpl(
            IrradiationConditionRepository icRepo,
            SourceRepository sourceRepo,
            MeasurementRepository mRepo) {
        this.icRepo = icRepo;
        this.sourceRepo = sourceRepo;
        this.mRepo = mRepo;
    }

    /**
     * Crea una nuova condizione di irradiazione per la Source specificata.
     */
    public IrradiationCondition createCondition(String sourceId, IrradiationCondition ic) {
        Source s = sourceRepo.findById(sourceId)
                .orElseThrow(() -> new RuntimeException("Source non trovata: " + sourceId));

        ic.setSourceId(sourceId);
        ic.setMeasurements(new java.util.ArrayList<>());
        IrradiationCondition saved = icRepo.save(ic);

        // Aggiungo il riferimento dentro la Source
        var list = s.getIrradiationConditions();
        if (list == null) {
            list = new java.util.ArrayList<>();
        }
        list.add(saved);
        s.setIrradiationConditions(list);
        sourceRepo.save(s);

        return saved;
    }

    public Optional<IrradiationCondition> getById(String id) {
        Optional<IrradiationCondition> opt = icRepo.findById(id);
        if (opt.isPresent()) {
            IrradiationCondition ic = opt.get();
            var measurements = mRepo.findByIrradiationConditionId(ic.getId());
            ic.setMeasurements(measurements);
            return Optional.of(ic);
        }
        return Optional.empty();
    }

    public List<IrradiationCondition> getAllBySource(String sourceId) {
        var list = icRepo.findBySourceId(sourceId);
        for (IrradiationCondition ic : list) {
            var measurements = mRepo.findByIrradiationConditionId(ic.getId());
            ic.setMeasurements(measurements);
        }
        return list;
    }

    /**
     * Metodo paginato per ottenere le condizioni di irradiazione di una Source.
     */
    public Page<IrradiationCondition> getPageBySource(String sourceId, Pageable pageable) {
        return icRepo.findBySourceId(sourceId, pageable);
    }

    public IrradiationCondition updateCondition(String id, IrradiationCondition updated) {
        return icRepo.findById(id).map(existing -> {
            existing.setKey(updated.getKey());
            existing.setValue(updated.getValue());
            existing.setSetUpMeasure(updated.getSetUpMeasure());
            // event. gestire il cambio di sourceId
            return icRepo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Condizione non trovata: " + id));
    }

    public void deleteCondition(String id) {
        // Prima cancello le misurazioni collegate
        var measurements = mRepo.findByIrradiationConditionId(id);
        for (Measurement m : measurements) {
            mRepo.delete(m);
        }
        // Rimuovo la condizione
        icRepo.deleteById(id);
    }

    public boolean existsBySource(String sourceId) {
        return icRepo.existsBySourceId(sourceId);
    }
}
