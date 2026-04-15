import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '@/theme';
import { propertyTypeLabel, PROPERTY_TYPES } from '@/constants/propertyTypes';
import { NEIGHBORHOOD_NAMES } from '@/constants/neighborhoods';
import { AMENITIES } from '@/constants/amenities';
import { formatUSD } from '@/utils/format';
import {
  ListingFormValues,
  STEP_TITLES,
  defaultListingValues,
  listingSchema,
} from '@/features/listings/schema';
import { Text } from '@/components/ui/Text';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { Card } from '@/components/ui/Card';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormToggle } from '@/components/forms/FormToggle';

export default function CreateListingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<ListingFormValues>(defaultListingValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ListingFormValues, string>>>({});

  const update = <K extends keyof ListingFormValues>(key: K, value: ListingFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateStep = (): boolean => {
    const fieldsByStep: (keyof ListingFormValues)[][] = [
      ['title', 'description', 'propertyType', 'price'],
      ['bedrooms', 'bathrooms', 'squareMeters', 'parking', 'furnished', 'amenities'],
      ['neighborhood', 'address'],
      [
        'shortTermCapable',
        'longTermCapable',
        'nightlyRateEstimate',
        'monthlyLongTermRent',
        'hoaMonthly',
        'utilitiesMonthly',
        'managementMonthly',
        'maintenanceReserveMonthly',
      ],
      ['images', 'coverImageIndex'],
      [],
    ];
    const fields = fieldsByStep[step];
    const result = listingSchema.safeParse(values);
    if (result.success) return true;
    const stepErrors: Partial<Record<keyof ListingFormValues, string>> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof ListingFormValues;
      if (fields.includes(key) && !stepErrors[key]) {
        stepErrors[key] = issue.message;
      }
    }
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(STEP_TITLES.length - 1, s + 1));
  };
  const back = () => {
    if (step === 0) {
      router.back();
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };
  const submit = () => {
    const result = listingSchema.safeParse(values);
    if (!result.success) {
      Alert.alert('Missing information', 'Please complete all steps before submitting.');
      return;
    }
    Alert.alert('Listing submitted', 'Your listing has been queued for review.', [
      { text: 'Done', onPress: () => router.replace('/dashboard/broker') },
    ]);
  };

  const isLast = step === STEP_TITLES.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={back} hitSlop={8} style={styles.backBtn}>
          <Ionicons
            name={step === 0 ? 'close' : 'chevron-back'}
            size={22}
            color={colors.text}
          />
        </Pressable>
        <Text variant="h3">Add listing</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.lg }}>
        <StepIndicator steps={STEP_TITLES} current={step} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 0 && <Step1 values={values} errors={errors} update={update} />}
        {step === 1 && <Step2 values={values} errors={errors} update={update} />}
        {step === 2 && <Step3 values={values} errors={errors} update={update} />}
        {step === 3 && <Step4 values={values} errors={errors} update={update} />}
        {step === 4 && <Step5 values={values} errors={errors} update={update} />}
        {step === 5 && <Step6 values={values} />}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <View style={styles.footerInner}>
          <SecondaryButton
            title={step === 0 ? 'Cancel' : 'Back'}
            onPress={back}
            variant="outline"
            fullWidth={false}
            style={{ flex: 1 }}
          />
          <PrimaryButton
            title={isLast ? 'Submit' : 'Continue'}
            onPress={isLast ? submit : next}
            icon={isLast ? 'checkmark' : 'arrow-forward'}
            iconPosition="right"
            fullWidth={false}
            style={{ flex: 1 }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

type StepProps = {
  values: ListingFormValues;
  errors: Partial<Record<keyof ListingFormValues, string>>;
  update: <K extends keyof ListingFormValues>(k: K, v: ListingFormValues[K]) => void;
};

function Step1({ values, errors, update }: StepProps) {
  return (
    <View>
      <Text variant="h2">Tell us about it</Text>
      <Text variant="caption" style={{ marginBottom: spacing.lg }}>
        Start with the essentials.
      </Text>
      <FormInput
        label="Listing title"
        placeholder="e.g. Modern 2BR with skyline views"
        value={values.title}
        onChangeText={(t) => update('title', t)}
        error={errors.title}
      />
      <FormInput
        label="Description"
        placeholder="Describe the property, neighborhood and what makes it unique."
        value={values.description}
        onChangeText={(t) => update('description', t)}
        multiline
        numberOfLines={6}
        style={{ minHeight: 110, textAlignVertical: 'top' }}
        error={errors.description}
      />
      <FormSelect
        label="Property type"
        options={PROPERTY_TYPES}
        value={values.propertyType}
        onChange={(v) => update('propertyType', v)}
      />
      <FormInput
        label="Price"
        placeholder="0"
        keyboardType="number-pad"
        value={values.price ? String(values.price) : ''}
        onChangeText={(t) => update('price', Number(t) || 0)}
        leftIcon="cash-outline"
        rightAdornment="USD"
        error={errors.price}
      />
    </View>
  );
}

function Step2({ values, errors, update }: StepProps) {
  const toggleAmenity = (a: string) => {
    const set = new Set(values.amenities);
    if (set.has(a)) set.delete(a);
    else set.add(a);
    update('amenities', Array.from(set));
  };
  return (
    <View>
      <Text variant="h2">Property details</Text>
      <Text variant="caption" style={{ marginBottom: spacing.lg }}>
        Add the specs your investors care about.
      </Text>
      <View style={styles.row}>
        <FormInput
          containerStyle={{ flex: 1 }}
          label="Bedrooms"
          keyboardType="number-pad"
          value={String(values.bedrooms)}
          onChangeText={(t) => update('bedrooms', Number(t) || 0)}
          error={errors.bedrooms}
        />
        <FormInput
          containerStyle={{ flex: 1 }}
          label="Bathrooms"
          keyboardType="decimal-pad"
          value={String(values.bathrooms)}
          onChangeText={(t) => update('bathrooms', Number(t) || 0)}
          error={errors.bathrooms}
        />
      </View>
      <View style={styles.row}>
        <FormInput
          containerStyle={{ flex: 1 }}
          label="Area"
          keyboardType="number-pad"
          value={String(values.squareMeters)}
          onChangeText={(t) => update('squareMeters', Number(t) || 0)}
          rightAdornment="m²"
          error={errors.squareMeters}
        />
        <FormInput
          containerStyle={{ flex: 1 }}
          label="Parking spots"
          keyboardType="number-pad"
          value={String(values.parking)}
          onChangeText={(t) => update('parking', Number(t) || 0)}
          error={errors.parking}
        />
      </View>
      <FormToggle
        label="Furnished"
        value={values.furnished}
        onValueChange={(v) => update('furnished', v)}
      />

      <Text variant="captionStrong" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
        Amenities
      </Text>
      <View style={styles.amenityWrap}>
        {AMENITIES.map((a) => {
          const selected = values.amenities.includes(a);
          return (
            <Pressable
              key={a}
              onPress={() => toggleAmenity(a)}
              style={[styles.chip, selected && styles.chipOn]}
            >
              <Text
                variant="captionStrong"
                style={{ color: selected ? colors.textInverse : colors.text }}
              >
                {a}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Step3({ values, errors, update }: StepProps) {
  return (
    <View>
      <Text variant="h2">Location</Text>
      <Text variant="caption" style={{ marginBottom: spacing.lg }}>
        Where is the property located?
      </Text>
      <FormSelect
        label="Neighborhood"
        options={NEIGHBORHOOD_NAMES.map((n) => ({ label: n, value: n }))}
        value={values.neighborhood || null}
        onChange={(v) => update('neighborhood', v)}
      />
      {errors.neighborhood && (
        <Text variant="caption" style={{ color: colors.danger, marginTop: -spacing.md, marginBottom: spacing.lg }}>
          {errors.neighborhood}
        </Text>
      )}
      <FormInput
        label="Address"
        placeholder="Street and number"
        leftIcon="location-outline"
        value={values.address}
        onChangeText={(t) => update('address', t)}
        error={errors.address}
      />
      <Card padded={false} style={styles.mapCard}>
        <View style={styles.mapPreview}>
          <Ionicons name="map" size={28} color={colors.primary} />
          <Text variant="captionStrong" style={{ marginTop: 6 }}>
            Pin location on map
          </Text>
          <Text variant="caption">Coming soon — coordinates auto-set from address</Text>
        </View>
      </Card>
    </View>
  );
}

function Step4({ values, errors, update }: StepProps) {
  return (
    <View>
      <Text variant="h2">Investment details</Text>
      <Text variant="caption" style={{ marginBottom: spacing.lg }}>
        Help investors estimate returns.
      </Text>
      <FormToggle
        label="Short-term rental capable"
        description="Airbnb / vacation rental"
        value={values.shortTermCapable}
        onValueChange={(v) => update('shortTermCapable', v)}
      />
      <FormToggle
        label="Long-term rental capable"
        description="Standard residential lease"
        value={values.longTermCapable}
        onValueChange={(v) => update('longTermCapable', v)}
      />
      <View style={[styles.row, { marginTop: spacing.lg }]}>
        <FormInput
          containerStyle={{ flex: 1 }}
          label="Nightly rate"
          keyboardType="number-pad"
          value={String(values.nightlyRateEstimate)}
          onChangeText={(t) => update('nightlyRateEstimate', Number(t) || 0)}
          rightAdornment="USD"
          error={errors.nightlyRateEstimate}
        />
        <FormInput
          containerStyle={{ flex: 1 }}
          label="Monthly rent"
          keyboardType="number-pad"
          value={String(values.monthlyLongTermRent)}
          onChangeText={(t) => update('monthlyLongTermRent', Number(t) || 0)}
          rightAdornment="USD"
          error={errors.monthlyLongTermRent}
        />
      </View>
      <View style={styles.row}>
        <FormInput
          containerStyle={{ flex: 1 }}
          label="HOA / mo"
          keyboardType="number-pad"
          value={String(values.hoaMonthly)}
          onChangeText={(t) => update('hoaMonthly', Number(t) || 0)}
        />
        <FormInput
          containerStyle={{ flex: 1 }}
          label="Utilities / mo"
          keyboardType="number-pad"
          value={String(values.utilitiesMonthly)}
          onChangeText={(t) => update('utilitiesMonthly', Number(t) || 0)}
        />
      </View>
      <View style={styles.row}>
        <FormInput
          containerStyle={{ flex: 1 }}
          label="Management / mo"
          keyboardType="number-pad"
          value={String(values.managementMonthly)}
          onChangeText={(t) => update('managementMonthly', Number(t) || 0)}
        />
        <FormInput
          containerStyle={{ flex: 1 }}
          label="Maintenance / mo"
          keyboardType="number-pad"
          value={String(values.maintenanceReserveMonthly)}
          onChangeText={(t) => update('maintenanceReserveMonthly', Number(t) || 0)}
        />
      </View>
    </View>
  );
}

const PLACEHOLDER_IMAGES = [
  'https://picsum.photos/seed/listing-a/800/600',
  'https://picsum.photos/seed/listing-b/800/600',
  'https://picsum.photos/seed/listing-c/800/600',
  'https://picsum.photos/seed/listing-d/800/600',
];

function Step5({ values, errors, update }: StepProps) {
  const addPlaceholder = () => {
    const next = [...values.images, PLACEHOLDER_IMAGES[values.images.length % PLACEHOLDER_IMAGES.length]];
    update('images', next);
  };
  const removeAt = (i: number) => {
    const next = values.images.filter((_, idx) => idx !== i);
    update('images', next);
    if (values.coverImageIndex >= next.length) update('coverImageIndex', 0);
  };

  return (
    <View>
      <Text variant="h2">Add photos</Text>
      <Text variant="caption" style={{ marginBottom: spacing.lg }}>
        Listings with 5+ photos receive 3x more inquiries.
      </Text>

      <View style={styles.imageGrid}>
        {values.images.map((uri, i) => (
          <View key={`${uri}-${i}`} style={styles.imageWrap}>
            <Image source={{ uri }} style={styles.image} contentFit="cover" />
            {i === values.coverImageIndex && (
              <View style={styles.coverBadge}>
                <Ionicons name="star" size={10} color={colors.accent} />
                <Text style={{ color: colors.textInverse, fontSize: 10, fontWeight: '700', marginLeft: 3 }}>
                  COVER
                </Text>
              </View>
            )}
            <View style={styles.imageActions}>
              <Pressable
                onPress={() => update('coverImageIndex', i)}
                style={[styles.imageAction, { backgroundColor: colors.surface }]}
              >
                <Ionicons name="star-outline" size={14} color={colors.text} />
              </Pressable>
              <Pressable
                onPress={() => removeAt(i)}
                style={[styles.imageAction, { backgroundColor: colors.surface }]}
              >
                <Ionicons name="trash-outline" size={14} color={colors.danger} />
              </Pressable>
            </View>
          </View>
        ))}
        <Pressable onPress={addPlaceholder} style={styles.addImage}>
          <Ionicons name="add" size={28} color={colors.text} />
          <Text variant="caption" style={{ marginTop: 4 }}>
            Add photo
          </Text>
        </Pressable>
      </View>
      {errors.images && (
        <Text variant="caption" style={{ color: colors.danger, marginTop: spacing.sm }}>
          {errors.images}
        </Text>
      )}
    </View>
  );
}

function Step6({ values }: { values: ListingFormValues }) {
  return (
    <View>
      <Text variant="h2">Review & submit</Text>
      <Text variant="caption" style={{ marginBottom: spacing.lg }}>
        Make sure everything looks good before publishing.
      </Text>

      <Card padded>
        {values.images[values.coverImageIndex] && (
          <Image
            source={{ uri: values.images[values.coverImageIndex] }}
            style={styles.reviewImage}
            contentFit="cover"
          />
        )}
        <Text variant="h3" style={{ marginTop: spacing.md }}>
          {values.title || 'Untitled listing'}
        </Text>
        <Text variant="caption">
          {values.neighborhood || '—'} · {propertyTypeLabel(values.propertyType)}
        </Text>
        <Text variant="metric" style={{ marginTop: spacing.sm }}>
          {formatUSD(values.price || 0)}
        </Text>

        <View style={styles.reviewGrid}>
          <ReviewStat label="Beds" value={String(values.bedrooms)} />
          <ReviewStat label="Baths" value={String(values.bathrooms)} />
          <ReviewStat label="Area" value={`${values.squareMeters} m²`} />
          <ReviewStat label="Parking" value={String(values.parking)} />
        </View>

        <View style={styles.reviewSection}>
          <Text variant="captionStrong">Investment</Text>
          <ReviewRow label="Short-term" value={values.shortTermCapable ? 'Yes' : 'No'} />
          <ReviewRow label="Long-term" value={values.longTermCapable ? 'Yes' : 'No'} />
          <ReviewRow label="Nightly est." value={formatUSD(values.nightlyRateEstimate)} />
          <ReviewRow label="Monthly rent" value={formatUSD(values.monthlyLongTermRent)} />
        </View>
      </Card>
    </View>
  );
}

function ReviewStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text variant="micro">{label}</Text>
      <Text variant="bodyStrong" style={{ marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
}
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.reviewRow}>
      <Text variant="caption">{label}</Text>
      <Text variant="bodyStrong">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  backBtn: { padding: 4 },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  row: { flexDirection: 'row', gap: spacing.md },
  amenityWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  mapCard: { marginTop: spacing.md },
  mapPreview: {
    height: 160,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xl,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  imageWrap: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  coverBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14,27,43,0.85)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  imageActions: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    flexDirection: 'row',
    gap: 4,
  },
  imageAction: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImage: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewImage: { width: '100%', height: 180, borderRadius: radius.lg, backgroundColor: colors.surfaceAlt },
  reviewGrid: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  reviewSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  footerInner: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
});
