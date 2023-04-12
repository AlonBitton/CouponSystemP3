export function refreshBackgroundImage() {
  const newBackgroundImage = `https://source.unsplash.com/random/?shopping&${new Date().getTime()}`;
  sessionStorage.setItem('backgroundImage', newBackgroundImage);
  return newBackgroundImage;
}

export function getBackgroundImage() {
  return sessionStorage.getItem('backgroundImage') || 'https://source.unsplash.com/random/?finance';
}
