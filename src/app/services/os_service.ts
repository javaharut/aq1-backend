const getOpenseaStats = async () => {
  const response = await fetch(
    'https://api.opensea.io/api/v1/collection/aqone/stats?format=json'
  );

  return (await response.json()).stats;
};

export default getOpenseaStats;
