package com.authem.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorDetails> handleUserAlreadyExists(UserAlreadyExistsException ex){
        ErrorDetails error = ErrorDetails.builder()
                .timestamp(LocalDateTime.now())
                .message(ex.getMessage())
                .details("Conflict: Resource already exists")
                .build();
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleResourceNotFound(ResourceNotFoundException ex){
        ErrorDetails error = ErrorDetails.builder()
                .timestamp(LocalDateTime.now())
                .message(ex.getMessage())
                .details("Not Found: Resource does not exist")
                .build();
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<ErrorDetails> handleInsufficientBalance(InsufficientBalanceException ex){
        ErrorDetails error = ErrorDetails.builder()
                .timestamp(LocalDateTime.now())
                .message(ex.getMessage())
                .details("Bad Request: Insufficient wallet funds")
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDetails> handleValidationExceptions(MethodArgumentNotValidException ex){
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorDetails error = ErrorDetails.builder()
                .timestamp(LocalDateTime.now())
                .message("Validation Failed")
                .details("Invalid input arguments supplied")
                .validationErrors(errors)
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidTradeException.class)
    public ResponseEntity<ErrorDetails> handleInvalidTrade(InvalidTradeException ex) {
        ErrorDetails error = ErrorDetails.builder()
                .timestamp(LocalDateTime.now())
                .message(ex.getMessage())
                .details("Bad Request: Invalid trade operation")
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(Exception ex){
        ex.printStackTrace();
        ErrorDetails error = ErrorDetails.builder()
                .timestamp(LocalDateTime.now())
                .message(ex.getMessage())
                .details("Internal Server Error")
                .build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
