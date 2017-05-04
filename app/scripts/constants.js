function constants() {
	const server = 'http://13.92.198.201/laravel/public/';
  return {
    login: server + 'login/signin',
    logout: server + 'login/signout',
    profile: server + 'login/profile',
    dishRegister: server + 'dish/register',
    cycleRegister: server + 'cycle/register',
    cycleFind: server + 'cycle/find',
  }
}