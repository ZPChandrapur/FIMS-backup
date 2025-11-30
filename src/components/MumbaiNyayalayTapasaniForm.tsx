import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ClipboardCheck,
  Save,
  Send,
  School
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface MumbaiHighCourtFormProps {
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

interface SchoolInspectionFormData {
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
}

export const MumbaiNyayalayTapasaniForm: React.FC<MumbaiNyayalayTapasaniForm> = ({
  user,
  onBack,
  categories,
  onInspectionCreated,
  editingInspection
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

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

  const [formData, setFormData] = useState<SchoolInspectionFormData>({
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
    water_tank_cleaning_interval_days: ''
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
    }
  }, [editingInspection]);

  const updateField = <K extends keyof SchoolInspectionFormData>(
    key: K,
    value: SchoolInspectionFormData[K]
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
            : null
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>मागे</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={isLoading || isViewMode}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              मसुदा जतन करा
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={isLoading || isViewMode}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              अंतिम सादर करा
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <ClipboardCheck className="w-4 h-4 text-gray-600" />
          <span className="font-semibold">पायरी {currentStep} / 3</span>
        </div>

        {/* STEP 1: basic school info */}
        {currentStep === 1 && (
          <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4">
            <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
              <School className="w-4 h-4" />
              शाळेची मूलभूत माहिती
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold">
                  तपासणी दिनांक
                </label>
                <input
                  type="date"
                  value={formData.inspection_date}
                  onChange={e => updateField('inspection_date', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isViewMode}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold">जिल्हा</label>
                <input
                  type="text"
                  value={formData.district_name}
                  onChange={e => updateField('district_name', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isViewMode}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold">तालुका</label>
                <input
                  type="text"
                  value={formData.taluka_name}
                  onChange={e => updateField('taluka_name', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isViewMode}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold">
                  केंद्राचे नाव
                </label>
                <input
                  type="text"
                  value={formData.center_name}
                  onChange={e => updateField('center_name', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isViewMode}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold">
                  शाळेचे नाव
                </label>
                <input
                  type="text"
                  value={formData.school_name}
                  onChange={e => updateField('school_name', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isViewMode}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold">
                  व्यवस्थापनाचे नाव
                </label>
                <input
                  type="text"
                  value={formData.management_name}
                  onChange={e =>
                    updateField('management_name', e.target.value)
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isViewMode}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold">
                  मुख्याध्यापक / मुख्याध्यापिका
                </label>
                <input
                  type="text"
                  value={formData.headmaster_name}
                  onChange={e =>
                    updateField('headmaster_name', e.target.value)
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  disabled={isViewMode}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold">
                  UDISE क्रमांक
                </label>
                <input
                  type="text"
                  value={formData.udise_number}
                  onChange={e => updateField('udise_number', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
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

        {/* STEP 2: इमारत + वर्ग खोल्या + मुलांसाठी स्वच्छतागृह */}
        {currentStep === 2 && (
          <>
            {/* SECTION 1: इमारत */}
            <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
              <h2 className="text-sm font-bold border-b pb-2">
                १. शाळा इमारत बांधकाम
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold">
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
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-center font-mono"
                    placeholder="उदा. 2025"
                    disabled={isViewMode}
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-semibold">
                    (ब) शाळा बांधकाम प्रकार
                  </label>
                  <select
                    value={formData.building_type}
                    onChange={e =>
                      updateField('building_type', e.target.value)
                    }
                    className="w-full md:w-2/3 px-2 py-1 border border-gray-300 rounded text-xs bg-white"
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

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold">
                    (क) इमारत सुस्थितीत आहे का ?
                  </p>
                  <div className="flex gap-6 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="building_condition_ok"
                        value="होय"
                        checked={formData.building_condition_ok === 'होय'}
                        onChange={e =>
                          updateField('building_condition_ok', e.target.value)
                        }
                        disabled={isViewMode}
                      />
                      <span>होय</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="building_condition_ok"
                        value="नाही"
                        checked={formData.building_condition_ok === 'नाही'}
                        onChange={e =>
                          updateField('building_condition_ok', e.target.value)
                        }
                        disabled={isViewMode}
                      />
                      <span>नाही</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold">
                    (ड) दुरुस्तीची गरज असल्यास प्रकार
                  </p>
                  <select
                    value={formData.building_repair_level}
                    onChange={e =>
                      updateField('building_repair_level', e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white"
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
            <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
              <h2 className="text-sm font-bold border-b pb-2">
                २. वर्ग खोल्यांचा तपशील
              </h2>

              <div className="space-y-2">
                <p className="text-sm font-semibold">
                  (अ) विद्यार्थ्यांच्या प्रमाणात वर्ग खोल्या आहेत का ?
                </p>
                <div className="flex gap-6 text-sm">
                  <label className="flex items-center gap-2">
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
                    />
                    <span>होय</span>
                  </label>
                  <label className="flex items-center gap-2">
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
                    />
                    <span>नाही</span>
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold">
                    १) आवश्यक खोल्यांची संख्या.
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.required_rooms}
                    onChange={e =>
                      updateField('required_rooms', e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-right"
                    placeholder="0"
                    disabled={isViewMode}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold">
                    २) उपलब्ध खोल्यांची संख्या.
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.available_rooms}
                    onChange={e =>
                      updateField('available_rooms', e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-right"
                    placeholder="0"
                    disabled={isViewMode}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold">
                    ३) नव्याने आवश्यक असणाऱ्या खोल्यांची संख्या.
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.new_required_rooms}
                    onChange={e =>
                      updateField('new_required_rooms', e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-right"
                    placeholder="0"
                    disabled={isViewMode}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold">
                    ४) खोल्या सुस्थितीत आहेत का ?
                  </p>
                  <div className="flex gap-6 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="rooms_good_condition"
                        value="होय"
                        checked={formData.rooms_good_condition === 'होय'}
                        onChange={e =>
                          updateField('rooms_good_condition', e.target.value)
                        }
                        disabled={isViewMode}
                      />
                      <span>होय</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="rooms_good_condition"
                        value="नाही"
                        checked={formData.rooms_good_condition === 'नाही'}
                        onChange={e =>
                          updateField('rooms_good_condition', e.target.value)
                        }
                        disabled={isViewMode}
                      />
                      <span>नाही</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold">
                    ५) दुरुस्ती आवश्यक आहे का ? असल्‍यास काय दुरुस्ती ?
                  </p>
                  <select
                    value={formData.rooms_repair_action}
                    onChange={e =>
                      updateField('rooms_repair_action', e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white"
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

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold">
                    उपाययोजना
                  </label>
                  <textarea
                    rows={3}
                    value={formData.rooms_repair_measures}
                    onChange={e =>
                      updateField('rooms_repair_measures', e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    placeholder="खोल्यांसंबंधी करावयाच्या उपाययोजना"
                    disabled={isViewMode}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold">
                    अभिप्राय
                  </label>
                  <textarea
                    rows={3}
                    value={formData.rooms_repair_feedback}
                    onChange={e =>
                      updateField('rooms_repair_feedback', e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    placeholder="खोल्यांविषयी निरीक्षकांचा अभिप्राय"
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </section>

            {/* SECTION 3: मुलांसाठी व मुलीसाठी स्वच्छतागृह */}
            <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
              <h2 className="text-sm font-bold border-b pb-2">
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

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-1.5 text-xs bg-gray-200 rounded"
              >
                मागे
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded"
              >
                पुढे
              </button>
            </div>
          </>
        )}

        {/* STEP 3: CWSN + पिण्याचे पाणी */}
        {currentStep === 3 && (
          <>
            {/* SECTION 4: CWSN */}
            <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
              <h2 className="text-sm font-bold border-b pb-2">
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
              <h2 className="text-sm font-bold border-b pb-2">
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

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-1.5 text-xs bg-gray-200 rounded"
              >
                मागे
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isLoading || isViewMode}
                className="px-4 py-1.5 text-xs bg-green-600 text-white rounded disabled:opacity-60"
              >
                अंतिम सादर करा
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
