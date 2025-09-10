import { Button } from '@/components/button';
import { Chart } from '@/components/graph';
import { StatCard } from '@/components/pages/dashboard/coloredCard';
import { PaymentSVG, UnitSVG, UsersSVG } from '@/components/pages/dashboard/svg';
import PopupMenuV1 from '@/components/PopupMenu';
import { Typography } from '@/components/typography';
import { useResponsive } from '@/hooks/useResponsive';
import { useGetAdminDashboardData } from '@/store/dashboard/queries';
import { useRoundness } from '@/styleguide/theme/Border';
import { generateColorScale } from '@/styleguide/theme/Colors';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Dashboard() {
  const styles = useStyles();
  const {colors} = useTheme();
  const { isMobile, widthPixel, heightPixel, fontPixel } = useResponsive();
  const [selectedPeriod, setSelectedPeriod] = useState<string>('last_12_months');
  const { data, isLoading, error } = useGetAdminDashboardData();
  const { navigate } = useRouter();
  const { setOptions } = useNavigation();
  // const { openDrawer, closeDrawer } = useNavigation();

  useEffect(() => {
    setOptions({
      title: 'Dashboard',
      headerShown: isMobile,
      headerRight: () => <PopupMenuV1
        anchor={
          ({ref, onPress}) => <Button
            ref={ref}
            onPress={onPress}
            title={duration(selectedPeriod)}
            variant='tertiary'
            icon="Ionicons.calendar-outline"
            iconOnly
          />
        }
        options={[
          {onPress: () => setSelectedPeriod('last_7_days'), label: 'Last 7 Days'},
          {onPress: () => setSelectedPeriod('last_30_days'), label: 'Last 30 Days'},
          {onPress: () => setSelectedPeriod('last_90_days'), label: 'Last 90 Days'},
          {onPress: () => setSelectedPeriod('last_12_months'), label: 'Last 12 Months'},
        ]}
      />
    });
  }, [isMobile]);

  const duration = (duration: string) => {
    switch (duration) {
      case 'last_7_days':
        return 'Last 7 Days';
      case 'last_30_days':
        return 'Last 30 Days';
      case 'last_90_days':
        return 'Last 90 Days';
      case 'last_12_months':
        return 'Last 12 Months';
      default:
        return duration;
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {!isMobile && <View style={styles.header}>
          <View style={{ rowGap: heightPixel(4), flex: 1 }}>
            <Typography variant='semiBold' size='subtitle'>
              Dashboard
            </Typography>
            <Typography size='body' color={colors.textWeak}>Welcome to Cortts project, here is your progress summary</Typography>
          </View>
          <PopupMenuV1
            anchor={
              ({ref, onPress}) => <Button
                ref={ref}
                onPress={onPress}
                title={duration(selectedPeriod)}
                variant='secondary'
                rightIcon="Ionicons.chevron-down"
              />
            }
            options={[
              {onPress: () => setSelectedPeriod('last_7_days'), label: 'Last 7 Days'},
              {onPress: () => setSelectedPeriod('last_30_days'), label: 'Last 30 Days'},
              {onPress: () => setSelectedPeriod('last_90_days'), label: 'Last 90 Days'},
              {onPress: () => setSelectedPeriod('last_12_months'), label: 'Last 12 Months'},
            ]}
          />
        </View>}
        <View style={styles.revenue}>
          <View style={[styles.revenueCard, { backgroundColor: '#414141'}, isMobile && {width: '100%'}]}>
            <Typography color="#FFFFFF" variant='semiBold' size='caption'>Total Revenue</Typography>
            <Typography color="#FFFFFF" variant='bold' size={isMobile ? 'subtitle' : 'h2'}>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(data?.total_revenue ?? 0)}</Typography>
            <Typography color="#FFFFFF" variant='regular' size='caption'>Number of payments across all units.</Typography>
          </View>
          <View style={[styles.revenueCard, isMobile && {width: '100%'}]}>
            <Typography variant='semiBold' size='caption'>Total Outstanding</Typography>
            <Typography variant='bold' size={isMobile ? 'subtitle' : 'h2'} color={colors.notification}>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(data?.total_outstanding ?? 0)}</Typography>
            <Typography variant='regular' size='caption'>Number of outstanding payments across all units.</Typography>
          </View>
        </View>
        <View style={styles.stats}>
          <StatCard title='Total Projects' value={data?.total_projects ?? 0} icon={<UnitSVG width={widthPixel(21)} height={heightPixel(21)} />} backgroundColor={generateColorScale(colors.primary).lightActive} iconBgColor='#C5E8FF' />
          <StatCard title='Total Units' value={data?.total_units ?? 0} icon={<AntDesign name='home' size={fontPixel(21)} />} backgroundColor={generateColorScale(colors.secondary).lightActive} iconBgColor='#74FFE9' />
          <StatCard title='Total Clients' value={data?.total_users ?? 0} icon={<UsersSVG width={widthPixel(21)} height={heightPixel(21)} />} backgroundColor={generateColorScale(colors.notification).lightActive} iconBgColor='#FFBBA9' />
          <StatCard title='Payment Logged' value={data?.total_payments ?? 0} icon={<PaymentSVG width={widthPixel(21)} height={heightPixel(21)} />} backgroundColor={generateColorScale(colors.warning).lightActive} iconBgColor='#FCFC98' />
        </View>
        <View style={styles.graphArea}>
          <Typography variant='semiBold' size='caption'>Overall Activities</Typography>
          {(data?.monthly_revenue?.length ?? 0) > 0 && <Chart
            data={data?.monthly_revenue ?? []}
            xKey="month"
            yKeys={["amount"]}
            variant="bar"
            yFormat={(value: number) => {
              const val = value / 1000000;
              if (val < 1000) {
                return `${val}Mil`;
              } else if (val >= 1000) {
                return `${val}Bil`;
              } else if (val < 1) {
                return `${val}K`;
              }
              return value.toString();
            }}
          />}
        </View>
      </View>
    </ScrollView>
  );
}

export const useStyles = () => {
  const { isMobile, widthPixel, heightPixel, fontPixel } = useResponsive();
  const roundness = useRoundness();
  const { colors, shadow } = useTheme();

  return useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: heightPixel(32),
      paddingHorizontal: widthPixel(isMobile ? 16 : 32),
      rowGap: heightPixel(24),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      rowGap: heightPixel(24),
      flexWrap: 'wrap',
      // columnGap: widthPixel(24),
    },
    revenue: {
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      columnGap: heightPixel(24),
      rowGap: heightPixel(16),
    },
    revenueCard: {
      flex: 1,
      padding: widthPixel(24),
      ...roundness.m,
      borderColor: '#E5E5E5',
      rowGap: heightPixel(24),
      ...shadow(heightPixel(0), widthPixel(1)),
      backgroundColor: colors.card,
    },
    graphArea: {
      padding: widthPixel(20),
      paddingVertical: heightPixel(20),
      ...roundness.m,
      rowGap: heightPixel(24),
      backgroundColor: colors.card,
      ...shadow(heightPixel(0), widthPixel(1)),
      borderColor: '#E5E5E5',
      position: 'relative'
    },
  }), [widthPixel, heightPixel, fontPixel, isMobile]);
}
