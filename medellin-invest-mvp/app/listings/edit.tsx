import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/theme';
import { MOCK_PROPERTIES } from '@/services/mock';
import { PROPERTY_TYPES } from '@/constants/propertyTypes';
import { NEIGHBORHOOD_NAMES } from '@/constants/neighborhoods';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormToggle } from '@/components/forms/FormToggle';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

export default function EditListingScreen() {
  const router = useRouter();
  const seed = MOCK_PROPERTIES[0];
  const [title, setTitle] = useState(seed.title);
  const [description, setDescription] = useState(seed.description);
  const [price, setPrice] = useState(String(seed.price));
  const [neighborhood, setNeighborhood] = useState(seed.neighborhood);
  const [propertyType, setPropertyType] = useState(seed.propertyType);
  const [bedrooms, setBedrooms] = useState(String(seed.bedrooms));
  const [bathrooms, setBathrooms] = useState(String(seed.bathrooms));
  const [furnished, setFurnished] = useState(seed.furnished);
  const [shortTerm, setShortTerm] = useState(seed.shortTermCapable);
  const [longTerm, setLongTerm] = useState(seed.longTermCapable);

  const onSave = () => {
    Alert.alert('Listing saved', 'Your changes have been saved.', [
      { text: 'OK', onPress: () => router.replace('/dashboard/broker') },
    ]);
  };

  const onUnpublish = () => {
    Alert.alert('Unpublish listing?', 'It will be removed from search results.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Unpublish', style: 'destructive' },
    ]);
  };

  return (
    <Screen scroll>
      <DashboardHeader title="Edit listing" subtitle={seed.title} />

      <Card padded>
        <Text variant="captionStrong" style={{ marginBottom: spacing.md }}>
          Basic info
        </Text>
        <FormInput label="Title" value={title} onChangeText={setTitle} />
        <FormInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          style={{ minHeight: 100, textAlignVertical: 'top' }}
        />
        <FormInput
          label="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="number-pad"
          rightAdornment="USD"
        />
        <FormSelect
          label="Property type"
          options={PROPERTY_TYPES}
          value={propertyType}
          onChange={setPropertyType}
        />
      </Card>

      <Card padded style={{ marginTop: spacing.lg }}>
        <Text variant="captionStrong" style={{ marginBottom: spacing.md }}>
          Details
        </Text>
        <View style={styles.row}>
          <FormInput
            containerStyle={{ flex: 1 }}
            label="Bedrooms"
            value={bedrooms}
            onChangeText={setBedrooms}
            keyboardType="number-pad"
          />
          <FormInput
            containerStyle={{ flex: 1 }}
            label="Bathrooms"
            value={bathrooms}
            onChangeText={setBathrooms}
            keyboardType="decimal-pad"
          />
        </View>
        <FormSelect
          label="Neighborhood"
          options={NEIGHBORHOOD_NAMES.map((n) => ({ label: n, value: n }))}
          value={neighborhood}
          onChange={setNeighborhood}
        />
        <FormToggle label="Furnished" value={furnished} onValueChange={setFurnished} />
      </Card>

      <Card padded style={{ marginTop: spacing.lg }}>
        <Text variant="captionStrong" style={{ marginBottom: spacing.md }}>
          Rental strategy
        </Text>
        <FormToggle
          label="Short-term capable"
          value={shortTerm}
          onValueChange={setShortTerm}
        />
        <FormToggle
          label="Long-term capable"
          value={longTerm}
          onValueChange={setLongTerm}
        />
      </Card>

      <PrimaryButton title="Save changes" icon="save-outline" style={{ marginTop: spacing.xl }} onPress={onSave} />
      <SecondaryButton
        title="Unpublish listing"
        icon="eye-off-outline"
        tone="danger"
        variant="soft"
        style={{ marginTop: spacing.md }}
        onPress={onUnpublish}
      />
      <Text variant="caption" align="center" style={{ marginTop: spacing.lg, color: colors.textSubtle }}>
        Changes are saved locally in this MVP — backend integration is coming next.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
});
