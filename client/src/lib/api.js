const read = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem('breatheWellUser') || 'null');
  if (!user) throw new Error('Authentication required');
  return user;
};

export const authApi = {
  login: async ({ email, password }) => {
    const user = read('breatheWellAccounts').find(
      (account) => account.email === email.toLowerCase() && account.password === password
    );
    if (!user) throw new Error('Email or password is incorrect');
    return { token: 'local-demo-session', user: { id: user.id, name: user.name, email: user.email } };
  },
  register: async ({ name, email, password }) => {
    const accounts = read('breatheWellAccounts');
    const normalizedEmail = email.toLowerCase();
    if (accounts.some((account) => account.email === normalizedEmail)) {
      throw new Error('An account with this email already exists');
    }
    const user = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, password };
    write('breatheWellAccounts', [...accounts, user]);
    return { token: 'local-demo-session', user: { id: user.id, name: user.name, email: user.email } };
  },
  me: async () => ({ user: getCurrentUser() })
};

export const apiRequest = async (path, options = {}) => {
  const user = getCurrentUser();
  const key = path === '/symptoms' ? 'symptomLogs' : 'exerciseSessions';
  const records = read(key);
  if (options.method === 'POST') {
    const body = JSON.parse(options.body || '{}');
    const record = { ...body, userId: user.id, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
    write(key, [...records, record]);
    return record;
  }
  return records.filter((record) => !record.userId || record.userId === user.id).reverse().slice(0, 100);
};

export default apiRequest;
