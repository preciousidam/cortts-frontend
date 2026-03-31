import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, useWindowDimensions } from "react-native";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { useResponsive } from "@/hooks/useResponsive";
import { useRouter } from "expo-router";
import { UnitsPreview, UnitPreviewItem } from "./UnitPreview";
import { QuickActions } from "./quickActions";
import { ImageBackground } from "expo-image";
import { useGetAdminDashboardData } from "@/store/dashboard/queries";
import { PaymentPreviewItem, RecentPayments } from "./recentPayments";
import { Ionicons } from "@expo/vector-icons";

const AdminDashboard = () => {
  const { colors, fonts } = useTheme();
  const { widthPixel, heightPixel, fontPixel, isMobile } = useResponsive();
  const router = useRouter();
  const { width } = useWindowDimensions();

    const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background ?? "#F4F6FA",
    },
    header: {
      paddingHorizontal: widthPixel(20),
      paddingTop: heightPixel(24),
      paddingBottom: heightPixel(10),
      rowGap: heightPixel(6),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerText: {
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
    refreshButton: {
      padding: widthPixel(10),
      borderRadius: widthPixel(8),
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.neutral.light,
    },

    kpiRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: widthPixel(12),
      paddingHorizontal: widthPixel(20),
      paddingTop: heightPixel(8),
      paddingBottom: heightPixel(6),
    },
    kpiCard: {
      width: !isMobile ? "24%" : "48%",
      minHeight: heightPixel(100),
    //   backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: widthPixel(18),
    //   padding: widthPixel(14),
      rowGap: heightPixel(8),
      elevation: 1,
      shadowColor: "#aaa",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      cursor: "pointer",
      transition: "all 0.2s ease",
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
  } as any);

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
      contentContainerStyle={{ paddingBottom: heightPixel(24), rowGap: heightPixel(24) }}
    >
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Admin overview</Text>
        </View>
        <Pressable
          style={styles.refreshButton}
          onPress={() => refetch()}
          disabled={isRefetching}
        >
          <Ionicons
            name="refresh"
            size={fontPixel(20)}
            color={colors.text.default}
            style={{
              opacity: isRefetching ? 0.5 : 1,
              transform: [{ rotate: isRefetching ? "180deg" : "0deg" }],
            }}
          />
        </Pressable>
      </View>

      <View style={styles.kpiRow}>
        <Pressable
          style={({ hovered }) => [
            styles.kpiCard,
            hovered && {
              transform: [{ scale: 1.03 }],
              shadowOpacity: 0.2,
            }
          ]}
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
          style={({ hovered }) => [
            styles.kpiCard,
            hovered && {
              transform: [{ scale: 1.03 }],
              shadowOpacity: 0.2,
            }
          ]}
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
              <Text style={styles.kpiValue}>&#x20A6; {data?.total_revenue.toLocaleString() ?? 0}</Text>
              <Text style={styles.kpiSubtext}>Paid amount</Text>
            </View>
          </ImageBackground>
        </Pressable>

        <Pressable
          style={({ hovered }) => [
            styles.kpiCard,
            hovered && {
              transform: [{ scale: 1.03 }],
              shadowOpacity: 0.2,
            }
          ]}
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
          style={({ hovered }) => [
            styles.kpiCard,
            hovered && {
              transform: [{ scale: 1.03 }],
              shadowOpacity: 0.2,
            }
          ]}
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
              <Text style={styles.kpiValue}>&#x20A6; {data?.total_outstanding.toLocaleString() ?? 0}</Text>
              <Text style={styles.kpiSubtext}>Pending payments</Text>
            </View>
          </ImageBackground>
        </Pressable>
      </View>

      <QuickActions actions={actions} />

      <UnitsPreview
        units={unitsPreview}
        onViewAll={() => router.push("/(app)/(admin)/Units")}
        onOpenUnit={(id) => router.push(`/(app)/(admin)/Units/${id}`)}
      />

      <RecentPayments payments={recent_payments} />
    </ScrollView>
  );
};

export default AdminDashboard;
