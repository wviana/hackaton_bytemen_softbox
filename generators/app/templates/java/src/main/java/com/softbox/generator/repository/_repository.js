package com.softbox.generator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.softbox.generator.domain.Pessoa;

@Repository
<%= `public interface ${upperCamel(table)}Repository extends JpaRepository<${upperCamel(table)}, Long> {` %>

}
