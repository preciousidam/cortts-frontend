import { useResponsive } from "@/hooks/useResponsive";
import { useRoundness } from "@/styleguide/theme/Border";
import * as DocumentPicker from 'expo-document-picker';
import { Platform, Pressable, StyleSheet, TextStyle, View } from "react-native";
import { useTheme } from "@/styleguide/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "../typography";
import { Button } from "../button";
import { useCallback, useState } from "react";
import { ValidationRule } from "react-hook-form";
import { Accept, useDropzone } from "react-dropzone";
import { FileLike } from "@/services/upload";

type MultiSelect = {
  multiSelect: true;
  onSelect?: (selected: FileLike[] | null) => Promise<void> | void;
};

type SingleSelect = {
  multiSelect?: false;
  onSelect?: (selected: FileLike | null) => Promise<void> | void;
};

export type FilePickerProps = {
  label?: string,
  labelStyle?: TextStyle,
  required?: string | boolean | ValidationRule<boolean>;
  error?: string;
  accept?: Accept;
  placeholder?: string;
} & (MultiSelect | SingleSelect);


export const FilePicker: React.FC<FilePickerProps> = ({ onSelect, multiSelect, label, labelStyle = {}, required, error, accept, placeholder }) => {
  const styles = useStyles();
  const { colors, isDarkMode } = useTheme();
  const { heightPixel, widthPixel } = useResponsive();
  const [fileList, setFileList] = useState<File[] | DocumentPicker.DocumentPickerAsset[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
      // Do something with the files
      console.log(acceptedFiles, 'dropped files', 'multiselect:', multiSelect);

      if (multiSelect) {
        const all = [...(fileList as File[]), ...acceptedFiles];
        setFileList(prev => [...(prev as File[]), ...all]);
        onSelect?.(all);
      } else {
        setFileList(acceptedFiles);
        onSelect?.(acceptedFiles[0]);
      }
    }, [multiSelect, onSelect]);

  const { getRootProps, getInputProps, isDragActive, open } = Platform.OS === 'web'
    ? useDropzone({
        multiple: multiSelect,
        maxFiles: multiSelect ? 15 : 1,
        accept: accept ?? { '*/*': [], },
        onDrop,
        noClick: true, // keep click to your existing “Browse Files” button
      })
    : // dummy fallbacks for native so spreading props doesn't break
      ({ getRootProps: () => ({} as any), getInputProps: () => ({} as any), isDragActive: false });

  const handlePress = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: multiSelect,
        copyToCacheDirectory: true,
      });
      if (!res.canceled) {
        setFileList(res.assets || []);
        if (multiSelect) {
          const all = [...(fileList as DocumentPicker.DocumentPickerAsset[]), ...res.assets];
          const updated = [...(all as DocumentPicker.DocumentPickerAsset[]).map(asset => Platform.OS == 'web' && asset.file ? asset.file : asset.uri)];
          setFileList(all);
          onSelect?.(updated);
        } else {
          setFileList([res.assets[0]]);
          onSelect?.(Platform.OS == 'web' && res.assets?.[0].file ? res.assets[0].file : res.assets[0].uri);
        }
      } else {
        console.log('File selection was cancelled');
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  }

  const byteToSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }

  const handleDelete = (index: number) => {
    if (!fileList || fileList.length === 0) return;
    if (Platform.OS === 'web') {
      const updatedList = fileList.filter((_, i) => i !== index) as File[];
      setFileList(updatedList);
      if (multiSelect) {
        onSelect?.(updatedList);
      } else {
        onSelect?.(updatedList[0]);
      }
    } else {
      const updatedList = fileList.filter((_, i) => i !== index) as DocumentPicker.DocumentPickerAsset[];
      setFileList(updatedList);
      if (multiSelect) {
        const updatedListPath = updatedList.map(file => file.uri);
        onSelect?.(updatedListPath);
      } else {
        onSelect?.(updatedList?.[0] ? updatedList[0].uri : null);
      }
    }
  }

  const handleReplace = (index: number) => {
    if (!fileList || fileList.length === 0) return;
    handleDelete(index);
    handlePress();
  }

  const renderSelectedFiles = () => {
    if (multiSelect && fileList.length > 0) {
      return (
        <View style={styles.list}>
          {fileList.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <View>
                {/* <Image source={{ uri: file.uri }} style={styles.image} /> */}
              </View>
              <View style={{ flex: 1, rowGap: heightPixel(8) }}>
                <Typography variant="bold" numberOfLines={1} ellipsizeMode="middle">{file.name}</Typography>
                <View style={styles.sb}>
                  <Typography size="caption" color={colors.text.weaker}>{byteToSize(file.size ?? 0)} • {((file as File)?.type ?? (file as DocumentPicker.DocumentPickerAsset)?.mimeType).split('/')[1] ?? ''}</Typography>
                </View>
              </View>
              <View style={styles.sb}>
                <Button
                  iconOnly
                  icon="EvilIcons.refresh"
                  title="Remove"
                  variant='tertiary'
                  size="medium"
                  onPress={() => handleReplace(index)}
                />
                <Button
                  iconOnly
                  icon="Ionicons.trash-outline"
                  title="Remove"
                  color={colors.error.normal}
                  variant='tertiary'
                  size="medium"
                  onPress={() => handleDelete(index)}
                />
              </View>
          </View>
        ))}
      </View>);
    } else {
      return (
        <View style={styles.fileItem}>
            <View>
              {/* <Image source={{ uri: file.uri }} style={styles.image} /> */}
            </View>
            <View style={{ flex: 1, rowGap: heightPixel(8) }}>
              <Typography variant="bold" numberOfLines={1} ellipsizeMode="middle">{fileList[0].name}</Typography>
              <View style={styles.sb}>
                <Typography size="caption" color={colors.text.weaker}>{byteToSize(fileList[0].size ?? 0)} • {((fileList[0] as File)?.type ?? (fileList[0] as DocumentPicker.DocumentPickerAsset)?.mimeType).split('/')[1] ?? ''}</Typography>
              </View>
            </View>
            <View style={styles.sb}>
              <Button
                iconOnly
                icon="EvilIcons.refresh"
                title="Remove"
                variant='tertiary'
                size="medium"
                onPress={() => handleReplace(0)}
              />
              <Button
                iconOnly
                icon="Ionicons.trash-outline"
                title="Remove"
                color={colors.error.normal}
                variant='tertiary'
                size="medium"
                onPress={() => handleDelete(0)}
              />
            </View>
        </View>
      );
    }
  };

  const renderWebPicker = () => (
    <div {...getRootProps()}>
      <Pressable style={[styles.container, { borderColor: error ? colors.error.normal : colors.neutral.normal }]} onPress={open}>
        {Platform.OS === 'web' && <input {...getInputProps()} style={{ display: 'none' }} />}
        <View style={styles.white_circle}>
          <Ionicons name="cloud-upload-outline" size={24} color="#606B85" />
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', rowGap: heightPixel(2) }}>
          {isDragActive && <Typography variant="semiBold" color={colors.brand.blue}>Drop files here</Typography>}
          {!isDragActive && <Typography variant="semiBold" color={colors.brand.blue}>Click to upload <Typography color={colors.text.weak}>or drag and drop</Typography></Typography>}
          <Typography color={colors.text.weak} variant="regular" size="caption">{placeholder ?? "Import images, pdf or other files"}</Typography>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative' }}>
          <View style={{ width: '100%', height: heightPixel(1), backgroundColor: '#F0F2F5', position: 'absolute' }} />
          <Typography color={colors.text.weak} variant="regular" size="caption" style={{ backgroundColor: isDarkMode ? colors.background : '#F7F7F7' }}>OR</Typography>
        </View>
        <Button onPress={open} variant='secondary' title="Browse Files" color={colors.brand.blue} style={{ backgroundColor: '#E6F2FA' }} />
      </Pressable>
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
      {Boolean(fileList) && (fileList?.length ?? 0) > 0 ? renderSelectedFiles() : renderPicker()}
    </View>
  );
}

const useStyles = () => {
  const { heightPixel, widthPixel, scale, fontPixel } = useResponsive();
  const { m, circle } = useRoundness();
  const { colors, isDarkMode } = useTheme();

  return StyleSheet.create({
    container: {
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      ...m,
      borderStyle: 'dashed',
      borderColor: colors.neutral.normal,
      backgroundColor: isDarkMode ? colors.background : '#F7F7F7',
      paddingVertical: heightPixel(20),
      paddingHorizontal: widthPixel(16),
      paddingBottom: heightPixel(32),
      paddingTop: heightPixel(32),
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
      flexDirection: 'column',
      rowGap: heightPixel(16),
      width: '100%',
    },
    fileItem: {
      width: '100%',
      height: heightPixel(68),
      ...m,
      overflow: 'hidden',
      borderColor: colors.neutral.normalHover,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      columnGap: widthPixel(16),
      paddingHorizontal: widthPixel(10),
      paddingVertical: heightPixel(10),
    }
  });
}

export default FilePicker;