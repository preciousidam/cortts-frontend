import { useAuth } from "@/contexts/AuthContext";
import { Href, Redirect, useLocalSearchParams, usePathname, useSegments } from "expo-router";
import { ActivityIndicator } from "react-native";

export const withRole = (ScreenComponent: React.ComponentType) => {
  return (props: any) => {
    const { role, isFetching } = useAuth();
    const pathname = usePathname();
    const params = useLocalSearchParams();

    const segment = useSegments();
    const adminSegment = segment.find(s => s === '(admin)');
    const agentSegment = segment.find(s => s === '(agent)');
    const clientSegment = segment.find(s => s === '(client)');

    if (isFetching) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!role && !isFetching) {
      return (
        <Redirect href="/(auths)/login" />
      );
    } else if (role === 'admin' && !adminSegment) {
      return <Redirect href={{pathname: `/(app)/(${role})${pathname}` as any}} />;
    } else if (role === 'agent' && !agentSegment) {
      return <Redirect href={{pathname: `/(app)/(${role})${pathname}` as any}} />;
    } else if (role === 'client' && !clientSegment) {
      return <Redirect href={{pathname: `/(app)/(${role})${pathname}` as any}} />;
    }

    return <ScreenComponent {...props} />;
  };
}