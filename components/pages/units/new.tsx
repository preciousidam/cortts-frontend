import { Button } from '@/components/button';
import { BaseCurrencyInput, FormCurrencyInput, FormTextInput } from '@/components/input';
import { FormDropdown } from '@/components/input/dropdown/form';
import { Typography } from '@/components/typography';
import { useResponsive } from '@/hooks/useResponsive';
import { useRoundness } from '@/styleguide/theme/Border';
import { generateColorScale } from '@/styleguide/theme/Colors';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useUnitLogic } from './logic';
import { Breadcrumb } from '@/components/breadcrumb';
import { FormRadioButton } from '@/components/input/radio';
import { useGetProjectsQueries } from '@/store/projects/queries';
import ImagePicker from '@/components/fileUpload/image';

const propertyTypes = [
  { value: 'detached', label: 'Detached' },
  { value: 'semi_detached', label: 'Semi Detached' },
  { value: 'terraced', label: 'Terraced' },
  { value: 'end_of_terrace', label: 'End Of Terrace' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'maisonette', label: 'Maisonette' },
  { value: 'flat', label: 'Flat' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'triplex', label: 'Triplex' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'studio', label: 'Studio' },
  { value: 'cottage', label: 'Cottage' },
  { value: 'villa', label: 'Villa' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'chalet', label: 'Chalet' },
].sort((a, b) => a.label.localeCompare(b.label))

const dev_status_list = [
  { value: 'in_progress', label: 'In Development' },
  { value: 'completed', label: 'Completed' },
  { value: 'not_started', label: 'Not Started' },
].sort((a, b) => a.label.localeCompare(b.label))

const duration = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'bi_annually', label: 'Biannually' },
  { value: 'annually', label: 'Annually' },
]

const NewUnit: React.FC = () => {
  const styles = useStyles();
  const { back } = useRouter();
  const {control, onSubmit, isLoading, watch, installment_amount, total_amount, handleImageUpload } = useUnitLogic();
  const { projects, count, isLoading: isLoadingProjects } = useGetProjectsQueries();

  return (
    <ScrollView>
      <View style={styles.container}>
        <Breadcrumb />
        <View>
          <Typography variant="semiBold" size="subtitle">Add Unit</Typography>
          <Typography size="body">Fill in the essential details to create a new unit.</Typography>
        </View>
        <View style={styles.formArea}>
          <View style={styles.sectionHeader}>
            <Typography variant="semiBold" size="body" style={styles.header}>Unit Information</Typography>
          </View>
          <View style={styles.padded}>
            <View style={styles.formRow}>
              <FormTextInput control={control} rules={{ required: true }} style={styles.input} name="name" label="Unit Name" inputProps={{ placeholder: "Enter unit name" }} />
              <FormDropdown label='Link to a Project' style={styles.input} inputProps={{ options: projects.map(({ id, name }) => ({ value: id, label: name })), placeholder: "Select project", label: "Link to Project", icon_position: 'right' }} name="project_id" control={control} rules={{ required: true }} />
            </View>
            <View style={styles.formRow}>
              <FormCurrencyInput control={control} rules={{ required: true, }} style={styles.input} name="amount" label="Amount" inputProps={{ placeholder: "Enter amount" }} />
              <FormTextInput control={control} style={styles.input} name="discount" label="Discount (%)" inputProps={{ placeholder: "Enter discount (e.g. 10)" }} info='This is assumed to be a percentage of the total amount.' />
            </View>
            <View style={styles.formRow}>
              <FormDropdown rules={{ required: true }} control={control} style={styles.input} name="type" label="Type" inputProps={{ options: propertyTypes, icon_position: 'right', isSearchable: false }} />
              <FormTextInput control={control} rules={{ required: true }} style={styles.input} name="warranty_period" label="Warranty Period (Months)" info="Warranty period in months" inputProps={{ keyboardType: 'numeric', placeholder: "Enter warranty period" }} />
            </View>
            <View style={styles.formRow}>
              <FormDropdown rules={{ required: true }} control={control} style={styles.input} name="development_status" label="Development Status" inputProps={{ options: dev_status_list, icon_position: 'right', isSearchable: false }} />
              <View style={styles.input}></View>
            </View>
            <ImagePicker
              multiSelect
              onSelect={handleImageUpload}
              label="Upload Unit Images"
            />
          </View>
        </View>
        <View style={styles.formArea}>
          <View style={styles.sectionHeader}>
            <Typography variant="bold" size="body" style={styles.header}>Payment Plan</Typography>
          </View>
          <View style={styles.padded}>
            <FormRadioButton
              control={control}
              name="payment_plan"
              options={[
                { label: 'One-time Payment', value: false },
                { label: 'Installments', value: true },
              ]}
              rules={{ required: true }}
              label='Choose a Payment Plan'
            />
            {!watch('payment_plan') && <View style={styles.amount}>
              <Typography size='caption'>Amount to pay</Typography>
              <Typography size='subtitle' variant='bold'>{Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(total_amount() ?? 0)}</Typography>
            </View>}
            {
              watch('payment_plan') && <>
                <View style={styles.formRow}>
                  <FormCurrencyInput
                    control={control}
                    rules={{ required: true }}
                    style={styles.input}
                    name="expected_initial_payment"
                    label="Initial Payment"
                    inputProps={{ placeholder: "Enter expected initial payment" }}
                  />
                  <FormDropdown
                    control={control}
                    rules={{ required: true }}
                    style={styles.input}
                    name="payment_duration"
                    label="Payment Duration (Months)"
                    inputProps={{ placeholder: "Enter payment duration", options: duration, icon_position: 'right', isSearchable: false }}
                  />
                </View>
                <View style={styles.formRow}>
                  <FormTextInput
                    control={control}
                    rules={{ required: true }}
                    style={styles.input}
                    name="installment"
                    label="Number of Installments"
                    inputProps={{ placeholder: "Enter number of installments" }}
                  />
                  <BaseCurrencyInput
                    style={styles.input}
                    label="Installment Amount"
                    inputProps={{ placeholder: "Enter installment amount", readOnly: true }}
                    value={installment_amount().toString()}
                  />
                </View>
              </>
            }
          </View>
        </View>
        <View style={styles.ctaView}>
          <Button title="Cancel" variant='outlined' onPress={back} style={styles.cancel} />
          <Button title="Add Unit" size='medium' onPress={onSubmit} isLoading={isLoading} style={styles.cancel} />
        </View>
      </View>
    </ScrollView>
  );
};

const useStyles = () => {
  const { fontPixel, widthPixel, heightPixel } = useResponsive();
  const { colors, shadow } = useTheme();
  const { m } = useRoundness()

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: widthPixel(32),
      paddingVertical: heightPixel(32),
      rowGap: heightPixel(24),
    },
    formArea: {
      rowGap: heightPixel(24),
      backgroundColor: colors.card,
      ...m,
      borderColor: generateColorScale(colors.neutral).lightHover,
      ...shadow(heightPixel(2), widthPixel(8))
    },
    formRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      columnGap: widthPixel(16),
    },
    ctaView: {
      alignSelf: 'flex-end',
      columnGap: widthPixel(16),
      flexDirection: 'row',
    },
    input: {
      flex: 1,
    },
    cancel: {
      width: widthPixel(151)
    },
    padded: {
      paddingHorizontal: widthPixel(16),
      paddingVertical: heightPixel(24),
      rowGap: heightPixel(24),
    },
    sectionHeader: {
      borderBottomColor: '#E4E7EC',
      paddingVertical: heightPixel(16),
      paddingHorizontal: widthPixel(16),
      borderBottomWidth: heightPixel(1),
      rowGap: heightPixel(8),
    },
    header: {
      fontSize: fontPixel(16),
    },
    amount: {
      ...m,
      borderColor: generateColorScale(colors.neutral).lightActive,
      paddingHorizontal: widthPixel(24),
      paddingVertical: heightPixel(24)
    }
  });
}

export default NewUnit;