'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the company profile data
export interface CompanyProfile {
  name: string;
  email: string;
  phone: string;
  logoUrl: string | null;
  backgroundUrl: string | null;
}

// Initial mock data
const initialCompanyProfile: CompanyProfile = {
  name: "Usuário Demo",
  email: "demo@example.com",
  phone: "(65) 99999-9999",
  logoUrl: null,
  backgroundUrl: null,
};

// Define the context shape
interface CompanyContextType {
  companyProfile: CompanyProfile;
  setCompanyProfile: (profile: CompanyProfile) => void;
}

// Create the context with a default value
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Create the provider component
export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(initialCompanyProfile);

  return (
    <CompanyContext.Provider value={{ companyProfile, setCompanyProfile }}>
      {children}
    </CompanyContext.Provider>
  );
};

// Create a custom hook to use the context
export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
