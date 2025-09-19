export const getFavoriteCount = () => {
  try {
    const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata'));
    if (!favoriteData || !favoriteData.dataArray) return 0;
    
    // Check expiry
    if (favoriteData.expiry && new Date().getTime() > favoriteData.expiry) {
      localStorage.removeItem('mymatchesdata');
      return 0;
    }
    
    return favoriteData.dataArray.length;
  } catch {
    return 0;
  }
};

export const toggleFavorite = (fixtureId) => {
  try {
    let favoriteData = JSON.parse(localStorage.getItem('mymatchesdata')) || { dataArray: [] };
    const exists = favoriteData.dataArray.some(item => item.fixture_id === fixtureId);
    
    if (exists) {
      favoriteData.dataArray = favoriteData.dataArray.filter(item => item.fixture_id !== fixtureId);
    } else {
      favoriteData.dataArray.push({ fixture_id: fixtureId });
    }

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    favoriteData.expiry = expiry.getTime();

    localStorage.setItem('mymatchesdata', JSON.stringify(favoriteData));
    return !exists; // Returns true if added to favorites, false if removed
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};

export const isFavorite = (fixtureId) => {
  try {
    const favoriteData = JSON.parse(localStorage.getItem('mymatchesdata'));
    if (!favoriteData || !favoriteData.dataArray) return false;
    
    // Check expiry
    if (favoriteData.expiry && new Date().getTime() > favoriteData.expiry) {
      localStorage.removeItem('mymatchesdata');
      return false;
    }
    
    return favoriteData.dataArray.some(item => item.fixture_id === fixtureId);
  } catch {
    return false;
  }
};