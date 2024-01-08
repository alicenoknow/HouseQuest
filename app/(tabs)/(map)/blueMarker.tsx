import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

const blueMarker = () => {
  return (
    <Svg height={20} width={20}>
      <Ellipse
        cx="10"
        cy="10"
        rx="10"
        ry="10"
        fill="#007AFF"
        stroke="#fff"
        strokeWidth="2"
        opacity={0.8}
      />
    </Svg>
  );
};

export default blueMarker;
