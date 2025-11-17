import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Camera,
  MapPin,
  Save,
  Send,
  FileText
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface HealthInspectionFormProps {
  user: SupabaseUser;
  onBack: () => void;
  categories: any[];
  onInspectionCreated: () => void;
  editingInspection?: any;
}

interface ProgramData {
  program: string;
  target: string;
  achieved: string;
  percentage: string;
}

export const HealthInspectionForm: React.FC<HealthInspectionFormProps> = ({
  user,
  onBack,
  categories,
  onInspectionCreated,
  editingInspection
}) => {
  const { t } = useTranslation();

  const isViewMode = editingInspection?.mode === 'view';
  const isEditMode = editingInspection?.mode === 'edit';

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [programsData, setProgramsData] = useState<ProgramData[]>([
    { program: 'राष्ट्रीय कुटुंब कल्याण कार्यक्रम', target: '', achieved: '', percentage: '' },
    { program: 'पुरुष नसबंदी शस्त्रक्रिया', target: '', achieved: '', percentage: '' },
    { program: 'स्त्री नसबंदी शस्त्रक्रिया', target: '', achieved: '', percentage: '' },
    { program: 'एकुण शस्त्रक्रिया', target: '', achieved: '', percentage: '' },
    { program: 'IUCD', target: '', achieved: '', percentage: '' },
    { program: 'PPIUCD', target: '', achieved: '', percentage: '' },
    { program: '2) राष्ट्रीय माताबाल संगोपन कार्यक्रम', target: '', achieved: '', percentage: '' },
    { program: 'एकुण गरोदर माता नोंदणी', target: '', achieved: '', percentage: '' },
    { program: '१२ आठवडयाच्या आत नोंदणी', target: '', achieved: '', percentage: '' },
    { program: 'गरोदर माता १८० लोहगोळया', target: '', achieved: '', percentage: '' },
    { program: 'गरोदर माता ३६० कॅल्शियम गोळया', target: '', achieved: '', percentage: '' },
    { program: 'गरोदर माता ४ वेळा तपासणी', target: '', achieved: '', percentage: '' },
    { program: 'एकुण अतिजोखमीच्या माता नोंद', target: '', achieved: '', percentage: '' },
    { program: 'गर्भपात', target: '', achieved: '', percentage: '' },
    { program: 'वैद्यकिय गर्भपात', target: '', achieved: '', percentage: '' },
    { program: 'एकुण प्रसूती', target: '', achieved: '', percentage: '' },
    { program: 'संस्थात्मक प्रसूती', target: '', achieved: '', percentage: '' },
    { program: 'घरी झालेली प्रसूती', target: '', achieved: '', percentage: '' },
    { program: 'एकुण जिवंत जन्म', target: '', achieved: '', percentage: '' },
    { program: '२.५ किलोग्रामपेक्षा कमी वजनाचे बालक', target: '', achieved: '', percentage: '' },
    { program: '3) आर आय', target: '', achieved: '', percentage: '' },
    { program: 'लसीकरण विभाग', target: '', achieved: '', percentage: '' },
    { program: 'बिसीजी', target: '', achieved: '', percentage: '' },
    { program: 'विटॅमीन के', target: '', achieved: '', percentage: '' },
    { program: 'पेंन्टॅवॅलंट १', target: '', achieved: '', percentage: '' },
    { program: 'ओपीव्ही १', target: '', achieved: '', percentage: '' },
    { program: 'पेंन्टॅवॅलंट ३', target: '', achieved: '', percentage: '' },
    { program: 'ओपीव्ही ३', target: '', achieved: '', percentage: '' },
    { program: 'आयपीव्ही १', target: '', achieved: '', percentage: '' },
    { program: 'आयपीव्ही २', target: '', achieved: '', percentage: '' },
    { program: 'रोटाव्हायरस ३', target: '', achieved: '', percentage: '' },
    { program: 'पिसीव्ही १', target: '', achieved: '', percentage: '' },
    { program: 'पिसीव्ही २', target: '', achieved: '', percentage: '' },
    { program: 'संपुर्ण लसीकरण (एम आर १)', target: '', achieved: '', percentage: '' },
    { program: 'एम आर २', target: '', achieved: '', percentage: '' },
    { program: 'डिपीटी बुस्टर', target: '', achieved: '', percentage: '' },
    { program: 'पोलिओ बुस्टर', target: '', achieved: '', percentage: '' },
    { program: 'टीडी १० वर्ष', target: '', achieved: '', percentage: '' },
    { program: 'टीडी १६ वर्ष', target: '', achieved: '', percentage: '' },
    { program: 'वि.पी.डी', target: '', achieved: '', percentage: '' },
    { program: 'ए.ई.एफ.आय', target: '', achieved: '', percentage: '' },
    { program: 'एएनसी टीडी', target: '', achieved: '', percentage: '' },
    { program: 'एकुण आरोग्य सेवा सत्रांची संख्या', target: '', achieved: '', percentage: '' },
    { program: 'एकुण आयोजित सत्रे', target: '', achieved: '', percentage: '' },
    { program: 'एकुण सॅम बालके', target: '', achieved: '', percentage: '' },
    { program: 'एकुण मॅम बालके', target: '', achieved: '', percentage: '' },
    { program: '4) चाईल्ड हेल्थ', target: '', achieved: '', percentage: '' },
    { program: '० ते १ वर्षातील बालमृत्यू', target: '', achieved: '', percentage: '' },
    { program: '१ ते ५ वर्षातील बालमृत्यू', target: '', achieved: '', percentage: '' },
    { program: 'व्हिसीबल बर्थ डिफेक्ट', target: '', achieved: '', percentage: '' },
    { program: '5) मॅटर्नल हेल्थ', target: '', achieved: '', percentage: '' },
    { program: 'मॅटर्नल डेथ', target: '', achieved: '', percentage: '' },
    { program: 'प्रसुती कक्ष', target: '', achieved: '', percentage: '' },
    { program: 'ए.एम.बी कार्यक्रम', target: '', achieved: '', percentage: '' },
    { program: 'भरती प्रक्रिया/डिस्चार्ज कार्ड', target: '', achieved: '', percentage: '' },
    { program: 'JSSK कार्यक्रम', target: '', achieved: '', percentage: '' },
    { program: 'JSY कार्यक्रम', target: '', achieved: '', percentage: '' },
    { program: '6) RISE APP', target: '', achieved: '', percentage: '' },
    { program: '7) RCH Portal', target: '', achieved: '', percentage: '' },
    { program: '8) सुधारित राष्ट्रीय क्षयरोग नियंत्रण कार्यक्रम', target: '', achieved: '', percentage: '' },
    { program: 'एकुण संशयित क्षयरोग नोंदणी', target: '', achieved: '', percentage: '' },
    { program: 'संशयित क्षयरुग्णाची थुकी नमूना तपासणी', target: '', achieved: '', percentage: '' },
    { program: 'एक्स रे तपासणी', target: '', achieved: '', percentage: '' },
    { program: 'एकुण आढळलेले क्षयरुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'निक्क्षय पोर्टलवर क्षयरुग्णांची नोंदणी', target: '', achieved: '', percentage: '' },
    { program: 'लाभार्थ्याला DBT लाभ देण्यात आला आहे काय', target: '', achieved: '', percentage: '' },
    { program: 'उपचार सुरु केलेले क्षयरुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'एकुण मृत्यू झालेले क्षयरुग्ण', target: '', achieved: '', percentage: '' },
    { program: '9) राष्ट्रीय कुष्ठरोग दूरिकरण कार्यक्रम', target: '', achieved: '', percentage: '' },
    { program: 'संशयित कुष्ठरुग्ण नोंदणी', target: '', achieved: '', percentage: '' },
    { program: 'एकुण क्रियाशिल रुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'पीबी', target: '', achieved: '', percentage: '' },
    { program: 'एमबी', target: '', achieved: '', percentage: '' },
    { program: 'उपचार सुरु केलेले कुष्ठरुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'आरएफटी झालेले कुष्ठरुग्ण', target: '', achieved: '', percentage: '' },
    { program: '10) राष्ट्रीय किटकजन्य आजार नियंत्रण कार्यक्रम', target: '', achieved: '', percentage: '' },
    { program: 'बाहयरुग्ण विभागात एकुण नवीन नोंदणी झालेल रुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'एकुण रक्त नमूना गोळा केलेले रुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'हिवताप आढळलेले रुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'पीव्हि', target: '', achieved: '', percentage: '' },
    { program: 'पीएफ', target: '', achieved: '', percentage: '' },
    { program: 'एकुण उपचार केलेले रुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'एकुण मृत्यू झालेले हिवताप रुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'प्रा.आ.केंद्रामार्फत अंडवृध्दि शिबीराचे आयोजन', target: '', achieved: '', percentage: '' },
    { program: 'हत्तीरोग क्लिनिक व पायधूनी कार्यक्रम', target: '', achieved: '', percentage: '' },
    { program: 'पायधूनी किट वाटप', target: '', achieved: '', percentage: '' },
    { program: 'एकुण संशयित रुग्णाची डेंग्यू नमूना तपासणी', target: '', achieved: '', percentage: '' },
    { program: 'एकुण डेंग्यूचे रुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'एकुण डेंग्यू रुग्णाचा मृत्यू', target: '', achieved: '', percentage: '' },
    { program: '11) एकात्मिक साथरोग सर्व्हेक्षण कार्यक्रम', target: '', achieved: '', percentage: '' },
    { program: 'एकुण उपकेंद्राची संख्या', target: '', achieved: '', percentage: '' },
    { program: 'एकुण भरलेले एस फार्म', target: '', achieved: '', percentage: '' },
    { program: 'एकुण भरलेले पी फार्म', target: '', achieved: '', percentage: '' },
    { program: 'एकुण भरलेले एल फार्म', target: '', achieved: '', percentage: '' },
    { program: 'एकुण पाणी नमूने तपासणी', target: '', achieved: '', percentage: '' },
    { program: 'दूषीत आढळलेले पाणी नमूने', target: '', achieved: '', percentage: '' },
    { program: 'एकुण ब्लिचिंग पावडर नमूने तपासणी', target: '', achieved: '', percentage: '' },
    { program: 'दूषीत आढळलेले ब्लिचिंग पावडर नमूने', target: '', achieved: '', percentage: '' },
    { program: 'हिरवे कार्ड देण्यात आलेल्या ग्रामपचांयतीची संख्या', target: '', achieved: '', percentage: '' },
    { program: 'पिवळे कार्ड देण्यात आलेल्या ग्रामपचांयतीची संख्या', target: '', achieved: '', percentage: '' },
    { program: 'लाल कार्ड देण्यात आलेल्या ग्रामपचांयतीची संख्या', target: '', achieved: '', percentage: '' },
    { program: '12) राष्ट्रीय असांसर्गिक रोग नियंत्रण कार्यक्रम', target: '', achieved: '', percentage: '' },
    { program: 'एकुण आढळलेले रक्तदाबाचे रुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'एकुण आढळलेले मधुमेह रुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'एकुण आढळलेले रुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'एकुण तोंडाच्या कर्करोगाचे रुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'एकुण स्तनाच्या कर्करोगाचे रुग्ण', target: '', achieved: '', percentage: '' },
    { program: 'एकुण गर्भाशयाच्या कर्करोगाचे रुग्ण', target: '', achieved: '', percentage: '' }
  ]);

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

  const healthCategory = categories.find(cat =>
    cat.form_type === 'Health Inspection' ||
    cat.form_type === 'Health Inspection' ||
    cat.form_type === 'Health Inspection'
  );

  useEffect(() => {
    if (healthCategory) {
      setInspectionData(prev => ({
        ...prev,
        category_id: healthCategory.id
      }));
    }
  }, [healthCategory]);

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
          .from('health_inspection_form')
          .select('*')
          .eq('inspection_id', editingInspection.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading form data:', error);
          return;
        }

        if (formData) {
          const loadedAnswers: { [key: number]: string } = {};
          for (let i = 1; i <= 27; i++) {
            loadedAnswers[i] = formData[`q${i}`] || '';
          }
          setAnswers(loadedAnswers);

          if (formData.programs_data && Array.isArray(formData.programs_data)) {
            setProgramsData(formData.programs_data);
          }
        }
      }
    };

    loadInspectionData();
  }, [editingInspection]);

  const questions = [
    { num: 1, text: 'ओपीडी मध्ये आवश्यक उपकरणे व साधनसामुग्री उपलब्ध आहे काय ?' },
    { num: 2, text: 'नोंदणी प्रक्रियेदरम्यान रुग्णांना नोंदणी क्रमांक तसेच संपुर्ण तपशिल लिहीला जातो काय ?' },
    { num: 3, text: 'ओपीडी स्लिपमध्ये रुग्णांचा इतिहास, तक्रारी, तात्पुरते निदान नोंदविले जातात काय ?' },
    { num: 4, text: 'गरोदर मातेसाठी औषधीची सुविधा उपलब्ध आहे काय ?' },
    { num: 5, text: 'दररोज लागणारे उपकरणे व अत्यावश्यक औषधांची यादी आहे काय ?' },
    { num: 6, text: 'PIH (Pregnancy induced Hypertension) ची लक्षणे व त्यादरम्यान करण्याच्या उपायाबाबत माहीती आहे काय व त्याबाबत किट उपलब्ध आहे काय ?' },
    { num: 7, text: 'लसीकरण बाबत संपुर्ण माहीती आहे काय ? आयएलआर चे तापमान नोदींचे रजिस्टर उपलब्ध आहे काय ?' },
    { num: 8, text: 'Emergency Drug tray मधील औषधाच्या Expiry date चा चार्ट अद्यावत करण्यात येतो काय ?' },
    { num: 9, text: 'आरोग्य सेविकेचे एनएसएसके, आयुसीडी, एसबीए (Skill Birth Attendant) प्रशिक्षण घेऊन याबाबत कौशल्य प्राप्त केले आहे ?' },
    { num: 10, text: 'कुटुंब कल्याण कार्यक्रमामधील पाळणा लांबविण्याकरिता अंतरा, छाया संस्थेमध्ये उपलब्ध आहे काय, तसेच आयुसिडी व पीपीआययुसीडी बसविल्या जातात काय ?' },
    { num: 11, text: 'PMMVY, JSY, MVM, MAY ई योजने अंतर्गत प्रा.आ.केंद्र स्तरावर लाभार्थ्यांची नोंदणी व रजिस्टर अद्यावत ठेवण्यात आलेले आहे काय ? लाभार्थ्यांना विहित वेळेत आर्थीक लाभ देण्यात आला आहे काय ?' },
    { num: 12, text: 'दर महिन्याचे २८ ते ३० तारखेला उपकेंद्र स्तरावर, १ तारखेला प्रा. आ.केंद्र स्तरावर HMIS Data Validation Meeting नियमित घेतली जाते काय ?' },
    { num: 13, text: 'BMW/IMEP चे वर्गीकरणाबाबत माहीती अवगत आहे काय असल्यास त्यानुसार पिवळी व लाल बकेट तसेच निळा व पांढरा बॉक्समध्ये वर्गीकरण करता येते काय ? Biomedical waste साठी संस्था रजिस्टर्ड आहे काय ?' },
    { num: 14, text: 'Emergency Drug tray मध्ये ठेवण्यात येणाऱ्या औषधीबाबत वापर करण्याबाबतची माहीती आहे काय ?' },
    { num: 15, text: 'संस्थेतील प्रसाधन गृहे स्वच्छ आहे काय. स्वच्छतेची चेकलिस्ट लावण्यात आलेली आहे काय ?' },
    { num: 16, text: 'वयोवृध्द रुणांकरिता रुग्णालयात प्रवेश करतांना हातधरण्याकरिता रॅम्प (Ramp) व हॅडंल (Handle) उपलब्धआहे काय ?' },
    { num: 17, text: 'कार्यक्रमाबाबत देण्यात येणाऱ्या सुविधेबाबत माहीती त्यामध्ये विषयाबाबत समुपदेशन करणे व त्याबाबतची माहीती ठळकपणे प्रदर्शित करण्यात आली आहे काय ?' },
    { num: 18, text: 'प्रा.आ.केंद्र स्तरावर CRS Software मध्ये Online जन्म म≡त्युच्या नोंदी करुन लाभार्थ्यांना प्रमाणपत्र दिल्या जाते काय ?' },
    { num: 19, text: 'प्रा.आ. केद्रस्तरावर Biomedical Waste, Fire extinguisher वापराबाबत कर्मचाऱ्यांचे प्रशिक्षण झाले आहे ?' },
    { num: 20, text: 'संस्थेतील विविध विभागाचे मुल्यमापन चॅकलिस्ट नुसार करण्याचा कृती आराखडा उपलब्ध आहे काय व त्यानुसार कार्यवाही करण्यात येते काय ?' },
    { num: 21, text: 'विविध राष्ट्रीय कार्यक्रमाचे रेकॉर्ड अद्यावत आहे काय ?' },
    { num: 22, text: 'आरोग्य केंद्रातील तपासणी करिता लागणारे उपकरणे व साधनसामुग्री वापरण्याबाबत व त्याची काळजी घेण्याबाबत माहीती आहे काय ?' },
    { num: 23, text: 'आरोग्य केंद्रातील संस्थेत संदर्भ सेवा देणे आवश्यक असल्यास त्याबाबत ज्या संस्थेत रुग्ण संदर्भित होणार आहे त्या संस्थेला आधिच कळविणे गरजेचे आहे त्याबाबत आरोग्य सेविकेला माहीती आहे काय ?' },
    { num: 24, text: 'रेफर आऊट आणि रेफर इन रजिस्टर अद्यावत ठेवणे (Refferal Audit) याबाबत कर्मचाऱ्यांना माहिती आहे काय ?)' },
    { num: 25, text: '५ आर विषयी आरोग्य सेविकेला माहीती आहे काय ? ज्यामध्ये Right Patient, Right Drug, Right Route, Right time, Right documentation' },
    { num: 26, text: 'एनसीडी कार्यक्रमानुसार Hypertension, Blood Sugar Cervical cancer इत्यादी आजाराबाबत तपासणी केली जाते काय व त्याबाबत गोषवारा संस्थेत उपलब्ध आहे काय ?' },
    { num: 27, text: 'प्रा.आ.केंद्रात गप्पीमासे पैदास केंद्रे कार्यरत आहे काय ?' }
  ];

  const handleRadioChange = (questionNum: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionNum]: value }));
  };

  const handleProgramChange = (index: number, field: 'target' | 'achieved' | 'percentage', value: string) => {
    setProgramsData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

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
        const fileName = `Health Inspection_${inspectionId}_${Date.now()}_${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
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
            description: `Health inspection photo ${i + 1}`,
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
    return `HEALTH-${year}${month}${day}-${time}`;
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
          .from('health_inspection_form')
          .update({
            q1: answers[1] || '',
            q2: answers[2] || '',
            q3: answers[3] || '',
            q4: answers[4] || '',
            q5: answers[5] || '',
            q6: answers[6] || '',
            q7: answers[7] || '',
            q8: answers[8] || '',
            q9: answers[9] || '',
            q10: answers[10] || '',
            q11: answers[11] || '',
            q12: answers[12] || '',
            q13: answers[13] || '',
            q14: answers[14] || '',
            q15: answers[15] || '',
            q16: answers[16] || '',
            q17: answers[17] || '',
            q18: answers[18] || '',
            q19: answers[19] || '',
            q20: answers[20] || '',
            q21: answers[21] || '',
            q22: answers[22] || '',
            q23: answers[23] || '',
            q24: answers[24] || '',
            q25: answers[25] || '',
            q26: answers[26] || '',
            q27: answers[27] || '',
            programs_data: programsData,
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
          .from('health_inspection_form')
          .insert({
            inspection_id: inspectionResult.id,
            q1: answers[1] || '',
            q2: answers[2] || '',
            q3: answers[3] || '',
            q4: answers[4] || '',
            q5: answers[5] || '',
            q6: answers[6] || '',
            q7: answers[7] || '',
            q8: answers[8] || '',
            q9: answers[9] || '',
            q10: answers[10] || '',
            q11: answers[11] || '',
            q12: answers[12] || '',
            q13: answers[13] || '',
            q14: answers[14] || '',
            q15: answers[15] || '',
            q16: answers[16] || '',
            q17: answers[17] || '',
            q18: answers[18] || '',
            q19: answers[19] || '',
            q20: answers[20] || '',
            q21: answers[21] || '',
            q22: answers[22] || '',
            q23: answers[23] || '',
            q24: answers[24] || '',
            q25: answers[25] || '',
            q26: answers[26] || '',
            q27: answers[27] || '',
            programs_data: programsData
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 px-8">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors duration-200 bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="w-24"></div>
            </div>
            <h1 className="text-3xl font-bold text-center">Zilhastariya-Adhikari-Tapasani-Suchi-Forms</h1>
          </div>

          <div className="p-8">
            {/* Location and Date Section */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-600" />
                स्थान आणि तारीख माहिती
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Name</label>
                  <input
                    type="text"
                    value={inspectionData.location_name}
                    onChange={(e) => setInspectionData(prev => ({ ...prev, location_name: e.target.value }))}
                    disabled={isViewMode}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter location name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Planned Date</label>
                  <input
                    type="date"
                    value={inspectionData.planned_date}
                    onChange={(e) => setInspectionData(prev => ({ ...prev, planned_date: e.target.value }))}
                    disabled={isViewMode}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation || isViewMode}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-5 h-5" />
                    {isGettingLocation ? 'Getting Location...' : 'Get Current Location'}
                  </button>
                  {inspectionData.location_detected && (
                    <p className="mt-2 text-sm text-gray-600">
                      Detected: {inspectionData.location_detected}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
                आवश्यक बाबींची प्रश्नावली
              </h2>
              <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold">अ. क्र.</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold">आवश्यक बाबींची प्रश्नावली</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold">होय/नाही</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">१</td>
                      <td className="border border-gray-300 px-4 py-3 font-medium">२</td>
                      <td className="border border-gray-300 px-4 py-3 text-center"></td>
                    </tr>
                    {questions.map((q, index) => (
                      <tr key={q.num} className={index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'}>
                        <td className="border border-gray-300 px-4 py-3 text-center font-medium">{q.num}</td>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">{q.text}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`question-${q.num}`}
                                value="होय"
                                checked={answers[q.num] === 'होय'}
                                onChange={(e) => handleRadioChange(q.num, e.target.value)}
                                disabled={isViewMode}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                              <span className="text-gray-700 font-medium">होय</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={`question-${q.num}`}
                                value="नाही"
                                checked={answers[q.num] === 'नाही'}
                                onChange={(e) => handleRadioChange(q.num, e.target.value)}
                                disabled={isViewMode}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                              <span className="text-gray-700 font-medium">नाही</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Programs Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
                राष्ट्रीय कार्यक्रम
              </h2>
              <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold">राष्ट्रीय कार्यक्रम</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold">उद्दिष्ट</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold">साध्य</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold">टक्केवारी</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programsData.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'}>
                        <td className="border border-gray-300 px-4 py-3 text-gray-700">
                          {row.program}
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="number"
                            value={row.target}
                            onChange={(e) => handleProgramChange(index, 'target', e.target.value)}
                            disabled={isViewMode}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="number"
                            value={row.achieved}
                            onChange={(e) => handleProgramChange(index, 'achieved', e.target.value)}
                            disabled={isViewMode}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </td>
                        <td className="border border-gray-300 px-2 py-2">
                          <input
                            type="number"
                            value={row.percentage}
                            onChange={(e) => handleProgramChange(index, 'percentage', e.target.value)}
                            disabled={isViewMode}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="bg-violet-50 border-l-4 border-violet-500 p-6 rounded-lg mb-6 mt-8">
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

            {/* Submit Buttons */}
            {!isViewMode && (
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={isLoading || isUploading}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isLoading ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isLoading || isUploading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {isLoading ? 'Submitting...' : 'Submit Inspection'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};