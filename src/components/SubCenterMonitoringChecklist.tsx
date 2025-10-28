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

type ChecklistItem = {
  id: string;
  label: string;
  value: string;
  comments?: string;
};

type HumanResource = {
  id: string;
  label: string;
  numbers: string;
  training: string;
  remarks: string;
};

type Equipment = {
  id: string;
  equipment: string;
  availableFunctional: boolean;
  availableNotFunctional: boolean;
  notAvailable: boolean;
  remarks: string;
};

type ServiceDelivery = {
  id: string;
  label: string;
  actual: string;
  expected: string;
  remarks: string;
};

type EssentialSkill = {
  id: string;
  skill: string;
  knowledge: string;
  skillLevel: string;
  remarks: string;
};

type RecordMaintenance = {
  id: string;
  record: string;
  availableUpdated: boolean;
  availableNotMaintained: boolean;
  notAvailable: boolean;
  remarks: string;
};

type ReferralLinkage = {
  id: string;
  modeOfTransport: string;
  womenTransported: string;
  sickInfantsTransported: string;
  freePaid: string;
};

type IECDisplay = {
  id: string;
  material: string;
  available: boolean;
  remarks: string;
};

type MonitoringSupervisor = {
  id: string;
  name: string;
  designation: string;
  dateOfVisit: string;
  sign: string;
};

type KeyFinding = {
  id: number;
  keyFinding: string;
  action: string;
  responsible: string;
  timeline: string;
};

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
  const [currentSection, setCurrentSection] = useState(1);

  const [section1, setSection1] = useState<ChecklistItem[]>([]);
  const [humanResources, setHumanResources] = useState<HumanResource[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [section4, setSection4] = useState<ChecklistItem[]>([]);
  const [section5, setSection5] = useState<ChecklistItem[]>([]);
  const [serviceDelivery, setServiceDelivery] = useState<ServiceDelivery[]>([]);
  const [essentialSkills, setEssentialSkills] = useState<EssentialSkill[]>([]);
  const [recordMaintenance, setRecordMaintenance] = useState<RecordMaintenance[]>([]);
  const [referralLinkages, setReferralLinkages] = useState<ReferralLinkage[]>([]);
  const [iecDisplay, setIecDisplay] = useState<IECDisplay[]>([]);
  const [monitoringSupervisors, setMonitoringSupervisors] = useState<MonitoringSupervisor[]>([]);
  const [keyFindings, setKeyFindings] = useState<KeyFinding[]>([]);

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
    if (!editingInspection && section1.length === 0) {
      setSection1([
        { id: "1.1", label: "Sub-centre located near a main habitation", value: "", comments: "" },
        { id: "1.2", label: "Functioning in Govt. building", value: "", comments: "" },
        { id: "1.3", label: "Building in good condition", value: "", comments: "" },
        { id: "1.4", label: "Electricity with functional power back up", value: "", comments: "" },
        { id: "1.5", label: "Running 24*7 water supply", value: "", comments: "" },
        { id: "1.6", label: "ANM quarter available", value: "", comments: "" },
        { id: "1.7", label: "ANM residing at SC", value: "", comments: "" },
        { id: "1.8", label: "Functional labour room", value: "", comments: "" },
        { id: "1.9", label: "Functional and clean toilet attached to labour room", value: "", comments: "" },
        { id: "1.10", label: "Functional New Born Care Corner", value: "", comments: "" },
        { id: "1.11", label: "General cleanliness in the facility", value: "", comments: "" },
        { id: "1.12", label: "Availability of complain / suggestion box", value: "", comments: "" },
        { id: "1.13", label: "BMW mechanism", value: "", comments: "" },
      ]);

      setHumanResources([
        { id: '2.1', label: 'CHO', numbers: '', training: '', remarks: '' },
        { id: '2.2', label: 'ANM', numbers: '', training: '', remarks: '' },
        { id: '2.3', label: '2nd ANM', numbers: '', training: '', remarks: '' },
        { id: '2.4', label: 'MPW – Male', numbers: '', training: '', remarks: '' },
        { id: '2.5', label: 'Assistant', numbers: '', training: '', remarks: '' },
      ]);

      setEquipment([
        { id: '3.1', equipment: 'Equipment for Haemoglobin Estimation', availableFunctional: false, availableNotFunctional: false, notAvailable: false, remarks: '' },
        { id: '3.2', equipment: 'Blood sugar testing kits', availableFunctional: false, availableNotFunctional: false, notAvailable: false, remarks: '' },
        { id: '3.3', equipment: 'BP Instrument and Stethoscope', availableFunctional: false, availableNotFunctional: false, notAvailable: false, remarks: '' },
        { id: '3.4', equipment: 'Delivery equipment', availableFunctional: false, availableNotFunctional: false, notAvailable: false, remarks: '' },
        { id: '3.5', equipment: 'Neonatal ambu bag', availableFunctional: false, availableNotFunctional: false, notAvailable: false, remarks: '' },
        { id: '3.6', equipment: 'Adult weighing machine', availableFunctional: false, availableNotFunctional: false, notAvailable: false, remarks: '' },
        { id: '3.7', equipment: 'Infant / New born weighing machine', availableFunctional: false, availableNotFunctional: false, notAvailable: false, remarks: '' },
        { id: '3.8', equipment: 'Needle & Hub Cutter', availableFunctional: false, availableNotFunctional: false, notAvailable: false, remarks: '' },
        { id: '3.9', equipment: 'Colour coded bins', availableFunctional: false, availableNotFunctional: false, notAvailable: false, remarks: '' }
      ]);

      setSection4([
        { id: "4.1", label: "IFA tablets", value: "", comments: "" },
        { id: "4.2", label: "IFA syrup with dispenser", value: "", comments: "" },
        { id: "4.3", label: "Vit A syrup", value: "", comments: "" },
        { id: "4.4", label: "ORS packets", value: "", comments: "" },
        { id: "4.5", label: "Zinc tablets", value: "", comments: "" },
        { id: "4.6", label: "Inj Magnesium Sulphate", value: "", comments: "" },
        { id: "4.7", label: "Inj Oxytocin", value: "", comments: "" },
        { id: "4.8", label: "Gentamycin inj. 40 mg", value: "", comments: "" },
        { id: "4.9", label: "Antibiotics (specify)", value: "", comments: "" },
        { id: "4.10", label: "Drugs for common ailments (PCM, anti-allergic)", value: "", comments: "" },
        { id: "4.11", label: "Syrup Calcium with Phosphate 200ml", value: "", comments: "" },
        { id: "4.12", label: "Cotrimazole 100mg Vaginal Pessaries", value: "", comments: "" },
        { id: "4.13", label: "Fluconazole Tab. 150mg", value: "", comments: "" },
        { id: "4.14", label: "Albendazole Tab 400mg", value: "", comments: "" },
        { id: "4.15", label: "Albendazole Susp. 200mg/5ml", value: "", comments: "" },
        { id: "4.16", label: "Anti-hypertensive drugs", value: "", comments: "" },
        { id: "4.17", label: "Anti-diabetic drugs", value: "", comments: "" },
        { id: "4.18", label: "Glucostrip", value: "", comments: "" },
        { id: "4.19", label: "Calcium Carbonate Tab + Vit D3", value: "", comments: "" },
      ]);

      setSection5([
        { id: "5.1", label: "Pregnancy testing Kits", value: "", comments: "" },
        { id: "5.2", label: "Urine albumin and sugar testing kit", value: "", comments: "" },
        { id: "5.3", label: "OCPs", value: "", comments: "" },
        { id: "5.4", label: "EC pills", value: "", comments: "" },
        { id: "5.5", label: "IUCDs", value: "", comments: "" },
        { id: "5.6", label: "Sanitary napkins", value: "", comments: "" },
      ]);

      setServiceDelivery([
        { id: '6.1', label: 'Number of estimated pregnancies', actual: '', expected: '', remarks: '' },
        { id: '6.2', label: 'Percentage of women registered in first trimester', actual: '', expected: '', remarks: '' },
        { id: '6.3', label: 'Percentage of 4 ANC checkups', actual: '', expected: '', remarks: '' },
        { id: '6.4', label: 'Pregnant women given IFA', actual: '', expected: '', remarks: '' },
        { id: '6.5', label: 'Deliveries conducted at SC', actual: '', expected: '', remarks: '' },
        { id: '6.6', label: 'Deliveries conducted at home', actual: '', expected: '', remarks: '' },
        { id: '6.7', label: 'Neonates with breastfeeding within one hour', actual: '', expected: '', remarks: '' },
      ]);

      setEssentialSkills([
        { id: '7.1', skill: 'Correctly measure BP', knowledge: '', skillLevel: '', remarks: '' },
        { id: '7.2', skill: 'Correctly measure haemoglobin', knowledge: '', skillLevel: '', remarks: '' },
        { id: '7.3', skill: 'Correctly measure urine albumin and protein', knowledge: '', skillLevel: '', remarks: '' },
        { id: '7.4', skill: 'Identify high risk pregnancy', knowledge: '', skillLevel: '', remarks: '' },
        { id: '7.5', skill: 'Awareness on mechanisms for referral', knowledge: '', skillLevel: '', remarks: '' },
        { id: '7.6', skill: 'Correct use of partograph', knowledge: '', skillLevel: '', remarks: '' },
        { id: '7.7', skill: 'Provide essential newborn care', knowledge: '', skillLevel: '', remarks: '' },
        { id: '7.8', skill: 'Correctly insert IUCD', knowledge: '', skillLevel: '', remarks: '' },
        { id: '7.9', skill: 'Correctly administer vaccine', knowledge: '', skillLevel: '', remarks: '' },
        { id: '7.10', skill: 'Adherence to IMEP protocols', knowledge: '', skillLevel: '', remarks: '' },
        { id: '7.11', skill: 'Segregation of wastes in colour coded bins', knowledge: '', skillLevel: '', remarks: '' },
        { id: '7.12', skill: 'Guidance for breast feeding method', knowledge: '', skillLevel: '', remarks: '' },
        { id: '7.13', skill: 'Identify signs of Pneumonia and dehydration', knowledge: '', skillLevel: '', remarks: '' },
        { id: '7.14', skill: 'Awareness on Immunization Schedule', knowledge: '', skillLevel: '', remarks: '' },
        { id: '7.15', skill: 'Awareness on site of administration of vaccine', knowledge: '', skillLevel: '', remarks: '' },
      ]);

      setRecordMaintenance([
        { id: '8.1', record: 'Untied funds expenditure (Rs.10,000)', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.2', record: 'Annual maintenance grant (Rs.10,000)', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.3', record: 'Payments under JSY', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.4', record: 'VHSNC plan', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.5', record: 'VHSNC meeting minutes and action taken', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.6', record: 'Eligible couple register', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.7', record: 'MCH register (as per GOI)', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.8', record: 'Delivery Register as per GOI format', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.9', record: 'Stock register', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.10', record: 'Due lists', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.11', record: 'MCP cards', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.12', record: 'Referral Registers (in and out)', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.13', record: 'List of families with 0-6 years children', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.14', record: 'Line listing of severely anaemic pregnant women', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.15', record: 'Line list of SAM, MAM Children', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.16', record: 'Updated Micro plan', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.17', record: 'Vaccine supply for each session day', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
        { id: '8.18', record: 'Due list from RCH Portal', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
      ]);

      setReferralLinkages([
        { id: '9.1', modeOfTransport: 'Home to facility', womenTransported: '', sickInfantsTransported: '', freePaid: '' },
        { id: '9.2', modeOfTransport: 'Inter facility', womenTransported: '', sickInfantsTransported: '', freePaid: '' },
        { id: '9.3', modeOfTransport: 'Facility to Home (drop back)', womenTransported: '', sickInfantsTransported: '', freePaid: '' },
      ]);

      setIecDisplay([
        { id: '10.1', material: 'Approach roads have directions to the sub centre', available: false, remarks: '' },
        { id: '10.2', material: 'Citizen Charter', available: false, remarks: '' },
        { id: '10.3', material: 'Timings of the Sub Centre', available: false, remarks: '' },
        { id: '10.4', material: 'Visit schedule of ANMs', available: false, remarks: '' },
        { id: '10.5', material: 'Area distribution of the ANMs / VHNSC plan', available: false, remarks: '' },
        { id: '10.6', material: 'SBA Protocol Posters', available: false, remarks: '' },
        { id: '10.7', material: 'Immunization Schedule', available: false, remarks: '' },
        { id: '10.8', material: 'List of services provided at SC', available: false, remarks: '' },
        { id: '10.9', material: 'Display of JSY benefits', available: false, remarks: '' },
        { id: '10.10', material: 'Display of referral transport facility', available: false, remarks: '' },
      ]);

      setMonitoringSupervisors([
        { id: '11.1', name: '', designation: '', dateOfVisit: '', sign: '' },
        { id: '11.2', name: '', designation: '', dateOfVisit: '', sign: '' },
        { id: '11.3', name: '', designation: '', dateOfVisit: '', sign: '' },
        { id: '11.4', name: '', designation: '', dateOfVisit: '', sign: '' },
        { id: '11.5', name: '', designation: '', dateOfVisit: '', sign: '' },
      ]);

      setKeyFindings([
        { id: 1, keyFinding: '', action: '', responsible: '', timeline: '' },
        { id: 2, keyFinding: '', action: '', responsible: '', timeline: '' },
        { id: 3, keyFinding: '', action: '', responsible: '', timeline: '' },
        { id: 4, keyFinding: '', action: '', responsible: '', timeline: '' },
        { id: 5, keyFinding: '', action: '', responsible: '', timeline: '' },
      ]);
    }
  }, [editingInspection]);

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



  const renderBasicInfo = () => (
    <div className="space-y-4">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Catchment Population</label>
          <input
            type="text"
            value={catchmentPopulation}
            onChange={(e) => setCatchmentPopulation(e.target.value)}
            disabled={isViewMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Villages</label>
          <input
            type="text"
            value={totalVillages}
            onChange={(e) => setTotalVillages(e.target.value)}
            disabled={isViewMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Distance from PHC (km)</label>
          <input
            type="text"
            value={distanceFromPHC}
            onChange={(e) => setDistanceFromPHC(e.target.value)}
            disabled={isViewMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Visit Date</label>
          <input
            type="date"
            value={lastVisit}
            onChange={(e) => setLastVisit(e.target.value)}
            disabled={isViewMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Visit Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Staff Available</label>
          <textarea
            value={staffAvailable}
            onChange={(e) => setStaffAvailable(e.target.value)}
            disabled={isViewMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Staff Not Available</label>
          <textarea
            value={staffNotAvailable}
            onChange={(e) => setStaffNotAvailable(e.target.value)}
            disabled={isViewMode}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
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
  );

  const renderInfrastructure = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Section 1: Infrastructure</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sr. No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Checklist Item</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Comments</th>
            </tr>
          </thead>
          <tbody>
            {section1.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.label}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={item.value}
                    onChange={(e) => {
                      const newSection = [...section1];
                      newSection[index].value = e.target.value;
                      setSection1(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="NA">N/A</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.comments || ''}
                    onChange={(e) => {
                      const newSection = [...section1];
                      newSection[index].comments = e.target.value;
                      setSection1(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    placeholder="Comments"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHumanResources = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Section 2: Human Resources</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sr. No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Numbers</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Training</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {humanResources.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.label}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.numbers}
                    onChange={(e) => {
                      const newSection = [...humanResources];
                      newSection[index].numbers = e.target.value;
                      setHumanResources(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.training}
                    onChange={(e) => {
                      const newSection = [...humanResources];
                      newSection[index].training = e.target.value;
                      setHumanResources(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.remarks}
                    onChange={(e) => {
                      const newSection = [...humanResources];
                      newSection[index].remarks = e.target.value;
                      setHumanResources(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEquipment = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Section 3: Equipment</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sr. No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Equipment</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Available & Functional</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Available Not Functional</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Not Available</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.equipment}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.availableFunctional}
                    onChange={(e) => {
                      const newSection = [...equipment];
                      newSection[index].availableFunctional = e.target.checked;
                      if (e.target.checked) {
                        newSection[index].availableNotFunctional = false;
                        newSection[index].notAvailable = false;
                      }
                      setEquipment(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-4 h-4"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.availableNotFunctional}
                    onChange={(e) => {
                      const newSection = [...equipment];
                      newSection[index].availableNotFunctional = e.target.checked;
                      if (e.target.checked) {
                        newSection[index].availableFunctional = false;
                        newSection[index].notAvailable = false;
                      }
                      setEquipment(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-4 h-4"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.notAvailable}
                    onChange={(e) => {
                      const newSection = [...equipment];
                      newSection[index].notAvailable = e.target.checked;
                      if (e.target.checked) {
                        newSection[index].availableFunctional = false;
                        newSection[index].availableNotFunctional = false;
                      }
                      setEquipment(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-4 h-4"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.remarks}
                    onChange={(e) => {
                      const newSection = [...equipment];
                      newSection[index].remarks = e.target.value;
                      setEquipment(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEssentialDrugs = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Section 4: Essential Drugs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sr. No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Drug Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Availability</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Comments</th>
            </tr>
          </thead>
          <tbody>
            {section4.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.label}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={item.value}
                    onChange={(e) => {
                      const newSection = [...section4];
                      newSection[index].value = e.target.value;
                      setSection4(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.comments || ''}
                    onChange={(e) => {
                      const newSection = [...section4];
                      newSection[index].comments = e.target.value;
                      setSection4(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEssentialSupplies = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Section 5: Essential Supplies</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sr. No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Supply Item</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Availability</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Comments</th>
            </tr>
          </thead>
          <tbody>
            {section5.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.label}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={item.value}
                    onChange={(e) => {
                      const newSection = [...section5];
                      newSection[index].value = e.target.value;
                      setSection5(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.comments || ''}
                    onChange={(e) => {
                      const newSection = [...section5];
                      newSection[index].comments = e.target.value;
                      setSection5(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderServiceDelivery = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Section 6: Service Delivery</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sr. No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Indicator</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actual</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Expected</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {serviceDelivery.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.label}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.actual}
                    onChange={(e) => {
                      const newSection = [...serviceDelivery];
                      newSection[index].actual = e.target.value;
                      setServiceDelivery(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.expected}
                    onChange={(e) => {
                      const newSection = [...serviceDelivery];
                      newSection[index].expected = e.target.value;
                      setServiceDelivery(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.remarks}
                    onChange={(e) => {
                      const newSection = [...serviceDelivery];
                      newSection[index].remarks = e.target.value;
                      setServiceDelivery(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEssentialSkills = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Section 7: Essential Skills</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sr. No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Skill</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Knowledge</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Skill Level</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {essentialSkills.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.skill}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={item.knowledge}
                    onChange={(e) => {
                      const newSection = [...essentialSkills];
                      newSection[index].knowledge = e.target.value;
                      setEssentialSkills(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Partial">Partial</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={item.skillLevel}
                    onChange={(e) => {
                      const newSection = [...essentialSkills];
                      newSection[index].skillLevel = e.target.value;
                      setEssentialSkills(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Poor">Poor</option>
                    <option value="NA">N/A</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.remarks}
                    onChange={(e) => {
                      const newSection = [...essentialSkills];
                      newSection[index].remarks = e.target.value;
                      setEssentialSkills(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRecordMaintenance = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Section 8: Record Maintenance</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sr. No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Record Type</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Available & Updated</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Available Not Maintained</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Not Available</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {recordMaintenance.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.record}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.availableUpdated}
                    onChange={(e) => {
                      const newSection = [...recordMaintenance];
                      newSection[index].availableUpdated = e.target.checked;
                      if (e.target.checked) {
                        newSection[index].availableNotMaintained = false;
                        newSection[index].notAvailable = false;
                      }
                      setRecordMaintenance(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-4 h-4"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.availableNotMaintained}
                    onChange={(e) => {
                      const newSection = [...recordMaintenance];
                      newSection[index].availableNotMaintained = e.target.checked;
                      if (e.target.checked) {
                        newSection[index].availableUpdated = false;
                        newSection[index].notAvailable = false;
                      }
                      setRecordMaintenance(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-4 h-4"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.notAvailable}
                    onChange={(e) => {
                      const newSection = [...recordMaintenance];
                      newSection[index].notAvailable = e.target.checked;
                      if (e.target.checked) {
                        newSection[index].availableUpdated = false;
                        newSection[index].availableNotMaintained = false;
                      }
                      setRecordMaintenance(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-4 h-4"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.remarks}
                    onChange={(e) => {
                      const newSection = [...recordMaintenance];
                      newSection[index].remarks = e.target.value;
                      setRecordMaintenance(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReferralLinkages = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Section 9: Referral Linkages</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sr. No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Mode of Transport</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Women Transported</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Sick Infants Transported</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Free/Paid</th>
            </tr>
          </thead>
          <tbody>
            {referralLinkages.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.modeOfTransport}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.womenTransported}
                    onChange={(e) => {
                      const newSection = [...referralLinkages];
                      newSection[index].womenTransported = e.target.value;
                      setReferralLinkages(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.sickInfantsTransported}
                    onChange={(e) => {
                      const newSection = [...referralLinkages];
                      newSection[index].sickInfantsTransported = e.target.value;
                      setReferralLinkages(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={item.freePaid}
                    onChange={(e) => {
                      const newSection = [...referralLinkages];
                      newSection[index].freePaid = e.target.value;
                      setReferralLinkages(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderIECDisplay = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Section 10: IEC Display</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sr. No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">IEC Material</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Available</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {iecDisplay.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.material}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={(e) => {
                      const newSection = [...iecDisplay];
                      newSection[index].available = e.target.checked;
                      setIecDisplay(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-4 h-4"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.remarks}
                    onChange={(e) => {
                      const newSection = [...iecDisplay];
                      newSection[index].remarks = e.target.value;
                      setIecDisplay(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMonitoringSupervisors = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Section 11: Monitoring Supervisors</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sr. No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Designation</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date of Visit</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Signature</th>
            </tr>
          </thead>
          <tbody>
            {monitoringSupervisors.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newSection = [...monitoringSupervisors];
                      newSection[index].name = e.target.value;
                      setMonitoringSupervisors(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    placeholder="Name"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.designation}
                    onChange={(e) => {
                      const newSection = [...monitoringSupervisors];
                      newSection[index].designation = e.target.value;
                      setMonitoringSupervisors(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    placeholder="Designation"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="date"
                    value={item.dateOfVisit}
                    onChange={(e) => {
                      const newSection = [...monitoringSupervisors];
                      newSection[index].dateOfVisit = e.target.value;
                      setMonitoringSupervisors(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.sign}
                    onChange={(e) => {
                      const newSection = [...monitoringSupervisors];
                      newSection[index].sign = e.target.value;
                      setMonitoringSupervisors(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    placeholder="Signature"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderKeyFindings = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Section 12: Key Findings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Sr. No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Key Finding</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Action Required</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Responsible Person</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Timeline</th>
            </tr>
          </thead>
          <tbody>
            {keyFindings.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <textarea
                    value={item.keyFinding}
                    onChange={(e) => {
                      const newSection = [...keyFindings];
                      newSection[index].keyFinding = e.target.value;
                      setKeyFindings(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    rows={2}
                    placeholder="Enter key finding"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <textarea
                    value={item.action}
                    onChange={(e) => {
                      const newSection = [...keyFindings];
                      newSection[index].action = e.target.value;
                      setKeyFindings(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    rows={2}
                    placeholder="Action required"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.responsible}
                    onChange={(e) => {
                      const newSection = [...keyFindings];
                      newSection[index].responsible = e.target.value;
                      setKeyFindings(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    placeholder="Responsible person"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={item.timeline}
                    onChange={(e) => {
                      const newSection = [...keyFindings];
                      newSection[index].timeline = e.target.value;
                      setKeyFindings(newSection);
                    }}
                    disabled={isViewMode}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                    placeholder="Timeline"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGeneralComments = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Section 13: General Comments</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Overall Comments & Recommendations</label>
        <textarea
          value={generalComments}
          onChange={(e) => setGeneralComments(e.target.value)}
          disabled={isViewMode}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={6}
          placeholder="Enter overall comments and recommendations..."
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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

        {/* Section Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { num: 1, name: 'Basic Info' },
              { num: 2, name: 'Infrastructure' },
              { num: 3, name: 'Human Resources' },
              { num: 4, name: 'Equipment' },
              { num: 5, name: 'Essential Drugs' },
              { num: 6, name: 'Essential Supplies' },
              { num: 7, name: 'Service Delivery' },
              { num: 8, name: 'Essential Skills' },
              { num: 9, name: 'Record Maintenance' },
              { num: 10, name: 'Referral Linkages' },
              { num: 11, name: 'IEC Display' },
              { num: 12, name: 'Monitoring Supervisors' },
              { num: 13, name: 'Key Findings & Comments' },
            ].map((section) => (
              <button
                key={section.num}
                onClick={() => setCurrentSection(section.num)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentSection === section.num
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.num}. {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* Section Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {currentSection === 1 && renderBasicInfo()}
          {currentSection === 2 && renderInfrastructure()}
          {currentSection === 3 && renderHumanResources()}
          {currentSection === 4 && renderEquipment()}
          {currentSection === 5 && renderEssentialDrugs()}
          {currentSection === 6 && renderEssentialSupplies()}
          {currentSection === 7 && renderServiceDelivery()}
          {currentSection === 8 && renderEssentialSkills()}
          {currentSection === 9 && renderRecordMaintenance()}
          {currentSection === 10 && renderReferralLinkages()}
          {currentSection === 11 && renderIECDisplay()}
          {currentSection === 12 && renderMonitoringSupervisors()}
          {currentSection === 13 && (
            <>
              {renderKeyFindings()}
              <div className="mt-6">
                {renderGeneralComments()}
              </div>
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
              disabled={currentSection === 1}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>

            <span className="text-gray-600 font-medium">
              Section {currentSection} of 13
            </span>

            {currentSection < 13 ? (
              <button
                onClick={() => setCurrentSection(Math.min(13, currentSection + 1))}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <span>Next</span>
                <ArrowLeft className="h-5 w-5 transform rotate-180" />
              </button>
            ) : (
              <div className="flex gap-4">
                {!isViewMode && (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
