const USER_STORAGE_KEY = "usersMock";

export const getUsers = () => {
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  // Utilisateur par défaut
  return [{ email: "admin@example.com", password: "123456" }];
};

export const saveUsers = (users) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
};

export const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const findUser = (email, password) => {
  const users = getUsers();
  return users.find((u) => u.email === email && u.password === password);
};

export const isEmailTaken = (email) => {
  const users = getUsers();
  return users.some((u) => u.email === email);
};
