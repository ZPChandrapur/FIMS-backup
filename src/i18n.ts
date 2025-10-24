import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      systems: {
        fims: {
          fullName: 'Field Inspection Management System',
          description: 'Manage and track field inspections efficiently'
        }
      },
      auth: {
        secureAccess: 'Secure access to field inspection management system',
        email: 'Email',
        password: 'Password',
        signIn: 'Sign In',
        enterEmail: 'Enter your email',
        enterPassword: 'Enter your password',
        forgotPassword: 'Forgot Password?',
        fillAllFields: 'Please fill in all fields',
        invalidEmail: 'Please enter a valid email address',
        passwordTooShort: 'Password must be at least 6 characters',
        checkEmail: 'Check Your Email',
        resetEmailMessage: 'We sent a password reset link to',
        didntReceiveEmail: "Didn't receive the email? Check your spam folder or try again.",
        backToSignIn: 'Back to Sign In'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
