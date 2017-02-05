package com.softbox.generator.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@Entity
@Table(name = "<%= table %>")
public class <%=upperCamel(table) %> {

	<% columns.forEach(function(column){ %>

		<% if (column.pk) { %>
				@Id
				@GeneratedValue(strategy = GenerationType.IDENTITY)
		<% } %>

		<% if (column.is_nullable == 'NO' && !column.pk) { %>
				@NotNull(message = "O campo <%= camelCase(column.column_name) %> não pode ser nulo")
		<% } %>

		@JsonInclude(Include.NON_NULL)
		<%= `${dbToJava(column.data_type)} ${camelCase(column.column_name)}` %>;

		public <%=`${dbToJava(column.data_type)} get${upperCamel(column.column_name)}`%> () {
			return <%= camelCase(column.column_name) %>;
		}

		public void set<%=`${upperCamel(column.column_name)}(${dbToJava(column.data_type)} ${camelCase(column.column_name)}) {`%>
			<%=`this.${camelCase(column.column_name)} = ${camelCase(column.column_name)}`%>;
		}

	<% }); %>
}
