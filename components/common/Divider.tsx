import { View } from "react-native";
import { Colors } from "../../constants";

interface DividerProps {
    marginX: number;
    marginY: number;
}

const Divider: React.FC<DividerProps> = ({ marginX, marginY }) => (<View style={{ marginHorizontal: marginX, marginVertical: marginY, width: "100%", height: 1, backgroundColor: Colors.lightGrey }} />);

export default Divider;