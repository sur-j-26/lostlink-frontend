import api from './api';

/**
 * Service for Anurag University Campus Portal Administrative operations
 */
export const adminService = {
  // Get live campus statistics from database
  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data?.data || response.data;
  },

  // Get registered university users
  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data?.data || response.data || [];
  },

  // Get all item reports
  async getReports() {
    const response = await api.get('/admin/reports');
    return response.data?.data || response.data || [];
  },

  // Update report status or security verification
  async updateReportStatus(id, status, verifiedBySecurity) {
    const response = await api.patch(`/admin/reports/${id}/status`, {
      status,
      verifiedBySecurity,
    });
    return response.data?.data || response.data;
  },

  // Get all campus ownership claims
  async getClaims() {
    const response = await api.get('/admin/claims');
    return response.data?.data || response.data || [];
  },
};

export default adminService;
