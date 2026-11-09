export function removeQuote(item) {
  if (typeof item !== 'string') {
    return item;
  }

  return item.slice(1, item.length - 1);
}

export function exitAccount() {
  localStorage.setItem('user', JSON.stringify(null));
  localStorage.setItem('IdUser', JSON.stringify(null));
  localStorage.setItem('nameUser', JSON.stringify(null));

  window.location.replace('/login');
}