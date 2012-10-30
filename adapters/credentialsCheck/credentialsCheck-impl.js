 var procedureCredStatement = WL.Server.createSQLStatement("select userid, password from credentials where loginname = ?");
function check(param) {
	if (!!!param || !!!param.login || !!!param.password)
		return {login:false, id:null};
	var login = param.login,
		password = param.password,
		data = null;
	WL.Logger.debug('Login:' + login);
	data = WL.Server.invokeSQLStatement({
		preparedStatement : procedureCredStatement,
		parameters : [login]
	});	
	if (!!!data || !!!data.resultSet || !!!data.resultSet.length || data.resultSet.length === 0) {
		WL.Logger.debug('unsuccsessful check. data is not valid');
		return {login:false, id:null};
	}		
	data = data.resultSet[0];	
	if (password === data.password) {
		WL.Logger.debug('succsessful check');
		return {login:true, id:data.userid};
	}				
	else {
		WL.Logger.debug('unsuccsessful check');
		return {login:false, id:null};
	}
		
}


