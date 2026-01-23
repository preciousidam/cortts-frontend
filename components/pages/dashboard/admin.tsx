import { useMemo } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { useResponsive } from "@/hooks/useResponsive";
import { useRouter } from "expo-router";
import { UnitsPreview, UnitPreviewItem } from "./UnitPreview";
import { QuickActions } from "./quickActions";
import { ImageBackground } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetAdminDashboardData } from "@/store/dashboard/queries";
import { PaymentPreviewItem, RecentPayments } from "./recentPayments";

const AdminDashboard = () => {
  const { colors, fonts } = useTheme();
  const { widthPixel, heightPixel, fontPixel } = useResponsive();
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background ?? "#F4F6FA",
      paddingTop: top,
    },
    header: {
      paddingHorizontal: widthPixel(20),
      paddingTop: heightPixel(18),
      paddingBottom: heightPixel(10),
      rowGap: heightPixel(6),
    },
    title: {
      ...fonts.bold,
      fontSize: fontPixel(22),
      color: colors.text.default,
    },
    subtitle: {
      ...fonts.medium,
      fontSize: fontPixel(13),
      color: colors.text.weak ?? "#6B7280",
    },

    kpiRow: {
      flexDirection: "row",
      // flexWrap: "wrap",
      gap: widthPixel(12),
      paddingHorizontal: widthPixel(20),
      paddingTop: heightPixel(8),
      paddingBottom: heightPixel(6),
      flex: 1
    },
    kpiCard: {
      width: widthPixel(160),
      minHeight: heightPixel(100),
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: widthPixel(18),
      rowGap: heightPixel(8),
      elevation: 1,
      shadowColor: "#aaa",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: widthPixel(2),
    },
    kpiLabel: {
      ...fonts.semiBold,
      fontSize: fontPixel(12),
      color: "#FFFFFF",
    },
    kpiValue: {
      ...fonts.bold,
      fontSize: fontPixel(22),
      color: "#FFFFFF",
    },
    kpiSubtext: {
      ...fonts.medium,
      fontSize: fontPixel(10),
      color: "#FFFFFF",
      opacity: 0.9,
    },

    sectionGap: { height: heightPixel(18) },

    activityCard: {
      marginHorizontal: widthPixel(20),
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.neutral.light,
      borderRadius: widthPixel(18),
      padding: widthPixel(14),
      rowGap: heightPixel(10),
    },
    activityTitle: {
      ...fonts.bold,
      fontSize: fontPixel(15),
      color: colors.text.default,
    },
    activityText: {
      ...fonts.medium,
      fontSize: fontPixel(13),
      color: colors.text.default ?? "#6B7280",
    },
  });

  /**
   * - services/dashboard.ts / store/dashboard/queries.ts
   * - services/unit.ts / store/units/queries.ts
   */
  const { data, isLoading, error, refetch, isRefetching } = useGetAdminDashboardData();

  // Mixed units (available + sold) preview — replace with API data
  const unitsPreview: UnitPreviewItem[] = useMemo(
    () => (data?.units ?? []).map((unit) => ({
        ...unit,
        priceLabel: `₦ ${unit.price.toLocaleString()}`,
      })),
    [data]
  );

  const actions = useMemo(
    () => [
      { key: "add-unit", label: "Add Unit", icon: "add" as const, onPress: () => router.push("/(app)/(admin)/Units/new") },
      { key: "units", label: "View Units", icon: "home-outline" as const, onPress: () => router.push("/(app)/(admin)/Units") },
      { key: "add-project", label: "Add Project", icon: "add-circle-outline" as const, onPress: () => router.push("/(app)/(admin)/Projects/new") },
      { key: "payments", label: "Payments", icon: "card-outline" as const, onPress: () => router.push("/(app)/(admin)/Payments") },
    ],
    [router]
  );

  const recent_payments: PaymentPreviewItem[] = useMemo(
    () => (data?.recent_payments ?? []).map((payment) => ({
        ...payment,
        title: payment.title ?? '',
        subtitle: payment.reason_for_payment ?? '',
        amountLabel: `₦ ${payment.amount.toLocaleString()}`,
      })),
    [data]
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: heightPixel(24), rowGap: heightPixel(18), }}
      alwaysBounceVertical
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Admin overview</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.kpiRow}>
          <Pressable
            style={styles.kpiCard}
            onPress={() => router.push("/(app)/(admin)/Units")}
          >
            <ImageBackground 
              style={{ flex: 1, borderRadius: widthPixel(18) }} 
              imageStyle={{ borderRadius: widthPixel(18) }} 
              source={require('@/assets/images/red_bg.png')} 
              contentFit="cover"
            >
              <View style={{ padding: widthPixel(14), rowGap: heightPixel(8) }}>
                <Text style={styles.kpiLabel}>Total Units</Text>
                <Text style={styles.kpiValue}>{data?.total_units ?? 0}</Text>
                <Text style={styles.kpiSubtext}>All properties</Text>
              </View>
            </ImageBackground>
          </Pressable>

          <Pressable
            style={styles.kpiCard}
            onPress={() => router.push("/(app)/(admin)/Payments")}
          >
            <ImageBackground 
              style={{ flex: 1, borderRadius: widthPixel(18) }} 
              imageStyle={{ borderRadius: widthPixel(18) }} 
              source={require('@/assets/images/purple_bg.png')} 
              contentFit="fill"
            >
              <View style={{ padding: widthPixel(14), rowGap: heightPixel(8) }}>
                <Text style={styles.kpiLabel}>Total Revenue</Text>
                <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>&#x20A6; {data?.total_revenue.toLocaleString() ?? 0}</Text>
                <Text style={styles.kpiSubtext}>Paid amount</Text>
              </View>
            </ImageBackground>
          </Pressable>

          <Pressable
            style={styles.kpiCard}
            onPress={() => router.push("/(app)/(admin)/Projects")}
          >
            <ImageBackground 
              style={{ flex: 1, borderRadius: widthPixel(18) }} 
              imageStyle={{ borderRadius: widthPixel(18) }} 
              source={require('@/assets/images/blue_bg_1.png')} 
              contentFit="cover"
            >
              <View style={{ padding: widthPixel(14), rowGap: heightPixel(8) }}>
                <Text style={styles.kpiLabel}>Active Projects</Text>
                <Text style={styles.kpiValue}>{data?.total_projects ?? 0}</Text>
                <Text style={styles.kpiSubtext}>Ongoing developments</Text>
              </View>
            </ImageBackground>
          </Pressable>

          <Pressable
            style={styles.kpiCard}
            onPress={() => router.push("/(app)/(admin)/Payments")}
          >
            <ImageBackground 
              style={{ flex: 1, borderRadius: widthPixel(18) }} 
              imageStyle={{ borderRadius: widthPixel(18) }} 
              source={require('@/assets/images/green_bg.png')} 
              contentFit="fill"
            >
              <View style={{ padding: widthPixel(14), rowGap: heightPixel(8) }}>
                <Text style={styles.kpiLabel}>Outstanding</Text>
                <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>&#x20A6; {data?.total_outstanding.toLocaleString() ?? 0}</Text>
                <Text style={styles.kpiSubtext}>Pending payments</Text>
              </View>
            </ImageBackground>
          </Pressable>
        </View>
      </ScrollView>

      <QuickActions actions={actions} />

      <UnitsPreview
        units={unitsPreview}
        onViewAll={() => router.push("/(app)/(admin)/Units")}
        onOpenUnit={(id) => router.push(`/(app)/(admin)/Units/${id}`)}
      />

      {/* <View style={styles.activityCard}>
        <Text style={styles.activityTitle}>Recent Activity</Text>
        <Text style={styles.activityText}>
          Hook this up to your payments + projects feed (e.g., latest payments, recently edited units, etc.)
        </Text>
      </View> */}
      <RecentPayments payments={recent_payments} />
    </ScrollView>
  );
};

export default AdminDashboard;