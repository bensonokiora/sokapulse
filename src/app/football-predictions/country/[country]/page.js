import NavigationRow from '@/components/NavigationRow';
import { fetchFixturesByCountry } from '@/utils/api';
import '../../../../styles/custom.css';
import LoadingAnimation from '@/components/LoadingAnimation';
import CountryPredictionsClient from '@/components/CountryPredictionsClient';

async function getCountryData(country) {
  try {
    const data = await fetchFixturesByCountry(country);
    
    if (data.status === true) {
      return {
        fixtures: data.data,
        error: null
      };
    } else {
      return {
        fixtures: [],
        error: data.message || 'Failed to load fixtures'
      };
    }
  } catch (err) {
    console.error('Error loading country data:', err);
    return {
      fixtures: [],
      error: 'Error loading fixtures'
    };
  }
}

export default async function CountryPredictions({ params }) {
  const { fixtures, error } = await getCountryData(params.country);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
      <div className="col-lg-12" style={{ height: 'auto !important' }}>
        <CountryPredictionsClient 
          initialFixtures={fixtures}
          country={params.country}
        />
      </div>
    </div>
  );
}
