function myProfile() {	
	var currentUser = WL.Server.getActiveUser();
	if (!!currentUser && !!currentUser.userId) {
		return WL.Server.invokeProcedure({
			adapter:'searchEmployee',
			procedure:'searchById',
			parameters:[currentUser.userId]
		});
	}
	return {message:'No user found'};
}

function login(param) {
	var result = null,
		userIdentity = null,
		login = '',
		password = '',
		profile = null;
	if (!!!param || !!!param.login || !!!param.password)
		return onAuhtenticationRequered(null,"user or password is invalid");
	login = param.login;
	password = param.password;
	result = WL.Server.invokeProcedure({
		adapter:'credentialsCheck',
		procedure:'check',
		parameters:[{'login':login, 'password':password}]
	});
	WL.Logger.debug('after getting result');
	if (!!result && !!result.login) {
		userIdentity = {
			userId:'' + result.id
		};
		WL.Logger.debug('authenticated id:' + result.id);
		WL.Server.setActiveUser('ProfileRealm',userIdentity);
		//first invocation of myProfile
		WL.Logger.debug('myProfile() invocation');
		profile = WL.Server.invokeProcedure({
			adapter:'searchEmployee',
			procedure:'searchById',
			parameters:[result.id]
		});
		if (!!profile.resultSet)
			return {authRequered:false, resultSet:profile.resultSet};
		return {authRequered:false};
	}
	WL.Logger.debug('getProfile login unsuccessful');
	return onAuhtenticationRequered(null,"user or password is invalid");
}

function onAuhtenticationRequered(headers, errorMessage) {
	errorMessage = errorMessage ? errorMessage : null;
	return {
		authRequered: true,
		errorMessage: errorMessage
	};
}

function onLogout() {
	//empty function. Logging can be implemented here
	WL.Logger.debug('logout');
}

