const read = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const currentUser = () => JSON.parse(localStorage.getItem('breatheWellUser') || 'null')
  || { id: 'local-demo-user', name: 'Demo User', email: 'demo@breathewell.local' };

export const apiRequest = async (path, options = {}) => {
  const key = path === '/symptoms' ? 'symptomLogs' : 'exerciseSessions';
  const records = read(key);
  if (options.method === 'POST') {
    const record = {
      ...JSON.parse(options.body || '{}'),
      userId: currentUser().id,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
    write(key, [...records, record]);
    return record;
  }
  return records.filter((record) => !record.userId || record.userId === currentUser().id)
    .reverse()
    .slice(0, 100);
};

export default apiRequest;
