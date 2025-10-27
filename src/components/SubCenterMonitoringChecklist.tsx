// Sub Centre Monitoring Checklist Form
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

interface SubCenterFormProps {
  user: SupabaseUser;
  onBack: () => void;
  categories: any[];
  onInspectionCreated: () => void;
  editingInspection?: any;
}

export const SubCenterMonitoringChecklist: React.FC<SubCenterFormProps> = ({
  user,
  onBack,
  categories,
  onInspectionCreated,
  editingInspection
}) => {
  const { t } = useTranslation();

  const isViewMode = editingInspection?.mode === 'view';
  const isEditMode = editingInspection?.mode === 'edit';

  const [district, setDistrict] = useState('');
  const [blockName, setBlockName] = useState('');
  const [scName, setScName] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [catchmentPopulation, setCatchmentPopulation] = useState('');
  const [totalVillages, setTotalVillages] = useState('');
  const [distanceFromPHC, setDistanceFromPHC] = useState('');
  const [lastVisit, setLastVisit] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [monitorName, setMonitorName] = useState('');
  const [staffAvailable, setStaffAvailable] = useState('');
  const [staffNotAvailable, setStaffNotAvailable] = useState('');
  const [generalComments, setGeneralComments] = useState('');

  const [section1, setSection1] = useState<any[]>([]);
  const [humanResources, setHumanResources] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [section4, setSection4] = useState<any[]>([]);
  const [section5, setSection5] = useState<any[]>([]);
  const [serviceDelivery, setServiceDelivery] = useState<any[]>([]);
  const [essentialSkills, setEssentialSkills] = useState<any[]>([]);
  const [recordMaintenance, setRecordMaintenance] = useState<any[]>([]);
  const [referralLinkages, setReferralLinkages] = useState<any[]>([]);
  const [iecDisplay, setIecDisplay] = useState<any[]>([]);
  const [monitoringSupervisors, setMonitoringSupervisors] = useState<any[]>([]);
  const [keyFindings, setKeyFindings] = useState<any[]>([]);

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

  const grampanchayatCategory = categories.find(cat => cat.form_type === 'Sub Centre Monitoring' || cat.form_type === 'Sub Centre Monitoring');

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

        // Load data from sub_centre_monitoring_checklist table
        const { data: formData, error } = await supabase
          .from('sub_centre_monitoring_checklist')
          .select('*')
          .eq('inspection_id', editingInspection.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading form data:', error);
          return;
        }

        if (formData) {
          setDistrict(formData.district || '');
          setBlockName(formData.block_name || '');
          setScName(formData.sc_name || '');
          setFacilityName(formData.facility_name || '');
          setCatchmentPopulation(formData.catchment_population || '');
          setTotalVillages(formData.total_villages || '');
          setDistanceFromPHC(formData.distance_from_phc || '');
          setLastVisit(formData.last_visit || '');
          setDate(formData.date || '');
          setMonitorName(formData.monitor_name || '');
          setStaffAvailable(formData.staff_available || '');
          setStaffNotAvailable(formData.staff_not_available || '');
          setGeneralComments(formData.general_comments || '');

          if (formData.infrastructure) setSection1(formData.infrastructure);
          if (formData.human_resources) setHumanResources(formData.human_resources);
          if (formData.equipment) setEquipment(formData.equipment);
          if (formData.essential_drugs) setSection4(formData.essential_drugs);
          if (formData.essential_supplies) setSection5(formData.essential_supplies);
          if (formData.service_delivery) setServiceDelivery(formData.service_delivery);
          if (formData.essential_skills) setEssentialSkills(formData.essential_skills);
          if (formData.record_maintenance) setRecordMaintenance(formData.record_maintenance);
          if (formData.referral_linkages) setReferralLinkages(formData.referral_linkages);
          if (formData.iec_display) setIecDisplay(formData.iec_display);
          if (formData.monitoring_supervisors) setMonitoringSupervisors(formData.monitoring_supervisors);
          if (formData.key_findings) setKeyFindings(formData.key_findings);
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
        const fileName = `Sub Centre Monitoring_${inspectionId}_${Date.now()}_${i}.${fileExt}`;

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
            description: `Sub Centre monitoring photo ${i + 1}`,
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
    return `SC-${year}${month}${day}-${time}`;
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

        // Update sub_centre_monitoring_checklist table
        const { error: formUpdateError } = await supabase
          .from('sub_centre_monitoring_checklist')
          .update({
            district,
            block_name: blockName,
            sc_name: scName,
            facility_name: facilityName,
            catchment_population: catchmentPopulation,
            total_villages: totalVillages,
            distance_from_phc: distanceFromPHC,
            last_visit: lastVisit || null,
            date: date || new Date().toISOString().split('T')[0],
            monitor_name: monitorName,
            staff_available: staffAvailable,
            staff_not_available: staffNotAvailable,
            infrastructure: section1,
            human_resources: humanResources,
            equipment,
            essential_drugs: section4,
            essential_supplies: section5,
            service_delivery: serviceDelivery,
            essential_skills: essentialSkills,
            record_maintenance: recordMaintenance,
            referral_linkages: referralLinkages,
            iec_display: iecDisplay,
            monitoring_supervisors: monitoringSupervisors,
            key_findings: keyFindings,
            general_comments: generalComments,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingInspection.id);

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

        // Insert into sub_centre_monitoring_checklist table
        const { error: formInsertError } = await supabase
          .from('sub_centre_monitoring_checklist')
          .insert({
            category_id: sanitizedInspectionData.category_id,
            user_id: user.id,
            district,
            block_name: blockName,
            sc_name: scName,
            facility_name: facilityName,
            catchment_population: catchmentPopulation,
            total_villages: totalVillages,
            distance_from_phc: distanceFromPHC,
            last_visit: lastVisit || null,
            date: date || new Date().toISOString().split('T')[0],
            monitor_name: monitorName,
            staff_available: staffAvailable,
            staff_not_available: staffNotAvailable,
            infrastructure: section1,
            human_resources: humanResources,
            equipment,
            essential_drugs: section4,
            essential_supplies: section5,
            service_delivery: serviceDelivery,
            essential_skills: essentialSkills,
            record_maintenance: recordMaintenance,
            referral_linkages: referralLinkages,
            iec_display: iecDisplay,
            monitoring_supervisors: monitoringSupervisors,
            key_findings: keyFindings,
            general_comments: generalComments
          });

        if (formInsertError) throw formInsertError;

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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Sub Centre Monitoring Checklist</h1>
            <div className="w-24"></div>
          </div>
          <p className="text-gray-600 text-center">उपकेंद्र निरीक्षण यादी</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Block Name</label>
                  <input
                    type="text"
                    value={blockName}
                    onChange={(e) => setBlockName(e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub Centre Name</label>
                  <input
                    type="text"
                    value={scName}
                    onChange={(e) => setScName(e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facility Name</label>
                  <input
                    type="text"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monitor Name</label>
                  <input
                    type="text"
                    value={monitorName}
                    onChange={(e) => setMonitorName(e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Name *</label>
                  <input
                    type="text"
                    value={inspectionData.location_name}
                    onChange={(e) => setInspectionData(prev => ({ ...prev, location_name: e.target.value }))}
                    disabled={isViewMode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation || isViewMode}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <MapPin className="h-5 w-5" />
                  <span>{isGettingLocation ? 'Getting Location...' : 'Get Current Location'}</span>
                </button>
                {inspectionData.location_detected && (
                  <p className="mt-2 text-sm text-gray-600">
                    Detected: {inspectionData.location_detected}
                  </p>
                )}
              </div>

              {!isViewMode && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos (Max 5)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {uploadedPhotos.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {uploadedPhotos.map((photo, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={'Photo'}
                            className="h-20 w-20 object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">General Comments</label>
              <textarea
                value={generalComments}
                onChange={(e) => setGeneralComments(e.target.value)}
                disabled={isViewMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Enter any additional comments..."
              />
            </div>

            {!isViewMode && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={isLoading || isUploading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{isLoading ? 'Saving...' : 'Save as Draft'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={isLoading || isUploading}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                  <span>{isLoading ? 'Submitting...' : 'Submit Form'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
