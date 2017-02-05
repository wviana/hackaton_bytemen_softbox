module.exports = function() {
	var toJavaTypes = {
		"bigint": "Long",
		"bigserial": "long",
		"boolean": "boolean",
		"character": "String",
		"character varying": "String",
		"date": "Date",
		"double precision": "double",
		"integer": "int",
		"money": "double",
		"numeric": "double",
		"real": "double",
		"smallint": "int",
		"smallserial": "int",
		"serial": "long",
		"text": "String",
		"time": "Date",
		"time": "Date",
		"timestamp": "Date",
		"timestamp": "Date",
		"uuid": "long"
	};
	
	return function(dbType) {
		return toJavaTypes[dbType];
	};
}();




