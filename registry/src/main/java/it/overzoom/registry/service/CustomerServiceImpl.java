package it.overzoom.registry.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.overzoom.registry.dto.CustomerDTO;
import it.overzoom.registry.dto.DepartmentDTO;
import it.overzoom.registry.dto.IrradiationConditionDTO;
import it.overzoom.registry.dto.LocationDTO;
import it.overzoom.registry.dto.MeasurementDTO;
import it.overzoom.registry.dto.SourceDTO;
import it.overzoom.registry.exception.BadRequestException;
import it.overzoom.registry.exception.ResourceNotFoundException;
import it.overzoom.registry.mapper.CustomerMapper;
import it.overzoom.registry.mapper.DepartmentMapper;
import it.overzoom.registry.mapper.IrradiationConditionMapper;
import it.overzoom.registry.mapper.LocationMapper;
import it.overzoom.registry.mapper.MeasurementMapper;
import it.overzoom.registry.mapper.SourceMapper;
import it.overzoom.registry.model.Customer;
import it.overzoom.registry.model.Department;
import it.overzoom.registry.model.Location;
import it.overzoom.registry.model.Source;
import it.overzoom.registry.repository.CustomerRepository;
import it.overzoom.registry.repository.DepartmentRepository;
import it.overzoom.registry.repository.IrradiationConditionRepository;
import it.overzoom.registry.repository.LocationRepository;
import it.overzoom.registry.repository.MeasurementRepository;
import it.overzoom.registry.repository.SourceRepository;
import it.overzoom.registry.security.SecurityUtils;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final LocationService locationService;
    private final CustomerRepository customerRepository;
    private final LocationRepository locationRepository;
    private final DepartmentRepository departmentRepository;
    private final SourceRepository sourceRepository;
    private final CustomerMapper customerMapper;
    private final LocationMapper locationMapper;
    private final DepartmentMapper departmentMapper;
    private final SourceMapper sourceMapper;
    private final IrradiationConditionRepository irradiationConditionRepository;
    private final MeasurementRepository measurementRepository;
    private final IrradiationConditionMapper irradiationConditionMapper;
    private final MeasurementMapper measurementMapper;

    public CustomerServiceImpl(
            CustomerRepository customerRepository,
            LocationRepository locationRepository,
            DepartmentRepository departmentRepository,
            SourceRepository sourceRepository,
            CustomerMapper customerMapper,
            LocationMapper locationMapper,
            LocationService locationService,
            DepartmentMapper departmentMapper,
            SourceMapper sourceMapper,
            IrradiationConditionRepository irradiationConditionRepository,
            MeasurementRepository measurementRepository,
            IrradiationConditionMapper irradiationConditionMapper,
            MeasurementMapper measurementMapper) {
        this.customerRepository = customerRepository;
        this.locationRepository = locationRepository;
        this.departmentRepository = departmentRepository;
        this.sourceRepository = sourceRepository;
        this.customerMapper = customerMapper;
        this.locationMapper = locationMapper;
        this.locationService = locationService;
        this.departmentMapper = departmentMapper;
        this.sourceMapper = sourceMapper;
        this.irradiationConditionRepository = irradiationConditionRepository;
        this.measurementRepository = measurementRepository;
        this.irradiationConditionMapper = irradiationConditionMapper;
        this.measurementMapper = measurementMapper;
    }

    public boolean hasAccess(String customerId) throws ResourceNotFoundException {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));
        return SecurityUtils.isAdmin() || SecurityUtils.isCurrentUser(customer.getUserId());
    }

    @Override
    public Page<CustomerDTO> findAll(Pageable pageable) {
        return customerRepository.findAll(pageable)
                .map(customerMapper::toDto);
    }

    @Override
    public CustomerDTO findById(String customerId) throws ResourceNotFoundException {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato"));

        CustomerDTO dto = customerMapper.toDto(customer);

        List<LocationDTO> locDtos = locationRepository
                .findByCustomerId(customerId)
                .stream()
                .map(locationMapper::toDto)
                .collect(Collectors.toList());
        dto.setLocations(locDtos);

        locDtos.forEach(locDto -> {
            List<DepartmentDTO> deptDtos = departmentRepository
                    .findByLocationId(locDto.getId())
                    .stream()
                    .map(departmentMapper::toDto)
                    .collect(Collectors.toList());
            locDto.setDepartments(deptDtos);
            locDto.setCompletedDepartments(deptDtos.size());

            deptDtos.forEach(deptDto -> {
                List<SourceDTO> srcDtos = sourceRepository
                        .findByDepartmentId(deptDto.getId())
                        .stream()
                        .map(sourceMapper::toDto)
                        .collect(Collectors.toList());
                deptDto.setSources(srcDtos);
                deptDto.setCompletedSources(srcDtos.size());

                srcDtos.forEach(srcDto -> {
                    List<IrradiationConditionDTO> icDtos = irradiationConditionRepository
                            .findBySourceId(srcDto.getId())
                            .stream()
                            .map(irradiationConditionMapper::toDto)
                            .collect(Collectors.toList());
                    srcDto.setIrradiationConditions(icDtos);
                    srcDto.setCompletedIrradiationConditions(icDtos.size());

                    icDtos.forEach(icDto -> {
                        List<MeasurementDTO> mDtos = measurementRepository
                                .findByIrradiationConditionId(icDto.getId())
                                .stream()
                                .map(measurementMapper::toDto)
                                .collect(Collectors.toList());
                        icDto.setMeasurementPoints(mDtos);
                        icDto.setCompletedMeasurements(mDtos.size());
                    });
                });
            });
        });

        return dto;
    }

    @Override
    public Page<CustomerDTO> findByUserId(String userId, Pageable pageable) {
        return customerRepository.findByUserId(userId, pageable)
                .map(customerMapper::toDto)
                .map(dto -> {
                    List<LocationDTO> locDtos;
                    try {
                        locDtos = locationService.findByCustomerId(dto.getId());
                    } catch (ResourceNotFoundException | BadRequestException e) {
                        locDtos = Collections.emptyList();
                    }
                    dto.setLocations(locDtos);
                    return dto;
                });
    }

    @Override
    public boolean existsById(String id) {
        return customerRepository.existsById(id);
    }

    @Override
    public CustomerDTO create(Customer customer) {
        return customerMapper.toDto(customerRepository.save(customer));
    }

    @Override
    @Transactional
    public CustomerDTO createWithNested(CustomerDTO dto) {
        Customer customer = customerMapper.toEntity(dto);
        customer.setLocations(Collections.emptyList());
        customer = customerRepository.save(customer);

        List<Location> savedLocs = new ArrayList<>();
        for (LocationDTO locDto : dto.getLocations()) {
            locDto.setCustomerId(customer.getId());
            Location loc = locationMapper.toEntity(locDto);
            loc.setDepartments(Collections.emptyList());
            loc = locationRepository.save(loc);

            List<Department> savedDeps = new ArrayList<>();
            for (DepartmentDTO depDto : locDto.getDepartments()) {
                depDto.setLocationId(loc.getId());
                Department dep = departmentMapper.toEntity(depDto);
                dep.setSources(Collections.emptyList());
                dep = departmentRepository.save(dep);

                List<Source> savedSrcs = new ArrayList<>();
                for (SourceDTO srcDto : depDto.getSources()) {
                    srcDto.setDepartmentId(dep.getId());
                    Source src = sourceMapper.toEntity(srcDto);
                    savedSrcs.add(sourceRepository.save(src));
                }
                dep.setSources(savedSrcs);
                savedDeps.add(departmentRepository.save(dep));
            }
            loc.setDepartments(savedDeps);
            savedLocs.add(locationRepository.save(loc));
        }

        customer.setLocations(savedLocs);
        customer = customerRepository.save(customer);

        return customerMapper.toDto(customer);
    }

    @Override
    @Transactional
    public CustomerDTO update(Customer customer) throws ResourceNotFoundException, BadRequestException {
        Customer existingCustomer = customerRepository.findById(customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));

        existingCustomer.setName(customer.getName());
        existingCustomer.setFiscalCode(customer.getFiscalCode());
        existingCustomer.setVatCode(customer.getVatCode());
        existingCustomer.setPec(customer.getPec());
        existingCustomer.setSdi(customer.getSdi());
        existingCustomer.setPaymentMethod(customer.getPaymentMethod());
        existingCustomer.setEmail(customer.getEmail());
        existingCustomer.setPhoneNumber(customer.getPhoneNumber());
        existingCustomer.setNotes(customer.getNotes());

        return this.create(existingCustomer);
    }

    @Override
    @Transactional
    public CustomerDTO partialUpdate(String id, Customer customer)
            throws ResourceNotFoundException, BadRequestException {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente non trovato."));

        if (customer.getName() != null) {
            existingCustomer.setName(customer.getName());
        }
        if (customer.getFiscalCode() != null) {
            existingCustomer.setFiscalCode(customer.getFiscalCode());
        }
        if (customer.getVatCode() != null) {
            existingCustomer.setVatCode(customer.getVatCode());
        }
        if (customer.getPec() != null) {
            existingCustomer.setPec(customer.getPec());
        }
        if (customer.getSdi() != null) {
            existingCustomer.setSdi(customer.getSdi());
        }
        if (customer.getPaymentMethod() != null) {
            existingCustomer.setPaymentMethod(customer.getPaymentMethod());
        }
        if (customer.getEmail() != null) {
            existingCustomer.setEmail(customer.getEmail());
        }
        if (customer.getPhoneNumber() != null) {
            existingCustomer.setPhoneNumber(customer.getPhoneNumber());
        }
        if (customer.getNotes() != null) {
            existingCustomer.setNotes(customer.getNotes());
        }

        return this.create(existingCustomer);

    }

    @Override
    @Transactional
    public void deleteById(String id) throws BadRequestException, ResourceNotFoundException {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente non trovato.");
        }
        if (locationRepository.existsByCustomerId(id)) {
            throw new BadRequestException(
                    "Impossibile cancellare il cliente perché ci sono delle sedi ad esso associate.");
        }
        customerRepository.deleteById(id);
    }

    @Override
    public List<CustomerDTO> findCustomersByMachine(String machineId) {
        List<Source> sources = sourceRepository.findByMachineId(machineId);

        Set<String> deptIds = sources.stream()
                .map(Source::getDepartmentId)
                .collect(Collectors.toSet());

        if (deptIds.isEmpty()) {
            return List.of();
        }

        List<Department> depts = departmentRepository.findByIdIn(List.copyOf(deptIds));

        Set<String> locIds = depts.stream()
                .map(Department::getLocationId)
                .collect(Collectors.toSet());

        if (locIds.isEmpty()) {
            return List.of();
        }

        List<Location> locs = locationRepository.findByIdIn(List.copyOf(locIds));

        Set<String> custIds = locs.stream()
                .map(Location::getCustomerId)
                .collect(Collectors.toSet());

        if (custIds.isEmpty()) {
            return List.of();
        }

        List<Customer> customers = customerRepository.findByIdIn(List.copyOf(custIds));
        if (customers.isEmpty()) {
            return List.of();
        }

        return customers.stream()
                .map(customerMapper::toDto)
                .collect(Collectors.toList());
    }
}