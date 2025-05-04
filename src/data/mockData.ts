import { StatCard, ActivityItem, ChartData } from '../types';

export const statCards: StatCard[] = [
  {
    id: '1',
    title: 'Total Revenue',
    value: '$24,780',
    change: 12.5,
    icon: 'dollar-sign',
    color: 'blue',
  },
  {
    id: '2',
    title: 'Active Users',
    value: '1,429',
    change: 8.2,
    icon: 'users',
    color: 'purple',
  },
  {
    id: '3',
    title: 'New Customers',
    value: '385',
    change: -2.4,
    icon: 'user-plus',
    color: 'indigo',
  },
  {
    id: '4',
    title: 'Satisfaction',
    value: '98.2%',
    change: 3.1,
    icon: 'smile',
    color: 'green',
  },
];

export const recentActivity: ActivityItem[] = [
  {
    id: '1',
    user: 'John Doe',
    action: 'completed',
    target: 'Q2 Sales Report',
    time: '2 hours ago',
  },
  {
    id: '2',
    user: 'Emma Watson',
    action: 'updated',
    target: 'Marketing Strategy',
    time: '5 hours ago',
  },
  {
    id: '3',
    user: 'Michael Scott',
    action: 'commented on',
    target: 'Product Roadmap',
    time: 'Yesterday',
  },
  {
    id: '4',
    user: 'Sarah Johnson',
    action: 'created',
    target: 'New Customer Onboarding',
    time: 'Yesterday',
  },
  {
    id: '5',
    user: 'David Miller',
    action: 'approved',
    target: 'Budget Request',
    time: '2 days ago',
  },
];

export const chartData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  data: [12, 19, 13, 25, 22, 30],
};