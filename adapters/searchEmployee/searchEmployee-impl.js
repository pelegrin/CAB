	var statement1 = WL.Server.createSQLStatement("select id, firstname, lastname, jobtitle, email, phone from employee where firstname = ?");
	var statement2 = WL.Server.createSQLStatement("select id, firstname, lastname, jobtitle, email, phone from employee where lastname = ?");
	var statement3 = WL.Server.createSQLStatement("select id, firstname, lastname, jobtitle, email, phone from employee where jobtitle = ?");
	var statement4 = WL.Server.createSQLStatement("select id, firstname, lastname, jobtitle, email, phone from employee where email = ?");
	var statement5 = WL.Server.createSQLStatement("select id, firstname, lastname, jobtitle, email, phone from employee where id = ?");
	var statement6 = WL.Server.createSQLStatement("select id, firstname, lastname, jobtitle, email, phone from employee where firstname = ? or lastname = ? or jobtitle = ? or email = ?");

function search(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : statement6,
		parameters : param
	});	
}
	
function searchById(param) {
		return WL.Server.invokeSQLStatement({
			preparedStatement : statement5,
			parameters : [param]
		});
	}
	
function searchByFirstName(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : statement1,
		parameters : [param]
	});
}

function searchByLastName(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : statement2,
		parameters : [param]
	});
}

function searchByTitle(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : statement3,
		parameters : [param]
	});
}

function searchByEmail(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : statement4,
		parameters : [param]
	});
}

function searchByPhone(param) {
	var statement = WL.Server.createSQLStatement("select id, firstname, lastname, jobtitle, email, phone from employee where phone = ?");
	return WL.Server.invokeSQLStatement({
		preparedStatement : statement,
		parameters : [param]
	});
}
