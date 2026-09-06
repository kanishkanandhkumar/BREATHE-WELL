import { supabase } from './supabase';

const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Authentication required');
  return data.user;
};

export const authApi = {
  login: async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return {
      token: data.session?.access_token,
      user: { id: data.user.id, name: data.user.user_metadata.name || email.split('@')[0], email: data.user.email }
    };
  },
  register: async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: window.location.origin
      }
    });
    if (error) throw error;
    if (!data.user) throw new Error('Could not create account');
    return {
      token: data.session?.access_token,
      requiresEmailConfirmation: !data.session,
      user: { id: data.user.id, name, email: data.user.email }
    };
  },
  me: async () => {
    const user = await getUser();
    return { user: { id: user.id, name: user.user_metadata.name || user.email.split('@')[0], email: user.email } };
  }
};

export const apiRequest = async (path, options = {}) => {
  const user = await getUser();
  const body = options.body ? JSON.parse(options.body) : {};
  const table = path === '/symptoms' ? 'symptoms' : 'exercise_sessions';
  if (path === '/symptoms' && options.method === 'POST') {
    const { chestTightness, ...rest } = body;
    const { data, error } = await supabase.from(table).insert({
      ...rest,
      chest_tightness: chestTightness,
      user_id: user.id
    }).select().single();
    if (error) throw error;
    return { ...data, chestTightness: data.chest_tightness };
  }
  if (path === '/exercise-sessions' && options.method === 'POST') {
    const { data, error } = await supabase.from(table).insert({ ...body, user_id: user.id }).select().single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false }).limit(100);
  if (error) throw error;
  return table === 'symptoms'
    ? data.map((item) => ({ ...item, chestTightness: item.chest_tightness }))
    : data;
};

export default apiRequest;
