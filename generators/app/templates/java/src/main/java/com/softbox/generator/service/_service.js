package com.softbox.generator.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import com.softbox.generator.domain.Pessoa;
import com.softbox.generator.repository.PessoaRepository;
import com.softbox.generator.service.exception.RecursoNaoEncontradoException;

@Service
public class <%=upperCamel(table)%>Service {

	@Autowired
	private <%=upperCamel(table)%>Repository <%=camelCase(table)%>Repository;

	<%= `public List<${upperCamel(table)}> listar(){` =>

		return <%=camelCase(table)%>Repository.findAll();
	}

	<%=`public ${upperCamel(table)} ${camelCase(table)}(Long id){`%>

		<%=`${upperCamel(table)} ${camelCase(table)} = ${camelCase(table)}Repository.findOne(id);`%>

		if(<%=camelCase(table)%> == null){

			throw new RecursoNaoEncontradoException("Recurso não encontrado");
		}

		return <%=camelCase(table)%>;
	}

	<%=`public ${upperCamel(table)} salvar(${upperCamel(table)} ${camelCase(table)}){`%>

		<%=`return ${camelCase(table)}Repository.save(${camelCase(table)});`%>
	}

	public void deletar(Long id){

		try {

			<%=`${camelCase(table)}Repository.delete(id);`%>
		} catch (EmptyResultDataAccessException e) {

			throw new RecursoNaoEncontradoException("Recurso não encontrado");
		}
	}

	<%=`public void atualizar(${upperCamel(table)} ${camelCase(table)}){`%>

		this.buscar(<%=camelCase(table)%>.getId());
		this.salvar(<%=camelCase(table)%>);
	}
}
