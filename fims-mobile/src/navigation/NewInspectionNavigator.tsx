import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FormsStackParamList } from '../types';
import CategorySelectionScreen from '../screens/inspections/CategorySelectionScreen';
import FIMSOfficeInspectionScreen from '../screens/forms/FIMSOfficeInspectionScreen';
import AnganwadiTapasaniScreen from '../screens/forms/AnganwadiTapasaniScreen';
import HealthInspectionScreen from '../screens/forms/HealthInspectionScreen';

const Stack = createStackNavigator<FormsStackParamList>();

export default function NewInspectionNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CategorySelection"
        component={CategorySelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FIMSOfficeInspection"
        component={FIMSOfficeInspectionScreen}
        options={{ title: 'Office Inspection' }}
      />
      <Stack.Screen
        name="AnganwadiTapasani"
        component={AnganwadiTapasaniScreen}
        options={{ title: 'Anganwadi Inspection' }}
      />
      <Stack.Screen
        name="HealthInspection"
        component={HealthInspectionScreen}
        options={{ title: 'Health Inspection' }}
      />
    </Stack.Navigator>
  );
}
