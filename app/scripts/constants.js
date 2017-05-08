function constants() {
	const server = 'http://13.92.198.201/laravel/public/';
  return {
    login: server + 'login/signin',
    logout: server + 'login/signout',
    profile: server + 'login/profile',
    dishRegister: server + 'dish/register',
		dishUpdate: server + 'dish/update',
		dishDelete: server + 'dish/delete',
    cycleRegister: server + 'cycle/register',
    cycleFind: server + 'cycle/find',
		cycleReport: server +'reportCycle',
		cycleList: server + 'cyclelist',
		cycleDelete: server + 'cycle/delete',
		userRegister: server+ 'user/register',
		userUpdate: server+'user/update',
		userDelete: server+'user/delete',
		userFindList: server+'user/findlist',
		orderRegister: server+'order/register',
		dateserver: server+'date',
  }
}
