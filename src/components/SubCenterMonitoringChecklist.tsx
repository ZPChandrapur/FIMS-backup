import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Camera, MapPin, Save, Send, FileText, Calendar, Users, Stethoscope, Pill, Clipboard, BookOpen, Truck, Eye, UserCheck, Target, X } from 'lucide-react';
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

  const [facilityName, setFacilityName] = useState("");
  const [blockName, setBlockName] = useState("");
  const [scName, setScName] = useState("");
  const [district, setDistrict] = useState("CHANDRAPUR");
  const [catchmentPopulation, setCatchmentPopulation] = useState("");
  const [totalVillages, setTotalVillages] = useState("");
  const [distanceFromPHC, setDistanceFromPHC] = useState("");
  const [lastVisit, setLastVisit] = useState("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [monitorName, setMonitorName] = useState("");
  const [staffAvailable, setStaffAvailable] = useState("");
  const [staffNotAvailable, setStaffNotAvailable] = useState("");
  const [generalComments, setGeneralComments] = useState("");
  const [currentSection, setCurrentSection] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [inspectionData, setInspectionData] = useState({
    category_id: '',
    location_name: '',
    planned_date: '',
    latitude: null as number | null,
    longitude: null as number | null,
    location_accuracy: null as number | null,
    location_detected: ''
  });

  const [section1, setSection1] = useState<ChecklistItem[]>([
    { id: "1.1", label: "Sub-centre located near a main habitation (वस्ती)", value: "", comments: "" },
    { id: "1.2", label: "Functioning in Govt. building", value: "", comments: "" },
    { id: "1.3", label: "Building in good condition", value: "", comments: "" },
    { id: "1.4", label: "Electricity with functional power back up", value: "", comments: "" },
    { id: "1.5", label: "Running 24*7 water supply", value: "", comments: "" },
    { id: "1.6", label: "ANM quarter available", value: "", comments: "" },
    { id: "1.7", label: "ANM residing at SC", value: "", comments: "" },
    { id: "1.8", label: "Functional labour room", value: "", comments: "" },
    { id: "1.9", label: "Functional and clean toilet attached to labour room", value: "", comments: "" },
    { id: "1.10", label: "Functional New Born Care Corner (Functional neo-natal ambu bag)", value: "", comments: "" },
    { id: "1.11", label: "General cleanliness in the facility", value: "", comments: "" },
    { id: "1.12", label: "Availability of complain / suggestion box", value: "", comments: "" },
    { id: "1.13", label: "BMW mechanism", value: "", comments: "" },
  ]);

  const [humanResources, setHumanResources] = useState<HumanResource[]>([
    { id: '2.1', label: 'CHO', numbers: '', training: '', remarks: '' },
    { id: '2.2', label: 'ANM', numbers: '', training: '', remarks: '' },
    { id: '2.3', label: '2nd ANM', numbers: '', training: '', remarks: '' },
    { id: '2.4', label: 'MPW – Male', numbers: '', training: '', remarks: '' },
    { id: '2.5', label: 'मदतनीस', numbers: '', training: '', remarks: '' },
  ]);

  const [equipment, setEquipment] = useState<Equipment[]>([
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

  const [section4, setSection4] = useState<ChecklistItem[]>([
    { id: "4.1", label: "IFA tablets", value: "", comments: "" },
    { id: "4.2", label: "IFA syrup with dispenser", value: "", comments: "" },
    { id: "4.3", label: "Vit A syrup", value: "", comments: "" },
    { id: "4.4", label: "ORS packets", value: "", comments: "" },
    { id: "4.5", label: "Zinc tablets", value: "", comments: "" },
    { id: "4.6", label: "Inj Magnesium Sulphate", value: "", comments: "" },
    { id: "4.7", label: "Inj Oxytocin", value: "", comments: "" },
    { id: "4.8", label: "Gentamycin inj. 40 mg", value: "", comments: "" },
    { id: "4.9", label: "Antibiotics, if any, pls specify", value: "", comments: "" },
    { id: "4.10", label: "Availability of drugs for common ailments e.g PCM, anti-allergic drugs etc.", value: "", comments: "" },
    { id: "4.11", label: "Syrup Calcium with Phosphate 200ml", value: "", comments: "" },
    { id: "4.12", label: "cotrimazole 100mg Vaginal Pessaries with applicator", value: "", comments: "" },
    { id: "4.13", label: "Flucona: zole Tab. 150mg", value: "", comments: "" },
    { id: "4.14", label: "Albendazole Tab 400mg", value: "", comments: "" },
    { id: "4.15", label: "Albendazole Susp. 200mg/5ml, 10ml Bottle", value: "", comments: "" },
    { id: "4.16", label: "ANTI HYPERTENSIVE DRUGS", value: "", comments: "" },
    { id: "4.17", label: "ANTI DIABETIC DRUGS", value: "", comments: "" },
    { id: "4.18", label: "Glucostrip", value: "", comments: "" },
    { id: "4.19", label: "Calcium Carbonate Tab+ Vit D3", value: "", comments: "" },
  ]);

  const [section5, setSection5] = useState<ChecklistItem[]>([
    { id: "5.1", label: "Pregnancy testing Kits", value: "", comments: "" },
    { id: "5.2", label: "Urine albumin and sugar testing kit", value: "", comments: "" },
    { id: "5.3", label: "OCPs", value: "", comments: "" },
    { id: "5.4", label: "EC pills", value: "", comments: "" },
    { id: "5.5", label: "IUCDs", value: "", comments: "" },
    { id: "5.6", label: "Sanitary napkins", value: "", comments: "" },
  ]);

  const [serviceDelivery, setServiceDelivery] = useState<ServiceDelivery[]>([
    { id: '6.1', label: 'Number of estimated pregnancies', actual: '', expected: '', remarks: '' },
    { id: '6.2', label: 'Percentage of women registered in the first trimester', actual: '', expected: '', remarks: '' },
    { id: '6.3', label: 'Percentage of (4 ANC checkup) out of total registered', actual: '', expected: '', remarks: '' },
    { id: '6.4', label: 'No. of pregnant women given IFA', actual: '', expected: '', remarks: '' },
    { id: '6.5', label: 'Number of deliveries conducted at SC', actual: '', expected: '', remarks: '' },
    { id: '6.6', label: 'Number of deliveries conducted at home', actual: '', expected: '', remarks: '' },
    { id: '6.7', label: 'No. of neonates initiated breast feeding within one hour', actual: '', expected: '', remarks: '' },
  ]);

  const [essentialSkills, setEssentialSkills] = useState<EssentialSkill[]>([
    { id: '7.1', skill: 'Correctly measure BP', knowledge: '', skillLevel: '', remarks: '' },
    { id: '7.2', skill: 'Correctly measure haemoglobin', knowledge: '', skillLevel: '', remarks: '' },
    { id: '7.3', skill: 'Correctly measure urine albumin and protein', knowledge: '', skillLevel: '', remarks: '' },
    { id: '7.4', skill: 'Identify high risk pregnancy', knowledge: '', skillLevel: '', remarks: '' },
    { id: '7.5', skill: 'Awareness on mechanisms for referral to PHC and FRU', knowledge: '', skillLevel: '', remarks: '' },
    { id: '7.6', skill: 'Correct use of partograph', knowledge: '', skillLevel: '', remarks: '' },
    { id: '7.7', skill: 'Provide essential newborn care (thermoregulation, breastfeeding and asepsis)', knowledge: '', skillLevel: '', remarks: '' },
    { id: '7.8', skill: 'Correctly insert IUCD', knowledge: '', skillLevel: '', remarks: '' },
    { id: '7.9', skill: 'Correctly administer vaccine', knowledge: '', skillLevel: '', remarks: '' },
    { id: '7.10', skill: 'Adherence to IMEP protocols', knowledge: '', skillLevel: '', remarks: '' },
    { id: '7.11', skill: 'Segregation of wastes in colour coded bins', knowledge: '', skillLevel: '', remarks: '' },
    { id: '7.12', skill: 'Guidance / Support for breast feeding method', knowledge: '', skillLevel: '', remarks: '' },
    { id: '7.13', skill: 'Correctly identified signs of Pneumonia and dehydration', knowledge: '', skillLevel: '', remarks: '' },
    { id: '7.14', skill: 'Awareness on Immunization Schedule', knowledge: '', skillLevel: '', remarks: '' },
    { id: '7.15', skill: 'Awareness on site of administration of vaccine', knowledge: '', skillLevel: '', remarks: '' },
  ]);

  const [recordMaintenance, setRecordMaintenance] = useState<RecordMaintenance[]>([
    { id: '8.1', record: 'Untied funds expenditure (Rs.10,000) Check % expenditure', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
    { id: '8.2', record: 'Annual maintenance grant (Rs.10,000) Check % expenditure', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
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
    { id: '8.13', record: 'List of families with 0-6 years children under RBSK', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
    { id: '8.14', record: 'Line listing of severely anaemic pregnant women', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
    { id: '8.15', record: 'Line list of SAM, MAM Children', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
    { id: '8.15A', record: 'Updated Micro plan', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
    { id: '8.16', record: 'Vaccine supply for each session day (check availability of all vaccines)', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
    { id: '8.17', record: 'Due list and work plan received from RCH Portal through Mobile / Physically', availableUpdated: false, availableNotMaintained: false, notAvailable: false, remarks: '' },
  ]);

  const [referralLinkages, setReferralLinkages] = useState<ReferralLinkage[]>([
    { id: '9.1', modeOfTransport: 'Home to facility', womenTransported: '', sickInfantsTransported: '', freePaid: '' },
    { id: '9.2', modeOfTransport: 'Inter facility', womenTransported: '', sickInfantsTransported: '', freePaid: '' },
    { id: '9.3', modeOfTransport: 'Facility to Home (drop back)', womenTransported: '', sickInfantsTransported: '', freePaid: '' },
  ]);

  const [iecDisplay, setIecDisplay] = useState<IECDisplay[]>([
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

  const [monitoringSupervisors, setMonitoringSupervisors] = useState<MonitoringSupervisor[]>([
    { id: '11.1', name: '', designation: '', sign: '' },
    { id: '11.2', name: '', designation: '', sign: '' },
    { id: '11.3', name: '', designation: '', sign: '' },
    { id: '11.4', name: '', designation: '', sign: '' },
    { id: '11.5', name: '', designation: '', sign: '' },
  ]);

  const [keyFindings, setKeyFindings] = useState<KeyFinding[]>([
    { id: 1, keyFinding: '', action: '', responsible: '', timeline: '' },
    { id: 2, keyFinding: '', action: '', responsible: '', timeline: '' },
    { id: 3, keyFinding: '', action: '', responsible: '', timeline: '' },
    { id: 4, keyFinding: '', action: '', responsible: '', timeline: '' },
    { id: 5, keyFinding: '', action: '', responsible: '', timeline: '' },
  ]);

  const sections = [
    { id: 1, title: 'Basic Information', icon: FileText },
    { id: 2, title: 'Infrastructure', icon: MapPin },
    { id: 3, title: 'Human Resources', icon: Users },
    { id: 4, title: 'Equipment', icon: Stethoscope },
    { id: 5, title: 'Essential Drugs', icon: Pill },
    { id: 6, title: 'Essential Supplies', icon: Clipboard },
    { id: 7, title: 'Service Delivery', icon: Target },
    { id: 8, title: 'Essential Skills', icon: BookOpen },
    { id: 9, title: 'Record Maintenance', icon: FileText },
    { id: 10, title: 'Referral Linkages', icon: Truck },
    { id: 11, title: 'IEC Display', icon: Eye },
    { id: 12, title: 'Monitoring Supervisors', icon: UserCheck },
    { id: 13, title: 'Key Findings', icon: Target },
  ];

  const subCenterCategory = categories.find(cat =>
    cat.form_type === 'Sub Centre Monitoring' ||
    cat.name === 'Sub Centre Monitoring'
  );

  useEffect(() => {
    if (subCenterCategory) {
      setInspectionData(prev => ({
        ...prev,
        category_id: subCenterCategory.id
      }));
    }
  }, [subCenterCategory]);

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
        const fileName = `SubCentre_${inspectionId}_${Date.now()}_${i}.${fileExt}`;

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
          .eq('inspection_id', editingInspection.id);

        if (formUpdateError) throw formUpdateError;

      } else {
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

        const { error: formInsertError } = await supabase
          .from('sub_centre_monitoring_checklist')
          .insert({
            inspection_id: inspectionResult.id,
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
      }

      if (uploadedPhotos.length > 0) {
        await uploadPhotosToSupabase(inspectionResult.id);
      }

      alert(isDraft ? 'Draft saved successfully!' : 'Form submitted successfully!');
      onInspectionCreated();
      onBack();

    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert('Error submitting form: ' + error.message);
    } finally {
      setIsLoading(false);
    };
  