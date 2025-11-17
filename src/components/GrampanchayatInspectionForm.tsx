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

  // Tax collection progress fields (Section 9)
  const [previousYearHouseTaxArrears, setPreviousYearHouseTaxArrears] = useState('');
  const [previousYearWaterTaxArrears, setPreviousYearWaterTaxArrears] = useState('');
  const [currentYearHouseTaxDemand, setCurrentYearHouseTaxDemand] = useState('');
  const [currentYearWaterTaxDemand, setCurrentYearWaterTaxDemand] = useState('');
  const [totalHouseTaxDemand, setTotalHouseTaxDemand] = useState('');
  const [totalWaterTaxDemand, setTotalWaterTaxDemand] = useState('');
  const [totalHouseTaxCollection, setTotalHouseTaxCollection] = useState('');
  const [totalWaterTaxCollection, setTotalWaterTaxCollection] = useState('');
  const [balanceHouseTaxCollection, setBalanceHouseTaxCollection] = useState('');
  const [balanceWaterTaxCollection, setBalanceWaterTaxCollection] = useState('');
  const [houseTaxPercentage, setHouseTaxPercentage] = useState('');
  const [waterTaxPercentage, setWaterTaxPercentage] = useState('');
  const [remarks, setRemarks] = useState('');

  // 15% fund expenditure fields (Section 10)
  const [gramPanchayatTotalIncome, setGramPanchayatTotalIncome] = useState('');
  const [fifteenPercentAmount, setFifteenPercentAmount] = useState('');
  const [previousBalance, setPreviousBalance] = useState('');
  const [totalExpense, setTotalExpense] = useState('');
  const [expenseTillInspectionDate, setExpenseTillInspectionDate] = useState('');
  const [balanceExpense, setBalanceExpense] = useState('');

  // Financial transaction fields (Section 11)
  const [budgetProvision, setBudgetProvision] = useState('');
  const [tendersCalled, setTendersCalled] = useState('');
  const [entriesMade, setEntriesMade] = useState('');

  // Register balance table fields (Section 7) - First table
  const [gramNidhiRegisterBalance, setGramNidhiRegisterBalance] = useState('');
  const [gramNidhiBankBalance, setGramNidhiBankBalance] = useState('');
  const [gramNidhiPostBalance, setGramNidhiPostBalance] = useState('');
  const [gramNidhiHandBalance, setGramNidhiHandBalance] = useState('');
  const [gramNidhiCheck, setGramNidhiCheck] = useState('');

  const [waterSupplyRegisterBalance, setWaterSupplyRegisterBalance] = useState('');
  const [waterSupplyBankBalance, setWaterSupplyBankBalance] = useState('');
  const [waterSupplyPostBalance, setWaterSupplyPostBalance] = useState('');
  const [waterSupplyHandBalance, setWaterSupplyHandBalance] = useState('');
  const [waterSupplyCheck, setWaterSupplyCheck] = useState('');

  // Register balance table fields (Section 7) - Second table (17 funds)
  const [_14thFinanceRegisterBalance, set14thFinanceRegisterBalance] = useState('');
  const [_14thFinanceBankBalance, set14thFinanceBankBalance] = useState('');
  const [_14thFinancePostBalance, set14thFinancePostBalance] = useState('');
  const [_14thFinanceHandBalance, set14thFinanceHandBalance] = useState('');
  const [_14thFinanceCheck, set14thFinanceCheck] = useState('');

  const [engGhaYoRegisterBalance, setEngGhaYoRegisterBalance] = useState('');
  const [engGhaYoBankBalance, setEngGhaYoBankBalance] = useState('');
  const [engGhaYoPostBalance, setEngGhaYoPostBalance] = useState('');
  const [engGhaYoHandBalance, setEngGhaYoHandBalance] = useState('');
  const [engGhaYoCheck, setEngGhaYoCheck] = useState('');

  const [scDevelopmentRegisterBalance, setScDevelopmentRegisterBalance] = useState('');
  const [scDevelopmentBankBalance, setScDevelopmentBankBalance] = useState('');
  const [scDevelopmentPostBalance, setScDevelopmentPostBalance] = useState('');
  const [scDevelopmentHandBalance, setScDevelopmentHandBalance] = useState('');
  const [scDevelopmentCheck, setScDevelopmentCheck] = useState('');

  const [laborDeptRegisterBalance, setLaborDeptRegisterBalance] = useState('');
  const [laborDeptBankBalance, setLaborDeptBankBalance] = useState('');
  const [laborDeptPostBalance, setLaborDeptPostBalance] = useState('');
  const [laborDeptHandBalance, setLaborDeptHandBalance] = useState('');
  const [laborDeptCheck, setLaborDeptCheck] = useState('');

  const [thakkarBappaRegisterBalance, setThakkarBappaRegisterBalance] = useState('');
  const [thakkarBappaBankBalance, setThakkarBappaBankBalance] = useState('');
  const [thakkarBappaPostBalance, setThakkarBappaPostBalance] = useState('');
  const [thakkarBappaHandBalance, setThakkarBappaHandBalance] = useState('');
  const [thakkarBappaCheck, setThakkarBappaCheck] = useState('');

  const [gramKoshMoneyRegisterBalance, setGramKoshMoneyRegisterBalance] = useState('');
  const [gramKoshMoneyBankBalance, setGramKoshMoneyBankBalance] = useState('');
  const [gramKoshMoneyPostBalance, setGramKoshMoneyPostBalance] = useState('');
  const [gramKoshMoneyHandBalance, setGramKoshMoneyHandBalance] = useState('');
  const [gramKoshMoneyCheck, setGramKoshMoneyCheck] = useState('');

  const [civicFacilitiesRegisterBalance, setCivicFacilitiesRegisterBalance] = useState('');
  const [civicFacilitiesBankBalance, setCivicFacilitiesBankBalance] = useState('');
  const [civicFacilitiesPostBalance, setCivicFacilitiesPostBalance] = useState('');
  const [civicFacilitiesHandBalance, setCivicFacilitiesHandBalance] = useState('');
  const [civicFacilitiesCheck, setCivicFacilitiesCheck] = useState('');

  const [dalitBastiRegisterBalance, setDalitBastiRegisterBalance] = useState('');
  const [dalitBastiBankBalance, setDalitBastiBankBalance] = useState('');
  const [dalitBastiPostBalance, setDalitBastiPostBalance] = useState('');
  const [dalitBastiHandBalance, setDalitBastiHandBalance] = useState('');
  const [dalitBastiCheck, setDalitBastiCheck] = useState('');

  const [tantaMuktRegisterBalance, setTantaMuktRegisterBalance] = useState('');
  const [tantaMuktBankBalance, setTantaMuktBankBalance] = useState('');
  const [tantaMuktPostBalance, setTantaMuktPostBalance] = useState('');
  const [tantaMuktHandBalance, setTantaMuktHandBalance] = useState('');
  const [tantaMuktCheck, setTantaMuktCheck] = useState('');

  const [janSuvidhaRegisterBalance, setJanSuvidhaRegisterBalance] = useState('');
  const [janSuvidhaBankBalance, setJanSuvidhaBankBalance] = useState('');
  const [janSuvidhaPostBalance, setJanSuvidhaPostBalance] = useState('');
  const [janSuvidhaHandBalance, setJanSuvidhaHandBalance] = useState('');
  const [janSuvidhaCheck, setJanSuvidhaCheck] = useState('');

  const [paykaRegisterBalance, setPaykaRegisterBalance] = useState('');
  const [paykaBankBalance, setPaykaBankBalance] = useState('');
  const [paykaPostBalance, setPaykaPostBalance] = useState('');
  const [paykaHandBalance, setPaykaHandBalance] = useState('');
  const [paykaCheck, setPaykaCheck] = useState('');

  const [panchayatSamitiRegisterBalance, setPanchayatSamitiRegisterBalance] = useState('');
  const [panchayatSamitiBankBalance, setPanchayatSamitiBankBalance] = useState('');
  const [panchayatSamitiPostBalance, setPanchayatSamitiPostBalance] = useState('');
  const [panchayatSamitiHandBalance, setPanchayatSamitiHandBalance] = useState('');
  const [panchayatSamitiCheck, setPanchayatSamitiCheck] = useState('');

  const [sbmRegisterBalance, setSbmRegisterBalance] = useState('');
  const [sbmBankBalance, setSbmBankBalance] = useState('');
  const [sbmPostBalance, setSbmPostBalance] = useState('');
  const [sbmHandBalance, setSbmHandBalance] = useState('');
  const [sbmCheck, setSbmCheck] = useState('');

  const [tirthakshetraRegisterBalance, setTirthakshetraRegisterBalance] = useState('');
  const [tirthakshetraBankBalance, setTirthakshetraBankBalance] = useState('');
  const [tirthakshetraPostBalance, setTirthakshetraPostBalance] = useState('');
  const [tirthakshetraHandBalance, setTirthakshetraHandBalance] = useState('');
  const [tirthakshetraCheck, setTirthakshetraCheck] = useState('');

  const [minorityFundRegisterBalance, setMinorityFundRegisterBalance] = useState('');
  const [minorityFundBankBalance, setMinorityFundBankBalance] = useState('');
  const [minorityFundPostBalance, setMinorityFundPostBalance] = useState('');
  const [minorityFundHandBalance, setMinorityFundHandBalance] = useState('');
  const [minorityFundCheck, setMinorityFundCheck] = useState('');

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

          // Load tax collection fields
          setPreviousYearHouseTaxArrears(formData.previous_year_house_tax_arrears || '');
          setPreviousYearWaterTaxArrears(formData.previous_year_water_tax_arrears || '');
          setCurrentYearHouseTaxDemand(formData.current_year_house_tax_demand || '');
          setCurrentYearWaterTaxDemand(formData.current_year_water_tax_demand || '');
          setTotalHouseTaxDemand(formData.total_house_tax_demand || '');
          setTotalWaterTaxDemand(formData.total_water_tax_demand || '');
          setTotalHouseTaxCollection(formData.total_house_tax_collection || '');
          setTotalWaterTaxCollection(formData.total_water_tax_collection || '');
          setBalanceHouseTaxCollection(formData.balance_house_tax_collection || '');
          setBalanceWaterTaxCollection(formData.balance_water_tax_collection || '');
          setHouseTaxPercentage(formData.house_tax_percentage || '');
          setWaterTaxPercentage(formData.water_tax_percentage || '');
          setRemarks(formData.remarks || '');

          // Load 15% fund expenditure fields
          setGramPanchayatTotalIncome(formData.gram_panchayat_total_income || '');
          setFifteenPercentAmount(formData.fifteen_percent_amount || '');
          setPreviousBalance(formData.previous_balance || '');
          setTotalExpense(formData.total_expense || '');
          setExpenseTillInspectionDate(formData.expense_till_inspection_date || '');
          setBalanceExpense(formData.balance_expense || '');

          // Load financial transaction fields
          setBudgetProvision(formData.budget_provision || '');
          setTendersCalled(formData.tenders_called || '');
          setEntriesMade(formData.entries_made || '');

          // Load register balance fields - First table
          setGramNidhiRegisterBalance(formData.gram_nidhi_register_balance || '');
          setGramNidhiBankBalance(formData.gram_nidhi_bank_balance || '');
          setGramNidhiPostBalance(formData.gram_nidhi_post_balance || '');
          setGramNidhiHandBalance(formData.gram_nidhi_hand_balance || '');
          setGramNidhiCheck(formData.gram_nidhi_check || '');

          setWaterSupplyRegisterBalance(formData.water_supply_register_balance || '');
          setWaterSupplyBankBalance(formData.water_supply_bank_balance || '');
          setWaterSupplyPostBalance(formData.water_supply_post_balance || '');
          setWaterSupplyHandBalance(formData.water_supply_hand_balance || '');
          setWaterSupplyCheck(formData.water_supply_check || '');

          // Load register balance fields - Second table (17 funds)
          set14thFinanceRegisterBalance(formData._14th_finance_commission_register_balance || '');
          set14thFinanceBankBalance(formData._14th_finance_commission_bank_balance || '');
          set14thFinancePostBalance(formData._14th_finance_commission_post_balance || '');
          set14thFinanceHandBalance(formData._14th_finance_commission_hand_balance || '');
          set14thFinanceCheck(formData._14th_finance_commission_check || '');

          setEngGhaYoRegisterBalance(formData.eng_gha_yo_register_balance || '');
          setEngGhaYoBankBalance(formData.eng_gha_yo_bank_balance || '');
          setEngGhaYoPostBalance(formData.eng_gha_yo_post_balance || '');
          setEngGhaYoHandBalance(formData.eng_gha_yo_hand_balance || '');
          setEngGhaYoCheck(formData.eng_gha_yo_check || '');

          setScDevelopmentRegisterBalance(formData.sc_development_register_balance || '');
          setScDevelopmentBankBalance(formData.sc_development_bank_balance || '');
          setScDevelopmentPostBalance(formData.sc_development_post_balance || '');
          setScDevelopmentHandBalance(formData.sc_development_hand_balance || '');
          setScDevelopmentCheck(formData.sc_development_check || '');

          setLaborDeptRegisterBalance(formData.labor_department_register_balance || '');
          setLaborDeptBankBalance(formData.labor_department_bank_balance || '');
          setLaborDeptPostBalance(formData.labor_department_post_balance || '');
          setLaborDeptHandBalance(formData.labor_department_hand_balance || '');
          setLaborDeptCheck(formData.labor_department_check || '');

          setThakkarBappaRegisterBalance(formData.thakkar_bappa_register_balance || '');
          setThakkarBappaBankBalance(formData.thakkar_bappa_bank_balance || '');
          setThakkarBappaPostBalance(formData.thakkar_bappa_post_balance || '');
          setThakkarBappaHandBalance(formData.thakkar_bappa_hand_balance || '');
          setThakkarBappaCheck(formData.thakkar_bappa_check || '');

          setGramKoshMoneyRegisterBalance(formData.gram_kosh_money_register_balance || '');
          setGramKoshMoneyBankBalance(formData.gram_kosh_money_bank_balance || '');
          setGramKoshMoneyPostBalance(formData.gram_kosh_money_post_balance || '');
          setGramKoshMoneyHandBalance(formData.gram_kosh_money_hand_balance || '');
          setGramKoshMoneyCheck(formData.gram_kosh_money_check || '');

          setCivicFacilitiesRegisterBalance(formData.civic_facilities_register_balance || '');
          setCivicFacilitiesBankBalance(formData.civic_facilities_bank_balance || '');
          setCivicFacilitiesPostBalance(formData.civic_facilities_post_balance || '');
          setCivicFacilitiesHandBalance(formData.civic_facilities_hand_balance || '');
          setCivicFacilitiesCheck(formData.civic_facilities_check || '');

          setDalitBastiRegisterBalance(formData.dalit_basti_development_register_balance || '');
          setDalitBastiBankBalance(formData.dalit_basti_development_bank_balance || '');
          setDalitBastiPostBalance(formData.dalit_basti_development_post_balance || '');
          setDalitBastiHandBalance(formData.dalit_basti_development_hand_balance || '');
          setDalitBastiCheck(formData.dalit_basti_development_check || '');

          setTantaMuktRegisterBalance(formData.tanta_mukt_yojana_register_balance || '');
          setTantaMuktBankBalance(formData.tanta_mukt_yojana_bank_balance || '');
          setTantaMuktPostBalance(formData.tanta_mukt_yojana_post_balance || '');
          setTantaMuktHandBalance(formData.tanta_mukt_yojana_hand_balance || '');
          setTantaMuktCheck(formData.tanta_mukt_yojana_check || '');

          setJanSuvidhaRegisterBalance(formData.jan_suvidha_register_balance || '');
          setJanSuvidhaBankBalance(formData.jan_suvidha_bank_balance || '');
          setJanSuvidhaPostBalance(formData.jan_suvidha_post_balance || '');
          setJanSuvidhaHandBalance(formData.jan_suvidha_hand_balance || '');
          setJanSuvidhaCheck(formData.jan_suvidha_check || '');

          setPaykaRegisterBalance(formData.payka_register_balance || '');
          setPaykaBankBalance(formData.payka_bank_balance || '');
          setPaykaPostBalance(formData.payka_post_balance || '');
          setPaykaHandBalance(formData.payka_hand_balance || '');
          setPaykaCheck(formData.payka_check || '');

          setPanchayatSamitiRegisterBalance(formData.panchayat_samiti_yojana_register_balance || '');
          setPanchayatSamitiBankBalance(formData.panchayat_samiti_yojana_bank_balance || '');
          setPanchayatSamitiPostBalance(formData.panchayat_samiti_yojana_post_balance || '');
          setPanchayatSamitiHandBalance(formData.panchayat_samiti_yojana_hand_balance || '');
          setPanchayatSamitiCheck(formData.panchayat_samiti_yojana_check || '');

          setSbmRegisterBalance(formData.sbm_register_balance || '');
          setSbmBankBalance(formData.sbm_bank_balance || '');
          setSbmPostBalance(formData.sbm_post_balance || '');
          setSbmHandBalance(formData.sbm_hand_balance || '');
          setSbmCheck(formData.sbm_check || '');

          setTirthakshetraRegisterBalance(formData.tirthakshetra_development_fund_register_balance || '');
          setTirthakshetraBankBalance(formData.tirthakshetra_development_fund_bank_balance || '');
          setTirthakshetraPostBalance(formData.tirthakshetra_development_fund_post_balance || '');
          setTirthakshetraHandBalance(formData.tirthakshetra_development_fund_hand_balance || '');
          setTirthakshetraCheck(formData.tirthakshetra_development_fund_check || '');

          setMinorityFundRegisterBalance(formData.minority_development_fund_register_balance || '');
          setMinorityFundBankBalance(formData.minority_development_fund_bank_balance || '');
          setMinorityFundPostBalance(formData.minority_development_fund_post_balance || '');
          setMinorityFundHandBalance(formData.minority_development_fund_hand_balance || '');
          setMinorityFundCheck(formData.minority_development_fund_check || '');
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

    let bestPosition: GeolocationPosition | null = null;
    let watchId: number | null = null;
    let attempts = 0;
    const maxAttempts = 3;
    const accuracyThreshold = 50; // meters - prefer accuracy better than 50m

    // Function to process and save location
    const processLocation = async (position: GeolocationPosition) => {
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
    };

    // Success handler for position updates
    const handlePosition = async (position: GeolocationPosition) => {
      attempts++;
      const accuracy = position.coords.accuracy;

      // Keep track of best position (most accurate)
      if (!bestPosition || accuracy < bestPosition.coords.accuracy) {
        bestPosition = position;
      }

      // If we get good accuracy, use it immediately
      if (accuracy <= accuracyThreshold) {
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
        await processLocation(position);
        setIsGettingLocation(false);
        return;
      }

      // After max attempts, use the best position we got
      if (attempts >= maxAttempts) {
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
        if (bestPosition) {
          await processLocation(bestPosition);
        }
        setIsGettingLocation(false);
      }
    };

    // Error handler
    const handleError = (error: GeolocationPositionError) => {
      console.error('Error getting location:', error);
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }

      // If we have a best position from previous attempts, use it
      if (bestPosition) {
        processLocation(bestPosition);
      } else {
        setIsGettingLocation(false);
        alert('Error getting your location. Please enable GPS and try again.');
      }
      setIsGettingLocation(false);
    };

    // Start watching position for continuous updates
    watchId = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 30000, // 30 seconds timeout for each attempt
        maximumAge: 0 // Force fresh location, don't use cached data
      }
    );

    // Fallback: Stop watching after 45 seconds and use best position
    setTimeout(() => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        if (bestPosition && attempts > 0) {
          processLocation(bestPosition);
        } else if (!bestPosition) {
          alert('Unable to get location. Please try again or check your GPS settings.');
        }
        setIsGettingLocation(false);
      }
    }, 45000);
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
            previous_year_house_tax_arrears: previousYearHouseTaxArrears || null,
            previous_year_water_tax_arrears: previousYearWaterTaxArrears || null,
            current_year_house_tax_demand: currentYearHouseTaxDemand || null,
            current_year_water_tax_demand: currentYearWaterTaxDemand || null,
            total_house_tax_demand: totalHouseTaxDemand || null,
            total_water_tax_demand: totalWaterTaxDemand || null,
            total_house_tax_collection: totalHouseTaxCollection || null,
            total_water_tax_collection: totalWaterTaxCollection || null,
            balance_house_tax_collection: balanceHouseTaxCollection || null,
            balance_water_tax_collection: balanceWaterTaxCollection || null,
            house_tax_percentage: houseTaxPercentage || null,
            water_tax_percentage: waterTaxPercentage || null,
            remarks: remarks || '',
            gram_panchayat_total_income: gramPanchayatTotalIncome || null,
            fifteen_percent_amount: fifteenPercentAmount || null,
            previous_balance: previousBalance || null,
            total_expense: totalExpense || null,
            expense_till_inspection_date: expenseTillInspectionDate || null,
            balance_expense: balanceExpense || null,
            budget_provision: budgetProvision || '',
            tenders_called: tendersCalled || '',
            entries_made: entriesMade || '',
            gram_nidhi_register_balance: gramNidhiRegisterBalance || '',
            gram_nidhi_bank_balance: gramNidhiBankBalance || '',
            gram_nidhi_post_balance: gramNidhiPostBalance || '',
            gram_nidhi_hand_balance: gramNidhiHandBalance || '',
            gram_nidhi_check: gramNidhiCheck || '',
            water_supply_register_balance: waterSupplyRegisterBalance || '',
            water_supply_bank_balance: waterSupplyBankBalance || '',
            water_supply_post_balance: waterSupplyPostBalance || '',
            water_supply_hand_balance: waterSupplyHandBalance || '',
            water_supply_check: waterSupplyCheck || '',
            _14th_finance_commission_register_balance: _14thFinanceRegisterBalance || '',
            _14th_finance_commission_bank_balance: _14thFinanceBankBalance || '',
            _14th_finance_commission_post_balance: _14thFinancePostBalance || '',
            _14th_finance_commission_hand_balance: _14thFinanceHandBalance || '',
            _14th_finance_commission_check: _14thFinanceCheck || '',
            eng_gha_yo_register_balance: engGhaYoRegisterBalance || '',
            eng_gha_yo_bank_balance: engGhaYoBankBalance || '',
            eng_gha_yo_post_balance: engGhaYoPostBalance || '',
            eng_gha_yo_hand_balance: engGhaYoHandBalance || '',
            eng_gha_yo_check: engGhaYoCheck || '',
            sc_development_register_balance: scDevelopmentRegisterBalance || '',
            sc_development_bank_balance: scDevelopmentBankBalance || '',
            sc_development_post_balance: scDevelopmentPostBalance || '',
            sc_development_hand_balance: scDevelopmentHandBalance || '',
            sc_development_check: scDevelopmentCheck || '',
            labor_department_register_balance: laborDeptRegisterBalance || '',
            labor_department_bank_balance: laborDeptBankBalance || '',
            labor_department_post_balance: laborDeptPostBalance || '',
            labor_department_hand_balance: laborDeptHandBalance || '',
            labor_department_check: laborDeptCheck || '',
            thakkar_bappa_register_balance: thakkarBappaRegisterBalance || '',
            thakkar_bappa_bank_balance: thakkarBappaBankBalance || '',
            thakkar_bappa_post_balance: thakkarBappaPostBalance || '',
            thakkar_bappa_hand_balance: thakkarBappaHandBalance || '',
            thakkar_bappa_check: thakkarBappaCheck || '',
            gram_kosh_money_register_balance: gramKoshMoneyRegisterBalance || '',
            gram_kosh_money_bank_balance: gramKoshMoneyBankBalance || '',
            gram_kosh_money_post_balance: gramKoshMoneyPostBalance || '',
            gram_kosh_money_hand_balance: gramKoshMoneyHandBalance || '',
            gram_kosh_money_check: gramKoshMoneyCheck || '',
            civic_facilities_register_balance: civicFacilitiesRegisterBalance || '',
            civic_facilities_bank_balance: civicFacilitiesBankBalance || '',
            civic_facilities_post_balance: civicFacilitiesPostBalance || '',
            civic_facilities_hand_balance: civicFacilitiesHandBalance || '',
            civic_facilities_check: civicFacilitiesCheck || '',
            dalit_basti_development_register_balance: dalitBastiRegisterBalance || '',
            dalit_basti_development_bank_balance: dalitBastiBankBalance || '',
            dalit_basti_development_post_balance: dalitBastiPostBalance || '',
            dalit_basti_development_hand_balance: dalitBastiHandBalance || '',
            dalit_basti_development_check: dalitBastiCheck || '',
            tanta_mukt_yojana_register_balance: tantaMuktRegisterBalance || '',
            tanta_mukt_yojana_bank_balance: tantaMuktBankBalance || '',
            tanta_mukt_yojana_post_balance: tantaMuktPostBalance || '',
            tanta_mukt_yojana_hand_balance: tantaMuktHandBalance || '',
            tanta_mukt_yojana_check: tantaMuktCheck || '',
            jan_suvidha_register_balance: janSuvidhaRegisterBalance || '',
            jan_suvidha_bank_balance: janSuvidhaBankBalance || '',
            jan_suvidha_post_balance: janSuvidhaPostBalance || '',
            jan_suvidha_hand_balance: janSuvidhaHandBalance || '',
            jan_suvidha_check: janSuvidhaCheck || '',
            payka_register_balance: paykaRegisterBalance || '',
            payka_bank_balance: paykaBankBalance || '',
            payka_post_balance: paykaPostBalance || '',
            payka_hand_balance: paykaHandBalance || '',
            payka_check: paykaCheck || '',
            panchayat_samiti_yojana_register_balance: panchayatSamitiRegisterBalance || '',
            panchayat_samiti_yojana_bank_balance: panchayatSamitiBankBalance || '',
            panchayat_samiti_yojana_post_balance: panchayatSamitiPostBalance || '',
            panchayat_samiti_yojana_hand_balance: panchayatSamitiHandBalance || '',
            panchayat_samiti_yojana_check: panchayatSamitiCheck || '',
            sbm_register_balance: sbmRegisterBalance || '',
            sbm_bank_balance: sbmBankBalance || '',
            sbm_post_balance: sbmPostBalance || '',
            sbm_hand_balance: sbmHandBalance || '',
            sbm_check: sbmCheck || '',
            tirthakshetra_development_fund_register_balance: tirthakshetraRegisterBalance || '',
            tirthakshetra_development_fund_bank_balance: tirthakshetraBankBalance || '',
            tirthakshetra_development_fund_post_balance: tirthakshetraPostBalance || '',
            tirthakshetra_development_fund_hand_balance: tirthakshetraHandBalance || '',
            tirthakshetra_development_fund_check: tirthakshetraCheck || '',
            minority_development_fund_register_balance: minorityFundRegisterBalance || '',
            minority_development_fund_bank_balance: minorityFundBankBalance || '',
            minority_development_fund_post_balance: minorityFundPostBalance || '',
            minority_development_fund_hand_balance: minorityFundHandBalance || '',
            minority_development_fund_check: minorityFundCheck || '',
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

        // Insert into grampanchayat_inspection_form table - only save fields that are collected in the form
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
            previous_year_house_tax_arrears: previousYearHouseTaxArrears || null,
            previous_year_water_tax_arrears: previousYearWaterTaxArrears || null,
            current_year_house_tax_demand: currentYearHouseTaxDemand || null,
            current_year_water_tax_demand: currentYearWaterTaxDemand || null,
            total_house_tax_demand: totalHouseTaxDemand || null,
            total_water_tax_demand: totalWaterTaxDemand || null,
            total_house_tax_collection: totalHouseTaxCollection || null,
            total_water_tax_collection: totalWaterTaxCollection || null,
            balance_house_tax_collection: balanceHouseTaxCollection || null,
            balance_water_tax_collection: balanceWaterTaxCollection || null,
            house_tax_percentage: houseTaxPercentage || null,
            water_tax_percentage: waterTaxPercentage || null,
            remarks: remarks || '',
            gram_panchayat_total_income: gramPanchayatTotalIncome || null,
            fifteen_percent_amount: fifteenPercentAmount || null,
            previous_balance: previousBalance || null,
            total_expense: totalExpense || null,
            expense_till_inspection_date: expenseTillInspectionDate || null,
            balance_expense: balanceExpense || null,
            budget_provision: budgetProvision || '',
            tenders_called: tendersCalled || '',
            entries_made: entriesMade || '',
            gram_nidhi_register_balance: gramNidhiRegisterBalance || '',
            gram_nidhi_bank_balance: gramNidhiBankBalance || '',
            gram_nidhi_post_balance: gramNidhiPostBalance || '',
            gram_nidhi_hand_balance: gramNidhiHandBalance || '',
            gram_nidhi_check: gramNidhiCheck || '',
            water_supply_register_balance: waterSupplyRegisterBalance || '',
            water_supply_bank_balance: waterSupplyBankBalance || '',
            water_supply_post_balance: waterSupplyPostBalance || '',
            water_supply_hand_balance: waterSupplyHandBalance || '',
            water_supply_check: waterSupplyCheck || '',
            _14th_finance_commission_register_balance: _14thFinanceRegisterBalance || '',
            _14th_finance_commission_bank_balance: _14thFinanceBankBalance || '',
            _14th_finance_commission_post_balance: _14thFinancePostBalance || '',
            _14th_finance_commission_hand_balance: _14thFinanceHandBalance || '',
            _14th_finance_commission_check: _14thFinanceCheck || '',
            eng_gha_yo_register_balance: engGhaYoRegisterBalance || '',
            eng_gha_yo_bank_balance: engGhaYoBankBalance || '',
            eng_gha_yo_post_balance: engGhaYoPostBalance || '',
            eng_gha_yo_hand_balance: engGhaYoHandBalance || '',
            eng_gha_yo_check: engGhaYoCheck || '',
            sc_development_register_balance: scDevelopmentRegisterBalance || '',
            sc_development_bank_balance: scDevelopmentBankBalance || '',
            sc_development_post_balance: scDevelopmentPostBalance || '',
            sc_development_hand_balance: scDevelopmentHandBalance || '',
            sc_development_check: scDevelopmentCheck || '',
            labor_department_register_balance: laborDeptRegisterBalance || '',
            labor_department_bank_balance: laborDeptBankBalance || '',
            labor_department_post_balance: laborDeptPostBalance || '',
            labor_department_hand_balance: laborDeptHandBalance || '',
            labor_department_check: laborDeptCheck || '',
            thakkar_bappa_register_balance: thakkarBappaRegisterBalance || '',
            thakkar_bappa_bank_balance: thakkarBappaBankBalance || '',
            thakkar_bappa_post_balance: thakkarBappaPostBalance || '',
            thakkar_bappa_hand_balance: thakkarBappaHandBalance || '',
            thakkar_bappa_check: thakkarBappaCheck || '',
            gram_kosh_money_register_balance: gramKoshMoneyRegisterBalance || '',
            gram_kosh_money_bank_balance: gramKoshMoneyBankBalance || '',
            gram_kosh_money_post_balance: gramKoshMoneyPostBalance || '',
            gram_kosh_money_hand_balance: gramKoshMoneyHandBalance || '',
            gram_kosh_money_check: gramKoshMoneyCheck || '',
            civic_facilities_register_balance: civicFacilitiesRegisterBalance || '',
            civic_facilities_bank_balance: civicFacilitiesBankBalance || '',
            civic_facilities_post_balance: civicFacilitiesPostBalance || '',
            civic_facilities_hand_balance: civicFacilitiesHandBalance || '',
            civic_facilities_check: civicFacilitiesCheck || '',
            dalit_basti_development_register_balance: dalitBastiRegisterBalance || '',
            dalit_basti_development_bank_balance: dalitBastiBankBalance || '',
            dalit_basti_development_post_balance: dalitBastiPostBalance || '',
            dalit_basti_development_hand_balance: dalitBastiHandBalance || '',
            dalit_basti_development_check: dalitBastiCheck || '',
            tanta_mukt_yojana_register_balance: tantaMuktRegisterBalance || '',
            tanta_mukt_yojana_bank_balance: tantaMuktBankBalance || '',
            tanta_mukt_yojana_post_balance: tantaMuktPostBalance || '',
            tanta_mukt_yojana_hand_balance: tantaMuktHandBalance || '',
            tanta_mukt_yojana_check: tantaMuktCheck || '',
            jan_suvidha_register_balance: janSuvidhaRegisterBalance || '',
            jan_suvidha_bank_balance: janSuvidhaBankBalance || '',
            jan_suvidha_post_balance: janSuvidhaPostBalance || '',
            jan_suvidha_hand_balance: janSuvidhaHandBalance || '',
            jan_suvidha_check: janSuvidhaCheck || '',
            payka_register_balance: paykaRegisterBalance || '',
            payka_bank_balance: paykaBankBalance || '',
            payka_post_balance: paykaPostBalance || '',
            payka_hand_balance: paykaHandBalance || '',
            payka_check: paykaCheck || '',
            panchayat_samiti_yojana_register_balance: panchayatSamitiRegisterBalance || '',
            panchayat_samiti_yojana_bank_balance: panchayatSamitiBankBalance || '',
            panchayat_samiti_yojana_post_balance: panchayatSamitiPostBalance || '',
            panchayat_samiti_yojana_hand_balance: panchayatSamitiHandBalance || '',
            panchayat_samiti_yojana_check: panchayatSamitiCheck || '',
            sbm_register_balance: sbmRegisterBalance || '',
            sbm_bank_balance: sbmBankBalance || '',
            sbm_post_balance: sbmPostBalance || '',
            sbm_hand_balance: sbmHandBalance || '',
            sbm_check: sbmCheck || '',
            tirthakshetra_development_fund_register_balance: tirthakshetraRegisterBalance || '',
            tirthakshetra_development_fund_bank_balance: tirthakshetraBankBalance || '',
            tirthakshetra_development_fund_post_balance: tirthakshetraPostBalance || '',
            tirthakshetra_development_fund_hand_balance: tirthakshetraHandBalance || '',
            tirthakshetra_development_fund_check: tirthakshetraCheck || '',
            minority_development_fund_register_balance: minorityFundRegisterBalance || '',
            minority_development_fund_bank_balance: minorityFundBankBalance || '',
            minority_development_fund_post_balance: minorityFundPostBalance || '',
            minority_development_fund_hand_balance: minorityFundHandBalance || '',
            minority_development_fund_check: minorityFundCheck || ''
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
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-green-800 font-medium">{t('fims.locationCaptured')}</p>
                    {inspectionData.location_accuracy && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        inspectionData.location_accuracy <= 20
                          ? 'bg-green-600 text-white'
                          : inspectionData.location_accuracy <= 50
                          ? 'bg-yellow-500 text-white'
                          : 'bg-orange-500 text-white'
                      }`}>
                        {inspectionData.location_accuracy <= 20 ? 'Excellent' : inspectionData.location_accuracy <= 50 ? 'Good' : 'Fair'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-green-600">
                    {t('fims.latitude')}: {inspectionData.latitude.toFixed(6)}<br />
                    {t('fims.longitude')}: {inspectionData.longitude?.toFixed(6)}
                  </p>
                  {inspectionData.location_accuracy && (
                    <div className="mt-2 pt-2 border-t border-green-200">
                      <p className="text-xs text-green-700 font-medium">
                        {t('fims.accuracy')}: <span className="font-bold">{Math.round(inspectionData.location_accuracy)}m</span>
                        <span className="text-green-600 ml-1">
                          ({inspectionData.location_accuracy <= 20 ? '±20m - उत्कृष्ट' : inspectionData.location_accuracy <= 50 ? '±50m - चांगले' : '>50m - सामान्य'})
                        </span>
                      </p>
                    </div>
                  )}
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
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramNidhiRegisterBalance} onChange={(e) => setGramNidhiRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramNidhiBankBalance} onChange={(e) => setGramNidhiBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramNidhiPostBalance} onChange={(e) => setGramNidhiPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramNidhiHandBalance} onChange={(e) => setGramNidhiHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramNidhiCheck} onChange={(e) => setGramNidhiCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">2</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">पाणी पुरवठा</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={waterSupplyRegisterBalance} onChange={(e) => setWaterSupplyRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={waterSupplyBankBalance} onChange={(e) => setWaterSupplyBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={waterSupplyPostBalance} onChange={(e) => setWaterSupplyPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={waterSupplyHandBalance} onChange={(e) => setWaterSupplyHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={waterSupplyCheck} onChange={(e) => setWaterSupplyCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" /></td>
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
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 text-center border border-gray-300">1</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">ग्रामनिधी</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramNidhiRegisterBalance} onChange={(e) => setGramNidhiRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramNidhiBankBalance} onChange={(e) => setGramNidhiBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramNidhiPostBalance} onChange={(e) => setGramNidhiPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramNidhiHandBalance} onChange={(e) => setGramNidhiHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramNidhiCheck} onChange={(e) => setGramNidhiCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">2</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">पाणी पुरवठा</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={waterSupplyRegisterBalance} onChange={(e) => setWaterSupplyRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={waterSupplyBankBalance} onChange={(e) => setWaterSupplyBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={waterSupplyPostBalance} onChange={(e) => setWaterSupplyPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={waterSupplyHandBalance} onChange={(e) => setWaterSupplyHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={waterSupplyCheck} onChange={(e) => setWaterSupplyCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 text-center border border-gray-300">3</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">14 वा वित्त आयोग</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={_14thFinanceRegisterBalance} onChange={(e) => set14thFinanceRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={_14thFinanceBankBalance} onChange={(e) => set14thFinanceBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={_14thFinancePostBalance} onChange={(e) => set14thFinancePostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={_14thFinanceHandBalance} onChange={(e) => set14thFinanceHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={_14thFinanceCheck} onChange={(e) => set14thFinanceCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">4</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">इं.गा.यो.</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={engGhaYoRegisterBalance} onChange={(e) => setEngGhaYoRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={engGhaYoBankBalance} onChange={(e) => setEngGhaYoBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={engGhaYoPostBalance} onChange={(e) => setEngGhaYoPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={engGhaYoHandBalance} onChange={(e) => setEngGhaYoHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={engGhaYoCheck} onChange={(e) => setEngGhaYoCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 text-center border border-gray-300">5</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">अ.जा.विकास</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={scDevelopmentRegisterBalance} onChange={(e) => setScDevelopmentRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={scDevelopmentBankBalance} onChange={(e) => setScDevelopmentBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={scDevelopmentPostBalance} onChange={(e) => setScDevelopmentPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={scDevelopmentHandBalance} onChange={(e) => setScDevelopmentHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={scDevelopmentCheck} onChange={(e) => setScDevelopmentCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">6</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">मजगारोहयो</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={laborDeptRegisterBalance} onChange={(e) => setLaborDeptRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={laborDeptBankBalance} onChange={(e) => setLaborDeptBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={laborDeptPostBalance} onChange={(e) => setLaborDeptPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={laborDeptHandBalance} onChange={(e) => setLaborDeptHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={laborDeptCheck} onChange={(e) => setLaborDeptCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 text-center border border-gray-300">7</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">ठक्कर बाप्पा</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={thakkarBappaRegisterBalance} onChange={(e) => setThakkarBappaRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={thakkarBappaBankBalance} onChange={(e) => setThakkarBappaBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={thakkarBappaPostBalance} onChange={(e) => setThakkarBappaPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={thakkarBappaHandBalance} onChange={(e) => setThakkarBappaHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={thakkarBappaCheck} onChange={(e) => setThakkarBappaCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">8</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">ग्रामकोष पैसा</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramKoshMoneyRegisterBalance} onChange={(e) => setGramKoshMoneyRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramKoshMoneyBankBalance} onChange={(e) => setGramKoshMoneyBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramKoshMoneyPostBalance} onChange={(e) => setGramKoshMoneyPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramKoshMoneyHandBalance} onChange={(e) => setGramKoshMoneyHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={gramKoshMoneyCheck} onChange={(e) => setGramKoshMoneyCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 text-center border border-gray-300">9</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">नागरी सुविधा</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={civicFacilitiesRegisterBalance} onChange={(e) => setCivicFacilitiesRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={civicFacilitiesBankBalance} onChange={(e) => setCivicFacilitiesBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={civicFacilitiesPostBalance} onChange={(e) => setCivicFacilitiesPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={civicFacilitiesHandBalance} onChange={(e) => setCivicFacilitiesHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={civicFacilitiesCheck} onChange={(e) => setCivicFacilitiesCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">10</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">दलित वस्ती विकास</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={dalitBastiRegisterBalance} onChange={(e) => setDalitBastiRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={dalitBastiBankBalance} onChange={(e) => setDalitBastiBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={dalitBastiPostBalance} onChange={(e) => setDalitBastiPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={dalitBastiHandBalance} onChange={(e) => setDalitBastiHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={dalitBastiCheck} onChange={(e) => setDalitBastiCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 text-center border border-gray-300">11</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">तंटा मुक्त योजना</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={tantaMuktRegisterBalance} onChange={(e) => setTantaMuktRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={tantaMuktBankBalance} onChange={(e) => setTantaMuktBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={tantaMuktPostBalance} onChange={(e) => setTantaMuktPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={tantaMuktHandBalance} onChange={(e) => setTantaMuktHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={tantaMuktCheck} onChange={(e) => setTantaMuktCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">12</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">जनसुविधा</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={janSuvidhaRegisterBalance} onChange={(e) => setJanSuvidhaRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={janSuvidhaBankBalance} onChange={(e) => setJanSuvidhaBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={janSuvidhaPostBalance} onChange={(e) => setJanSuvidhaPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={janSuvidhaHandBalance} onChange={(e) => setJanSuvidhaHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={janSuvidhaCheck} onChange={(e) => setJanSuvidhaCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 text-center border border-gray-300">13</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">पायका</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={paykaRegisterBalance} onChange={(e) => setPaykaRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={paykaBankBalance} onChange={(e) => setPaykaBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={paykaPostBalance} onChange={(e) => setPaykaPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={paykaHandBalance} onChange={(e) => setPaykaHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={paykaCheck} onChange={(e) => setPaykaCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">14</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">प.सं.योजना</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={panchayatSamitiRegisterBalance} onChange={(e) => setPanchayatSamitiRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={panchayatSamitiBankBalance} onChange={(e) => setPanchayatSamitiBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={panchayatSamitiPostBalance} onChange={(e) => setPanchayatSamitiPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={panchayatSamitiHandBalance} onChange={(e) => setPanchayatSamitiHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={panchayatSamitiCheck} onChange={(e) => setPanchayatSamitiCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 text-center border border-gray-300">15</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">SBM</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={sbmRegisterBalance} onChange={(e) => setSbmRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={sbmBankBalance} onChange={(e) => setSbmBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={sbmPostBalance} onChange={(e) => setSbmPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={sbmHandBalance} onChange={(e) => setSbmHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={sbmCheck} onChange={(e) => setSbmCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 text-center border border-gray-300">16</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">तीर्थक्षेत्र विकास निधी</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={tirthakshetraRegisterBalance} onChange={(e) => setTirthakshetraRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={tirthakshetraBankBalance} onChange={(e) => setTirthakshetraBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={tirthakshetraPostBalance} onChange={(e) => setTirthakshetraPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={tirthakshetraHandBalance} onChange={(e) => setTirthakshetraHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={tirthakshetraCheck} onChange={(e) => setTirthakshetraCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
                  <tr className="bg-gray-50 hover:bg-gray-100">
                    <td className="px-4 py-3 text-center border border-gray-300">17</td>
                    <td className="px-4 py-3 border border-gray-300 font-medium">अल्पसंख्यांक विकास निधी</td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={minorityFundRegisterBalance} onChange={(e) => setMinorityFundRegisterBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={minorityFundBankBalance} onChange={(e) => setMinorityFundBankBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={minorityFundPostBalance} onChange={(e) => setMinorityFundPostBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={minorityFundHandBalance} onChange={(e) => setMinorityFundHandBalance(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 border border-gray-300"><input type="text" value={minorityFundCheck} onChange={(e) => setMinorityFundCheck(e.target.value)} disabled={isViewMode} className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none" /></td>
                  </tr>
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
                  गृहकर- <input type="number" value={previousYearHouseTaxArrears} onChange={(e) => setPreviousYearHouseTaxArrears(e.target.value)} disabled={isViewMode} className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                  पाणीकर- <input type="number" value={previousYearWaterTaxArrears} onChange={(e) => setPreviousYearWaterTaxArrears(e.target.value)} disabled={isViewMode} className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(2) चालू वर्षात मागणी :- </label>
                  गृहकर- <input type="number" value={currentYearHouseTaxDemand} onChange={(e) => setCurrentYearHouseTaxDemand(e.target.value)} disabled={isViewMode} className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                  पाणीकर- <input type="number" value={currentYearWaterTaxDemand} onChange={(e) => setCurrentYearWaterTaxDemand(e.target.value)} disabled={isViewMode} className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(3) एकुण मागणी :- </label>
                  गृहकर- <input type="number" value={totalHouseTaxDemand} onChange={(e) => setTotalHouseTaxDemand(e.target.value)} disabled={isViewMode} className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                  पाणीकर- <input type="number" value={totalWaterTaxDemand} onChange={(e) => setTotalWaterTaxDemand(e.target.value)} disabled={isViewMode} className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(4) एकुण वसूली :- </label>
                  गृहकर- <input type="number" value={totalHouseTaxCollection} onChange={(e) => setTotalHouseTaxCollection(e.target.value)} disabled={isViewMode} className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                  पाणीकर- <input type="number" value={totalWaterTaxCollection} onChange={(e) => setTotalWaterTaxCollection(e.target.value)} disabled={isViewMode} className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(5) शिल्लक वसूली :- </label>
                  गृहकर- <input type="number" value={balanceHouseTaxCollection} onChange={(e) => setBalanceHouseTaxCollection(e.target.value)} disabled={isViewMode} className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                  पाणीकर- <input type="number" value={balanceWaterTaxCollection} onChange={(e) => setBalanceWaterTaxCollection(e.target.value)} disabled={isViewMode} className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(6) टक्केवारी :- </label>
                  गृहकर- <input type="number" value={houseTaxPercentage} onChange={(e) => setHouseTaxPercentage(e.target.value)} disabled={isViewMode} className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                  पाणीकर- <input type="number" value={waterTaxPercentage} onChange={(e) => setWaterTaxPercentage(e.target.value)} disabled={isViewMode} className="mx-2 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-32" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(7) शेरा :- </label>
                  <input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} disabled={isViewMode} className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-96" />
                </li>
              </ul>
            </div>

            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">(10) मागास वर्गीयाकरीता राखून ठेवलेल्या 15% निधीच्या खर्चाचा तपशील:-</h3>
              <ul style={{ marginLeft: '20px', lineHeight: '2.5' }}>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(1) ग्राम पंचायतीचे एकुण उत्पन्न :- </label>
                  <input type="number" value={gramPanchayatTotalIncome} onChange={(e) => setGramPanchayatTotalIncome(e.target.value)} disabled={isViewMode} className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(2) 15% रक्कम :- </label>
                  <input type="number" value={fifteenPercentAmount} onChange={(e) => setFifteenPercentAmount(e.target.value)} disabled={isViewMode} className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(3) मागील अनुशेष </label>
                  <input type="number" value={previousBalance} onChange={(e) => setPreviousBalance(e.target.value)} disabled={isViewMode} className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(4) करावयाचा एकुण खर्च </label>
                  <input type="number" value={totalExpense} onChange={(e) => setTotalExpense(e.target.value)} disabled={isViewMode} className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(5) तपासणीत्या दिनांक पर्यंत झालेला खर्च: </label>
                  <input type="number" value={expenseTillInspectionDate} onChange={(e) => setExpenseTillInspectionDate(e.target.value)} disabled={isViewMode} className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
                </li>
                <li className="mb-3">
                  <label className="font-semibold text-gray-700">(6) शिल्लक खर्च </label>
                  <input type="number" value={balanceExpense} onChange={(e) => setBalanceExpense(e.target.value)} disabled={isViewMode} className="ml-3 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
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
                    <input type="radio" name="budgetProvision" value="होय" checked={budgetProvision === 'होय'} onChange={(e) => setBudgetProvision(e.target.value)} disabled={isViewMode} className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                    <span className="ml-2 text-gray-800 font-medium">होय</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="radio" name="budgetProvision" value="नाही" checked={budgetProvision === 'नाही'} onChange={(e) => setBudgetProvision(e.target.value)} disabled={isViewMode} className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
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
                    <input type="radio" name="tendersCalled" value="होय" checked={tendersCalled === 'होय'} onChange={(e) => setTendersCalled(e.target.value)} disabled={isViewMode} className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                    <span className="ml-2 text-gray-800 font-medium">होय</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="radio" name="tendersCalled" value="नाही" checked={tendersCalled === 'नाही'} onChange={(e) => setTendersCalled(e.target.value)} disabled={isViewMode} className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                    <span className="ml-2 text-gray-800 font-medium">नाही</span>
                  </label>
                </span>
              </p>
              <p className="mb-4 text-gray-700">(घ) खरेदी केलेल्या साहित्याचा नमुना 9,15 व 16 मधील नोंदवहीत नोंदी घेण्यात आल्या आहेत काय ?</p>
              <div className="ml-6 space-x-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="radio" name="entriesMade" value="होय" checked={entriesMade === 'होय'} onChange={(e) => setEntriesMade(e.target.value)} disabled={isViewMode} className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
                  <span className="ml-2 text-gray-800 font-medium">होय</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="radio" name="entriesMade" value="नाही" checked={entriesMade === 'नाही'} onChange={(e) => setEntriesMade(e.target.value)} disabled={isViewMode} className="w-5 h-5 text-orange-600 focus:ring-orange-500" />
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