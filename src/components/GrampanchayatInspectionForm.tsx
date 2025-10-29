import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Camera,
  MapPin,
  Save,
  Send,
  FileText,
  Users
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface GrampanchayatFormProps {
  user: SupabaseUser;
  onBack: () => void;
  categories: any[];
  onInspectionCreated: () => void;
  editingInspection?: any;
}

export const GrampanchayatInspectionForm: React.FC<GrampanchayatFormProps> = ({
  user,
  onBack,
  categories,
  onInspectionCreated,
  editingInspection
}) => {
  const { t } = useTranslation();

  const isViewMode = editingInspection?.mode === 'view';
  const isEditMode = editingInspection?.mode === 'edit';
  const [monthlyMeetings, setMonthlyMeetings] = useState('');
  const [agendaUpToDate, setAgendaUpToDate] = useState('');
  const [receiptUpToDate, setReceiptUpToDate] = useState('');
  const [reassessmentDone, setReassessmentDone] = useState('');
  const [reassessmentAction, setReassessmentAction] = useState('');

  const [gpName, setGpName] = useState('');
  const [psName, setPsName] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionPlace, setInspectionPlace] = useState('');
  const [officerName, setOfficerName] = useState('');
  const [officerPost, setOfficerPost] = useState('');
  const [secretaryName, setSecretaryName] = useState('');
  const [secretaryTenure, setSecretaryTenure] = useState('');
  const [resolutionNo, setResolutionNo] = useState('');
  const [resolutionDate, setResolutionDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [inspectionData, setInspectionData] = useState({
    category_id: '',
    location_name: '',
    planned_date: '',
    latitude: null as number | null,
    longitude: null as number | null,
    location_accuracy: null as number | null,
    location_detected: ''
  });

  const grampanchayatCategory = categories.find(cat => cat.form_type === 'Grampanchayat Inspection' || cat.form_type === 'Grampanchayat Inspection');

  useEffect(() => {
    if (grampanchayatCategory) {
      setInspectionData(prev => ({
        ...prev,
        category_id: grampanchayatCategory.id
      }));
    }
  }, [grampanchayatCategory]);

  useEffect(() => {
    const loadInspectionData = async () => {
      if (editingInspection && editingInspection.id) {
        setInspectionData({
          category_id: editingInspection.category_id || '',
          location_name: editingInspection.location_name || '',
          planned_date: editingInspection.planned_date ? editingInspection.planned_date.split('T')[0] : '',
          latitude: editingInspection.latitude,
          longitude: editingInspection.longitude,
          location_accuracy: editingInspection.location_accuracy,
          location_detected: editingInspection.location_detected || ''
        });

        // Load data from grampanchayat_inspection_form table
        const { data: formData, error } = await supabase
          .from('grampanchayat_inspection_form')
          .select('*')
          .eq('inspection_id', editingInspection.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading form data:', error);
          return;
        }

        if (formData) {
          setGpName(formData.gram_panchayat_name || '');
          setPsName(formData.panchayat_samiti || '');
          setInspectionDate(formData.general_inspection_date || '');
          setInspectionPlace(formData.general_inspection_place || '');
          setOfficerName(formData.inspection_officer_name || '');
          setOfficerPost(formData.inspection_officer_post || '');
          setSecretaryName(formData.secretary_name || '');
          setSecretaryTenure(formData.secretary_tenure || '');
          setMonthlyMeetings(formData.monthly_meetings || '');
          setAgendaUpToDate(formData.meeting_agenda_up_to_date || '');
          setReceiptUpToDate(formData.receipt_up_to_date || '');
          setReassessmentDone(formData.reassessment_done || '');
          setReassessmentAction(formData.reassessment_action || '');
          setResolutionNo(formData.resolution_no || '');
          setResolutionDate(formData.resolution_date || '');
        }
      }
    };

    loadInspectionData();
  }, [editingInspection]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
          );
          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const address = data.results[0].formatted_address;

            setInspectionData(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng,
              location_accuracy: accuracy,
              location_detected: address,
              location_name: prev.location_name || address
            }));
          } else {
            setInspectionData(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng,
              location_accuracy: accuracy,
              location_detected: 'Location detected but address not found'
            }));
          }
        } catch (error) {
          console.error('Error getting location name:', error);
          setInspectionData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            location_accuracy: accuracy,
            location_detected: 'Unable to get address'
          }));
        }

        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsGettingLocation(false);
        alert('Error getting your location. Please enable GPS and try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + uploadedPhotos.length > 5) {
      alert('Maximum 5 photos allowed');
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
        const fileName = `Grampanchayat Inspection_${inspectionId}_${Date.now()}_${i}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('field-visit-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('field-visit-images')
          .getPublicUrl(fileName);

        const { error: dbError } = await supabase
          .from('fims_inspection_photos')
          .insert({
            inspection_id: inspectionId,
            photo_url: publicUrl,
            photo_name: file.name,
            description: `Grampanchayat inspection photo ${i + 1}`,
            photo_order: i + 1,
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

  const generateInspectionNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = String(now.getTime()).slice(-6);
    return `GP-${year}${month}${day}-${time}`;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    try {
      setIsLoading(true);

      const sanitizedInspectionData = {
        ...inspectionData,
        planned_date: inspectionData.planned_date || null
      };

      let inspectionResult;

      if (editingInspection && editingInspection.id) {
        // Update existing inspection
        const { data: updateResult, error: updateError } = await supabase
          .from('fims_inspections')
          .update({
            location_name: sanitizedInspectionData.location_name,
            latitude: sanitizedInspectionData.latitude,
            longitude: sanitizedInspectionData.longitude,
            location_accuracy: sanitizedInspectionData.location_accuracy,
            location_detected: sanitizedInspectionData.location_detected,
            planned_date: sanitizedInspectionData.planned_date,
            inspection_date: new Date().toISOString(),
            status: isDraft ? 'draft' : 'submitted'
          })
          .eq('id', editingInspection.id)
          .select()
          .single();

        if (updateError) throw updateError;
        inspectionResult = updateResult;

        // Update grampanchayat_inspection_form table - only update fields that can change
        const { error: formUpdateError } = await supabase
          .from('grampanchayat_inspection_form')
          .update({
            gram_panchayat_name: gpName || '',
            panchayat_samiti: psName || '',
            general_inspection_date: inspectionDate || new Date().toISOString().split('T')[0],
            general_inspection_place: inspectionPlace || '',
            inspection_officer_name: officerName || '',
            inspection_officer_post: officerPost || '',
            secretary_name: secretaryName || '',
            secretary_tenure: secretaryTenure || '',
            monthly_meetings: monthlyMeetings || '',
            meeting_agenda_up_to_date: agendaUpToDate || '',
            receipt_up_to_date: receiptUpToDate || '',
            reassessment_done: reassessmentDone || '',
            reassessment_action: reassessmentAction || '',
            resolution_no: resolutionNo || '',
            resolution_date: resolutionDate || new Date().toISOString().split('T')[0],
            updated_at: new Date().toISOString()
          })
          .eq('inspection_id', editingInspection.id);

        if (formUpdateError) throw formUpdateError;

      } else {
        // Create new inspection
        const inspectionNumber = generateInspectionNumber();

        const { data: createResult, error: createError } = await supabase
          .from('fims_inspections')
          .insert({
            inspection_number: inspectionNumber,
            category_id: sanitizedInspectionData.category_id,
            inspector_id: user.id,
            location_name: sanitizedInspectionData.location_name,
            latitude: sanitizedInspectionData.latitude,
            longitude: sanitizedInspectionData.longitude,
            location_accuracy: sanitizedInspectionData.location_accuracy,
            location_detected: sanitizedInspectionData.location_detected,
            planned_date: sanitizedInspectionData.planned_date,
            inspection_date: new Date().toISOString(),
            status: isDraft ? 'draft' : 'submitted'
          })
          .select()
          .single();

        if (createError) throw createError;
        inspectionResult = createResult;

        // Insert into grampanchayat_inspection_form table with all required fields
        const { error: formInsertError } = await supabase
          .from('grampanchayat_inspection_form')
          .insert({
            inspection_id: inspectionResult.id,
            gram_panchayat_name: gpName || '',
            panchayat_samiti: psName || '',
            general_inspection_date: inspectionDate || new Date().toISOString().split('T')[0],
            general_inspection_place: inspectionPlace || '',
            inspection_officer_name: officerName || '',
            inspection_officer_post: officerPost || '',
            secretary_name: secretaryName || '',
            secretary_tenure: secretaryTenure || '',
            monthly_meetings: monthlyMeetings || '',
            meeting_agenda_up_to_date: agendaUpToDate || '',
            receipt_up_to_date: receiptUpToDate || '',
            reassessment_done: reassessmentDone || '',
            reassessment_action: reassessmentAction || '',
            resolution_no: resolutionNo || '',
            resolution_date: resolutionDate || new Date().toISOString().split('T')[0],
            previous_year_house_tax_arrears: 0,
            previous_year_water_tax_arrears: 0,
            current_year_house_tax_demand: 0,
            current_year_water_tax_demand: 0,
            total_house_tax_demand: 0,
            total_water_tax_demand: 0,
            total_house_tax_collection: 0,
            total_water_tax_collection: 0,
            balance_house_tax_collection: 0,
            balance_water_tax_collection: 0,
            house_tax_percentage: 0,
            water_tax_percentage: 0,
            remarks: '',
            gram_panchayat_total_income: 0,
            fifteen_percent_amount: 0,
            previous_balance: 0,
            total_expense: 0,
            expense_till_inspection_date: 0,
            balance_expense: 0,
            budget_provision: '',
            tenders_called: '',
            entries_made: '',
            form1: '', form2: '', form3: '', form4: '', form5: '', form6: '', form7: '', form8: '',
            copy1: '', copy2: '', copy3: '',
            copy_to_ceo: '', copy_to_bdo: '', copy_to_secretary: '',
            sr_no_gram_nidhi: '', gram_nidhi_register_balance: '', gram_nidhi_bank_balance: '',
            gram_nidhi_post_balance: '', gram_nidhi_hand_balance: '', gram_nidhi_check: '',
            sr_no_water_supply: '', water_supply_register_balance: '', water_supply_bank_balance: '',
            water_supply_post_balance: '', water_supply_hand_balance: '', water_supply_check: '',
            sr_no_14th_finance_commission: '', _14th_finance_commission_register_balance: '',
            _14th_finance_commission_bank_balance: '', _14th_finance_commission_post_balance: '',
            _14th_finance_commission_hand_balance: '', _14th_finance_commission_check: '',
            sr_no_eng_gha_yo: '', eng_gha_yo_register_balance: '', eng_gha_yo_bank_balance: '',
            eng_gha_yo_post_balance: '', eng_gha_yo_hand_balance: '', eng_gha_yo_check: '',
            sr_no_sc_development: '', sc_development_register_balance: '', sc_development_bank_balance: '',
            sc_development_post_balance: '', sc_development_hand_balance: '', sc_development_check: '',
            sr_no_labor_department: '', labor_department_register_balance: '', labor_department_bank_balance: '',
            labor_department_post_balance: '', labor_department_hand_balance: '', labor_department_check: '',
            sr_no_thakkar_bappa: '', thakkar_bappa_register_balance: '', thakkar_bappa_bank_balance: '',
            thakkar_bappa_post_balance: '', thakkar_bappa_hand_balance: '', thakkar_bappa_check: '',
            sr_no_gram_kosh_money: '', gram_kosh_money_register_balance: '', gram_kosh_money_bank_balance: '',
            gram_kosh_money_post_balance: '', gram_kosh_money_hand_balance: '', gram_kosh_money_check: '',
            sr_no_civic_facilities: '', civic_facilities_register_balance: '', civic_facilities_bank_balance: '',
            civic_facilities_post_balance: '', civic_facilities_hand_balance: '', civic_facilities_check: '',
            sr_no_dalit_basti_development: '', dalit_basti_development_register_balance: '',
            dalit_basti_development_bank_balance: '', dalit_basti_development_post_balance: '',
            dalit_basti_development_hand_balance: '', dalit_basti_development_check: '',
            sr_no_tanta_mukt_yojana: '', tanta_mukt_yojana_register_balance: '', tanta_mukt_yojana_bank_balance: '',
            tanta_mukt_yojana_post_balance: '', tanta_mukt_yojana_hand_balance: '', tanta_mukt_yojana_check: '',
            sr_no_jan_suvidha: '', jan_suvidha_register_balance: '', jan_suvidha_bank_balance: '',
            jan_suvidha_post_balance: '', jan_suvidha_hand_balance: '', jan_suvidha_check: '',
            sr_no_payka: '', payka_register_balance: '', payka_bank_balance: '',
            payka_post_balance: '', payka_hand_balance: '', payka_check: '',
            sr_no_panchayat_samiti_yojana: '', panchayat_samiti_yojana_register_balance: '',
            panchayat_samiti_yojana_bank_balance: '', panchayat_samiti_yojana_post_balance: '',
            panchayat_samiti_yojana_hand_balance: '', panchayat_samiti_yojana_check: '',
            sr_no_sbm: '', sbm_register_balance: '', sbm_bank_balance: '',
            sbm_post_balance: '', sbm_hand_balance: '', sbm_check: '',
            sr_no_tirthakshetra_development_fund: '', tirthakshetra_development_fund_register_balance: '',
            tirthakshetra_development_fund_bank_balance: '', tirthakshetra_development_fund_post_balance: '',
            tirthakshetra_development_fund_hand_balance: '', tirthakshetra_development_fund_check: '',
            sr_no_minority_development_fund: '', minority_development_fund_register_balance: '',
            minority_development_fund_bank_balance: '', minority_development_fund_post_balance: '',
            minority_development_fund_hand_balance: '', minority_development_fund_check: '',
            sr_no_egavika: '', egavika_objectives: '', egavika_status: '', egavika_remarks: '',
            sr_no_biogas: '', biogas_objectives: '', biogas_status: '', biogas_remarks: '',
            sr_no_smokeless_chul: '', smokeless_chul_objectives: '', smokeless_chul_status: '', smokeless_chul_remarks: '',
            sr_no_family_welfare: '', family_welfare_objectives: '', family_welfare_status: '', family_welfare_remarks: '',
            sr_no_alpavachnat: '', alpavachnat_objectives: '', alpavachnat_status: '', alpavachnat_remarks: '',
            sr_no_6: '', sr_no_6_objectives: '', sr_no_6_status: '', sr_no_6_remarks: '',
            sr_no_7: '', sr_no_7_objectives: '', sr_no_7_status: '', sr_no_7_remarks: '',
            sr_no_14_finance_scheme_1: '', _14_finance_scheme_1_type: '',
            _14_finance_scheme_1_estimate_amount: 0, _14_finance_scheme_1_grant_received: 0, _14_finance_scheme_1_expense: 0,
            sr_no_14_finance_scheme_2: '', _14_finance_scheme_2_type: '',
            _14_finance_scheme_2_estimate_amount: 0, _14_finance_scheme_2_grant_received: 0, _14_finance_scheme_2_expense: 0,
            sr_no_14_finance_scheme_3: '', _14_finance_scheme_3_type: '',
            _14_finance_scheme_3_estimate_amount: 0, _14_finance_scheme_3_grant_received: 0, _14_finance_scheme_3_expense: 0,
            sr_no_14_finance_scheme_4: '', _14_finance_scheme_4_type: '',
            _14_finance_scheme_4_estimate_amount: 0, _14_finance_scheme_4_grant_received: 0, _14_finance_scheme_4_expense: 0,
            sr_no_14_finance_scheme_5: '', _14_finance_scheme_5_type: '',
            _14_finance_scheme_5_estimate_amount: 0, _14_finance_scheme_5_grant_received: 0, _14_finance_scheme_5_expense: 0,
            sr_no_14_finance_scheme_6: '', _14_finance_scheme_6_type: '',
            _14_finance_scheme_6_estimate_amount: 0, _14_finance_scheme_6_grant_received: 0, _14_finance_scheme_6_expense: 0,
            sr_no_14_finance_scheme_7: '', _14_finance_scheme_7_type: '',
            _14_finance_scheme_7_estimate_amount: 0, _14_finance_scheme_7_grant_received: 0, _14_finance_scheme_7_expense: 0,
            sr_no_14_finance_scheme_8: '', _14_finance_scheme_8_type: '',
            _14_finance_scheme_8_estimate_amount: 0, _14_finance_scheme_8_grant_received: 0, _14_finance_scheme_8_expense: 0,
            sr_no_14_finance_scheme_9: '', _14_finance_scheme_9_type: '',
            _14_finance_scheme_9_estimate_amount: 0, _14_finance_scheme_9_grant_received: 0, _14_finance_scheme_9_expense: 0,
            sr_no_14_finance_scheme_10: '', _14_finance_scheme_10_type: '',
            _14_finance_scheme_10_estimate_amount: 0, _14_finance_scheme_10_grant_received: 0, _14_finance_scheme_10_expense: 0,
            sr_no_14_finance_scheme_11: '', _14_finance_scheme_11_type: '',
            _14_finance_scheme_11_estimate_amount: 0, _14_finance_scheme_11_grant_received: 0, _14_finance_scheme_11_expense: 0,
            work_start_date_1: new Date().toISOString().split('T')[0],
            work_completion_date_1: new Date().toISOString().split('T')[0],
            progress_status_1: '', certificate_received_1: '', remarks_1: '',
            inspection_officer_opinion_1: '', inspection_officer_opinion_2: '', inspection_officer_opinion_3: '',
            inspection_officer_opinion_4: '', inspection_officer_opinion_5: '', inspection_officer_opinion_6: '',
            inspection_officer_opinion_7: '', inspection_officer_opinion_8: ''
          });

        if (formInsertError) throw formInsertError;
      }

      if (uploadedPhotos.length > 0) {
        await uploadPhotosToSupabase(inspectionResult.id);
      }

      const isUpdate = editingInspection && editingInspection.id;
      const message = isDraft
        ? (isUpdate ? 'Inspection updated as draft' : 'Inspection saved as draft')
        : (isUpdate ? 'Inspection updated successfully' : 'Inspection submitted successfully');

      alert(message);
      onInspectionCreated();
      onBack();

    } catch (error: any) {
      console.error('Error saving inspection:', error);
      alert('Error saving inspection: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center flex-1">
              ग्राम पंचायत तपासणी
            </h1>
            <div className="w-24"></div>
          </div>

          <p className="text-base md:text-lg text-gray-600 text-center font-medium">
            ग्राम पंचायत निरीक्षण प्रपत्र भरा
          </p>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div style={{ fontFamily: 'Arial, sans-serif', direction: 'ltr' }}>
            <h1 style={{ textAlign: 'center', color: '#1f2937', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>परिशिष्ट-चार</h1>
            <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#374151' }}>(नियम 80 पहा)</p>
            <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#374151', marginBottom: '2rem' }}>(ख)ग्राम पंचायतांची सर्वसाधारण तपासणीचा नमुना</p>

            {/* Basic Information Section */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                मूळ माहिती
              </h2>

              <ol style={{ marginLeft: '20px', lineHeight: '2.5' }}>
                <li className="mb-4">
                  <label className="font-semibold text-gray-700">ग्राम पंचायतिचे नांव:</label>
                  <input
                    type="text"
                    value={gpName}
                    onChange={(e) => setGpName(e.target.value)}
                    className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    placeholder="ग्राम पंचायतिचे नांव"
                  />
                  <label className="ml-4 font-semibold text-gray-700">पंचायत समिती:</label>
                  <input
                    type="text"
                    value={psName}
                    onChange={(e) => setPsName(e.target.value)}
                    className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                    placeholder="पंचायत समिती"
                  />
                </li>
                <li className="mb-4">
                  <label className="font-semibold text-gray-700">(क) सर्वसाधारण तपासणीची तारीख:</label>
                  <input
                    type="date"
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </li>
                <li className="mb-4">
                  <label className="font-semibold text-gray-700">(ख) सर्वसाधारण तपासणीचे ठिकाण:</label>
                  <input
                    type="text"
                    value={inspectionPlace}
                    onChange={(e) => setInspectionPlace(e.target.value)}
                    className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                    placeholder="तपासणीचे ठिकाण"
                  />
                </li>
                <li className="mb-4">
                  <label className="font-semibold text-gray-700">तपासणी अधिकारीाचे नांव व हुद्दा:</label>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56"
                    placeholder="अधिकारीाचे नांव"
                  />
                  <span className="mx-2 text-gray-500">/</span>
                  <input
                    type="text"
                    value={officerPost}
                    onChange={(e) => setOfficerPost(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56"
                    placeholder="हुद्दा"
                  />
                </li>
                <li className="mb-4">
                  <label className="font-semibold text-gray-700">सचिवाचे नांव व तो सदस्य पंचायतीत केलेला पासून काम करीत आहे:</label>
                  <input
                    type="text"
                    value={secretaryName}
                    onChange={(e) => setSecretaryName(e.target.value)}
                    className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56"
                    placeholder="सचिवाचे नांव"
                  />
                  <span className="mx-2 text-gray-500">/</span>
                  <input
                    type="text"
                    value={secretaryTenure}
                    onChange={(e) => setSecretaryTenure(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-56"
                    placeholder="कार्यकाळ"
                  />
                </li>
              </ol>
            </div>

            {/* Location Section - Added After Basic Information */}
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-green-600" />
                स्थान माहिती
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    स्थानाचे नाव
                  </label>
                  <input
                    type="text"
                    value={inspectionData.location_name || gpName}
                    onChange={(e) => setInspectionData(prev => ({...prev, location_name: e.target.value}))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="स्थानाचे नाव"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    तारीख
                  </label>
                  <input
                    type="date"
                    value={inspectionData.planned_date || ''}
                    onChange={(e) => setInspectionData(prev => ({...prev, planned_date: e.target.value}))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg mb-4"
              >
                <MapPin className="w-6 h-6" />
                {isGettingLocation ? 'स्थान मिळवत आहे...' : 'GPS स्थान मिळवा'}
              </button>

              {inspectionData.latitude && (
                <div className="p-4 bg-white border-2 border-green-300 rounded-lg shadow-sm">
                  <p className="text-sm text-green-800">
                    <strong className="text-lg">स्थान कॅप्चर केले:</strong><br />
                    <span className="inline-block mt-2">
                      <strong>अक्षांश:</strong> {inspectionData.latitude.toFixed(6)}<br />
                      <strong>रेखांश:</strong> {inspectionData.longitude?.toFixed(6)}<br />
                      <strong>अचूकता:</strong> {inspectionData.location_accuracy ? Math.round(inspectionData.location_accuracy) + 'm' : 'N/A'}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Meeting Information */}
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-600" />
                सभा माहिती
              </h2>

              <ol start={6} style={{ marginLeft: '20px', lineHeight: '2.5' }}>
                <li className="mb-4">
                  <label className="font-semibold text-gray-700">मासिक सभा नियमांनुसार नियमितपणे होतात काय ?</label>
                  <div className="ml-6 mt-2 space-x-6">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="monthlyMeetings"
                        value="होय"
                        checked={monthlyMeetings === 'होय'}
                        onChange={(e) => setMonthlyMeetings(e.target.value)}
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-gray-800 font-medium">होय</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="monthlyMeetings"
                        value="नाही"
                        checked={monthlyMeetings === 'नाही'}
                        onChange={(e) => setMonthlyMeetings(e.target.value)}
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-gray-800 font-medium">नाही</span>
                    </label>
                  </div>
                </li>
                <ul style={{ marginLeft: '20px' }}>
                  <li className="mb-4">
                    <label className="font-semibold text-gray-700">सभेची कार्यसूची व सभेची नोंदवही ईत्यादी अद्यावत आहे काय ?</label>
                    <div className="ml-6 mt-2 space-x-6">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="agendaUpToDate"
                          value="होय"
                          checked={agendaUpToDate === 'होय'}
                          onChange={(e) => setAgendaUpToDate(e.target.value)}
                          className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-800 font-medium">होय</span>
                      </label>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="agendaUpToDate"
                          value="नाही"
                          checked={agendaUpToDate === 'नाही'}
                          onChange={(e) => setAgendaUpToDate(e.target.value)}
                          className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-gray-800 font-medium">नाही</span>
                      </label>
                    </div>
                  </li>
                </ul>
              </ol>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <th className="px-4 py-3 text-center border border-blue-500">अ.क्र.</th>
                    <th className="px-4 py-3 text-center border border-blue-500">नोंदवहीचे नाव</th>
                    <th className="px-4 py-3 text-center border border-blue-500">तपासणीच्या तारखेला शिल्लक</th>
                    <th className="px-4 py-3 text-center border border-blue-500">बँकेतिल शिल्लक</th>
                    <th className="px-4 py-3 text-center border border-blue-500">पोस्टातिल शिल्लक</th>
                    <th className="px-4 py-3 text-center border border-blue-500">हाती असलेली शिल्लक</th>
                    <th className="px-4 py-3 text-center border border-blue-500">चेक</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">1</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">ग्रामनिधी</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">2</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">पाणी पुरवठा</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                    <th colSpan={7} className="px-4 py-3 text-center border border-teal-500 text-lg font-bold">(7) रोकड वहीचा तपशील</th>
                  </tr>
                  <tr className="bg-teal-100">
                    <th className="px-4 py-3 text-center border border-gray-300">अ.क्र.</th>
                    <th className="px-4 py-3 text-center border border-gray-300">नोंदवहीचे नाव</th>
                    <th className="px-4 py-3 text-center border border-gray-300">तपासणीच्या तारीखेला शिल्लक</th>
                    <th className="px-4 py-3 text-center border border-gray-300">बँकेतिल शिल्लक</th>
                    <th className="px-4 py-3 text-center border border-gray-300">पोस्टातिल शिल्लक</th>
                    <th className="px-4 py-3 text-center border border-gray-300">हाती असलेली शिल्लक</th>
                    <th className="px-4 py-3 text-center border border-gray-300">चेक</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1", "ग्रामनिधी"],
                    ["2", "पाणी पुरवठा"],
                    ["3", "14 वा वित्त आयोग"],
                    ["4", "इं.गा.यो."],
                    ["5", "अ.जा.विकास"],
                    ["6", "मजगारोहयो"],
                    ["7", "ठक्कर बाप्पा"],
                    ["8", "ग्रामकोष पैसा"],
                    ["9", "नागरी सुविधा"],
                    ["10", "दलित वस्ती विकास"],
                    ["11", "तंटा मुक्त योजना"],
                    ["12", "जनसुविधा"],
                    ["13", "पायका"],
                    ["14", "प.सं.योजना"],
                    ["15", "SBM"],
                    ["16", "तीर्थक्षेत्र विकास निधी"],
                    ["17", "अल्पसंख्यांक विकास निधी"]
                  ].map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'bg-white hover:bg-gray-50'}>
                      <td className="px-4 py-3 text-center border border-gray-300">{row[0]}</td>
                      <td className="px-4 py-3 border border-gray-300 font-medium">{row[1]}</td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">(8)(क) कर आकारणी नोंदवही(नमुना 8) :- नाही</h3>
              <p className="mb-3 text-gray-700">1.कराच्या मागणीचे नोंदणी पुस्तक (नमुना 9):-</p>
              <p className="mb-4 text-gray-700">
                2.कराची पावती (नमुना 10):-हे अद्यावत आहे काय ?
                <span className="ml-6 space-x-6">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="receiptUpToDate"
                      value="होय"
                      checked={receiptUpToDate === 'होय'}
                      onChange={(e) => setReceiptUpToDate(e.target.value)}
                      className="w-5 h-5 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-gray-800 font-medium">होय</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="receiptUpToDate"
                      value="नाही"
                      checked={receiptUpToDate === 'नाही'}
                      onChange={(e) => setReceiptUpToDate(e.target.value)}
                      className="w-5 h-5 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-gray-800 font-medium">नाही</span>
                  </label>
                </span>
              </p>
              <p className="mb-3 text-gray-700">(ख) मागील फेर आकारणी केलेली झाली ? दिनांक
                <input type="date" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                / / ठराव क्रमांक -
                <input
                  type="text"
                  value={resolutionNo}
                  onChange={(e) => setResolutionNo(e.target.value)}
                  className="ml-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 w-40"
                />
              </p>
              <p className="mb-3 text-gray-700">नाही</p>
              <p className="mb-3 text-gray-700">(ग) चार वर्षे पूर्ण झालेली असल्यास ,नटल्याने फेर आकारणी करण्यासाठी कार्यवाही चालू आहे किंवा नाही ?</p>
              <div className="ml-6 space-x-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="reassessmentAction"
                    value="होय"
                    checked={reassessmentAction === 'होय'}
                    onChange={(e) => setReassessmentAction(e.target.value)}
                    className="w-5 h-5 text-yellow-600 focus:ring-yellow-500"
                  />
                  <span className="ml-2 text-gray-800 font-medium">होय</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="reassessmentAction"
                    value="नाही"
                    checked={reassessmentAction === 'नाही'}
                    onChange={(e) => setReassessmentAction(e.target.value)}
                    className="w-5 h-5 text-yellow-600 focus:ring-yellow-500"
                  />
                  <span className="ml-2 text-gray-800 font-medium">नाही</span>
                </label>
              </div>
            </div>

            <div className="bg-pink-50 border-l-4 border-pink-500 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">(9) तपासणी तारखेस कर वसुलीची प्रगती खालीलप्रमाणे आहे :-</h3>
              <ul style={{ marginLeft: '20px', lineHeight: '2.5' }}>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(1) मागील येणे रक्कम :- </label>
                  गृहकर- <input type="number" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                  पाणीकर- <input type="number" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(2) चालू वर्षात मागणी :- </label>
                  गृहकर- <input type="number" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                  पाणीकर- <input type="number" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(3) एकुण मागणी :- </label>
                  गृहकर- <input type="number" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                  पाणीकर- <input type="number" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(4) एकुण वसूली :- </label>
                  गृहकर- <input type="number" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                  पाणीकर- <input type="number" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(5) शिल्लक वसूली :- </label>
                  गृहकर- <input type="number" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                  पाणीकर- <input type="number" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(6) टक्केवारी :- </label>
                  गृहकर- <input type="number" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                  पाणीकर- <input type="number" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(7) शेरा :- </label>
                  <input type="text" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-96" />
                </li>
              </ul>
            </div>

            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">(10) मागास वर्गीयाकरीता राखून ठेवलेल्या 15% निधीच्या खर्चाचा तपशील:-</h3>
              <ul style={{ marginLeft: '20px', lineHeight: '2.5' }}>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(1) ग्राम पंचायतीचे एकुण उत्पन्न :- </label>
                  <input type="number" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(2) 15% रक्कम :- </label>
                  <input type="number" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(3) मागील अनुशेष </label>
                  <input type="number" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(4) करावयाचा एकुण खर्च </label>
                  <input type="number" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(5) तपासणीत्या दिनांक पर्यंत झालेला खर्च: </label>
                  <input type="number" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(6) शिल्लक खर्च </label>
                  <input type="number" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
                </li>
              </ul>
            </div>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">(7) सूचना-</h3>
              <h3 className="text-lg font-bold text-gray-800 mb-4">(11) आर्थिक व्यवहारात निर्देशानुसार आलेल्या नियमबाह्यता -</h3>
              <p className="mb-4 text-gray-700">
                (क) कोणत्याही चालू खरेदी करणाऱ्यापूर्वी अंदाजपत्रकात योग्य तरतूद केली आहे काय ?
                <span className="ml-6 space-x-6">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="radio" name="budgetProvision" value="होय" className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                    <span className="ml-2 text-gray-800 font-medium">होय</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="radio" name="budgetProvision" value="नाही" className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                    <span className="ml-2 text-gray-800 font-medium">नाही</span>
                  </label>
                </span>
              </p>
              <p className="mb-4 text-gray-700">(ख) ग्राम पंचायत खरेदीसाठी मान्यता दिली आहे काय ? ठराव क्र.
                <input type="text" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-32" />
                दि.
                <input type="date" className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                /
              </p>
              <p className="mb-4 text-gray-700">(ग) खरेदी करण्यासाठी नियमप्रमाणे दरपत्रके मागविली होती काय ?
                <span className="ml-6 space-x-6">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="radio" name="tendersCalled" value="होय" className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                    <span className="ml-2 text-gray-800 font-medium">होय</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="radio" name="tendersCalled" value="नाही" className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                    <span className="ml-2 text-gray-800 font-medium">नाही</span>
                  </label>
                </span>
              </p>
              <p className="mb-4 text-gray-700">(घ) खरेदी केलेल्या साहित्याचा नमुना 9,15 व 16 मधील नोंदवहीत नोंदी घेण्यात आल्या आहेत काय ?</p>
              <div className="ml-6 space-x-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="radio" name="entriesMade" value="होय" className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                  <span className="ml-2 text-gray-800 font-medium">होय</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="radio" name="entriesMade" value="नाही" className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                  <span className="ml-2 text-gray-800 font-medium">नाही</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-500 p-6 rounded-lg mb-6">
              <p className="text-gray-700 font-semibold mb-4">(12) ग्राम पंचायताने स्वतःच्या निधीतून किंवा शासकीय/जिल्हा परिषद योजनेंतर्गत हात घेतलेल्या कामांचा तपशील-</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden mb-4">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                      <th className="px-4 py-3 text-center border border-gray-500">अ.क्र.</th>
                      <th className="px-4 py-3 text-center border border-gray-500">योजनेचे नांव</th>
                      <th className="px-4 py-3 text-center border border-gray-500">कामाचा प्रकार</th>
                      <th className="px-4 py-3 text-center border border-gray-500">अंदाजित रक्कम</th>
                      <th className="px-4 py-3 text-center border border-gray-500">मिळालेले अनुदान</th>
                      <th className="px-4 py-3 text-center border border-gray-500">झालेला खर्च</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none text-center" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none" /></td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                      <th className="px-4 py-3 text-center border border-gray-500">काम सुरु झाल्याची तारीख</th>
                      <th className="px-4 py-3 text-center border border-gray-500">काम पूर्ण झाल्याची तारीख</th>
                      <th className="px-4 py-3 text-center border border-gray-500">प्रगतीवर असलेल्या कामाची सद्य:स्थिती</th>
                      <th className="px-4 py-3 text-center border border-gray-500">पूर्णत्वाचे प्रमाणपत्र प्राप्त केले किंवा नाही</th>
                      <th className="px-4 py-3 text-center border border-gray-500">शेरा</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 border border-gray-300"><input type="date" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="date" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300">
                        <div className="space-x-4">
                          <label className="inline-flex items-center"><input type="radio" name="certificate1" value="होय" className="w-4 h-4 text-gray-600" /> <span className="ml-1">होय</span></label>
                          <label className="inline-flex items-center"><input type="radio" name="certificate1" value="नाही" className="w-4 h-4 text-gray-600" /> <span className="ml-1">नाही</span></label>
                        </div>
                      </td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:outline-none" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-cyan-50 border-l-4 border-cyan-500 p-6 rounded-lg mb-6">
              <p className="text-gray-700 font-semibold mb-4">(13) ग्राम पंचायतांनी इतर योजनामध्ये केलेली प्रगती</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white">
                      <th className="px-4 py-3 text-center border border-cyan-500">अ.क्र.</th>
                      <th className="px-4 py-3 text-center border border-cyan-500">योजनेचे नाव</th>
                      <th className="px-4 py-3 text-center border border-cyan-500">दिलेली उद्दिष्टे</th>
                      <th className="px-4 py-3 text-center border border-cyan-500">तपासणीच्या दिनांकास</th>
                      <th className="px-4 py-3 text-center border border-cyan-500">शेरा</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center border border-gray-300">1</td>
                      <td className="px-4 py-3 border border-gray-300 font-medium">एगाविका.</td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center border border-gray-300">2</td>
                      <td className="px-4 py-3 border border-gray-300 font-medium">बॉयोगॅस</td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center border border-gray-300">3</td>
                      <td className="px-4 py-3 border border-gray-300 font-medium">निर्धूर चुल</td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center border border-gray-300">4</td>
                      <td className="px-4 py-3 border border-gray-300 font-medium">कुंटुंब कल्याण</td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center border border-gray-300">5</td>
                      <td className="px-4 py-3 border border-gray-300 font-medium">अल्पवचत</td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center border border-gray-300">6</td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-center border border-gray-300">7</td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                      <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
                    <th colSpan={6} className="px-4 py-3 text-center border border-emerald-500 text-lg font-bold">(14) 14 वा वित्त आयोगामधून हाती घेतलेली कामे व त्याची प्रगती .</th>
                  </tr>
                  <tr className="bg-emerald-100">
                    <th className="px-4 py-3 text-center border border-gray-300">अ. क्र.</th>
                    <th className="px-4 py-3 text-center border border-gray-300">योजनेचे नाव</th>
                    <th className="px-4 py-3 text-center border border-gray-300">कामाचा प्रकार</th>
                    <th className="px-4 py-3 text-center border border-gray-300">अंदाजित रक्कम</th>
                    <th className="px-4 py-3 text-center border border-gray-300">मिळालेले अनुदान</th>
                    <th className="px-4 py-3 text-center border border-gray-300">झालेला खर्च</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">1</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">14 वा वित्त आयोग</td>
                    <td className="px-4 py-3 border border-gray-300">एल.ई.डी.लाईट खरेदी</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">2</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">कचरा कुंडी</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">3</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">फर्निचर</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">4</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">टि.व्हि.संच खरेदी</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">5</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">आपले सरकार सेवा केंद्र खर्च</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">6</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">वाटर मिटर</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">7</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">सीसीरोड</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">8</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">आपले सरकार सेवा केंद्र खर्च</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">9</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">फॉगिंग मशीन</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">10</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">ग्रांपभवन</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">11</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">कंप्युटर</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="number" className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-6">
              <h1 className="text-xl font-bold text-gray-900 mb-4 text-center">तपासणी अधिकार्‍याचा अभिप्राय</h1>
              <div className="space-y-3">
                <p className="text-gray-700">1) नमुना - - - - -  अपूर्ण आहेत. <input type="text" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-96" /></p>
                <p className="text-gray-700">2) - ----- . <input type="text" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-96" /></p>
                <br />
                <p className="text-gray-700">3) --- . <input type="text" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-96" /></p>
                <p className="text-gray-700">4) --- . <input type="text" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-96" /></p>
                <p className="text-gray-700">5) --- . <input type="text" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-96" /></p>
                <p className="text-gray-700">6) --- . <input type="text" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-96" /></p>
                <p className="text-gray-700">7) --- . <input type="text" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-96" /></p>
                <p className="text-gray-700">8) --- . <input type="text" className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 w-96" /></p>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="bg-violet-50 border-l-4 border-violet-500 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Camera className="w-6 h-6 text-violet-600" />
                फोटो अपलोड
              </h3>

              <div>
                {!isViewMode && (
                  <label className="block mb-3">
                    <span className="sr-only">Choose photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isViewMode}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-3 file:px-6
                        file:rounded-lg file:border-0
                        file:text-sm file:font-semibold
                        file:bg-violet-600 file:text-white
                        hover:file:bg-violet-700
                        file:cursor-pointer cursor-pointer
                        file:transition-colors"
                    />
                  </label>
                )}

                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {uploadedPhotos.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg shadow-md"
                        />
                        {!isViewMode && (
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg transition-colors"
                          >
                            ×
                          </button>
                        )}
                        <p className="text-xs text-gray-600 truncate mt-2 px-1">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Display existing photos in view mode */}
                {isViewMode && editingInspection?.fims_inspection_photos && editingInspection.fims_inspection_photos.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">Uploaded Photos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {editingInspection.fims_inspection_photos.map((photo: any, index: number) => (
                        <div key={photo.id} className="relative group">
                          <img
                            src={photo.photo_url}
                            alt={photo.description || `Photo ${index + 1}`}
                            className="w-full h-40 object-cover rounded-lg shadow-md"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                            <p className="text-xs truncate">{photo.photo_name || `Photo ${index + 1}`}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isViewMode && (!editingInspection?.fims_inspection_photos || editingInspection.fims_inspection_photos.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Camera className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p>No photos available</p>
                  </div>
                )}
              </div>
            </div>

            {/* प्रतिलिपी Section */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">प्रतिलिपी:-</h3>
              <div className="space-y-2 text-gray-700">
                <p>1) मा.मुख्य कार्यकारी अधिकारी जिल्हा परिषद,चंद्रपूर यांना माहितीस सविनय सादर.</p>
                <p>2) गट विकास अधिकारी,पंचायत समिती---------------------यांना माहितीस सादर.</p>
                <p>3) सचिव ग्रामपंचायत---------------------यांना माहितीस व उचित कार्यवाहीस अवगत.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        {!isViewMode && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 pb-8">
            <button
              onClick={() => handleSubmit(true)}
              disabled={isLoading || isUploading}
              className="px-10 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isLoading ? 'सेव्ह करत आहे...' : 'मसुदा सेव्ह करा'}
            </button>

            <button
              onClick={() => handleSubmit(false)}
              disabled={isLoading || isUploading}
              className="px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {isLoading ? 'सबमिट करत आहे...' : 'तपासणी सबमिट करा'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
