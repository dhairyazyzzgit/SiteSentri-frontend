const KEY = "sitesentri_guest_history";

export const getLocalHistory = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const saveLocalHistoryItem = (item) => {
  const data = getLocalHistory();
  const updated = [{ id: Date.now(), ...item }, ...data];
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
};

export const deleteLocalHistoryItem = (id) => {
  const data = getLocalHistory();
  const updated = data.filter((i) => i.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
};