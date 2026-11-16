import { useState, useEffect } from 'react';
import { impactService } from '../services/impactService';

export function useImpactData() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = impactService.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  return {
    organization: impactService.getOrganization(),
    currentUser: impactService.getCurrentUser(),
    teamMembers: impactService.getTeamMembers(),
    campaigns: impactService.getCampaigns(),
    donors: impactService.getDonors(),
    donations: impactService.getDonations(),
    beneficiaries: impactService.getBeneficiaries(),
    projects: impactService.getProjects(),
    transactions: impactService.getTransactions(),
    volunteers: impactService.getVolunteers(),
    notifications: impactService.getNotifications(),
    unreadCount: impactService.getUnreadNotificationCount(),
    metrics: impactService.getDashboardMetrics(),
    authSession: impactService.getAuthSession(),
    isAuthenticated: impactService.isAuthenticated(),
    service: impactService,
  };
}
