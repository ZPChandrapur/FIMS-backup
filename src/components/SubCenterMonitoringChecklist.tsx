import React, { useState } from 'react';
import { FileText, Calendar, MapPin, Users, Stethoscope, Pill, Clipboard, BookOpen, Truck, Eye, UserCheck, Target } from 'lucide-react';

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

const SubCenterMonitoringChecklist: React.FC = () => {
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

  const [section1, setSection1] = useState<ChecklistItem[]>([
    { id: "1.1", label: "Sub-centre located near a main habitation (वस्ती)", value: "" },
    { id: "1.2", label: "Functioning in Govt. building", value: "" },
    { id: "1.3", label: "Building in good condition", value: "" },
    { id: "1.4", label: "Electricity with functional power back up", value: "" },
    { id: "1.5", label: "Running 24*7 water supply", value: "" },
    { id: "1.6", label: "ANM quarter available", value: "" },
    { id: "1.7", label: "ANM residing at SC", value: "" },
    { id: "1.8", label: "Functional labour room", value: "" },
    { id: "1.9", label: "Functional and clean toilet attached to labour room", value: "" },
    { id: "1.10", label: "Functional New Born Care Corner (Functional neo-natal ambu bag)", value: "" },
    { id: "1.11", label: "General cleanliness in the facility", value: "" },
    { id: "1.12", label: "Availability of complain / suggestion box", value: "" },
    { id: "1.13", label: "BMW mechanism", value: "" },
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
    { id: "4.1", label: "IFA tablets", value: "" },
    { id: "4.2", label: "IFA syrup with dispenser", value: "" },
    { id: "4.3", label: "Vit A syrup", value: "" },
    { id: "4.4", label: "ORS packets", value: "" },
    { id: "4.5", label: "Zinc tablets", value: "" },
    { id: "4.6", label: "Inj Magnesium Sulphate", value: "" },
    { id: "4.7", label: "Inj Oxytocin", value: "" },
    { id: "4.8", label: "Gentamycin inj. 40 mg", value: "" },
    { id: "4.9", label: "Antibiotics, if any, pls specify", value: "" },
    { id: "4.10", label: "Availability of drugs for common ailments e.g PCM, anti-allergic drugs etc.", value: "" },
    { id: "4.11", label: "Syrup Calcium with Phosphate 200ml", value: "" },
    { id: "4.12", label: "cotrimazole 100mg Vaginal Pessaries with applicator", value: "" },
    { id: "4.13", label: "Flucona: zole Tab. 150mg", value: "" },
    { id: "4.14", label: "Albendazole Tab 400mg", value: "" },
    { id: "4.15", label: "Albendazole Susp. 200mg/5ml, 10ml Bottle", value: "" },
    { id: "4.16", label: "ANTI HYPERTENSIVE DRUGS", value: "" },
    { id: "4.17", label: "ANTI DIABETIC DRUGS", value: "" },
    { id: "4.18", label: "Glucostrip", value: "" },
    { id: "4.19", label: "Calcium Carbonate Tab+ Vit D3", value: "" },
  ]);

  const [section5, setSection5] = useState<ChecklistItem[]>([
    { id: "5.1", label: "Pregnancy testing Kits", value: "" },
    { id: "5.2", label: "Urine albumin and sugar testing kit", value: "" },
    { id: "5.3", label: "OCPs", value: "" },
    { id: "5.4", label: "EC pills", value: "" },
    { id: "5.5", label: "IUCDs", value: "" },
    { id: "5.6", label: "Sanitary napkins", value: "" },
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

  const updateSection1Item = (id: string, field: keyof ChecklistItem, value: string) => {
    setSection1(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateSection4Item = (id: string, field: keyof ChecklistItem, value: string) => {
    setSection4(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateSection5Item = (id: string, field: keyof ChecklistItem, value: string) => {
    setSection5(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateHumanResource = (id: string, field: keyof HumanResource, value: string) => {
    setHumanResources(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateEquipment = (id: string, field: keyof Equipment, value: boolean | string) => {
    setEquipment(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateServiceDelivery = (id: string, field: keyof ServiceDelivery, value: string) => {
    setServiceDelivery(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateEssentialSkill = (id: string, field: keyof EssentialSkill, value: string) => {
    setEssentialSkills(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateRecordMaintenance = (id: string, field: keyof RecordMaintenance, value: boolean | string) => {
    setRecordMaintenance(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateReferralLinkage = (id: string, field: keyof ReferralLinkage, value: string) => {
    setReferralLinkages(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateIecDisplay = (id: string, field: keyof IECDisplay, value: boolean | string) => {
    setIecDisplay(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateMonitoringSupervisor = (id: string, field: keyof MonitoringSupervisor, value: string) => {
    setMonitoringSupervisors(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateKeyFinding = (id: number, field: keyof KeyFinding, value: string) => {
    setKeyFindings(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      basicInfo: {
        district,
        blockName,
        scName,
        facilityName,
        catchmentPopulation,
        totalVillages,
        distanceFromPHC,
        lastVisit,
        date,
        monitorName,
        staffAvailable,
        staffNotAvailable,
      },
      infrastructure: section1,
      humanResources,
      equipment,
      essentialDrugs: section4,
      essentialSupplies: section5,
      serviceDelivery,
      essentialSkills,
      recordMaintenance,
      referralLinkages,
      iecDisplay,
      monitoringSupervisors,
      keyFindings,
      generalComments,
      submittedAt: new Date().toISOString(),
    };

    const w = window.open();
    if (w) {
      w.document.write('<pre>' + JSON.stringify(payload, null, 2) + '</pre>');
      w.document.title = `${scName || 'SubCenter'}-monitoring-checklist`;
    }
  }

  const renderBasicInfo = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
          <input
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Block Name</label>
          <input
            type="text"
            value={blockName}
            onChange={(e) => setBlockName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub Centre Name</label>
          <input
            type="text"
            value={scName}
            onChange={(e) => setScName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Facility Name</label>
          <input
            type="text"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Catchment Population</label>
          <input
            type="text"
            value={catchmentPopulation}
            onChange={(e) => setCatchmentPopulation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Villages</label>
          <input
            type="text"
            value={totalVillages}
            onChange={(e) => setTotalVillages(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Distance from PHC (km)</label>
          <input
            type="text"
            value={distanceFromPHC}
            onChange={(e) => setDistanceFromPHC(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Visit Date</label>
          <input
            type="date"
            value={lastVisit}
            onChange={(e) => setLastVisit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Visit Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Monitor Name</label>
          <input
            type="text"
            value={monitorName}
            onChange={(e) => setMonitorName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Staff Available</label>
          <input
            type="text"
            value={staffAvailable}
            onChange={(e) => setStaffAvailable(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Staff Not Available</label>
          <input
            type="text"
            value={staffNotAvailable}
            onChange={(e) => setStaffNotAvailable(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderChecklistSection = (items: ChecklistItem[], updateFunction: any, title: string) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="mb-3">
              <label className="font-medium text-gray-900">{item.id}. {item.label}</label>
            </div>
            <div className="flex gap-6 mb-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={item.id}
                  value="yes"
                  checked={item.value === 'yes'}
                  onChange={(e) => updateFunction(item.id, 'value', e.target.value)}
                  className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={item.id}
                  value="no"
                  checked={item.value === 'no'}
                  onChange={(e) => updateFunction(item.id, 'value', e.target.value)}
                  className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
            <div>
              <textarea
                placeholder="Remarks"
                value={item.comments || ''}
                onChange={(e) => updateFunction(item.id, 'comments', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderChecklistSection(section1, updateSection1Item, 'Infrastructure');
      case 3:
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">S.No.</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Human Resource</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Numbers</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Training Received</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {humanResources.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm">{item.id}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{item.label}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.numbers}
                          onChange={(e) => updateHumanResource(item.id, 'numbers', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.training}
                          onChange={(e) => updateHumanResource(item.id, 'training', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => updateHumanResource(item.id, 'remarks', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">S.No.</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Equipment</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Available & Functional</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Available but Not Functional</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Not Available</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm">{item.id}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{item.equipment}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={item.availableFunctional}
                          onChange={(e) => updateEquipment(item.id, 'availableFunctional', e.target.checked)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={item.availableNotFunctional}
                          onChange={(e) => updateEquipment(item.id, 'availableNotFunctional', e.target.checked)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={item.notAvailable}
                          onChange={(e) => updateEquipment(item.id, 'notAvailable', e.target.checked)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => updateEquipment(item.id, 'remarks', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 5:
        return renderChecklistSection(section4, updateSection4Item, 'Essential Drugs');
      case 6:
        return renderChecklistSection(section5, updateSection5Item, 'Essential Supplies');
      case 7:
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">S.No.</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Service Delivery Indicator</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Actual</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Expected</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceDelivery.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm">{item.id}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{item.label}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.actual}
                          onChange={(e) => updateServiceDelivery(item.id, 'actual', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.expected}
                          onChange={(e) => updateServiceDelivery(item.id, 'expected', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => updateServiceDelivery(item.id, 'remarks', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">S.No.</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Essential Skill Set</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Knowledge (Y/N)</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Skill (Y/N)</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {essentialSkills.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm">{item.id}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{item.skill}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <select
                          value={item.knowledge}
                          onChange={(e) => updateEssentialSkill(item.id, 'knowledge', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Y">Yes</option>
                          <option value="N">No</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <select
                          value={item.skillLevel}
                          onChange={(e) => updateEssentialSkill(item.id, 'skillLevel', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select</option>
                          <option value="Y">Yes</option>
                          <option value="N">No</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => updateEssentialSkill(item.id, 'remarks', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">S.No.</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Record</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Available & Updated</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Available but Not Maintained</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Not Available</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {recordMaintenance.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm">{item.id}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{item.record}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={item.availableUpdated}
                          onChange={(e) => updateRecordMaintenance(item.id, 'availableUpdated', e.target.checked)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={item.availableNotMaintained}
                          onChange={(e) => updateRecordMaintenance(item.id, 'availableNotMaintained', e.target.checked)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={item.notAvailable}
                          onChange={(e) => updateRecordMaintenance(item.id, 'notAvailable', e.target.checked)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => updateRecordMaintenance(item.id, 'remarks', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">S.No.</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Mode of Transport</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Women Transported</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Sick Infants Transported</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Free/Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {referralLinkages.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm">{item.id}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{item.modeOfTransport}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.womenTransported}
                          onChange={(e) => updateReferralLinkage(item.id, 'womenTransported', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.sickInfantsTransported}
                          onChange={(e) => updateReferralLinkage(item.id, 'sickInfantsTransported', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <select
                          value={item.freePaid}
                          onChange={(e) => updateReferralLinkage(item.id, 'freePaid', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
      case 11:
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">S.No.</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Material</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">Yes</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-900">No</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {iecDisplay.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm">{item.id}</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium">{item.material}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <input
                          type="radio"
                          name={`iec-${item.id}`}
                          value="true"
                          checked={item.available === true}
                          onChange={(e) => updateIecDisplay(item.id, 'available', true)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <input
                          type="radio"
                          name={`iec-${item.id}`}
                          value="false"
                          checked={item.available === false}
                          onChange={(e) => updateIecDisplay(item.id, 'available', false)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => updateIecDisplay(item.id, 'remarks', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 12:
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">S.No.</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Name of Monitoring Supervisor</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Designation</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Signature</th>
                  </tr>
                </thead>
                <tbody>
                  {monitoringSupervisors.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm">{item.id}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateMonitoringSupervisor(item.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.designation}
                          onChange={(e) => updateMonitoringSupervisor(item.id, 'designation', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.sign}
                          onChange={(e) => updateMonitoringSupervisor(item.id, 'sign', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
      case 13:
        return (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Key Findings</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Action Taken / Proposed</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Person(s) Responsible</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-900">Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {keyFindings.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">
                        <textarea
                          value={item.keyFinding}
                          onChange={(e) => updateKeyFinding(item.id, 'keyFinding', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                          rows={2}
                          placeholder="Enter key finding..."
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <textarea
                          value={item.action}
                          onChange={(e) => updateKeyFinding(item.id, 'action', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                          rows={2}
                          placeholder="Enter action..."
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.responsible}
                          onChange={(e) => updateKeyFinding(item.id, 'responsible', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Responsible person"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <input
                          type="text"
                          value={item.timeline}
                          onChange={(e) => updateKeyFinding(item.id, 'timeline', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Timeline"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">General Comments</label>
              <textarea
                value={generalComments}
                onChange={(e) => setGeneralComments(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Enter any additional comments or observations..."
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sub Centre Monitoring Checklist</h1>
                <p className="text-gray-600 mt-2">Comprehensive assessment and monitoring tool for healthcare facilities</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Date: {date}</p>
                <p className="text-sm text-gray-500">District: {district}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex gap-8">
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentSection === section.id
                          ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <IconComponent className="mr-3 h-5 w-5" />
                      <span className="text-left">{section.title}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    {currentSection}/{sections.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentSection / sections.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Section {currentSection}: {sections.find(s => s.id === currentSection)?.title}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
                    disabled={currentSection === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentSection(Math.min(sections.length, currentSection + 1))}
                    disabled={currentSection === sections.length}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {renderCurrentSection()}

              {currentSection === sections.length && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="submit"
                    className="px-8 py-3 text-lg font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Generate Report & Export JSON
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCenterMonitoringChecklist;
