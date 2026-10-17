import api from './api';

/**
 * Service for managing Anurag University ownership claims
 */
export const claimService = {
  // Submit an ownership claim for an item
  async submitClaim(itemId, verificationNotes) {
    const response = await api.post(`/claims`, {
      itemId,
      verificationNotes,
    });
    return response.data?.data || response.data;
  },

  // Get all claims submitted by the currently logged-in student/staff
  async getMyClaims() {
    const response = await api.get('/claims/my');
    return response.data?.data || response.data || [];
  },

  // Get claims submitted for a specific item (for item reporter or staff/admin)
  async getItemClaims(itemId) {
    const response = await api.get(`/claims/item/${itemId}`);
    return response.data?.data || response.data || [];
  },

  // Get all claims campus-wide (for staff/admin)
  async getAllClaims() {
    const response = await api.get('/claims');
    return response.data?.data || response.data || [];
  },

  // Review a claim (approve or reject with feedback)
  async reviewClaim(claimId, status, feedback = '') {
    const response = await api.put(`/claims/${claimId}/review`, {
      status,
      feedback,
    });
    return response.data?.data || response.data;
  },
};

export default claimService;
