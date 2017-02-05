package com.softbox.generator.handler;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.softbox.generator.service.exception.RecursoNaoEncontradoException;

@ControllerAdvice
public class ResourceExceptionHandler {

	@ExceptionHandler(RecursoNaoEncontradoException.class)
	public ResponseEntity<Void> handleRecursoNaoEncontradoException(RecursoNaoEncontradoException exception, 
			HttpServletRequest httpServletRequest){
		
		return ResponseEntity.notFound().build();
	}
}
