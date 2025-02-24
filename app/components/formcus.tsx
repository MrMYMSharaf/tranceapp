"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Check, AlertCircle, ChevronRight, User, MapPin, Calendar, DollarSign, UserCheck } from 'lucide-react';

interface FormData {
  fullName: string;
  address: string;
  closeOutAmount: string;
  recordDate: string;
  nextDate: string;
  loanAmount: string;
  legalOfficer: string;
}

interface Step {
  title: string;
  icon: React.ComponentType<any>;
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  
  // Get day with suffix (1st, 2nd, 3rd, 4th, etc.)
  const day = date.getDate();
  const suffix = getDaySuffix(day);
  
  // Format the date
  return date.toLocaleString('en-GB', { 
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).replace(/\d+/, day + suffix);
};

const getDaySuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const formatDateForInput = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};

const CustomerDetailsForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    address: "",
    closeOutAmount: "",
    recordDate: "",
    nextDate: "",
    loanAmount: "",
    legalOfficer: "",
  });

  const [responseData, setResponseData] = useState<Record<string, any> | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps: Step[] = [
    { title: "Personal Info", icon: User },
    { title: "Financial Details", icon: DollarSign },
    { title: "Dates", icon: Calendar },
    { title: "Confirmation", icon: Check }
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResponseData(null);
    setErrorMessage(null);
    setIsLoading(true);

    const formattedData = {
      "Customer Full Name": formData.fullName,
      "Customer Address": formData.address,
      "Close out amount in words": formData.closeOutAmount,
      "Record initiating date": formData.recordDate ? formatDate(formData.recordDate) : "",
      "Loan outstanding amount in words": formData.loanAmount,
      "Next working date of record initiating date": formData.nextDate ? formatDate(formData.nextDate) : "",
      "Record Confirming Legal officer Name": formData.legalOfficer,
    };

    try {
      const response = await fetch("http://localhost:8000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();
      if (response.ok) {
        setResponseData(result);
        setActiveStep(3);
      } else {
        setErrorMessage(`Error: ${result.detail?.map((err: { msg: string }) => err.msg).join(", ")}`);
      }
    } catch (error) {
      setErrorMessage("Failed to submit the form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component remains the same until the date inputs...

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        // Personal Info step remains the same...
        return (
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>
            <div className="relative group">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                rows={3}
                required
              />
            </div>
          </div>
        );
      case 1:
        // Financial Details step remains the same...
        return (
          <div className="space-y-4">
            <div className="relative group">
              <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
              <input
                name="closeOutAmount"
                placeholder="Close Out Amount in Words"
                value={formData.closeOutAmount}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>
            <div className="relative group">
              <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
              <input
                name="loanAmount"
                placeholder="Loan Outstanding Amount"
                value={formData.loanAmount}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="relative group">
              <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
              <input
                name="recordDate"
                type="date"
                value={formData.recordDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
              {formData.recordDate && (
                <p className="mt-1 text-sm text-gray-600">
                  Selected: {formatDate(formData.recordDate)}
                </p>
              )}
            </div>
            <div className="relative group">
              <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
              <input
                name="nextDate"
                type="date"
                value={formData.nextDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
              {formData.nextDate && (
                <p className="mt-1 text-sm text-gray-600">
                  Selected: {formatDate(formData.nextDate)}
                </p>
              )}
            </div>
            <div className="relative group">
              <UserCheck className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
              <input
                name="legalOfficer"
                placeholder="Legal Officer Name"
                value={formData.legalOfficer}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Rest of the JSX remains the same...
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-6xl w-full mx-auto flex flex-col lg:flex-row gap-8 transition-all duration-300 hover:shadow-2xl">
        {/* Left Side - Form */}
        <div className="lg:w-1/2 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Customer Details Form</h2>
            <p className="text-gray-600">Please complete all required information</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= activeStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  } transition-all duration-200`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <p className="text-xs mt-2 text-gray-600">{step.title}</p>
              </div>
            ))}
          </div>

          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent(activeStep)}

            <div className="flex gap-4 justify-between mt-8">
              {activeStep > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Back
                </button>
              )}
              {activeStep < 2 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 ml-auto"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">Processing...</span>
                  ) : (
                    <>
                      Submit
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side - API Response */}
        <div className="lg:w-1/2">
          <div className="bg-gray-50 rounded-xl p-6 h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Response Details</h2>
            {responseData ? (
              <div className="space-y-4">
                {Object.entries(responseData).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <p className="text-sm font-medium text-gray-500">{key}</p>
                    <p className="text-gray-800 mt-1">{String(value)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-4">
                <AlertCircle className="w-12 h-12 text-gray-400" />
                <p className="text-center">
                  Complete the form to see the response details here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsForm;