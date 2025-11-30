import React from 'react';

export interface SimulationParams {
  magnitude: number;
  depth: number;
  latitude: number;
  longitude: number;
}

export interface SimulationResult {
  riskLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Bahaya';
  eta: number; // in minutes
  maxWaveHeight: number; // in meters
  impactArea: number; // in km2
  waveTrend: { time: string; height: number }[];
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}