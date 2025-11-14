import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FormsStackParamList } from '../types';
import CategorySelectionScreen from '../screens/inspections/CategorySelectionScreen';
import FIMSOfficeInspectionScreen from '../screens/forms/FIMSOfficeInspectionScreen';
import AnganwadiTapasaniScreen from '../screens/forms/AnganwadiTapasaniScreen';
import HealthInspectionScreen from '../screens/forms/HealthInspectionScreen';
import BandhkamVibhag1Screen from '../screens/forms/BandhkamVibhag1Screen';
import BandhkamVibhag2Screen from '../screens/forms/BandhkamVibhag2Screen';
import GrampanchayatInspectionScreen from '../screens/forms/GrampanchayatInspectionScreen';
import MahatmaGandhiRojgarHamiScreen from '../screens/forms/MahatmaGandhiRojgarHamiScreen';

const Stack = createStackNavigator<FormsStackParamList>();

export default function NewInspectionNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CategorySelection" component={CategorySelectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FIMSOfficeInspection" component={FIMSOfficeInspectionScreen} options={{ title: 'Office Inspection' }} />
      <Stack.Screen name="AnganwadiTapasani" component={AnganwadiTapasaniScreen} options={{ title: 'Anganwadi' }} />
      <Stack.Screen name="HealthInspection" component={HealthInspectionScreen} options={{ title: 'Health' }} />
      <Stack.Screen name="BandhkamVibhag1" component={BandhkamVibhag1Screen} options={{ title: 'Construction 1' }} />
      <Stack.Screen name="BandhkamVibhag2" component={BandhkamVibhag2Screen} options={{ title: 'Construction 2' }} />
      <Stack.Screen name="GrampanchayatInspection" component={GrampanchayatInspectionScreen} options={{ title: 'Gram Panchayat' }} />
      <Stack.Screen name="MahatmaGandhiRojgarHami" component={MahatmaGandhiRojgarHamiScreen} options={{ title: 'MGNREGA' }} />
    </Stack.Navigator>
  );
}
