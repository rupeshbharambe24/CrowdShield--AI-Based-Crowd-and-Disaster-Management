import { Polyline } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface RoutesProps {
  coords: LatLngExpression[];
}

const Routes: React.FC<RoutesProps> = ({ coords }) => {
  return <Polyline positions={coords} color="blue" />;
};

export default Routes;
