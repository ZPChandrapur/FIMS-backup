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
}

export const MumbaiNyayalayTapasaniForm: React.FC<MumbaiNyayalayTapasaniFormProps> = ({
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
    ramp_railings: ''
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

        classrooms_as_per_students: formData.classrooms_as_per_students === 'होय',
        required_rooms: Number(formData.required_rooms || 0),
        available_rooms: Number(formData.available_rooms || 0),
        new_required_rooms: Number(formData.new_required_rooms || 0),
        rooms_good_condition: formData.rooms_good_condition === 'होय',
        rooms_repair_action: formData.rooms_repair_action || null,
        rooms_repair_measures: formData.rooms_repair_measures || null,
        rooms_repair_feedback: formData.rooms_repair_feedback || null,

        separate_toilets_available: formData.separate_toilets_available === 'होय',
        toilets_as_per_strength: formData.toilets_as_per_strength === 'होय',
        toilets_regular_cleaning: formData.toilets_regular_cleaning === 'होय',
        toilets_enough_water: formData.toilets_enough_water === 'होय',

        cwsn_toilet_available: formData.cwsn_toilet_available === 'होय',
        cwsn_toilet_regular_cleaning: formData.cwsn_toilet_regular_cleaning === 'होय',
        cwsn_toilet_enough_water: formData.cwsn_toilet_enough_water === 'होय',

        drinking_water_available: formData.drinking_water_available === 'होय',
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
        ramp_railings: formData.ramp_railings === 'होय'
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

        {/* STEP 1: Basic School Info */}
        {currentStep === 1 && (
          <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4">
            <h2 className="text-sm font-bold border-b pb-2 flex items-center gap-2">
              <School className="w-4 h-4" />
              शाळेची मूलभूत माहिती
            </h2>
            {/* STEP 1 fields - existing code */}
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

        {/* STEP 2: Existing Sections 1-3 */}
        {currentStep === 2 && (
          <>
            {/* SECTION 1-3 existing code */}
            <div className="flex justify-between mt-4">
              <button onClick={() => setCurrentStep(1)} className="px-4 py-1.5 text-xs bg-gray-200 rounded">
                मागे
              </button>
              <button onClick={() => setCurrentStep(3)} className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded">
                पुढे
              </button>
            </div>
          </>
        )}

        {/* STEP 3: All Sections 4-10 */}
        {currentStep === 3 && (
          <>
            {/* SECTION 4: CWSN - existing */}
            {/* SECTION 5: Water - existing */}

            {/* SECTION 6: संरक्षक भक्त */}
            <section className="bg-white border rounded-lg p-4 md:p-5 space-y-4 mt-4">
              <h2 className="text-sm font-bold border-b pb-2">६. संरक्षक भक्त</h2>
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
              <h2 className="text-sm font-bold border-b pb-2">८. मुलांना खेळण्यासाठी मैदान</h2>
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
              <h2 className="text-sm font-bold border-b pb-2">९. किचनशेड उपलब्ध आहे का ? व स्थिती</h2>
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
              <h2 className="text-sm font-bold border-b pb-2">१०. उताराचा रॅम्प (Ramp) आहे का ?</h2>
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

            <div className="flex justify-between mt-4">
              <button onClick={() => setCurrentStep(2)} className="px-4 py-1.5 text-xs bg-gray-200 rounded">
                मागे
              </button>
              <button onClick={() => handleSave(true)} disabled={isLoading || isViewMode}
                className="px-4 py-1.5 text-xs bg-green-600 text-white rounded disabled:opacity-60">
                अंतिम सादर करा
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
