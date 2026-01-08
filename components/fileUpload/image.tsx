import { useResponsive } from "@/hooks/useResponsive";
import { useRoundness } from "@/styleguide/theme/Border";
import * as Picker from 'expo-image-picker';
import { useDropzone } from 'react-dropzone';
import { Platform, Pressable, StyleSheet, TextStyle, View } from "react-native";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "../typography";
import { Button } from "../button";
import { useCallback, useEffect, useState } from "react";
import { ValidationRule } from "react-hook-form";
import { Image } from "expo-image";

type MultiSelect = {
  multiSelect: true;
  selectedValue?: string[];
  onSelect?: (selected: string[] | null) => Promise<void> | void;
};

type SingleSelect = {
  multiSelect?: false;
  selectedValue?: string;
  onSelect?: (selected: string | null) => Promise<void> | void;
};

export type FilePickerProps = {
  label?: string,
  labelStyle?: TextStyle,
  required?: string | boolean | ValidationRule<boolean>;
  error?: string;
} & (MultiSelect | SingleSelect);


export const ImagePicker: React.FC<FilePickerProps> = ({ onSelect, multiSelect, selectedValue, label, labelStyle = {}, required, error }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { heightPixel, widthPixel } = useResponsive();
  const [selectedAsset, setSelectedAsset] = useState<string[] | string | null | undefined>(selectedValue);
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    console.log(acceptedFiles, 'dropped files', 'multiselect:', multiSelect);
    if (multiSelect) {
      const updated = [...(selectedAsset as string[] ?? []), ...acceptedFiles.map(file => URL.createObjectURL(file))];
      console.log('Updated selected assets:', updated);
      setSelectedAsset(updated);
      onSelect?.(updated);
    } else {
       console.log('Updated selected assets:', acceptedFiles[0]);
      setSelectedAsset(URL.createObjectURL(acceptedFiles[0]));
      onSelect?.(URL.createObjectURL(acceptedFiles[0]));
    }
  }, [multiSelect, onSelect, selectedAsset]);
  const { getRootProps, getInputProps, isDragActive, open } = Platform.OS === 'web'
    ? useDropzone({
        multiple: multiSelect,
        maxFiles: multiSelect ? 15 : 1,
        accept: { 'image/*': [] },
        onDrop,
        noClick: true, // keep click to your existing “Browse Files” button
      })
    : // dummy fallbacks for native so spreading props doesn't break
      ({ getRootProps: () => ({} as any), getInputProps: () => ({} as any), isDragActive: false });

  useEffect(() => {
    if (selectedValue) {
      setSelectedAsset(Array.isArray(selectedValue) ? selectedValue : [selectedValue]);
    }
  }, [selectedValue]);

  const handlePress = async () => {
    try {
      const res = await Picker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: multiSelect,
        selectionLimit: multiSelect ? 15 : 1,
        base64: true,
      });
      if (!res.canceled) {
        if (multiSelect) {
          const updated = [...(selectedAsset ?? []), ...res.assets.map(asset => asset.uri)];
          setSelectedAsset(updated);
          onSelect?.(updated);
        } else {
          setSelectedAsset(res.assets[0].uri);
          onSelect?.(res.assets[0].uri);
        }
      } else {
        console.log('File selection was cancelled');
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  }

  const handleDelete = (index: number) => {
    if (!selectedAsset) return;

    if (typeof selectedAsset === 'string') {
      setSelectedAsset(null);
      onSelect?.(null);
      return;
    }

    const updatedAssets = selectedAsset.filter((_, i) => i !== index);
    setSelectedAsset(updatedAssets);
    if (multiSelect) {
      const updated = selectedAsset?.filter((_, i) => i !== index);
      onSelect?.(updated ?? null);
    } else {
      onSelect?.(null);
    }
  }

  const handleDeleteAll = () => {
    setSelectedAsset(null);
    onSelect?.(null);
  }

  const handleReplace = async (uri: string) => {
    if (!selectedAsset) return;
    if (uri && typeof uri === 'string') {
      // Open the image picker again and replace the asset
      console.log(`Replacing asset at index ${uri}:`);
      const res = await Picker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
      if (!res.canceled) {
        if (multiSelect) {
          const updated = (selectedAsset as string[]).map((asset, index) => asset === uri ? res.assets[0].uri : asset);
          setSelectedAsset(updated);
          onSelect?.(updated);
        } else {
          setSelectedAsset(res.assets[0].uri);
          onSelect?.(res.assets[0].uri);
        }
      }
    }
  }

  const renderSelectedFiles = () => {
    if (selectedAsset && Array.isArray(selectedAsset)) {
      return (
        <View style={styles.rowGap}>
          <View style={styles.list}>
            {selectedAsset?.map((asset, index) => (
              <View key={index} style={styles.fileItem} onPointerEnter={() => setHoveredIndex(asset)} onPointerLeave={() => setHoveredIndex(null)}>
                <Image source={{ uri: asset }} style={{ width: '100%', height: '100%' }} />
                {hoveredIndex === asset && <View style={styles.itemOverlay}>
                  <Button variant="primary" size="small" iconOnly icon="Ionicons.refresh-outline" onPress={() => handleReplace(asset)} />
                  <Button variant="primary" size="small" iconOnly icon="Ionicons.trash-outline" onPress={() => handleDelete(index)} />
                </View>}
              </View>
            ))}
          </View>
          <View style={styles.sb}>
            <Button title="Clear" variant='secondary' onPress={handleDeleteAll} size="small" />
            <Button title="Upload New" variant='secondary' onPress={handlePress} size="small" />
          </View>
        </View>
      );
    } else if (typeof selectedAsset === 'string') {
      return (
        <View style={styles.fileItem} onPointerEnter={() => setHoveredIndex(selectedAsset)} onPointerLeave={() => setHoveredIndex(null)}>
          <Image source={{ uri: selectedAsset }} style={{ width: '100%', height: '100%' }} />
          {hoveredIndex === selectedAsset && <View style={styles.itemOverlay}>
            <Button variant="primary" size="medium" iconOnly icon="Ionicons.refresh-outline" onPress={() => handleReplace(selectedAsset)} />
            <Button variant="primary" size="medium" iconOnly icon="Ionicons.trash-outline" onPress={() => handleDelete(0)} />
          </View>}
        </View>
      );
    }
  };

  const renderWebPicker = () => (
    <div {...getRootProps()}>
      <View style={[styles.container, { borderColor: error ? colors.error.normal : colors.neutral.normal }]}>
        {Platform.OS === 'web' && <input {...getInputProps()} style={{ display: 'none' }} />}
        <View style={styles.white_circle}>
          <Ionicons name="cloud-upload-outline" size={24} color="#606B85" />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', rowGap: heightPixel(2) }}>
          {isDragActive && <Typography variant="semiBold" color={colors.brand.blue}>Drop files here</Typography>}
          {!isDragActive && <Typography variant="semiBold" color={colors.brand.blue}>Click to upload <Typography color={colors.text.weak}>or drag and drop</Typography></Typography>}
          <Typography color={colors.text.weak} variant="regular" size="caption">JPEG, PNG, GIF, WEBP</Typography>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
          <View style={{ width: '100%', height: heightPixel(1), backgroundColor: '#F0F2F5', position: 'absolute' }} />
          <Typography color={colors.text.weak} variant="regular" size="caption" style={{ backgroundColor: '#F7F7F7' }}>OR</Typography>
        </View>
        <Button onPress={open} variant='secondary' title="Browse Files" color={colors.brand.blue} style={{ backgroundColor: '#E6F2FA' }} />
      </View>
    </div>
  )

  const renderNativePicker = () => (
    <Pressable {...getRootProps()} style={[styles.container, { borderColor: error ? colors.error.normal : colors.neutral.normal}]} onPress={handlePress}>
      {Platform.OS === 'web' && <input {...getInputProps()} style={{ display: 'none' }} />}
      <View style={styles.white_circle}>
        <Ionicons name="cloud-upload-outline" size={24} color="#606B85" />
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', rowGap: heightPixel(2) }}>
        {isDragActive && <Typography variant="semiBold" color={colors.brand.blue}>Drop files here</Typography>}
        {!isDragActive && <Typography variant="semiBold" color={colors.brand.blue}>Click to upload <Typography color={colors.text.weak}>or drag and drop</Typography></Typography>}
        <Typography color={colors.text.weak} variant="regular" size="caption">JPEG, PNG, GIF, WEBP</Typography>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
        <View style={{ width: '100%', height: heightPixel(1), backgroundColor: '#F0F2F5', position: 'absolute' }} />
        <Typography color={colors.text.weak} variant="regular" size="caption" style={{ backgroundColor: '#F7F7F7' }}>OR</Typography>
      </View>
      <Button onPress={handlePress} variant='secondary' title="Browse Files" color={colors.brand.blue} style={{ backgroundColor: '#E6F2FA' }} />
    </Pressable>
  );

  const renderPicker = () => {
    if (Platform.OS === 'web') {
      return renderWebPicker();
    } else {
      return renderNativePicker();
    }
  }

  return (
    <View style={[ { width: '100%', rowGap: heightPixel(8) } ]}>
      {label && <View style={styles.sb}>
        {Boolean(required) && <Typography style={styles.required}>*</Typography>}
        <Typography size="caption" variant='semiBold' style={[ { color: colors.text.default }, labelStyle]}>{label}</Typography>
      </View>}
      {Boolean(selectedAsset) && (selectedAsset?.length ?? 0) > 0 ? renderSelectedFiles() : renderPicker()}
    </View>
  );
}

const useStyles = () => {
  const { heightPixel, widthPixel, scale, fontPixel } = useResponsive();
  const { m, circle } = useRoundness();
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: heightPixel(243),
      width: '100%',
      ...m,
      borderStyle: 'dashed',
      borderColor: colors.neutral.normal,
      backgroundColor: '#F7F7F7',
      paddingVertical: heightPixel(20),
      paddingHorizontal: widthPixel(16),
      rowGap: widthPixel(16),
    },
    white_circle: {
      width: widthPixel(44),
      height: widthPixel(44),
      justifyContent: 'center',
      alignItems: 'center',
      ...circle,
      backgroundColor: colors.card,
    },
    sb: {
      columnGap: scale(4),
      flexDirection: 'row',
    },
    required: {
      color: colors.error.normal,
      fontSize: fontPixel(12),
    },
    list: {
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: widthPixel(8),
      rowGap: heightPixel(8),
      flexWrap: 'wrap',
      width: '100%',
    },
    fileItem: {
      width: widthPixel(126.25),
      height: heightPixel(105),
      ...m,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderColor: colors.neutral.lightActive,
    },
    itemOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      ...m,
      flexDirection: 'row',
      columnGap: widthPixel(8),
    },
    rowGap: {
      rowGap: heightPixel(16),
    },
  });
}

export default ImagePicker;