const newFunc = async () => {
  return await Promise.resolve('acync is working');
};

newFunc().then(res => console.log('async func', res));

const APIKey = '28c7d687accc7c75aabbc7fb71173feb';
const city = 'Москва';
const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey;

fetch(url)
  .then(res => res.json())
  .then((res) => console.log('fetch', res));