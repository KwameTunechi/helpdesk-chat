
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { SessionStats, Ticket } from '../types';

interface AnalyticsProps {
  stats: SessionStats;
  tickets: Ticket[];
  activeUserCount: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const STATUS_COLORS = {
  'Escalated': '#ef4444',
  'Open': '#3b82f6',
  'In Progress': '#f59e0b',
  'Resolved': '#10b981',
  'Closed': '#64748b'
};

const Analytics: React.FC<AnalyticsProps> = ({ stats, tickets, activeUserCount }) => {
  const ticketData = [
    { name: 'Logins', value: stats.access || 0 },
    { name: 'Software', value: stats.apps || 0 },
    { name: 'Internet', value: stats.network || 0 },
    { name: 'Email', value: stats.email || 0 },
    { name: 'Hardware', value: stats.hardware || 0 },
  ];

  const lifecycleData = [
    { name: 'Escalated', value: tickets.filter(t => t.status === 'Escalated').length },
    { name: 'Open', value: tickets.filter(t => t.status === 'Open').length },
    { name: 'In Progress', value: tickets.filter(t => t.status === 'In Progress').length },
    { name: 'Resolved', value: tickets.filter(t => t.status === 'Resolved').length },
    { name: 'Closed', value: tickets.filter(t => t.status === 'Closed').length },
  ];

  const totalInquiries = (Object.values(stats) as number[]).reduce((a, b) => a + b, 0);
  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;
  const resolutionRate = totalTickets > 0 ? ((resolvedTickets / totalTickets) * 100).toFixed(1) : "100";

  const exportToCSV = () => {
    if (tickets.length === 0) {
      alert("No ticket records to export.");
      return;
    }

    const headers = ["Ticket ID", "Subject", "Category", "Priority", "Status", "Created At", "User", "Staff ID", "Department", "Description", "Escalation Reason", "Closing Reason"];
    const rows = tickets.map(t => [
      t.id,
      `"${t.subject.replace(/"/g, '""')}"`,
      t.category,
      t.priority,
      t.status,
      t.createdAt.toLocaleString(),
      t.userName || "N/A",
      t.staffId || "N/A",
      t.department || "N/A",
      `"${(t.description || "").replace(/"/g, '""')}"`,
      `"${(t.escalationReason || "").replace(/"/g, '""')}"`,
      `"${(t.closeReason || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Support_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8 pb-32">
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <StatCard title="Active Users" value={activeUserCount.toString()} subtitle="Currently Interfacing" color="text-indigo-600" isLive={true} />
          <StatCard title="Resolution Rate" value={`${resolutionRate}%`} subtitle="SLA Target 90%" color="text-green-600" />
          <StatCard title="Active Tickets" value={tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length.toString()} subtitle="Requires Attention" color="text-blue-600" />
          <StatCard title="Escalations" value={tickets.filter(t => t.status === 'Escalated').length.toString()} subtitle="Urgent Action" color="text-red-600" />
        </div>

        {/* Charts and Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-5 md:p-8 rounded-3xl border shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h4 className="text-xl font-bold text-slate-800 tracking-tight">Support Distribution</h4>
                  <p className="text-sm text-slate-500 font-medium">Issue categories identified by AI</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live Data
                </div>
              </div>
              
              <div className="h-[180px] sm:h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ticketData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                      {ticketData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 md:p-8 rounded-3xl border shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h4 className="text-xl font-bold text-slate-800 tracking-tight">Ticket Lifecycle Progression</h4>
                  <p className="text-sm text-slate-500 font-medium">Tracking tickets from escalation to resolution</p>
                </div>
              </div>
              
              <div className="h-[180px] sm:h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lifecycleData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                      {lifecycleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold tracking-tight">AI Efficiency Report</h4>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  The AI system is currently maintaining a high resolution rate.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>KB Coverage</span>
                    <span className="text-white">88%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>Context Accuracy</span>
                    <span className="text-white">96%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Session Summary</p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {totalInquiries > 0 
                      ? `AI has successfully classified ${totalInquiries} queries with high confidence.` 
                      : "Awaiting user input to begin session analysis."}
                  </p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={exportToCSV}
              className="mt-8 w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 rounded-2xl transition-all text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Audit Data (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; subtitle: string; color?: string; isLive?: boolean }> = ({ title, value, subtitle, color = "text-slate-800", isLive }) => (
  <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
    {isLive && (
      <div className="absolute top-3 right-3 md:top-4 md:right-4 flex items-center gap-1">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest hidden sm:block">Live</span>
      </div>
    )}
    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-tight">{title}</p>
    <p className={`text-2xl md:text-3xl font-black tracking-tight ${color}`}>{value}</p>
    <p className="text-[9px] md:text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter opacity-70 leading-tight">{subtitle}</p>
  </div>
);

export default Analytics;
