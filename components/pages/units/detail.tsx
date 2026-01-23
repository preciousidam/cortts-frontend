import { useResponsive } from '@/hooks/useResponsive';
import { useRoundness } from '@/styleguide/theme/Border';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { Bar } from 'react-native-progress';
import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import { DropdownOption } from '@/components/input/dropdown/dropdownStyles';
import { Breadcrumb } from '@/components/breadcrumb';
import { Typography } from '@/components/typography';
import { ColoredPill, ColorIndicator } from '@/components/Pill';
import { capitalize } from 'lodash';
import { ColumnDef } from '@/components/Table/logic';
import { Document, DocumentKind, Payment, PaymentDuration, Unit } from '@/types/models';
import { useTableStyles } from '@/components/Table/style';
import { useGetUnitDocumentsQuery, useGetUnitPaymentsQuery, useGetUnitQuery } from '@/store/units/queries';
import { CustomTab } from '@/components/tab';
import { Route } from 'react-native-tab-view';
import PopupMenuV1 from '@/components/PopupMenu';
import { Ionicons } from '@expo/vector-icons';
import { useGetProjectQuery } from '@/store/projects/queries';
import { Button } from '@/components/button';
import { Divider } from '@/components/divider';
import { Image } from 'expo-image';
import Table from '@/components/Table';
import { format } from 'date-fns';
import { openURL } from 'expo-linking';
import FilePicker from '@/components/fileUpload/file';
import { FormTextInput } from '@/components/input';
import { useUnitLogic } from './logic';
import { downloadFile } from '@/utilities/download';
import { withRole } from '@/libs/route';
import { BaseDropdown } from '@/components/input/dropdown/dropdown';

const purpose: DropdownOption<string>[] = [
  { label: "Detached", value: "Detached" },
  { label: "Semi Detached", value: "Semi-Detached" },
  { label: "Terraced", value: "Terraced" },
  { label: "End Of Terrace", value: "End-of-Terrace" },
  { label: "Bungalow", value: "Bungalow" },
  { label: "Maisonette", value: "Maisonette" },
  { label: "Flat", value: "Flat" },
  { label: "Duplex", value: "Duplex" },
  { label: "Triplex", value: "Triplex" },
  { label: "Penthouse", value: "Penthouse" },
  { label: "Studio", value: "Studio" },
  { label: "Cottage", value: "Cottage" },
  { label: "Villa", value: "Villa" },
  { label: "Townhouse", value: "Townhouse" },
  { label: "Chalet", value: "Chalet" }
].sort((a, b) => a.label.localeCompare(b.label))

const UnitDetail: React.FC = () => {
  const {unit_id} = useLocalSearchParams<{unit_id: string}>();
  const styles = useStyles();
  const { bodyText } = useTableStyles();
  const { widthPixel, heightPixel, isMobile } = useResponsive();
  const { colors } = useTheme();
  const {fontPixel} = useResponsive();
  const { back, push } = useRouter();
  const {unit, isLoading} = useGetUnitQuery(unit_id);
  const { project} = useGetProjectQuery(unit?.project_id ?? '');
  const { payments, isLoading: isLoadingPayments } = useGetUnitPaymentsQuery(unit_id);
  const { documents, isLoading: isLoadingDocuments } = useGetUnitDocumentsQuery(unit_id);
  const { setOptions } = useNavigation();
    useEffect(() => {
      setOptions({
        title: isMobile ? unit?.name : '',
        headerRight: () => <View><PopupMenuV1
          inHeader
          anchor={props => <Button iconOnly icon="Ionicons.ellipsis-vertical" {...props} variant='tertiary' size='medium' />}
            options={[
              { label: 'Upload New Template', onPress: () => setShowDocumentUpload(true) },
              { label: "Upload Signed Document", onPress: () => setShowSignedDocumentUpload(true) },
              { label: 'Edit unit', onPress: () => onSelect('edit') },
              { label: 'Delete', onPress: () => onSelect('delete'), destructive: true }
            ]}
          /></View>
      });
    }, [isMobile, unit]);
  const {
    templateControl,
    setTemplateValue,
    isLoading: isMutating,
    onCreateTemplate,
    showDocumentUpload,
    setShowDocumentUpload,
    showSignedDocumentUpload,
    setShowSignedDocumentUpload,
    setShowAssignClientForm,
    showAssignClientForm,
    loadMoreUsers,
    setClientId,
    clientId,
    assignClient,
    setAgentId,
    agentId,
    showAssignAgentForm,
    setShowAssignAgentForm,
    assignAgent
  } = useUnitLogic();
  const placeHolder = "eUIW_,0gxURjobyGxBM|W.ae20$eNaWpn%WCX9xZf7oJOEoNt7s.ay"

  const onViewPaymentReceipt = useCallback((paymentId: string) => {
    push(`./payments/${paymentId}/receipt`, { relativeToDirectory: true });
  }, [push]);

  const columns: ColumnDef<Payment>[] =  useMemo(() => [
    {
      header: 'Status',
      accessorKey: 'status',
      meta: { width: widthPixel(142) },
      cell: props => <ColoredPill title={capitalize(props.cell.getValue() as string).replace(/_/g, ' ')} color={(props.cell.getValue() as string) == 'paid' ? 'green' : (props.cell.getValue() as string) == 'not_paid' ? 'yellow' : 'red'} />
    },
    {
      header: 'Reason for Payment',
      accessorKey: 'reason_for_payment',
      meta: { width: widthPixel(291) },
      cell: props => <Typography style={bodyText}>{props.cell.getValue() ? capitalize(props.cell.getValue() as string) : 'N/A'}</Typography>
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      meta: { width: widthPixel(213) },
      cell: (props) => {
        return <Typography style={bodyText}>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(props.cell.getValue() as number)}</Typography>;
      }
    },
    {
      header: 'Due Date',
      accessorKey: 'due_date',
      meta: { width: widthPixel(200) },
      cell: (props) => {
        return <Typography style={bodyText}>{props.cell.getValue() ? format(new Date(props.cell.getValue() as string), 'MMM dd, yyyy') : 'N/A'}</Typography>;
      }
    },
    {
      header: 'Payment Date',
      accessorKey: 'payment_date',
      meta: { width: widthPixel(147) },
      cell: (props) => {
        return <Typography style={bodyText}>{props.cell.getValue() ? format(new Date(props.cell.getValue() as string), 'MMM dd, yyyy') : 'N/A'}</Typography>;
      }
    },
    {
      header: 'Actions',
      meta: { width: widthPixel(119), align: 'flex-end' },
      cell: (props) => {
        return (
          <PopupMenuV1
            style={{ alignSelf: 'flex-end' }}
            options={[
              { label: 'View Receipt', onPress: () => onViewPaymentReceipt(props.row.original?.id), disabled: true },
              { label: 'Delete Payment', onPress: () => {}, destructive: true, disabled: true }
            ]}
          />
        );
      }
    }
  ], [widthPixel]);

  const columnsDocuments: ColumnDef<Document>[] = useMemo(() => [
    {
      header: 'Document Name',
      accessorKey: 'name',
      meta: { width: widthPixel(250) },
      cell: (props) => {
        return <Typography style={bodyText}>{capitalize(props.cell.getValue() as string)}</Typography>;
      }
    },
    {
      header: 'Document Type',
      accessorKey: 'kind',
      meta: { width: widthPixel(250) },
      cell: (props) => {
        return <Typography style={bodyText}>{capitalize(props.cell.getValue() as string)}</Typography>;
      }
    },
    {
      header: 'Link to Document',
      accessorKey: 'media_file.file_path',
      meta: { width: widthPixel(250) },
      cell: (props) => {
        return <Typography style={[bodyText, {color: colors.brand.blue}]} numberOfLines={1} ellipsizeMode='head' onPress={() => downloadFile(`/upload/media/download/${props.cell.row.original?.media_file?.id}`, props.cell.row?.original?.media_file?.file_name ?? 'document')}>{(props.cell.getValue() as string).split('/').pop() ?? 'N/A'}</Typography>;
      }
    },
    {
      header: 'Actions',
      meta: { width: widthPixel(250), align: 'flex-end' },
      cell: (props) => {
        return (
          <PopupMenuV1
            options={[
              { label: 'View Document', onPress: () => openURL(props.cell.row.original?.media_file?.file_path ?? '')},
              { label: 'Download Document', onPress: () => downloadFile(`/upload/media/download/${props.cell.row.original?.media_file?.id}`, props.cell.row?.original?.media_file?.file_name ?? 'document') },
              { label: 'Delete Document', onPress: () => {}, destructive: true, disabled: true }
            ]}
            style={{ alignSelf: 'flex-end' }}
          />
        );
      }
    }
  ], [widthPixel, isMobile]);

  const onSelect = (option: 'edit' | 'delete') => {
    if (option == 'edit') {
      push('./edit', { relativeToDirectory: true })
    }
  }

  const renderScene = useCallback(({ route }: { route: Route }) => {
    switch (route.key) {
      case 'payments':
        return (
          <Table<Payment>
            columns={columns}
            data={payments}
            filter={{ field: 'reason_for_payment', options: purpose, multiple: false }}
            onRowSelected={(row) => push(`./payments/${row.id}`, { relativeToDirectory: true })}
            loading={isLoadingPayments}
            emptyStateText="No payment history available for this unit."
            loadingComponent={<Typography>Loading payment history...</Typography>}
            style={{ paddingVertical: heightPixel(32) }}
            rowCount={5}
            renderRow={isMobile ? (row) => <MobilePayment row={row} /> : undefined}
          />
        );
      case 'documents':
        return (
          <Table<Document>
            columns={columnsDocuments}
            data={documents}
            filter={{ field: 'kind', options: purpose, multiple: false }}
            // onRowSelected={(row) => push(`./payments/${row.id}`, { relativeToDirectory: true })}
            loading={isLoadingDocuments}
            emptyStateText="No document history available for this unit."
            loadingComponent={<Typography>Loading document history...</Typography>}
            style={{ paddingVertical: heightPixel(32) }}
            rowCount={5}
            renderRow={isMobile ? (row) => <MobileDocument row={row} /> : undefined}
          />
        );
      default:
        return null;
    }
  }, [isLoading, push, columns, heightPixel]);

  const duration = (d: Unit['payment_duration']) => {
    switch (d) {
      case 'monthly':
        return 'month';
      case 'quarterly':
        return 'quarter';
      case 'bi_annually':
        return '6 months';
      case 'annually':
        return 'year';
      default:
        return '';
    }
  }

  const openPhone = (phone?: string) => {
    // Logic to open phone dialer with the given phone number
    if (phone) {
      openURL(`tel:${phone}`);
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.row}>
          <Breadcrumb />
          {!isMobile && <PopupMenuV1
            options={[
              { label: 'Upload New Template', onPress: () => setShowDocumentUpload(true) },
              { label: "Upload Signed Document", onPress: () => setShowSignedDocumentUpload(true) },
              { label: 'Edit unit', onPress: () => onSelect('edit') },
              { label: 'Delete', onPress: () => onSelect('delete'), destructive: true }
            ]}
          />}
        </View>
        <View style={[{flexDirection: 'row', columnGap: widthPixel(24), rowGap: heightPixel(24) }, isMobile && { flexDirection: 'column-reverse' }]}>
          <View style={[{ width: isMobile ? '100%' : widthPixel(551), rowGap: heightPixel(16) }, isMobile && { paddingHorizontal: widthPixel(16) }]}>
            {/* details */}
            <View style={[styles.formArea, styles.row, {alignItems: 'flex-start'}]}>
              <View style={{ rowGap: heightPixel(12) }}>
                <Typography variant='bold' size='subtitle'>{unit?.name}</Typography>
                <View style={styles.smallGap}>
                  <Typography color={colors.text.weak}>{capitalize(unit?.type)}</Typography>
                  <ColorIndicator color='gray' />
                  <Typography color={colors.text.weak}><Ionicons name="location-outline" color={colors.warning.normal} size={fontPixel(14)} /> {project?.address}</Typography>
                </View>
              </View>
              <View>
                <ColoredPill title={capitalize(unit?.development_status?.split('_').join(' '))} color={unit?.development_status === 'completed' ? 'green' : unit?.development_status === 'in_progress' ? 'blue' : 'gray'} />
                {unit?.warranty?.isValid && <Typography>{(unit?.warranty_period ?? 0) / 12} years</Typography>}
              </View>
            </View>
            <View style={[{ rowGap: heightPixel(16) }, isMobile && { flexDirection: 'column-reverse' }]}>
              <View style={[styles.formArea, ]}>
                <View style={styles.row}>
                  <View style={styles.gapBetween}>
                    <Typography size='caption' color={colors.neutral.normal}>Client</Typography>
                    <Typography variant='semiBold'>{unit?.client ? unit?.client?.fullname : "No client assigned"}</Typography>
                  </View>
                  {!unit?.client ? <Button onPress={() => setShowAssignClientForm(true)} variant='outlined' size='large' rightIcon="Ionicons.add-outline">Assign Client</Button> : <View style={styles.smallGap}>
                    <Button iconOnly icon="SimpleLineIcons.refresh" variant='tertiary' onPress={() => setShowAssignClientForm(true)} />
                    <Button iconOnly icon="Feather.phone" variant='tertiary' onPress={() => openPhone(unit?.client?.phone)} />
                  </View>}
                </View>
                <Divider />
                <View style={{ rowGap: heightPixel(8) }}>
                  <View style={styles.row}>
                    <View style={styles.gapBetween}>
                      <Typography size='caption' color={colors.neutral.normal}>Assigned Agents</Typography>
                      <Typography variant='semiBold'>{unit?.unit_agents?.[0]?.agent?.fullname ?? "No assigned agent"}</Typography>
                    </View>
                    {!unit?.client ? <Button onPress={() => setShowAssignAgentForm(true)} variant='outlined' size='large' rightIcon="Ionicons.add-outline">Assign Agent</Button> : <View style={styles.smallGap}>
                      <Button iconOnly icon="SimpleLineIcons.refresh" variant='tertiary' onPress={() => setShowAssignAgentForm(true)} />
                      <Button iconOnly icon="Feather.phone" variant='tertiary' onPress={() => openPhone(unit?.unit_agents?.[0]?.agent?.phone)} />
                    </View>}
                  </View>
                  {(unit?.unit_agents?.length ?? 0) > 1 && <Button title="See All Agents" variant='tertiary' size='small' />}
                </View>
              </View>
              <View style={[styles.formArea, {paddingBottom: heightPixel(56)}]}>
                <View style={[styles.row, {justifyContent: 'space-between', alignItems: 'flex-start'}]}>
                  <View style={styles.gapBetween}>
                    <Typography size='caption' color={colors.neutral.normal}>Unit Price</Typography>
                    <View style={styles.amountDiscount}>
                      <Typography variant='semiBold' size='subtitle' style={styles.amount}>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(unit?.payment_summary?.total ?? 0)}</Typography>
                      <ColoredPill showIndicator={false} title={`-${unit?.discount}%`} color='blue' />
                    </View>
                    <Typography size='caption' color={colors.neutral.normal} style={{ textDecorationLine: 'line-through' }}>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(unit?.amount ?? 0)}</Typography>
                  </View>
                  <View style={[styles.alignLeft, styles.gapBetween]}>
                    <Typography size='caption' color={colors.neutral.normal}>Outstanding Balance</Typography>
                    <Typography variant='regular' size='body' color={colors.error.normal} style={styles.outstanding}>-{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(unit?.payment_summary?.outstanding ?? 0)}</Typography>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.gapBetween}>
                    <Typography size='caption' color={colors.neutral.normal}>Installment Amount</Typography>
                    <Typography variant='medium' size='body'>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(unit?.payment_summary?.installment_amount ?? 0)} / {duration(unit?.payment_duration  ?? PaymentDuration.MONTHLY)} x {unit?.installment ?? 0}</Typography>
                  </View>
                  <View style={[styles.alignLeft, styles.gapBetween]}>
                    <Typography size='caption' color={colors.neutral.normal}>Initial Payment</Typography>
                    <Typography variant='medium' size='body'>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(unit?.expected_initial_payment ?? 0)}</Typography>
                  </View>
                </View>
                <Divider />
                <View style={{ rowGap: heightPixel(12) }}>
                  <View style={styles.row}>
                    <Typography color={colors.neutral.normal}>Payment Progress</Typography>
                    <Typography color={colors.neutral.normal}>{unit?.payment_summary?.percentage_paid}% completed</Typography>
                  </View>
                  <Bar progress={(unit?.payment_summary?.percentage_paid ?? 0) / 100} width={widthPixel(isMobile ? 326 : 500)} color={colors.brand.blue} borderWidth={0} unfilledColor='#F4F4F4' />
                </View>
              </View>
            </View>
          </View>
          <View style={{ rowGap: heightPixel(12)}}>
            {/* image */}
            <Image source={unit?.images?.[0]} style={styles.largeImage} contentFit='cover' placeholderContentFit='cover' placeholder={{blurhash: placeHolder}} />
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[{ flexDirection: 'row', columnGap: widthPixel(8) }, isMobile && { paddingHorizontal: widthPixel(16) }]}>
                {unit?.images?.slice(1, 5).map((image, index) => (
                  <Image key={index} source={{ uri: image }} style={styles.image} contentFit='cover' placeholderContentFit='cover' placeholder={{blurhash: placeHolder}} />
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
        <View style={[{flex: 1}, isMobile && { paddingHorizontal: widthPixel(16) }]}>
          <CustomTab
            initialIndex={0}
            routes={[
              { key: 'payments', title: 'Payment History' },
              { key: 'documents', title: 'Documents' }
            ]}
            renderScene={renderScene}
          />
        </View>
        <Modal
          visible={showDocumentUpload}
          onRequestClose={() => setShowDocumentUpload(false)}
          transparent={true}
          animationType="fade"
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={[styles.formArea, styles.uploadContainer]}>
              <View style={styles.row}>
                <Typography style={styles.cardValue} variant='semiBold' size='subtitle'>Upload Template</Typography>
                <Button iconOnly icon="Ionicons.close" title="Close" onPress={() => setShowDocumentUpload(false)} variant='tertiary' size='medium' />
              </View>
              <FormTextInput
                label="Template Name"
                control={templateControl}
                name="name"
                inputProps={{ placeholder: 'Enter template name' }}
              />
              <FilePicker onSelect={(file) => setTemplateValue('file', file)} />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', columnGap: widthPixel(12)}}>
                <Button title="Cancel" disabled={isMutating} onPress={() => setShowDocumentUpload(false)} variant="outlined" />
                <Button title="Upload" disabled={isMutating} isLoading={isMutating} onPress={onCreateTemplate} />
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={showSignedDocumentUpload}
          onRequestClose={() => setShowSignedDocumentUpload(false)}
          transparent={true}
          animationType="fade"
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={[styles.formArea, styles.uploadContainer]}>
              <View style={styles.row}>
                <Typography style={styles.cardValue} variant='semiBold' size='subtitle'>Upload Signed Document</Typography>
                <Button iconOnly icon="Ionicons.close" title="Close" onPress={() => setShowSignedDocumentUpload(false)} variant='tertiary' size='medium' />
              </View>
              <FormTextInput
                label="Document Name"
                control={templateControl}
                name="name"
                inputProps={{ placeholder: 'Enter document name' }}
              />
              <FilePicker onSelect={(file) => setTemplateValue('file', file)} />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', columnGap: widthPixel(12)}}>
                <Button title="Cancel" disabled={isMutating} onPress={() => setShowDocumentUpload(false)} variant="outlined" />
                <Button title="Upload" disabled={isMutating} isLoading={isMutating} onPress={onCreateTemplate} />
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={showAssignClientForm}
          onRequestClose={() => setShowAssignClientForm(false)}
          transparent={true}
          animationType="fade"
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={[styles.formArea, styles.uploadContainer]}>
              <View style={styles.row}>
                <Typography style={styles.cardValue} variant='semiBold' size='subtitle'>Assign a Client</Typography>
                <Button iconOnly icon="Ionicons.close" title="Close" onPress={() => setShowAssignClientForm(false)} variant='tertiary' size='medium' />
              </View>
              <BaseDropdown<string | null>
                label="Select Client"
                asyncOptions={loadMoreUsers}
                placeholder="Choose a client"
                isSearchable
                style={{ width: '100%'}}
                selectedValue={clientId}
                onSelect={setClientId}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', columnGap: widthPixel(12)}}>
                <Button title="Cancel" disabled={isMutating} onPress={() => setShowAssignClientForm(false)} variant="outlined" />
                <Button title="Assign Client" disabled={isMutating} isLoading={isMutating} onPress={assignClient} />
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={showAssignAgentForm}
          onRequestClose={() => setShowAssignAgentForm(false)}
          transparent={true}
          animationType="fade"
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={[styles.formArea, styles.uploadContainer]}>
              <View style={styles.row}>
                <Typography style={styles.cardValue} variant='semiBold' size='subtitle'>Assign an Agent</Typography>
                <Button iconOnly icon="Ionicons.close" title="Close" onPress={() => setShowAssignAgentForm(false)} variant='tertiary' size='medium' />
              </View>
              <BaseDropdown<string | null>
                label="Select Agent"
                asyncOptions={(q, skip) => loadMoreUsers(q, skip, 'agent')}
                placeholder="Choose an agent"
                isSearchable
                style={{ width: '100%'}}
                selectedValue={agentId}
                onSelect={setAgentId}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', columnGap: widthPixel(12)}}>
                <Button title="Cancel" disabled={isMutating} onPress={() => setShowAssignAgentForm(false)} variant="outlined" />
                <Button title="Assign Agent" disabled={isMutating} isLoading={isMutating} onPress={assignAgent} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const MobilePayment: React.FC<{ row: Payment }> = ({ row }) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { heightPixel } = useResponsive();
  return (
    <Pressable style={styles.mobileView}>
      <Typography variant='bold'>{row.reason_for_payment ?? 'Payment'}</Typography>
      <View style={{ rowGap: heightPixel(4) }}>
        <Typography color={colors.text.weaker}>{Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(row.amount)}</Typography>
        <ColoredPill title={capitalize(row.status ?? '').replace(/_/g, ' ')} color={row.status == 'paid' ? 'green' : row.status == 'not_paid' ? 'yellow' : 'red'} />
      </View>
    </Pressable>
  );
};

const MobileDocument: React.FC<{ row: Document }> = ({ row }) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { heightPixel } = useResponsive();
  return (
    <Pressable style={styles.mobileView}>
      <Typography variant='bold'>{row.name ?? 'Document'}</Typography>
      <View style={{ rowGap: heightPixel(8) }}>
        {/* <Typography color={colors.text.weaker}>{row.}</Typography> */}
        <ColoredPill title={capitalize(row.kind ?? '').replace(/_/g, ' ')} color={row.kind == DocumentKind.TEMPLATE ? 'yellow' : 'green'} />
      </View>
    </Pressable>
  );
}


const useStyles = () => {
  const { fontPixel, widthPixel, heightPixel, isMobile, width } = useResponsive();
  const { colors, shadow } = useTheme();
  const { m, large, circle } = useRoundness();

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: widthPixel(isMobile ? 0 :32),
      paddingVertical: heightPixel(isMobile ? 0 : 32),
      rowGap: heightPixel(isMobile ? 0 : 24),
    },
    formArea: {
      rowGap: heightPixel(32),
      backgroundColor: colors.card,
      paddingHorizontal: widthPixel(24),
      paddingVertical: heightPixel(24),
      ...large,
      borderColor:  colors.neutral.lightHover,
      ...shadow(heightPixel(2), widthPixel(8))
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: widthPixel(12),
    },
    header: {
      rowGap: heightPixel(8),
      flex: 1,
    },
    ctaView: {
      columnGap: widthPixel(24),
      flexDirection: 'row',
      alignItems: 'center'
    },
    smallGap: {
      columnGap: widthPixel(12),
      flexDirection: 'row',
      alignItems: 'center',
    },
    blue: {
      color: colors.brand.blue
    },
    input: {
      flex: 1,
    },
    cancel: {
      width: widthPixel(151)
    },
    card: {
      backgroundColor: colors.card,
      paddingHorizontal: widthPixel(12),
      paddingVertical: heightPixel(16),
      ...m,
      borderColor: colors.neutral.lightActive,
      ...shadow(heightPixel(1), m.borderRadius),
      rowGap: heightPixel(4),
      flex: 1,
    },
    cardValue: {
      fontSize: fontPixel(20),
      color: colors.text.default,
    },
    largeImage: {
      width: isMobile ? width : widthPixel(529),
      height: widthPixel(437.85),
      ...m
    },
    image: {
      width: widthPixel(126.25),
      height: widthPixel(105),
      ...m
    },
    amount: {
      fontSize: fontPixel(20),
    },
    outstanding: {
      fontSize: fontPixel(16),
    },
    alignLeft: {
      alignItems: 'flex-end',
    },
    gapBetween: {
      rowGap: heightPixel(8),
      flex: 1,
    },
    amountDiscount: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: widthPixel(8),
      flexWrap: 'wrap'
    },
    uploadContainer: {
      width: isMobile ? width - widthPixel(32) : widthPixel(608),
    },
    mobileView: {
      paddingHorizontal: widthPixel(16),
      paddingVertical: heightPixel(20),
      borderBottomColor: '#F2F2F2',
      borderBottomWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }
  });
};

export default withRole(UnitDetail);