import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useResponsive } from "@/hooks/useResponsive";
import { useTheme } from "@/styleguide/theme/ThemeContext";

export type PaymentPreviewItem = {
  id: string;
  title: string;        // e.g. "Terrace B4 • Coral Estate" OR "John Doe"
  subtitle?: string;    // e.g. "INV-1023 • 2 hours ago"
  amountLabel: string;  // e.g. "₦ 5,000,000"
  status: 'paid';
};

export const RecentPayments: React.FC<{
  payments: PaymentPreviewItem[];
  onViewAll?: () => void;
  onOpenPayment?: (id: string) => void;
}> = ({ payments, onViewAll, onOpenPayment }) => {
  const { colors, fonts } = useTheme();
  const { widthPixel, heightPixel, fontPixel } = useResponsive();

  const styles = StyleSheet.create({
    card: {
      marginHorizontal: widthPixel(20),
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: widthPixel(18),
      padding: widthPixel(14),
      rowGap: heightPixel(12),
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      ...fonts?.bold,
      fontSize: fontPixel(15),
      color: colors.text.default,
    },
    viewAll: {
      ...fonts?.semiBold,
      fontSize: fontPixel(13),
      color: colors.primary,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: heightPixel(10),
      borderTopWidth: 1,
      borderTopColor: colors.border,
      columnGap: widthPixel(12),
    },
    left: { flex: 1, rowGap: heightPixel(4) },
    title: {
      ...fonts?.bold,
      fontSize: fontPixel(13),
      color: colors.text.default,
    },
    subtitle: {
      ...fonts?.medium,
      fontSize: fontPixel(12),
      color: colors.text.weak
    },

    right: { alignItems: "flex-end", rowGap: heightPixel(6) },
    amount: {
      ...fonts?.bold,
      fontSize: fontPixel(13),
      color: colors.text.default,
    },

    pill: {
      paddingHorizontal: widthPixel(10),
      paddingVertical: heightPixel(5),
      borderRadius: widthPixel(999),
      flexDirection: "row",
      alignItems: "center",
      columnGap: widthPixel(6),
    },
    pillPaid: { backgroundColor: colors.successful.normal },
    pillPending: { backgroundColor: "#FFF4E5" },
    pillFailed: { backgroundColor: "#FCE8E7" },
    pillText: {
      ...fonts?.bold,
      fontSize: fontPixel(11),
      color: "#ffffff",
    },

    empty: {
      paddingVertical: heightPixel(14),
      rowGap: heightPixel(6),
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    emptyText: {
      ...fonts?.semiBold,
      fontSize: fontPixel(13),
      color: colors.text.weak,
    },
  });

  const statusLabel = (s: PaymentPreviewItem["status"]) =>
    s === "paid" ? "Paid" : s === "pending" ? "Pending" : "Failed";

  const statusStyle = (s: PaymentPreviewItem["status"]) =>
    s === "paid" ? styles.pillPaid : s === "pending" ? styles.pillPending : styles.pillFailed;

  const statusIcon = (s: PaymentPreviewItem["status"]) =>
    s === "paid" ? "checkmark-circle" : s === "pending" ? "time" : "close-circle";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Recent Payments</Text>
        {!!onViewAll && (
          <Pressable onPress={onViewAll}>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        )}
      </View>

      {payments.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="card-outline" size={fontPixel(22)} color={colors.text.weak} />
          <Text style={styles.emptyText}>No payments yet</Text>
        </View>
      ) : (
        payments.slice(0, 4).map((p, idx) => (
          <Pressable
            key={p.id + idx}
            style={styles.row}
            onPress={() => onOpenPayment?.(p.id)}
          >
            <View style={styles.left}>
              <Text style={styles.title} numberOfLines={1}>
                {p.title}
              </Text>
              {!!p.subtitle && (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {p.subtitle}
                </Text>
              )}
            </View>

            <View style={styles.right}>
              <Text style={styles.amount}>{p.amountLabel}</Text>
              <View style={[styles.pill, statusStyle(p.status)]}>
                <Ionicons name={statusIcon(p.status) as any} size={fontPixel(16)} color="#ffffff" />
                <Text style={styles.pillText}>{statusLabel(p.status)}</Text>
              </View>
            </View>
          </Pressable>
        ))
      )}
    </View>
  );
};