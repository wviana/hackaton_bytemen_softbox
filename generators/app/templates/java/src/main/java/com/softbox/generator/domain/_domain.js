package com.softbox.generator.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Max;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@Entity
@Table(name = "<%= table %>")
public class <%= table %> {
	
	
	<% columns.forEach(function(column){ %>
	
		<% if (column.pk) { %>
				@Id 
				@GeneratedValue(strategy = GenerationType.IDENTITY)
		<% } %>
		
		
		<% if (column.is_nullable == 'NO') { %>
				@NotNull(message = "O campo <%= column.column_name %> não pode ser nulo")
		<% } %>
		
		<% if (column.character_maximum_length != null) { %>
				@Max(<%= column.character_maximum_length %>)
		<% } %>

		@JsonInclude(Include.NON_NULL)
		<%= `${column.data_type} ${column.column_name}` %> 
		
		public <%=`${column.data_type} get${column.column_name}`%> () {
			return <%= column.column_name %>;
		}

		public void set<%=`${column.column_name}(${column.data_type} ${column.column_name}) {`%>
			<%=`this.${column.column_name} = ${column.column_name}%`%>;
		}
		
	<% }); %>
}
