import { ColoredPill } from "@/components/Pill";
import PopupMenuV1 from "@/components/PopupMenu";
import Table from "@/components/Table";
import { useResponsive } from "@/hooks/useResponsive";
import { useGetAllPayments } from "@/store/payment/queries";
import { Payment } from "@/types/models";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";

export const Payments: React.FC = () => {
  const { widthPixel, heightPixel} = useResponsive();
  const { payments } = useGetAllPayments();
  const columnHelper = createColumnHelper<Payment>();
  const columns = useMemo(() => [
    columnHelper.accessor("unit", {
      header: "Unit",
      cell: info => info.getValue().name,
      meta: { width: widthPixel(157), type: 'string' }
    }),
    columnHelper.accessor("reason_for_payment", {
      header: "Payment Reason",
      cell: info => info.getValue() ?? '---',
      meta: { width: widthPixel(182), type: 'string' }
    }),
    columnHelper.accessor("amount", {
      header: "Amount Paid",
      cell: info => Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(info.getValue()),
      meta: { width: widthPixel(226), type: 'number' }
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: info => <ColoredPill title={info.getValue()} color={info.getValue() === 'paid' ? 'green' : info.getValue() === 'not_paid' ? 'gray' : 'red'} />,
      meta: { width: widthPixel(196), type: 'string' }
    }),
    columnHelper.accessor("due_date", {
      header: "Due Date",
      cell: info => info.getValue() ? format(info.getValue(), 'MMM dd, yyyy') : '---',
      meta: { width: widthPixel(132), type: 'date' }
    }),
    columnHelper.display({
      header: "Actions",
      id: 'actions',
      cell: info => <PopupMenuV1
        style={{ alignSelf: 'flex-end' }}
        options={[
          {
            label: 'View Receipt',
            onPress: () => console.log('View Receipt', info.row.original.id),
            disabled: info.row.original.status !== 'paid'
          },
          {
            label: 'Update status',
            onPress: () => console.log('Update status', info.row.original.id),
          },
        ]}
      />,
      meta: { width: widthPixel(100), align: 'flex-end' }
    }),
  ], [widthPixel, payments])

  return (
    <View style={{ flex: 1, paddingHorizontal: widthPixel(32), paddingVertical: heightPixel(32) }}>
      <ScrollView>
        <Table
          data={payments ?? []}
          columns={columns}
        />
      </ScrollView>
    </View>
  );
};

export default Payments;