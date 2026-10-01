# Employee Management System (REST API)

A production-ready Spring Boot backend REST API for managing employee records with full CRUD operations, robust input validation, and centralized exception handling.

---

## Tech Stack
- **Language**: Java 17
- **Framework**: Spring Boot 3.2.5 (Spring Web, Spring Data JPA, Jakarta Bean Validation)
- **Database**: MySQL 8.x / 9.x
- **Build Tool**: Maven 3.9+
- **Testing**: JUnit 5, Mockito, Spring WebMvcTest
- **API Client**: Postman

---

## Prerequisites
- **JDK 17** or later installed and configured (`JAVA_HOME`)
- **Apache Maven 3.8+**
- **MySQL Server** running on `localhost:3306`

---

## Database Setup (MySQL)
1. Start your local MySQL server.
2. Create the database:
   ```sql
   CREATE DATABASE ems_db;
   ```
3. Database credentials can be configured via environment variables:
   - `DB_USER` (default: `root`)
   - `DB_PASSWORD` (default: empty `""`)

*(Note: Hibernate automatic DDL `ddl-auto=update` creates and updates the `employees` table structure automatically on startup).*

---

## How to Run

### Compile and Run Tests
```bash
mvn clean test
```

### Run the Application
```bash
mvn spring-boot:run
```
The application starts on `http://localhost:8080`.

---

## API Endpoints

| Method | Endpoint | Description | Success Status | Error Statuses |
|---|---|---|---|---|
| `POST` | `/employees` | Create a new employee | `201 Created` | `400 Bad Request`, `409 Conflict` |
| `GET` | `/employees` | Retrieve all employees | `200 OK` | - |
| `GET` | `/employees/{id}` | Retrieve employee by ID | `200 OK` | `404 Not Found` |
| `PUT` | `/employees/{id}` | Update existing employee | `200 OK` | `400 Bad Request`, `404 Not Found`, `409 Conflict` |
| `DELETE` | `/employees/{id}` | Delete employee by ID | `204 No Content` | `404 Not Found` |

---

## Sample Request & Response Payloads

### 1. Create Employee (`POST /employees`)
**Request Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "department": "Engineering",
  "salary": 45000.0
}
```

**Success Response (`201 Created`):**
```json
{
  "id": 1,
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "department": "Engineering",
  "salary": 45000.0
}
```

### 2. Validation Error Response (`400 Bad Request`)
```json
{
  "status": 400,
  "message": "email: must be a well-formed email address, name: must not be blank",
  "timestamp": "2026-10-01T16:30:00"
}
```

### 3. Resource Not Found Error (`404 Not Found`)
```json
{
  "status": 404,
  "message": "Employee not found with id 5",
  "timestamp": "2026-10-01T16:30:00"
}
```

### 4. Duplicate Email Error (`409 Conflict`)
```json
{
  "status": 409,
  "message": "Email already exists: rahul@example.com",
  "timestamp": "2026-10-01T16:30:00"
}
```

---

## Project Structure
```
employee-management/
├── pom.xml
├── README.md
├── postman/
│   └── employee-management.postman_collection.json
└── src/
    ├── main/
    │   ├── java/com/example/ems/
    │   │   ├── EmployeeManagementApplication.java
    │   │   ├── controller/
    │   │   │   └── EmployeeController.java
    │   │   ├── service/
    │   │   │   └── EmployeeService.java
    │   │   ├── repository/
    │   │   │   └── EmployeeRepository.java
    │   │   ├── model/
    │   │   │   └── Employee.java
    │   │   └── exception/
    │   │       ├── DuplicateEmailException.java
    │   │       ├── ErrorResponse.java
    │   │       ├── GlobalExceptionHandler.java
    │   │       └── ResourceNotFoundException.java
    │   └── resources/
    │       └── application.properties
    └── test/
        └── java/com/example/ems/
            ├── controller/
            │   └── EmployeeControllerTest.java
            └── service/
                └── EmployeeServiceTest.java
```

---

## Postman Collection
A complete Postman collection covering all positive and negative test cases is located at:
`postman/employee-management.postman_collection.json`
