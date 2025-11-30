import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ClipboardCheck,
  Save,
  Send,
  School,
  MapPin,
  Camera
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface MumbaiNyayalayTapasaniFormProps {
  user: SupabaseUser;
  onBack: () => void;
  categories: any[];
  onInspectionCreated: () => void;
  editingInspection?: any;
}

type NullableNumber = number | null;

interface InspectionMeta {
  category_id: string;
  location_name: string;
  address: string;
  planned_date: string;
  latitude: NullableNumber;
  longitude: NullableNumber;
  location_accuracy: NullableNumber;
}

interface MumbaiNyayalayFormData {
  inspection_date: string;
  district_name: string;
  taluka_name: string;
  center_name: string;
  school_name: string;
  management_name: string;
  headmaster_name: string;
  udise_number: string;

  building_year: string;
  building_type: string;
  building_condition_ok: string;
  building_repair_level: string;
  building_measures: string;
  building_feedback: string;

  classrooms_as_per_students: string;
  required_rooms: string;
  available_rooms: string;
  new_required_rooms: string;
  rooms_good_condition: string;
  rooms_repair_action: string;
  rooms_repair_measures: string;
  rooms_repair_feedback: string;

  separate_toilets_available: string;
  toilets_as_per_strength: string;
  toilets_regular_cleaning: string;
  toilets_enough_water: string;

  cwsn_toilet_available: string;
  cwsn_toilet_regular_cleaning: string;
  cwsn_toilet_enough_water: string;

  drinking_water_available: string;
  water_tank_available: string;
  water_tank_capacity_liters: string;
  water_storage_type: string;
  water_tank_cleaning_done: string;
  water_tank_cleaning_interval_days: string;

    // NEW SECTIONS 6-10
  protection_devotee_type: string;
  protection_devotee_condition_ok: string;
  playground_condition: string;
  playground_ownership: string;
  playground_area: string;
  kitchen_shed_available: string;
  kitchen_shed_cleanliness: string;
  ramp_available: string;
  ramp_ratio_ok: string;
  ramp_railings: string;


electricity_available_all_rooms: string;
electricity_disconnected_bill: string;
electricity_needed_rooms_count: string;
fans_lights_condition_ok: string;

student_seating_arrangement: string;
available_benches_count: string;
required_benches_count: string;
shortage_benches_count: string;
benches_condition: string;

school_cleanliness_classrooms: string;
school_cleanliness_building: string;
school_cleanliness_playground: string;
classrooms_painting: string;
classrooms_academic_use_only: string;

illegal_citizen_use: string;
police_action_needed: string;

encroachment_status: string;
  encroachment_condition: string;

  facilities_measures: string;
  facilities_feedback: string;

  physical_facilities_remark: string;
  
}export const MumbaiNyayalayTapasaniForm: React.FC<MumbaiNyayalayTapasaniFormProps> = ({
  user,
  onBack,
  categories,
  onInspectionCreated,
  editingInspection
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const isViewMode = editingInspection?.mode === 'view';
  const isEditMode = editingInspection?.mode === 'edit';

  const [inspectionMeta, setInspectionMeta] = useState<InspectionMeta>({
    category_id: '',
    location_name: '',
    address: '',
    planned_date: '',
    latitude: null,
    longitude: null,
    location_accuracy: null
  });

  const [formData, setFormData] = useState<MumbaiNyayalayFormData>({
    inspection_date: '',
    district_name: '',
    taluka_name: '',
    center_name: '',
    school_name: '',
    management_name: '',
    headmaster_name: '',
    udise_number: '',

    building_year: '',
    building_type: '',
    building_condition_ok: '',
    building_repair_level: '',
    building_measures: '',
    building_feedback: '',

    classrooms_as_per_students: '',
    required_rooms: '',
    available_rooms: '',
    new_required_rooms: '',
    rooms_good_condition: '',
    rooms_repair_action: '',
    rooms_repair_measures: '',
    rooms_repair_feedback: '',

    separate_toilets_available: '',
    toilets_as_per_strength: '',
    toilets_regular_cleaning: '',
    toilets_enough_water: '',

    cwsn_toilet_available: '',
    cwsn_toilet_regular_cleaning: '',
    cwsn_toilet_enough_water: '',

    drinking_water_available: '',
    water_tank_available: '',
    water_tank_capacity_liters: '',
    water_storage_type: '',
    water_tank_cleaning_done: '',
    water_tank_cleaning_interval_days: '',

       // NEW FIELDS
    protection_devotee_type: '',
    protection_devotee_condition_ok: '',
    playground_condition: '',
    playground_ownership: '',
    playground_area: '',
    kitchen_shed_available: '',
    kitchen_shed_cleanliness: '',
    ramp_available: '',
    ramp_ratio_ok: '',
    ramp_railings: '',
    electricity_available_all_rooms: '',
      electricity_disconnected_bill: '',
    electricity_needed_rooms_count: '', 
      fans_lights_condition_ok: '',
    student_seating_arrangement: '',
      available_benches_count: '',
    required_benches_count: '',
      shortage_benches_count: '',
      benches_condition: '',
    school_cleanliness_classrooms: '',
      school_cleanliness_building: '',
    school_cleanliness_playground: '',
      classrooms_painting: '',
    classrooms_academic_use_only: '',
      illegal_citizen_use: '',
    police_action_needed: '',
      encroachment_status: '',
      encroachment_condition: '',

    facilities_measures: '',
    facilities_feedback: '',

    physical_facilities_remark: ''
  
  });

  useEffect(() => {
    if (editingInspection?.existingForm) {
      const f = editingInspection.existingForm;
      setFormData(prev => ({
        ...prev,
        inspection_date: f.inspection_date ?? '',
        district_name: f.district_name ?? '',
        taluka_name: f.taluka_name ?? '',
        center_name: f.center_name ?? '',
        school_name: f.school_name ?? '',
        management_name: f.management_name ?? '',
        headmaster_name: f.headmaster_name ?? '',
        udise_number: f.udise_number ?? ''
      }));

      // populate inspection meta (location) when editing
      setInspectionMeta(prev => ({
        ...prev,
        location_name: editingInspection.location_name || prev.location_name,
        address: editingInspection.address || prev.address,
        planned_date: editingInspection.planned_date ? String(editingInspection.planned_date).split('T')[0] : prev.planned_date,
        latitude: editingInspection.latitude ?? prev.latitude,
        longitude: editingInspection.longitude ?? prev.longitude,
        location_accuracy: editingInspection.location_accuracy ?? prev.location_accuracy
      }));
    }
  }, [editingInspection]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(t('fims.geolocationNotSupported') || 'Geolocation not supported');
      return;
    }

    setIsLoading(true);

    let bestPosition: GeolocationPosition | null = null;
    let watchId: number | null = null;
    let attempts = 0;
    const maxAttempts = 3;
    const accuracyThreshold = 50;

    const processLocation = async (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = position.coords.accuracy;

      setInspectionMeta(prev => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        location_accuracy: accuracy
      }));

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const locationName = data.results[0].formatted_address;
          setInspectionMeta(prev => ({ ...prev, address: locationName }));
        }
      } catch (error) {
        console.error('Error getting location name:', error);
      }
    };

    const handlePosition = async (position: GeolocationPosition) => {
      attempts++;
      const accuracy = position.coords.accuracy;

      if (!bestPosition || accuracy < bestPosition.coords.accuracy) {
        bestPosition = position;
      }

      if (accuracy <= accuracyThreshold) {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        await processLocation(position);
        setIsLoading(false);
        return;
      }

      if (attempts >= maxAttempts) {
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        if (bestPosition) await processLocation(bestPosition);
        setIsLoading(false);
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      console.error('Error getting location:', error);
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (bestPosition) processLocation(bestPosition as GeolocationPosition);
      else {
        setIsLoading(false);
        alert(t('fims.unableToGetLocation') || 'Unable to get location');
      }
      setIsLoading(false);
    };

    watchId = navigator.geolocation.watchPosition(handlePosition, handleError, {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    });

    setTimeout(() => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        if (bestPosition && attempts > 0) processLocation(bestPosition as GeolocationPosition);
        else alert('Unable to get location. Please try again or check your GPS settings.');
        setIsLoading(false);
      }
    }, 45000);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (uploadedPhotos.length + files.length > 5) {
      alert(t('fims.maxPhotosAllowed') || 'Maximum 5 photos allowed');
      return;
    }
    setUploadedPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const uploadPhotosToSupabase = async (inspectionId: string) => {
    if (uploadedPhotos.length === 0) return;
    setIsUploading(true);
    try {
      for (let i = 0; i < uploadedPhotos.length; i++) {
        const file = uploadedPhotos[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `High Court Order Inspection Form_${inspectionId}_${Date.now()}_${i}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('field-visit-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('field-visit-images').getPublicUrl(fileName) as any;
        const publicUrl = data?.publicUrl || '';

        const { error: dbError } = await supabase.from('fims_inspection_photos').insert({
          inspection_id: inspectionId,
          photo_url: publicUrl,
          photo_name: file.name,
          description: `मुंबई न्यायालय तपासणी फोटो ${i + 1}`,
          photo_order: i + 1
        });

        if (dbError) throw dbError;
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const updateField = <K extends keyof MumbaiNyayalayFormData>(
    key: K,
    value: MumbaiNyayalayFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (submit: boolean) => {
    try {
      setIsLoading(true);

      let inspectionId = editingInspection?.inspection_id as string | undefined;

      if (!inspectionId) {
        const { data, error } = await supabase
          .from('fims_inspections')
          .insert({
            category_id: inspectionMeta.category_id || null,
            location_name: inspectionMeta.location_name,
            address: inspectionMeta.address,
            planned_date: inspectionMeta.planned_date,
            created_by: user.id
          })
          .select('id')
          .single();

        if (error) throw error;
        inspectionId = data.id;
      }

      const payload = {
        inspection_id: inspectionId,
        inspection_date: formData.inspection_date,
        district_name: formData.district_name,
        taluka_name: formData.taluka_name,
        center_name: formData.center_name,
        school_name: formData.school_name,
        management_name: formData.management_name,
        headmaster_name: formData.headmaster_name,
        udise_number: formData.udise_number,
        visit_date: formData.inspection_date || null,

        building_year: formData.building_year,
        building_type: formData.building_type,
        building_condition_ok: formData.building_condition_ok === 'होय',
        building_repair_level: formData.building_repair_level || null,
        building_measures: formData.building_measures || null,
        building_feedback: formData.building_feedback || null,

        classrooms_as_per_students:
          formData.classrooms_as_per_students === 'होय',
        required_rooms: Number(formData.required_rooms || 0),
        available_rooms: Number(formData.available_rooms || 0),
        new_required_rooms: Number(formData.new_required_rooms || 0),
        rooms_good_condition: formData.rooms_good_condition === 'होय',
        rooms_repair_action: formData.rooms_repair_action || null,
        rooms_repair_measures: formData.rooms_repair_measures || null,
        rooms_repair_feedback: formData.rooms_repair_feedback || null,

        separate_toilets_available:
          formData.separate_toilets_available === 'होय',
        toilets_as_per_strength:
          formData.toilets_as_per_strength === 'होय',
        toilets_regular_cleaning:
          formData.toilets_regular_cleaning === 'होय',
        toilets_enough_water: formData.toilets_enough_water === 'होय',

        cwsn_toilet_available: formData.cwsn_toilet_available === 'होय',
        cwsn_toilet_regular_cleaning:
          formData.cwsn_toilet_regular_cleaning === 'होय',
        cwsn_toilet_enough_water:
          formData.cwsn_toilet_enough_water === 'होय',

        drinking_water_available:
          formData.drinking_water_available === 'होय',
        water_tank_available: formData.water_tank_available === 'होय',
        water_tank_capacity_liters: formData.water_tank_capacity_liters
          ? Number(formData.water_tank_capacity_liters)
          : null,
        water_storage_type: formData.water_storage_type || null,
        water_tank_cleaning_done: formData.water_tank_cleaning_done
          ? formData.water_tank_cleaning_done === 'होय'
          : null,
        water_tank_cleaning_interval_days:
          formData.water_tank_cleaning_interval_days
            ? Number(formData.water_tank_cleaning_interval_days)
            : null,

           // NEW FIELDS
        protection_devotee_type: formData.protection_devotee_type || null,
        protection_devotee_condition_ok: formData.protection_devotee_condition_ok === 'होय',
        playground_condition: formData.playground_condition === 'होय',
        playground_ownership: formData.playground_ownership || null,
        playground_area: formData.playground_area || null,
        kitchen_shed_available: formData.kitchen_shed_available === 'होय',
        kitchen_shed_cleanliness: formData.kitchen_shed_cleanliness === 'होय',
        ramp_available: formData.ramp_available === 'होय',
        ramp_ratio_ok: formData.ramp_ratio_ok === 'होय',
        ramp_railings: formData.ramp_railings === 'होय',

        // NEW PAYLOAD MAPPING (add to handleSave payload)
        electricity_available_all_rooms: formData.electricity_available_all_rooms === 'होय',
        electricity_disconnected_bill: formData.electricity_disconnected_bill === 'होय',
        electricity_needed_rooms_count: formData.electricity_needed_rooms_count ? Number(formData.electricity_needed_rooms_count) : null,
        fans_lights_condition_ok: formData.fans_lights_condition_ok === 'होय',
        
        student_seating_arrangement: formData.student_seating_arrangement || null,
        available_benches_count: formData.available_benches_count ? Number(formData.available_benches_count) : null,
        required_benches_count: formData.required_benches_count ? Number(formData.required_benches_count) : null,
        shortage_benches_count: formData.shortage_benches_count ? Number(formData.shortage_benches_count) : null,
        benches_condition: formData.benches_condition || null,
        
        school_cleanliness_classrooms: formData.school_cleanliness_classrooms === 'होय',
        school_cleanliness_building: formData.school_cleanliness_building === 'होय',
        school_cleanliness_playground: formData.school_cleanliness_playground === 'होय',
        classrooms_painting: formData.classrooms_painting === 'होय',
        classrooms_academic_use_only: formData.classrooms_academic_use_only === 'होय',
        
        illegal_citizen_use: formData.illegal_citizen_use === 'होय',
        police_action_needed: formData.police_action_needed === 'होय',
        
        encroachment_status: formData.encroachment_status === 'होय',
        encroachment_condition: formData.encroachment_condition || null,
        
        facilities_measures: formData.facilities_measures || null,
        facilities_feedback: formData.facilities_feedback || null,
        
        physical_facilities_remark: formData.physical_facilities_remark || null,
      
      };

      if (isEditMode && editingInspection?.form_id) {
        const { error } = await supabase
          .from('mumbai_high_court_school_inspection_form')
          .update(payload)
          .eq('id', editingInspection.form_id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('mumbai_high_court_school_inspection_form')
          .insert(payload);
        if (error) throw error;
      }

      // upload photos (if any)
      try {
        if (inspectionId && uploadedPhotos.length > 0) {
          await uploadPhotosToSupabase(inspectionId);
        }
      } catch (err) {
        console.error('Error uploading photos after save:', err);
      }

      if (submit) {
        await supabase
          .from('fims_inspections')
          .update({ status: 'submitted' })
          .eq('id', inspectionId);
      }

      onInspectionCreated();
    } catch (err) {
      console.error('Error saving inspection', err);
      alert('जतन करताना त्रुटी आली.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
          {editingInspection?.mode === 'view' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-800 text-sm font-medium">
                {t('fims.viewMode')} - {t('fims.formReadOnly')}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>

            <h1 className="text-lg md:text-xl font-bold text-gray-900 text-center">
              {editingInspection?.mode === 'view' ? t('fims.viewInspection') : 
               editingInspection?.mode === 'edit' ? t('fims.editInspection') : 
               t('fims.newInspection')} - मुंबई न्यायालय तपासणी प्रपत्र
            </h1>

            <div className="w-20" />
          </div>

          {/* step indicator */}
          <div className="flex items-center justify-center mb-2">
            {[1,2,3,4].map((s)=> (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= s ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {s}
                </div>
                {s < 4 && <div className={`w-16 h-1 mx-2 ${currentStep > s ? 'bg-red-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-white via-red-50/30 to-pink-50/30 rounded-xl shadow-lg border-2 border-red-200 p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center gap-2 text-xs mb-3">
            <ClipboardCheck className="w-4 h-4 text-gray-600" />
            <span className="font-semibold">पायरी {currentStep} / 4</span>
          </div>

        {/* STEP 1: basic school info */}
        {currentStep === 1 && (
          <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4">
            <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
              <School className="w-4 h-4" />
              शाळेची मूलभूत माहिती
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  तपासणी दिनांक <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.inspection_date}
                  onChange={e => updateField('inspection_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isViewMode}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">जिल्हा <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.district_name}
                  onChange={e => updateField('district_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="जिल्हाचे नाव प्रविष्ट करा"
                  disabled={isViewMode}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">तालुका <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.taluka_name}
                  onChange={e => updateField('taluka_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="तालुक्याचे नाव प्रविष्ट करा"
                  disabled={isViewMode}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  केंद्राचे नाव <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.center_name}
                  onChange={e => updateField('center_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="केंद्राचे नाव प्रविष्ट करा"
                  disabled={isViewMode}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  शाळेचे नाव <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.school_name}
                  onChange={e => updateField('school_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="शाळेचे नाव प्रविष्ट करा"
                  disabled={isViewMode}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  व्यवस्थापनाचे नाव
                </label>
                <input
                  type="text"
                  value={formData.management_name}
                  onChange={e =>
                    updateField('management_name', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="व्यवस्थापनाचे नाव प्रविष्ट करा"
                  disabled={isViewMode}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  मुख्याध्यापक / मुख्याध्यापिका <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.headmaster_name}
                  onChange={e =>
                    updateField('headmaster_name', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="मुख्याध्यापकाचे नाव प्रविष्ट करा"
                  disabled={isViewMode}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  UDISE क्रमांक
                </label>
                <input
                  type="text"
                  value={formData.udise_number}
                  onChange={e => updateField('udise_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="UDISE क्रमांक प्रविष्ट करा"
                  disabled={isViewMode}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded"
              >
                पुढे
              </button>
            </div>
          </section>
        )}

        {/* STEP 2: Location step (new) */}
        {currentStep === 2 && (
          <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
            <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              स्थान माहिती (Location Information)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold">स्थानाचे नाव *</label>
                <input
                  type="text"
                  value={inspectionMeta.location_name}
                  onChange={e => setInspectionMeta(prev => ({ ...prev, location_name: e.target.value }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isViewMode}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold">नियोजित तारीख</label>
                  <input
                    type="date"
                    value={inspectionMeta.planned_date}
                    onChange={e => setInspectionMeta(prev => ({ ...prev, planned_date: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    disabled={isViewMode}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold">GPS Location</label>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isLoading || isViewMode}
                    className="w-full px-3 py-1.5 bg-blue-600 text-white rounded text-xs"
                  >
                    {isLoading ? 'स्थान मिळवत आहे...' : 'सध्याचे स्थान मिळवा'}
                  </button>
                </div>
              </div>

              {inspectionMeta.latitude && inspectionMeta.longitude && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded text-xs">
                  <p>
                    Latitude: {inspectionMeta.latitude?.toFixed(6)} | Longitude: {inspectionMeta.longitude?.toFixed(6)}
                  </p>
                  {inspectionMeta.location_accuracy && (
                    <p className="text-xs">Accuracy: {Math.round(inspectionMeta.location_accuracy)}m</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold">संपूर्ण पत्ता</label>
                <textarea
                  value={inspectionMeta.address}
                  onChange={e => setInspectionMeta(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isViewMode}
                />
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button onClick={() => setCurrentStep(1)} className="px-4 py-1.5 text-xs bg-gray-200 rounded">मागे</button>
              <button onClick={() => setCurrentStep(3)} className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded">पुढे</button>
            </div>
          </section>
        )}

        {/* STEP 3: इमारत + वर्ग खोल्या + मुलांसाठी स्वच्छतागृह (combined form) */}
        {currentStep === 3 && (
          <>
            {/* SECTION 1: इमारत */}
            <section className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-5 md:p-6 space-y-5 mt-4 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 bg-white px-4 py-2.5 rounded-lg shadow-sm border-l-4 border-red-600 flex items-center gap-2">
                <span className="bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">१</span>
                शाळा इमारत बांधकाम
              </h2>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      (अ) शाळा इमारत बांधकाम वर्ष
                    </label>
                    <input
                      type="number"
                      min={1900}
                      max={2100}
                      value={formData.building_year}
                      onChange={e =>
                        updateField('building_year', e.target.value.slice(0, 4))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center font-mono focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="उदा. 2025"
                      disabled={isViewMode}
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      (ब) शाळा बांधकाम प्रकार
                    </label>
                    <select
                      value={formData.building_type}
                      onChange={e =>
                        updateField('building_type', e.target.value)
                      }
                      className="w-full md:w-2/3 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={isViewMode}
                    >
                      <option value="">-- निवडा --</option>
                      <option value="आर.सी.सी. बांधकाम">
                        आर.सी.सी. बांधकाम
                      </option>
                      <option value="पक्के बांधकाम / कौला बांधकाम">
                        पक्के बांधकाम / कौला बांधकाम
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">
                      (क) इमारत सुस्थितीत आहे का ?
                    </p>
                    <div className="flex gap-6 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="building_condition_ok"
                          value="होय"
                          checked={formData.building_condition_ok === 'होय'}
                          onChange={e =>
                            updateField('building_condition_ok', e.target.value)
                          }
                          disabled={isViewMode}
                          className="w-4 h-4 text-red-600 focus:ring-red-500"
                        />
                        <span>होय</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="building_condition_ok"
                          value="नाही"
                          checked={formData.building_condition_ok === 'नाही'}
                          onChange={e =>
                            updateField('building_condition_ok', e.target.value)
                          }
                          disabled={isViewMode}
                          className="w-4 h-4 text-red-600 focus:ring-red-500"
                        />
                        <span>नाही</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">
                      (ड) दुरुस्तीची गरज असल्यास प्रकार
                    </p>
                    <select
                      value={formData.building_repair_level}
                      onChange={e =>
                        updateField('building_repair_level', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={isViewMode}
                    >
                      <option value="">-- निवडा --</option>
                      <option value="सूक्ष्म दुरुस्ती">सूक्ष्म दुरुस्ती</option>
                      <option value="मध्यम दुरुस्ती">मध्यम दुरुस्ती</option>
                      <option value="पूर्ण दुरुस्ती / नवे बांधकाम">
                        पूर्ण दुरुस्ती / नवे बांधकाम
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold">
                    उपाययोजना
                  </label>
                  <textarea
                    rows={3}
                    value={formData.building_measures}
                    onChange={e =>
                      updateField('building_measures', e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    placeholder="इमारतीसंबंधी करावयाच्या उपाययोजना"
                    disabled={isViewMode}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold">
                    अभिप्राय
                  </label>
                  <textarea
                    rows={3}
                    value={formData.building_feedback}
                    onChange={e =>
                      updateField('building_feedback', e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    placeholder="इमारतीविषयी निरीक्षकांचा अभिप्राय"
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </section>

            {/* SECTION 2: वर्ग खोल्यांचा तपशील */}
            <section className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-5 md:p-6 space-y-5 mt-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-800 bg-white px-4 py-2.5 rounded-lg shadow-sm border-l-4 border-blue-600 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">२</span>
                वर्ग खोल्यांचा तपशील
              </h2>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700">
                    (अ) विद्यार्थ्यांच्या प्रमाणात वर्ग खोल्या आहेत का ?
                  </p>
                  <div className="flex gap-6 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="classrooms_as_per_students"
                        value="होय"
                        checked={
                          formData.classrooms_as_per_students === 'होय'
                        }
                        onChange={e =>
                          updateField(
                            'classrooms_as_per_students',
                            e.target.value
                          )
                        }
                        disabled={isViewMode}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span>होय</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="classrooms_as_per_students"
                        value="नाही"
                        checked={
                          formData.classrooms_as_per_students === 'नाही'
                        }
                        onChange={e =>
                          updateField(
                            'classrooms_as_per_students',
                            e.target.value
                          )
                        }
                        disabled={isViewMode}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span>नाही</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      १) आवश्यक खोल्यांची संख्या.
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.required_rooms}
                      onChange={e =>
                        updateField('required_rooms', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      disabled={isViewMode}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      २) उपलब्ध खोल्यांची संख्या.
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.available_rooms}
                      onChange={e =>
                        updateField('available_rooms', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      disabled={isViewMode}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      ३) नव्याने आवश्यक असणाऱ्या खोल्यांची संख्या.
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.new_required_rooms}
                      onChange={e =>
                        updateField('new_required_rooms', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">
                      ४) खोल्या सुस्थितीत आहेत का ?
                    </p>
                    <div className="flex gap-6 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rooms_good_condition"
                          value="होय"
                          checked={formData.rooms_good_condition === 'होय'}
                          onChange={e =>
                            updateField('rooms_good_condition', e.target.value)
                          }
                          disabled={isViewMode}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span>होय</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rooms_good_condition"
                          value="नाही"
                          checked={formData.rooms_good_condition === 'नाही'}
                          onChange={e =>
                            updateField('rooms_good_condition', e.target.value)
                          }
                          disabled={isViewMode}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span>नाही</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">
                      ५) दुरुस्ती आवश्यक आहे का ? असल्‍यास काय दुरुस्ती ?
                    </p>
                    <select
                      value={formData.rooms_repair_action}
                      onChange={e =>
                        updateField('rooms_repair_action', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isViewMode}
                    >
                      <option value="">-- निवडा --</option>
                      <option value="सूक्ष्म दुरुस्ती">सूक्ष्म दुरुस्ती</option>
                      <option value="मध्यम दुरुस्ती">मध्यम दुरुस्ती</option>
                      <option value="पूर्ण दुरुस्ती / नवे बांधकाम">
                        पूर्ण दुरुस्ती / नवे बांधकाम
                    </option>
                  </select>
                </div>
              </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">
                    उपाययोजना
                  </label>
                  <textarea
                    rows={3}
                    value={formData.rooms_repair_measures}
                    onChange={e =>
                      updateField('rooms_repair_measures', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="खोल्यांसंबंधी करावयाच्या उपाययोजना"
                    disabled={isViewMode}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">
                    अभिप्राय
                  </label>
                  <textarea
                    rows={3}
                    value={formData.rooms_repair_feedback}
                    onChange={e =>
                      updateField('rooms_repair_feedback', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="खोल्यांविषयी निरीक्षकांचा अभिप्राय"
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </section>

            {/* SECTION 3: मुलांसाठी व मुलीसाठी स्वच्छतागृह */}
            <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
              <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                ३. मुलांसाठी व मुलीसाठी स्वच्छतागृह
              </h2>

              <div className="space-y-2">
                <p className="text-sm font-semibold">
                  (अ) मुलांसाठी व मुलीसाठी स्वतंत्र स्वच्छतागृह उपलब्ध आहे का ?
                </p>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="separate_toilets_available"
                      value="होय"
                      checked={
                        formData.separate_toilets_available === 'होय'
                      }
                      onChange={e =>
                        updateField(
                          'separate_toilets_available',
                          e.target.value
                        )
                      }
                      disabled={isViewMode}
                    />
                    <span>होय</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="separate_toilets_available"
                      value="नाही"
                      checked={
                        formData.separate_toilets_available === 'नाही'
                      }
                      onChange={e =>
                        updateField(
                          'separate_toilets_available',
                          e.target.value
                        )
                      }
                      disabled={isViewMode}
                    />
                    <span>नाही</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold">
                    १) विद्यार्थ्यांच्या संख्येच्या प्रमाणात स्वच्छतागृहे
                    उपलब्ध आहेत का ?
                  </p>
                  <div className="flex gap-6 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="toilets_as_per_strength"
                        value="होय"
                        checked={
                          formData.toilets_as_per_strength === 'होय'
                        }
                        onChange={e =>
                          updateField(
                            'toilets_as_per_strength',
                            e.target.value
                          )
                        }
                        disabled={isViewMode}
                      />
                      <span>होय</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="toilets_as_per_strength"
                        value="नाही"
                        checked={
                          formData.toilets_as_per_strength === 'नाही'
                        }
                        onChange={e =>
                          updateField(
                            'toilets_as_per_strength',
                            e.target.value
                          )
                        }
                        disabled={isViewMode}
                      />
                      <span>नाही</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold">
                    २) शौचालयांची नियमित स्वच्छता होते का ?
                  </p>
                  <div className="flex gap-6 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="toilets_regular_cleaning"
                        value="होय"
                        checked={
                          formData.toilets_regular_cleaning === 'होय'
                        }
                        onChange={e =>
                          updateField(
                            'toilets_regular_cleaning',
                            e.target.value
                          )
                        }
                        disabled={isViewMode}
                      />
                      <span>होय</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="toilets_regular_cleaning"
                        value="नाही"
                        checked={
                          formData.toilets_regular_cleaning === 'नाही'
                        }
                        onChange={e =>
                          updateField(
                            'toilets_regular_cleaning',
                            e.target.value
                          )
                        }
                        disabled={isViewMode}
                      />
                      <span>नाही</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold">
                    ३) शौचालयांमध्ये पाण्याची मुबलक सोय आहे का ?
                  </p>
                  <div className="flex gap-6 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="toilets_enough_water"
                        value="होय"
                        checked={
                          formData.toilets_enough_water === 'होय'
                        }
                        onChange={e =>
                          updateField(
                            'toilets_enough_water',
                            e.target.value
                          )
                        }
                        disabled={isViewMode}
                      />
                      <span>होय</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="toilets_enough_water"
                        value="नाही"
                        checked={
                          formData.toilets_enough_water === 'नाही'
                        }
                        onChange={e =>
                          updateField(
                            'toilets_enough_water',
                            e.target.value
                          )
                        }
                        disabled={isViewMode}
                      />
                      <span>नाही</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* many following sections (classrooms, toilets, CWSN, water, etc.) are already present below; keep them as part of this combined step */}
          </>
        )}

        {/* STEP 3: CWSN + पिण्याचे पाणी */}
        {currentStep === 3 && (
          <>
            {/* SECTION 4: CWSN */}
            <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
              <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                ४. विशेष गरजा असलेल्या विद्यार्थ्यांसाठी (CWSN) स्वच्छतागृह
              </h2>

              <div className="space-y-2">
                <p className="text-sm font-semibold">
                  (अ) CWSN विद्यार्थ्यांसाठी स्वतंत्र स्वच्छतागृह आहे का ?
                </p>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cwsn_toilet_available"
                      value="होय"
                      checked={formData.cwsn_toilet_available === 'होय'}
                      onChange={e =>
                        updateField('cwsn_toilet_available', e.target.value)
                      }
                      disabled={isViewMode}
                    />
                    <span>होय</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="cwsn_toilet_available"
                      value="नाही"
                      checked={formData.cwsn_toilet_available === 'नाही'}
                      onChange={e =>
                        updateField('cwsn_toilet_available', e.target.value)
                      }
                      disabled={isViewMode}
                    />
                    <span>नाही</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold">
                    १) CWSN शौचालयाची नियमित स्वच्छता होते का ?
                  </p>
                  <div className="flex gap-6 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="cwsn_toilet_regular_cleaning"
                        value="होय"
                        checked={
                          formData.cwsn_toilet_regular_cleaning === 'होय'
                        }
                        onChange={e =>
                          updateField(
                            'cwsn_toilet_regular_cleaning',
                            e.target.value
                          )
                        }
                        disabled={isViewMode}
                      />
                      <span>होय</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="cwsn_toilet_regular_cleaning"
                        value="नाही"
                        checked={
                          formData.cwsn_toilet_regular_cleaning === 'नाही'
                        }
                        onChange={e =>
                          updateField(
                            'cwsn_toilet_regular_cleaning',
                            e.target.value
                          )
                        }
                        disabled={isViewMode}
                      />
                      <span>नाही</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold">
                    २) CWSN शौचालयामध्ये पाण्याची मुबलक सोय आहे का ?
                  </p>
                  <div className="flex gap-6 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="cwsn_toilet_enough_water"
                        value="होय"
                        checked={
                          formData.cwsn_toilet_enough_water === 'होय'
                        }
                        onChange={e =>
                          updateField(
                            'cwsn_toilet_enough_water',
                            e.target.value
                          )
                        }
                        disabled={isViewMode}
                      />
                      <span>होय</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="cwsn_toilet_enough_water"
                        value="नाही"
                        checked={
                          formData.cwsn_toilet_enough_water === 'नाही'
                        }
                        onChange={e =>
                          updateField(
                            'cwsn_toilet_enough_water',
                            e.target.value
                          )
                        }
                        disabled={isViewMode}
                      />
                      <span>नाही</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5: पिण्याचे / वापराचे पाणी */}
            <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
              <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                ५. मुलांना पिण्याचे स्वच्छ पाणी व वापरासाठी पाणी
              </h2>

              <div className="space-y-2">
                <p className="text-sm font-semibold">
                  मुलांना पिण्याचे स्वच्छ पाणी व वापरासाठी पाणी पुरेशा
                  प्रमाणात उपलब्ध आहे का ?
                </p>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="drinking_water_available"
                      value="होय"
                      checked={
                        formData.drinking_water_available === 'होय'
                      }
                      onChange={e =>
                        updateField(
                          'drinking_water_available',
                          e.target.value
                        )
                      }
                      disabled={isViewMode}
                    />
                    <span>होय</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="drinking_water_available"
                      value="नाही"
                      checked={
                        formData.drinking_water_available === 'नाही'
                      }
                      onChange={e =>
                        updateField(
                          'drinking_water_available',
                          e.target.value
                        )
                      }
                      disabled={isViewMode}
                    />
                    <span>नाही</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold">
                      १) पाणी साठवणेसाठी टाकी उपलब्ध आहे का ?
                    </p>
                    <div className="flex gap-6 text-xs">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="water_tank_available"
                          value="होय"
                          checked={
                            formData.water_tank_available === 'होय'
                          }
                          onChange={e =>
                            updateField(
                              'water_tank_available',
                              e.target.value
                            )
                          }
                          disabled={isViewMode}
                        />
                        <span>होय</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="water_tank_available"
                          value="नाही"
                          checked={
                            formData.water_tank_available === 'नाही'
                          }
                          onChange={e =>
                            updateField(
                              'water_tank_available',
                              e.target.value
                            )
                          }
                          disabled={isViewMode}
                        />
                        <span>नाही</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">
                      असल्यास क्षमता (लीटर मध्ये)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.water_tank_capacity_liters}
                      onChange={e =>
                        updateField(
                          'water_tank_capacity_liters',
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-right"
                      placeholder="उदा. 1000"
                      disabled={isViewMode}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold">
                    २) पाणी साठवणुकीचा प्रकार (पीप, जार, टाकी इ.)
                  </p>
                  <input
                    type="text"
                    value={formData.water_storage_type}
                    onChange={e =>
                      updateField('water_storage_type', e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    placeholder="उदा. पीप, प्लॅस्टिक टाकी, जार इ."
                    disabled={isViewMode}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold">
                      ३) पाणी साठवणीच्या टाकीची स्वच्छता करण्यात येते का ?
                    </p>
                    <div className="flex gap-6 text-xs">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="water_tank_cleaning_done"
                          value="होय"
                          checked={
                            formData.water_tank_cleaning_done === 'होय'
                          }
                          onChange={e =>
                            updateField(
                              'water_tank_cleaning_done',
                              e.target.value
                            )
                          }
                          disabled={isViewMode}
                        />
                        <span>होय</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="water_tank_cleaning_done"
                          value="नाही"
                          checked={
                            formData.water_tank_cleaning_done === 'नाही'
                          }
                          onChange={e =>
                            updateField(
                              'water_tank_cleaning_done',
                              e.target.value
                            )
                          }
                          disabled={isViewMode}
                        />
                        <span>नाही</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">
                      असल्यास किती दिवसांच्या अंतराने ?
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.water_tank_cleaning_interval_days}
                      onChange={e =>
                        updateField(
                          'water_tank_cleaning_interval_days',
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-right"
                      placeholder="उदा. ३० दिवसांनी"
                      disabled={isViewMode}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: संरक्षक भक्त */}
            <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
              <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                ६. संरक्षक भक्त
              </h2>
              <div className="space-y-1 md:col-span-2">
                <label className="block text-xs font-semibold">(अ) पाकी भक्त / तारेचे कंु</label>
                <select value={formData.protection_devotee_type} onChange={e => updateField('protection_devotee_type', e.target.value)}
                  className="w-full md:w-2/3 px-2 py-1 border border-gray-300 rounded text-xs bg-white" disabled={isViewMode}>
                  <option value="">-- निवडा --</option>
                  <option value="पाकी भक्त">पाकी भक्त</option>
                  <option value="तारेचे कंु">तारेचे कंु</option>
                  <option value="दोन्ही">दोन्ही</option>
                  <option value="नाही">नाही</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">(ब) संरक्षक भक्त सुस्थितीत आहे का?</p>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="protection_devotee_condition_ok" value="होय"
                      checked={formData.protection_devotee_condition_ok === 'होय'}
                      onChange={e => updateField('protection_devotee_condition_ok', e.target.value)} disabled={isViewMode} />
                    <span>होय</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="protection_devotee_condition_ok" value="नाही"
                      checked={formData.protection_devotee_condition_ok === 'नाही'}
                      onChange={e => updateField('protection_devotee_condition_ok', e.target.value)} disabled={isViewMode} />
                    <span>नाही</span>
                  </label>
                </div>
              </div>
            </section>

            {/* SECTION 8: खेळण्यासाठी मैदान */}
            <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
              <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                ८. मुलांना खेळण्यासाठी मैदान
              </h2>
              <div className="space-y-2">
                <p className="text-sm font-semibold">१. मैदानाची स्थिती</p>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="playground_condition" value="होय"
                      checked={formData.playground_condition === 'होय'}
                      onChange={e => updateField('playground_condition', e.target.value)} disabled={isViewMode} />
                    <span>होय</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="playground_condition" value="नाही"
                      checked={formData.playground_condition === 'नाही'}
                      onChange={e => updateField('playground_condition', e.target.value)} disabled={isViewMode} />
                    <span>नाही</span>
                  </label>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold">२. शासकीय / खाजगी जागा /सार्वजनिक</label>
                <select value={formData.playground_ownership} onChange={e => updateField('playground_ownership', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white" disabled={isViewMode}>
                  <option value="">-- निवडा --</option>
                  <option value="शासकीय">शासकीय</option>
                  <option value="खाजगी">खाजगी</option>
                  <option value="सार्वजनिक">सार्वजनिक</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold">३. क्षेत्रफळ किती ?</label>
                <input type="text" value={formData.playground_area}
                  onChange={e => updateField('playground_area', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs" placeholder="उदा. 5000 चौरस फूट"
                  disabled={isViewMode} />
              </div>
            </section>

            {/* SECTION 9: किचनशेड */}
            <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
              <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                ९. किचनशेड उपलब्ध आहे का ? व स्थिती
              </h2>
              <div className="space-y-2">
                <p className="text-sm font-semibold">किचनशेड उपलब्ध आहे का ?</p>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="kitchen_shed_available" value="होय"
                      checked={formData.kitchen_shed_available === 'होय'}
                      onChange={e => updateField('kitchen_shed_available', e.target.value)} disabled={isViewMode} />
                    <span>होय</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="kitchen_shed_available" value="नाही"
                      checked={formData.kitchen_shed_available === 'नाही'}
                      onChange={e => updateField('kitchen_shed_available', e.target.value)} disabled={isViewMode} />
                    <span>नाही</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold">स्वच्छता आहे का ?</p>
                <div className="flex gap-6 text-xs">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="kitchen_shed_cleanliness" value="होय"
                      checked={formData.kitchen_shed_cleanliness === 'होय'}
                      onChange={e => updateField('kitchen_shed_cleanliness', e.target.value)} disabled={isViewMode} />
                    <span>होय</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="kitchen_shed_cleanliness" value="नाही"
                      checked={formData.kitchen_shed_cleanliness === 'नाही'}
                      onChange={e => updateField('kitchen_shed_cleanliness', e.target.value)} disabled={isViewMode} />
                    <span>नाही</span>
                  </label>
                </div>
              </div>
            </section>

            {/* SECTION 10: उताराचा रॅम्प */}
            <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
              <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                १०. उताराचा रॅम्प (Ramp) आहे का ?
              </h2>
              <div className="space-y-2">
                <p className="text-sm font-semibold">रॅम्प उपलब्ध आहे का ?</p>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="ramp_available" value="होय"
                      checked={formData.ramp_available === 'होय'}
                      onChange={e => updateField('ramp_available', e.target.value)} disabled={isViewMode} />
                    <span>होय</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="ramp_available" value="नाही"
                      checked={formData.ramp_available === 'नाही'}
                      onChange={e => updateField('ramp_available', e.target.value)} disabled={isViewMode} />
                    <span>नाही</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold">निकषा प्रमाणे आहे का ? (उतार 1:12)</p>
                <div className="flex gap-6 text-xs">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="ramp_ratio_ok" value="होय"
                      checked={formData.ramp_ratio_ok === 'होय'}
                      onChange={e => updateField('ramp_ratio_ok', e.target.value)} disabled={isViewMode} />
                    <span>होय</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="ramp_ratio_ok" value="नाही"
                      checked={formData.ramp_ratio_ok === 'नाही'}
                      onChange={e => updateField('ramp_ratio_ok', e.target.value)} disabled={isViewMode} />
                    <span>नाही</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold">दोन्ही बाजुने कठडे आहेत का ?</p>
                <div className="flex gap-6 text-xs">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="ramp_railings" value="होय"
                      checked={formData.ramp_railings === 'होय'}
                      onChange={e => updateField('ramp_railings', e.target.value)} disabled={isViewMode} />
                    <span>होय</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="ramp_railings" value="नाही"
                      checked={formData.ramp_railings === 'नाही'}
                      onChange={e => updateField('ramp_railings', e.target.value)} disabled={isViewMode} />
                    <span>नाही</span>
                  </label>
                </div>
              </div>
            </section>
              { /* SECTION 11: शाळेमध्ये लाईटची सोय */}
              <section className="bg-white border rounded-lg p-4 md:p-5 space-य-4 mt-4">
                <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  ११. शाळेमध्ये लाईटची सोय आहे का ?
                </h2>
                
                <div className="space-y-2">
                  <p className="text-sm font-semibold">१. सर्व खोल्यांमध्ये वीज उपलब्ध आहे का ?</p>
                  <div className="flex gap-6 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="electricity_available_all_rooms" value="होय"
                        checked={formData.electricity_available_all_rooms === 'होय'}
                        onChange={e => updateField('electricity_available_all_rooms', e.target.value)} disabled={isViewMode} />
                      <span>होय</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="electricity_available_all_rooms" value="नाही"
                        checked={formData.electricity_available_all_rooms === 'नाही'}
                        onChange={e => updateField('electricity_available_all_rooms', e.target.value)} disabled={isViewMode} />
                      <span>नाही</span>
                    </label>
                  </div>
                </div>
              
                <div className="space-y-2">
                  <p className="text-sm font-semibold">२. वीज बिल भरणा न केल्यामुळे बंद आहे का ?</p>
                  <div className="flex gap-6 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="electricity_disconnected_bill" value="होय"
                        checked={formData.electricity_disconnected_bill === 'होय'}
                        onChange={e => updateField('electricity_disconnected_bill', e.target.value)} disabled={isViewMode} />
                      <span>होय</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="electricity_disconnected_bill" value="नाही"
                        checked={formData.electricity_disconnected_bill === 'नाही'}
                        onChange={e => updateField('electricity_disconnected_bill', e.target.value)} disabled={isViewMode} />
                      <span>नाही</span>
                    </label>
                  </div>
                </div>
              
                <div className="space-y-1">
                  <label className="block text-xs font-semibold">३. वीज जोडणी / दुरुस्ती आवश्यक असणाऱ्या खोल्यांची संख्या</label>
                  <input type="number" min={0} value={formData.electricity_needed_rooms_count}
                    onChange={e => updateField('electricity_needed_rooms_count', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-right" placeholder="0"
                    disabled={isViewMode} />
                </div>
              
                <div className="space-y-2">
                  <p className="text-sm font-semibold">४. शाळेत पंखा व लाईट्स सुस्थितीत आहेत का ?</p>
                  <div className="flex gap-6 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="fans_lights_condition_ok" value="होय"
                        checked={formData.fans_lights_condition_ok === 'होय'}
                        onChange={e => updateField('fans_lights_condition_ok', e.target.value)} disabled={isViewMode} />
                      <span>होय</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="fans_lights_condition_ok" value="नाही"
                        checked={formData.fans_lights_condition_ok === 'नाही'}
                        onChange={e => updateField('fans_lights_condition_ok', e.target.value)} disabled={isViewMode} />
                      <span>नाही</span>
                    </label>
                  </div>
                </div>
              </section>
              
              {/* SECTION 12: विद्यार्थ्यांना बसण्याची बैठक व्यवस्था */}
              <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
                <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  १२. विद्यार्थ्यांना बसण्याची बैठक व्यवस्था
                </h2>
                
                <div className="space-y-1">
                  <label className="block text-xs font-semibold">१. बेंचवर / फरशीवर / जिमनीवर</label>
                  <select value={formData.student_seating_arrangement} 
                    onChange={e => updateField('student_seating_arrangement', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white" disabled={isViewMode}>
                    <option value="">-- निवडा --</option>
                    <option value="बेंचवर">बेंचवर</option>
                    <option value="फरशीवर">फरशीवर</option>
                    <option value="जिमनीवर">जिमनीवर</option>
                  </select>
                </div>
              
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">२. उपलब्ध बेंच संख्या</label>
                    <input type="number" min={0} value={formData.available_benches_count}
                      onChange={e => updateField('available_benches_count', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-right" placeholder="0" disabled={isViewMode} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">३. आवश्यक बेंच संख्या</label>
                    <input type="number" min={0} value={formData.required_benches_count}
                      onChange={e => updateField('required_benches_count', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-right" placeholder="0" disabled={isViewMode} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">४. कमी असणाऱ्या बेंच संख्या</label>
                    <input type="number" min={0} value={formData.shortage_benches_count}
                      onChange={e => updateField('shortage_benches_count', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-right" placeholder="0" disabled={isViewMode} />
                  </div>
                </div>
              
                <div className="space-y-1">
                  <label className="block text-xs font-semibold">५. मुलांना बसण्याचे बेंचची स्थिती काय आहे?</label>
                  <textarea rows={2} value={formData.benches_condition}
                    onChange={e => updateField('benches_condition', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs" placeholder="बेंचची स्थितीचे वर्णन"
                    disabled={isViewMode} />
                </div>
              </section>
              
              {/* SECTION 13: शाळा व शाळा परिसर स्वच्छ  */}
              <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
                <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  १३. शाळा व शाळा परिसर स्वच्छ आहे का ?
                </h2>
                
                <div className="space-y-2">
                  <p className="text-xs font-semibold">१. वर्ग खोल्या</p>
                  <div className="flex gap-6 text-xs">
                    <label className="flex items-center gap-2"><input type="radio" name="school_cleanliness_classrooms" value="होय" checked={formData.school_cleanliness_classrooms === 'होय'} onChange={e => updateField('school_cleanliness_classrooms', e.target.value)} disabled={isViewMode} /><span>होय</span></label>
                    <label className="flex items-center gap-2"><input type="radio" name="school_cleanliness_classrooms" value="नाही" checked={formData.school_cleanliness_classrooms === 'नाही'} onChange={e => updateField('school_cleanliness_classrooms', e.target.value)} disabled={isViewMode} /><span>नाही</span></label>
                  </div>
                </div>
              
                <div className="space-y-2">
                  <p className="text-xs font-semibold">२. इमारत</p>
                  <div className="flex gap-6 text-xs">
                    <label className="flex items-center gap-2"><input type="radio" name="school_cleanliness_building" value="होय" checked={formData.school_cleanliness_building === 'होय'} onChange={e => updateField('school_cleanliness_building', e.target.value)} disabled={isViewMode} /><span>होय</span></label>
                    <label className="flex items-center gap-2"><input type="radio" name="school_cleanliness_building" value="नाही" checked={formData.school_cleanliness_building === 'नाही'} onChange={e => updateField('school_cleanliness_building', e.target.value)} disabled={isViewMode} /><span>नाही</span></label>
                  </div>
                </div>
              
                <div className="space-y-2">
                  <p className="text-xs font-semibold">३. मैदान / शाळेचा परिसर</p>
                  <div className="flex gap-6 text-xs">
                    <label className="flex items-center gap-2"><input type="radio" name="school_cleanliness_playground" value="होय" checked={formData.school_cleanliness_playground === 'होय'} onChange={e => updateField('school_cleanliness_playground', e.target.value)} disabled={isViewMode} /><span>होय</span></label>
                    <label className="flex items-center gap-2"><input type="radio" name="school_cleanliness_playground" value="नाही" checked={formData.school_cleanliness_playground === 'नाही'} onChange={e => updateField('school_cleanliness_playground', e.target.value)} disabled={isViewMode} /><span>नाही</span></label>
                  </div>
                </div>
              
                <div className="space-y-2">
                  <p className="text-xs font-semibold">४. वर्गखोल्यांची रंगरंगोटी आहे का ?</p>
                  <div className="flex gap-6 text-xs">
                    <label className="flex items-center gap-2"><input type="radio" name="classrooms_painting" value="होय" checked={formData.classrooms_painting === 'होय'} onChange={e => updateField('classrooms_painting', e.target.value)} disabled={isViewMode} /><span>होय</span></label>
                    <label className="flex items-center gap-2"><input type="radio" name="classrooms_painting" value="नाही" checked={formData.classrooms_painting === 'नाही'} onChange={e => updateField('classrooms_painting', e.target.value)} disabled={isViewMode} /><span>नाही</span></label>
                  </div>
                </div>
              
                <div className="space-y-2">
                  <p className="text-xs font-semibold">५. वर्गखोल्यांचा वापर शैक्षणिक कामकाजासाठीच होतो का ?</p>
                  <p className="text-xs text-gray-600">इतर कामांसाठी उदा. शेळया बांधणे, गोठा, दुकान, व्यवस्थितपणे नसलेली यादी</p>
                  <div className="flex gap-6 text-xs">
                    <label className="flex items-center gap-2"><input type="radio" name="classrooms_academic_use_only" value="होय" checked={formData.classrooms_academic_use_only === 'होय'} onChange={e => updateField('classrooms_academic_use_only', e.target.value)} disabled={isViewMode} /><span>होय</span></label>
                    <label className="flex items-center gap-2"><input type="radio" name="classrooms_academic_use_only" value="नाही" checked={formData.classrooms_academic_use_only === 'नाही'} onChange={e => updateField('classrooms_academic_use_only', e.target.value)} disabled={isViewMode} /><span>नाही</span></label>
                  </div>
                </div>
              </section>
              
              {/* SECTION 14: अवैध वापर */}
              <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
                <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  १४. शाळा इमारतीचा / शाळा परिसराचा वापर नागरिकांकडून अवैध कामासाठी केला जातो का ?
                </h2>
                
                <div className="space-y-2">
                  <p className="text-sm font-semibold">कायदा व सुव्यवस्थेचा भंग होतो का ?</p>
                  <div className="flex gap-6 text-sm">
                    <label className="flex items-center gap-2"><input type="radio" name="illegal_citizen_use" value="होय" checked={formData.illegal_citizen_use === 'होय'} onChange={e => updateField('illegal_citizen_use', e.target.value)} disabled={isViewMode} /><span>होय</span></label>
                    <label className="flex items-center gap-2"><input type="radio" name="illegal_citizen_use" value="नाही" checked={formData.illegal_citizen_use === 'नाही'} onChange={e => updateField('illegal_citizen_use', e.target.value)} disabled={isViewMode} /><span>नाही</span></label>
                  </div>
                </div>
              
                <div className="space-y-2">
                  <p className="text-sm font-semibold">पोलिस प्रशासनाने दखल घेवून बंदोबस्त करणे आवश्यक आहे का ?</p>
                  <div className="flex gap-6 text-sm">
                    <label className="flex items-center gap-2"><input type="radio" name="police_action_needed" value="होय" checked={formData.police_action_needed === 'होय'} onChange={e => updateField('police_action_needed', e.target.value)} disabled={isViewMode} /><span>होय</span></label>
                    <label className="flex items-center gap-2"><input type="radio" name="police_action_needed" value="नाही" checked={formData.police_action_needed === 'नाही'} onChange={e => updateField('police_action_needed', e.target.value)} disabled={isViewMode} /><span>नाही</span></label>
                  </div>
                </div>
              </section>
              
               {/* SECTION 15: अतिक्रमण  */}
              <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
                <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  १५. शाळेच्या इमारत व जागेवर अतिक्रमण झाले आहे का?
                </h2>
                
                <div className="space-y-2">
                  <p className="text-sm font-semibold">असल्यास काय स्थिती</p>
                  <div className="flex gap-6 text-sm">
                    <label className="flex items-center gap-2"><input type="radio" name="encroachment_status" value="होय" checked={formData.encroachment_status === 'होय'} onChange={e => updateField('encroachment_status', e.target.value)} disabled={isViewMode} /><span>होय</span></label>
                    <label className="flex items-center gap-2"><input type="radio" name="encroachment_status" value="नाही" checked={formData.encroachment_status === 'नाही'} onChange={e => updateField('encroachment_status', e.target.value)} disabled={isViewMode} /><span>नाही</span></label>
                  </div>
                </div>
              
                <div className="space-y-1">
                  <label className="block text-xs font-semibold">अतिक्रमणाची स्थितीचे वर्णन</label>
                  <textarea rows={3} value={formData.encroachment_condition}
                    onChange={e => updateField('encroachment_condition', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs" placeholder="अतिक्रमणाची स्थिती वर्णन"
                    disabled={isViewMode} />
                </div>
              </section>
              
              {/* SECTION 16: उपाययोजना व अभिप्राय */}
              <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
                <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  १६. भौतिक सुविधा व इतर बाबीबाबत उपाययोजना व अभिप्राय
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">करावयाच्या उपाययोजना (Measures to be taken)</label>
                    <textarea rows={4} value={formData.facilities_measures}
                      onChange={e => updateField('facilities_measures', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs" 
                      placeholder="भौतिक सुविधांसंबंधी करावयाच्या उपाययोजना"
                      disabled={isViewMode} />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">अभिप्राय (Remarks/Opinion)</label>
                    <textarea rows={4} value={formData.facilities_feedback}
                      onChange={e => updateField('facilities_feedback', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs" 
                      placeholder="भौतिक सुविधांविषयी निरीक्षकांचा अभिप्राय"
                      disabled={isViewMode} />
                  </div>
                </div>
              </section>
              
            
              <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
                <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  १७. भौतिक सुविधा व इतर बाबीबाबत उलेखनीय बाबी
                </h2>
                
                <div className="space-y-1">
                  <label className="block text-xs font-semibold">उलेखनीय काम असल्यास येथे उल्लेख करावा</label>
                  <textarea rows={4} value={formData.physical_facilities_remark}
                    onChange={e => updateField('physical_facilities_remark', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs" placeholder="भौतिक सुविधा व इतर बाबींबाबत विशेष उल्लेख"
                    disabled={isViewMode} />
                </div>
              </section>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-1.5 text-xs bg-gray-200 rounded"
              >
                मागे
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded"
              >
                पुढे (Photos)
              </button>
            </div>
          </>
        )}

        {/* STEP 4: Photo upload */}
        {currentStep === 4 && (
          <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
            <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              फोटो दस्तऐवजीकरण (Photo Documentation)
            </h2>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {!isViewMode && (
                  <>
                    <input type="file" id="photo-upload" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    <label htmlFor="photo-upload" className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded cursor-pointer text-xs">
                      फोटो निवडा
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Maximum 5 photos allowed</p>
                  </>
                )}
                {isViewMode && (!editingInspection?.fims_inspection_photos || editingInspection.fims_inspection_photos.length === 0) && (
                  <p className="text-xs text-gray-500">No photos available</p>
                )}
              </div>

              {uploadedPhotos.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium">Uploaded Photos ({uploadedPhotos.length}/5)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {uploadedPhotos.map((photo, idx) => (
                      <div key={idx} className="relative">
                        <img src={URL.createObjectURL(photo)} alt={photo.name} className="w-full h-24 object-cover rounded" />
                        {!isViewMode && (
                          <button onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1">×</button>
                        )}
                        <p className="text-xs truncate mt-1">{photo.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isViewMode && editingInspection?.fims_inspection_photos && editingInspection.fims_inspection_photos.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium">Inspection Photos ({editingInspection.fims_inspection_photos.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {editingInspection.fims_inspection_photos.map((p: any) => (
                      <div key={p.id}>
                        <img src={p.photo_url} alt={p.photo_name} className="w-full h-24 object-cover rounded" />
                        <p className="text-xs truncate mt-1">{p.photo_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button onClick={() => setCurrentStep(3)} className="px-4 py-1.5 text-xs bg-gray-200 rounded">मागे</button>
              <div className="flex items-center gap-2">
                {!isViewMode && (
                  <button onClick={() => handleSave(false)} disabled={isLoading || isUploading} className="px-3 py-1.5 text-xs bg-gray-200 rounded">मसुदा जतन करा</button>
                )}
                {!isViewMode && (
                  <button onClick={() => handleSave(true)} disabled={isLoading || isUploading} className="px-3 py-1.5 text-xs bg-green-600 text-white rounded">अंतिम सादर करा</button>
                )}
              </div>
            </div>
          </section>
        )}
        </div>
      </div>
    </div>
  );
};
