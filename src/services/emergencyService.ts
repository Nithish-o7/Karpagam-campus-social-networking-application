import apiClient from './apiClient';

export interface EmergencyResponse {
  success: boolean;
  incidentId: string;
  message: string;
  meta: {
    location: string;
    createdAt: string;
  };
}

export const emergencyService = {
  /**
   * Triggers a Priority 1 Emergency Dispatch to ServiceNow.
   * This bypasses standard ticket flows for immediate manual action.
   */
  async trigger(location: string): Promise<EmergencyResponse> {
    const { data } = await apiClient.post<EmergencyResponse>('/emergency', { location });
    return data;
  },
};
