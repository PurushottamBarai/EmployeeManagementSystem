package com.example.ems.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.ems.exception.DuplicateEmailException;
import com.example.ems.exception.ResourceNotFoundException;
import com.example.ems.model.Employee;
import com.example.ems.repository.EmployeeRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee employee;

    @BeforeEach
    void setUp() {
        employee = new Employee(1L, "Rahul Sharma", "rahul@example.com", "Engineering", 45000.0);
    }

    @Test
    void createEmployee_Success() {
        when(employeeRepository.existsByEmail(employee.getEmail())).thenReturn(false);
        when(employeeRepository.save(employee)).thenReturn(employee);

        Employee created = employeeService.createEmployee(employee);

        assertNotNull(created);
        assertEquals("rahul@example.com", created.getEmail());
        verify(employeeRepository).save(employee);
    }

    @Test
    void createEmployee_DuplicateEmail_ThrowsException() {
        when(employeeRepository.existsByEmail(employee.getEmail())).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> employeeService.createEmployee(employee));
        verify(employeeRepository, never()).save(any());
    }

    @Test
    void getEmployeeById_Found() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        Employee found = employeeService.getEmployeeById(1L);

        assertNotNull(found);
        assertEquals(1L, found.getId());
    }

    @Test
    void getEmployeeById_NotFound_ThrowsException() {
        when(employeeRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> employeeService.getEmployeeById(2L));
    }

    @Test
    void updateEmployee_Success() {
        Employee updateInfo = new Employee(null, "Rahul Verma", "rahul.verma@example.com", "HR", 50000.0);
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(employeeRepository.existsByEmail("rahul.verma@example.com")).thenReturn(false);
        when(employeeRepository.save(any(Employee.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Employee updated = employeeService.updateEmployee(1L, updateInfo);

        assertNotNull(updated);
        assertEquals("Rahul Verma", updated.getName());
        assertEquals("rahul.verma@example.com", updated.getEmail());
    }

    @Test
    void updateEmployee_NotFound_ThrowsException() {
        Employee updateInfo = new Employee(null, "Rahul Verma", "rahul.verma@example.com", "HR", 50000.0);
        when(employeeRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> employeeService.updateEmployee(2L, updateInfo));
        verify(employeeRepository, never()).save(any());
    }

    @Test
    void deleteEmployee_Success() {
        when(employeeRepository.existsById(1L)).thenReturn(true);

        employeeService.deleteEmployee(1L);

        verify(employeeRepository).deleteById(1L);
    }

    @Test
    void deleteEmployee_NotFound_ThrowsException() {
        when(employeeRepository.existsById(2L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> employeeService.deleteEmployee(2L));
        verify(employeeRepository, never()).deleteById(any());
    }
}
