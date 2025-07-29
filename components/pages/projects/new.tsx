import { Button } from '@/components/button';
import { FormTextInput, TextAreaFormInput } from '@/components/input';
import { FormDropdown } from '@/components/input/dropdown/form';
import { Typography } from '@/components/typography';
import { useResponsive } from '@/hooks/useResponsive';
import { useRoundness } from '@/styleguide/theme/Border';
import { generateColorScale } from '@/styleguide/theme/Colors';
import { useTheme } from '@/styleguide/theme/ThemeContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useProjectLogic } from './logic';
import { DropdownOption } from '@/components/input/dropdown/dropdownStyles';
import { Breadcrumb } from '@/components/breadcrumb';

const purpose: DropdownOption[] = [
  {label: "Commercial", value: 'commercial'},
  {label: "Residential", value: 'residential'},
  {label: "Mixed Use", value: 'mixed_use'},
  {label: "Industrial", value: 'industrial'},
  {label: "Others", value: 'others'},
].sort((a, b) => a.label.localeCompare(b.label))

const NewProject: React.FC = () => {
  const styles = useStyles();
  const { back } = useRouter();
  const {control, onSubmit, isLoading} = useProjectLogic();

  return (
    <View style={styles.container}>
      <Breadcrumb />
      <View>
        <Typography variant="semiBold" size="subtitle">Create Project</Typography>
        <Typography size="body">Fill in the essential details to create a new project.</Typography>
      </View>
      <View style={styles.formArea}>
        {/* Form components will go here */}
        <View style={styles.formRow}>
          <FormTextInput control={control} rules={{ required: true }} style={styles.input} name="name" label="Project Name" inputProps={{ placeholder: "Enter project name" }} />
          <FormTextInput control={control} rules={{ required: true }} style={styles.input} name="address" label="Address" inputProps={{ placeholder: "Enter project address" }} />
        </View>
        <TextAreaFormInput
          name="description"
          label="Description"
          inputProps={{ placeholder: "Enter project description" }}
          control={control}
          rules={{ required: true }}
        />
        <View style={styles.formRow}>
          <FormDropdown rules={{ required: true }} control={control} style={styles.input} name="purpose" label="Purpose" inputProps={{ options: purpose, icon_position: 'right', isSearchable: false }} />
          <FormTextInput control={control} rules={{ required: true }} style={styles.input} name="num_units" label="Total Units" inputProps={{ keyboardType: 'numeric', placeholder: "Enter total units" }} />
        </View>
        <View style={styles.ctaView}>
          <Button title="Cancel" variant='outlined' onPress={back} style={styles.cancel} />
          <Button title="Create Project" onPress={onSubmit} isLoading={isLoading} />
        </View>
      </View>
    </View>
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
      rowGap: heightPixel(16),
    },
    formArea: {
      rowGap: heightPixel(24),
      backgroundColor: colors.card,
      paddingHorizontal: widthPixel(16),
      paddingBottom: heightPixel(56),
      paddingTop: heightPixel(32),
      ...m,
      borderColor: generateColorScale(colors.neutral).lightHover,
      ...shadow(heightPixel(2), widthPixel(8))
    },
    formRow: {
      flexDirection: 'row',
      alignItems: 'center',
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
    }
  });
};

export default NewProject;