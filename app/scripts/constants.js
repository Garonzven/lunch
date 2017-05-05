function constants() {
	const server = 'http://127.0.0.1:8000/';
  return {
    login: server + 'login/signin',
    logout: server + 'login/signout',
    profile: server + 'login/profile',
    dishRegister: server + 'dish/register',
		dishUpdate: server + 'dish/update',
    cycleRegister: server + 'cycle/register',
    cycleFind: server + 'cycle/find',
		cycleReport: server +'reportCycle',
		cycleList: server + 'cyclelist',
		userRegister: server+ 'user/register',
		userUpdate: server+'user/change',
		userDelete: server+'user/delete',
		userFindList: server+'user/findlist',
		orderRegister: server+'order/register',

  }
}
