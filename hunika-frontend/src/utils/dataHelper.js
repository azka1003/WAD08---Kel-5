// Fungsi ini menggabungkan data JSON dengan hasil edit/tambah
export const getKostData = (originalData) => {
  const localData = localStorage.getItem('kostDataCustom');
  return localData ? JSON.parse(localData) : originalData;
};

export const saveKostData = (newData) => {
  localStorage.setItem('kostDataCustom', JSON.stringify(newData));
};