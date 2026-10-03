export interface User {
  id?: string;
  username: string;
  password: string;
}

const users: User[] = [
  {
    id: '1',
    username: 'Genrey',
    password: 'password123',
  },
];

export const UserAPI = {
  getUserByUsername(username: string): User | undefined {
    return users.find((user) => user.username === username);
  },

  login(username: string, password: string): boolean {
    const user = this.getUserByUsername(username);
    if (user && user.password === password) {
      return true;
    }
    return false;
  },

  isAuthenticated(username: string): boolean {
    const user = this.getUserByUsername(username);
    return !!user;
  },
};
