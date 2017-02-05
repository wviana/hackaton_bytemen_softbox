package com.softbox.generator.resources;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.softbox.generator.domain.<%=upperCamel(table)%>;
import com.softbox.generator.service.<%=upperCamel(table)%>Service;

@RestController
@RequestMapping("/<%= table %>")
public class <%=upperCamel(table)%>Resources {

	@Autowired
	private <%=upperCamel(table)%>Service <%=camelCase(table)%>Service;

	@GetMapping(produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
	public ResponseEntity<List<<%=upperCamel(table)%>>> listar(){

		return ResponseEntity.status(HttpStatus.OK).body(<%=camelCase(table)%>Service.listar());
	}

	@PostMapping(produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
	public ResponseEntity<Void> salvar(@Valid @RequestBody <%=upperCamel(table)%> <%=camelCase(table)%>){

		<%=`${camelCase(table)}.setId(null);`%>
		<%=`${camelCase(table)} = ${camelCase(table)}Service.salvar(${camelCase(table)});`%>

		URI uri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/{id}").buildAndExpand(<%=camelCase(table)%>.getId()).toUri();

		return ResponseEntity.created(uri).build();
	}

	@GetMapping(value = "/{id}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
	public ResponseEntity<?> buscar(@PathVariable Long id){

		<%=`${upperCamel(table)} ${camelCase(table)} = ${camelCase(table)}Service.buscar(id);`%>

		return ResponseEntity.status(HttpStatus.OK).body(<%=camelCase(table)%>);
	}

	@DeleteMapping(value = "/{id}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
	public ResponseEntity<Void> deletar(@PathVariable Long id){

		<%=`${camelCase(table)}Service.deletar(id);`%>

		return ResponseEntity.noContent().build();
	}

	@PutMapping(value = "/{id}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
	public ResponseEntity<Void> atualizar(@RequestBody <%=upperCamel(table)%> <%=camelCase(table)%>, @PathVariable Long id){

		<%=`${camelCase(table)}.setId(id);`%>
		<%= `${camelCase(table)}Service.atualizar(${camelCase(table)});` %>

		return ResponseEntity.noContent().build();
	}
}
