import Ionicons from "@expo/vector-icons/Ionicons";

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface IconProps {
    name: IconName;
    color: string;
}

export default function Icon(props: IconProps) {
    return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}