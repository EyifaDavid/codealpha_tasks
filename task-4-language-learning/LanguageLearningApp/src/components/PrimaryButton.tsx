import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../constants/theme';


type Props = TouchableOpacityProps & { title: string };


const PrimaryButton: React.FC<Props> = ({ title, style, ...rest }) => {
const { colors } = useTheme();
return (
<TouchableOpacity {...rest} style={[styles.btn, { backgroundColor: colors.primary }, style]}>
<Text style={[styles.text]}>{title}</Text>
</TouchableOpacity>
);
};


export default PrimaryButton;


const styles = StyleSheet.create({
btn: { padding: 12, borderRadius: 10, alignItems: 'center' },
text: { color: '#fff', fontWeight: '700' },
});