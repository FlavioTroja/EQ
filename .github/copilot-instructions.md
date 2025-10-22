# EQ Project - AI Agent Instructions

## Architecture Overview

This is a microservices-based radiology equipment management system with:
- **Backend**: Spring Boot 3.4.6 microservices with Java 21, MongoDB/PostgreSQL, AWS Cognito auth
- **Frontend**: Angular 16 with NgRx state management, Material UI, Tailwind CSS
- **Infrastructure**: Docker Compose stack with ELK logging, service discovery via Eureka

### Core Microservices
- `gateway` (8765) - Spring Cloud Gateway with OAuth2, routes to all services  
- `registry` (8080) - MongoDB-based registry service for customers/locations/equipment
- `calendar` (8081) - PostgreSQL-based scheduling service  
- `document` (8082) - Document management service
- `eurekaserver` (8761) - Service discovery server
- `frontend` (4200/80) - Angular SPA served via nginx

## Development Workflow

### Building & Deployment
- **Services**: Use `./gradlew clean bootJar` in each service directory
- **Frontend**: `npm run build -- --configuration production` creates `dist/` 
- **Docker Build/Push**: Use `./push_eq.sh [service...]` to build & push specific services
- **Local Development**: Use `./cleanup_docker.sh [service...]` to rebuild specific containers
- **Full Stack**: `docker compose up -d` starts entire environment

### Key Configuration Patterns
- All services use `application.yml` with environment variable substitution
- Database configs: `${SPRING_DATA_MONGODB_HOST:localhost}` pattern for defaults
- OAuth2 configured via AWS Cognito environment variables
- Eureka client registration on all services except frontend

## Code Patterns & Conventions

### Backend (Spring Boot)
- **Package Structure**: `controller/` → `service/` → `repository/` → `model/` 
- **DTOs**: Separate DTOs in `dto/` package with validation annotations
- **MapStruct**: All entity↔DTO mapping via `@Mapper(componentModel = "spring")`
  - Custom mapping methods use `@Named` qualifiers (e.g., `enumToString`)
  - Complex mappings use `@AfterMapping` for enrichment
- **Error Handling**: Global exception handler with custom exceptions (`ResourceNotFoundException`, `BadRequestException`)
- **Transaction Management**: `@Transactional` on service methods that modify data
- **API Documentation**: SpringDoc OpenAPI with service-specific paths (`/registry/swagger-ui.html`)

### Frontend (Angular + NgRx)
- **State Management**: Centralized NgRx store with feature modules (`auth`, `profile`, `ui`)
- **Models**: TypeScript interfaces with payload creation functions using `lodash-es` `omitBy`
- **Services**: Injectable services with `inject()` pattern, base URL from environment
- **Routing**: Standalone components with feature-based routing
- **Styling**: Tailwind CSS with Angular Material components

### Data Transformation Patterns
```java
// Backend: MapStruct with custom mappings
@Mapper(componentModel = "spring", uses = {DepartmentMapper.class})
public interface CustomerMapper {
    @Mapping(source = "paymentMethod", target = "paymentMethod", 
             qualifiedByName = "enumToString")
    CustomerDTO toDto(Customer customer);
}
```

```typescript
// Frontend: Payload creation with validation
export function createCustomerPayload(customer: any): CustomerDTO {
  const customerDTO = { /* transform */ };
  return <CustomerDTO>omitBy(customerDTO, overSome([isNil, isNaN]));
}
```

## Database & Entity Relationships
- **Registry Service**: MongoDB with nested documents (Customer → Location → Department → Source)
- **Calendar Service**: PostgreSQL for scheduling data
- **Partial Updates**: Services support PATCH operations with null-safe field updates
- **Cascade Operations**: Manual cascade handling in service layer (e.g., department deletion checks for sources)

## Authentication & Security
- **AWS Cognito** JWT-based authentication across all services
- **Gateway**: TokenRelay filter propagates JWT to downstream services
- **Resource Server**: All services validate JWT via `spring-security-oauth2-resource-server`
- **Frontend**: JWT stored in NgRx auth state, interceptor adds Authorization header

## Service Communication
- **Internal**: Eureka service discovery (`lb://REGISTRY` format)
- **External**: Gateway routes `/api/{service}/**` to appropriate microservice
- **API Docs**: Aggregated Swagger UI in gateway with links to individual service docs

## Development Tips
- **Hot Reload**: Spring Boot DevTools enabled in all services
- **Database Seeding**: Check service implementations for initialization patterns
- **Logging**: Logstash integration configured, structured logging with correlation IDs
- **Memory Limits**: Docker compose has memory constraints (512MB services, 256MB frontend)
- **Port Mapping**: Standard ports +100 offset for databases (5480, 5481)

## Common Patterns to Follow
- Always use MapStruct for entity-DTO conversion, never manual mapping
- Implement partial update methods returning `Optional<T>` for PATCH endpoints  
- Use constructor injection in services, not `@Autowired` fields
- Follow REST conventions: POST (create), PUT (full update), PATCH (partial update)
- Frontend services should return observables, use reactive patterns
- NgRx actions follow `[Feature] Action Name` naming convention