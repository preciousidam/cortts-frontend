import { useResponsive } from "@/hooks/useResponsive";
import { useRoundness } from "@/styleguide/theme/Border";
import * as DocumentPicker from 'expo-document-picker';
import { Pressable, StyleSheet, TextStyle, View } from "react-native";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "../typography";
import { Button } from "../button";
import { useState } from "react";
import { ValidationRule } from "react-hook-form";
import { generateColorScale } from "@/styleguide/theme/Colors";
import { Image } from "expo-image";

type MultiSelect = {
  multiSelect: true;
  selectedValue?: string[];
  onSelect?: (selected: string[]) => Promise<void> | void;
};

type SingleSelect = {
  multiSelect?: false;
  selectedValue?: string;
  onSelect?: (selected: string) => Promise<void> | void;
};

export type FilePickerProps = {
  label?: string,
  labelStyle?: TextStyle,
  required?: string | boolean | ValidationRule<boolean>;
  error?: string;
} & (MultiSelect | SingleSelect);


export const FilePicker: React.FC<FilePickerProps> = ({ onSelect, multiSelect, selectedValue, label, labelStyle = {}, required, error }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { heightPixel, widthPixel } = useResponsive();
  const [selectedAsset, setSelectedAsset] = useState<DocumentPicker.DocumentPickerAsset[] | null>(null);

  const handlePress = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: multiSelect,
        copyToCacheDirectory: true,
      });
      if (!res.canceled) {
        setSelectedAsset(res.assets);
        if (multiSelect) {
          const updated = [...(selectedValue ?? []), res.assets[0].uri];
          onSelect?.(updated);
        } else {
          onSelect?.(res.assets[0].uri);
        }
      } else {
        console.log('File selection was cancelled');
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  }

  const renderSelectedFiles = () => (
    <View style={styles.list}>
      {selectedAsset?.map((asset, index) => (
        <View key={index} style={styles.fileItem}>
          <Image source={{ uri: asset.uri }} style={{ width: '100%', height: '100%' }} />
        </View>
      ))}
    </View>
  )

  const imageUploadHandler = async (uri: string) => {
    try {
      
    } catch (error) {
      console.error("Error picking image:", error);
    }
  }

  const renderPicker = () => (
    <Pressable style={[styles.container, { borderColor: error ? colors.notification : generateColorScale(colors.neutral).normalBase}]} onPress={handlePress}>
      <View style={styles.white_circle}>
        <Ionicons name="cloud-upload-outline" size={24} color="#606B85" />
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', rowGap: heightPixel(2) }}>
        <Typography variant="semiBold" color={colors.primary}>Click to upload <Typography color={colors.textWeak}>or drag and drop</Typography></Typography>
        <Typography color={colors.textWeak} variant="regular" size="caption">JPEG, PNG, GIF, WEBP</Typography>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
        <View style={{ width: '100%', height: heightPixel(1), backgroundColor: '#F0F2F5', position: 'absolute' }} />
        <Typography color={colors.textWeak} variant="regular" size="caption" style={{ backgroundColor: '#F7F7F7' }}>OR</Typography>
      </View>
      <Button variant='secondary' title="Browse Files" color={colors.primary} style={{ backgroundColor: '#E6F2FA' }} />
    </Pressable>
  )

  return (
    <View style={[ { width: '100%', rowGap: heightPixel(8) } ]}>
      {label && <View style={styles.sb}>
        {Boolean(required) && <Typography style={styles.required}>*</Typography>}
        <Typography size="caption" variant='semiBold' style={[ { color: colors.text }, labelStyle]}>{label}</Typography>
      </View>}
      {selectedAsset ? renderSelectedFiles() : renderPicker()}
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
      borderColor: colors.neutral,
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
      color: colors.notification,
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
      borderColor: generateColorScale(colors.neutral).normalHover,
    }
  });
}

export default FilePicker;