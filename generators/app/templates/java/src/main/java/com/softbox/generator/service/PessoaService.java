package com.softbox.generator.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import com.softbox.generator.domain.Pessoa;
import com.softbox.generator.repository.PessoaRepository;
import com.softbox.generator.service.exception.RecursoNaoEncontradoException;

@Service
public class PessoaService {
	
	@Autowired
	private PessoaRepository pessoaRepository;

	public List<Pessoa> listar(){
		
		return pessoaRepository.findAll();
	}
	
	public Pessoa buscar(Long id){
		
		Pessoa pessoa = pessoaRepository.findOne(id);
		
		if(pessoa == null){
			
			throw new RecursoNaoEncontradoException("Recurso não encontrado");
		}
		
		return pessoa;
	}
	
	public Pessoa salvar(Pessoa pessoa){
		
		return pessoaRepository.save(pessoa);
	}
	
	public void deletar(Long id){
		
		try {
			
			pessoaRepository.delete(id);
		} catch (EmptyResultDataAccessException e) {
			
			throw new RecursoNaoEncontradoException("Recurso não encontrado");
		}
	}
	
	public void atualizar(Pessoa pessoa){
		
		this.buscar(pessoa.getId());
		this.salvar(pessoa);
	}
}
