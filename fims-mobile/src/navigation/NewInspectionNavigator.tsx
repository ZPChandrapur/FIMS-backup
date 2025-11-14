import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FormsStackParamList } from '../types';
import CategorySelectionScreen from '../screens/inspections/CategorySelectionScreen';

const Stack = createStackNavigator<FormsStackParamList>();

export default function NewInspectionNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CategorySelection"
        component={CategorySelectionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
