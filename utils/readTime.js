const calculateReadTime = (text) => {
  const wordsPerMinute = 250;
  const numberOfWords = text.split(/\s/g).length;
  return Math.ceil(numberOfWords / wordsPerMinute);
};

export default calculateReadTime;
