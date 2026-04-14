
import React, { useState } from 'react';
import { Ticket } from '../types';

interface TicketListProps {
  tickets: Ticket[];
  onUpdateStatus: (id: string, status: Ticket['status'], closeReason?: string) => void;
  isReadOnly?: boolean;
  onRefresh?: () => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onUpdateStatus, isReadOnly, onRefresh }) => {
  const [closingTicketId, setClosingTicketId] = useState<string | null>(null);

  const closeReasons = [
    "The user later mentioned the issue was resolved",
    "The escalation was by mistake",
    "Admin closed because request was unethical/against company policies"
  ];

  const handleCloseTicket = (reason: string) => {
    if (closingTicketId) {
      onUpdateStatus(closingTicketId, 'Closed', reason);
      setClosingTicketId(null);
    }
  };

  const exportToCSV = () => {
    if (tickets.length === 0) {
      alert("No records to export.");
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
      <div className="p-4 md:p-10 max-w-6xl mx-auto w-full space-y-8 pb-32">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              {isReadOnly ? 'Ticket History & Records' : 'Active Support Queue'}
            </h3>
            <p className="text-slate-500 text-sm md:text-base font-medium">
              {isReadOnly ? 'A complete record of all support interactions.' : 'Issues escalated for human review.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
             {onRefresh && (
               <button
                 onClick={onRefresh}
                 className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                 </svg>
                 Refresh
               </button>
             )}
             {isReadOnly && (
               <button
                 onClick={exportToCSV}
                 className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                 </svg>
                 Export CSV
               </button>
             )}
             {!isReadOnly && (
               <>
                 <div className="px-3 py-1.5 bg-red-100 text-red-700 rounded-xl text-[10px] font-black flex items-center gap-2 shadow-sm whitespace-nowrap">
                   {tickets.filter(t => t.status === 'Escalated').length} ESCALATED
                 </div>
                 <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-xl text-[10px] font-black flex items-center gap-2 shadow-sm whitespace-nowrap">
                   {tickets.filter(t => t.status === 'Open').length} OPEN
                 </div>
                 <div className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-xl text-[10px] font-black flex items-center gap-2 shadow-sm whitespace-nowrap">
                   {tickets.filter(t => t.status === 'In Progress').length} IN PROGRESS
                 </div>
                 <div className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black flex items-center gap-2 shadow-sm whitespace-nowrap">
                   {tickets.filter(t => t.status === 'Closed').length} CLOSED
                 </div>
               </>
             )}
             {isReadOnly && (
               <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg whitespace-nowrap">
                 {tickets.length} TOTAL RECORDS
               </div>
             )}
          </div>
        </header>

        {tickets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className={`bg-white rounded-3xl border p-6 flex flex-col gap-6 shadow-sm transition-all ${
                ticket.status === 'Resolved' ? 'opacity-70 bg-slate-50' : 'hover:shadow-md'
              }`}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-black text-base ${
                      ticket.status === 'Resolved' 
                        ? 'bg-slate-200 text-slate-500' 
                        : (ticket.priority === 'Emergency' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600')
                    }`}>
                      {ticket.id.slice(-4)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={`font-black text-lg ${ticket.status === 'Resolved' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {ticket.subject}
                        </h4>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${
                          ticket.status === 'Resolved' 
                            ? 'bg-slate-300 text-white' 
                            : (ticket.priority === 'Emergency' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white')
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-bold">
                        <span className="px-1.5 py-0.5 bg-slate-100 border rounded text-[9px] font-black text-slate-500 uppercase">
                          {ticket.category}
                        </span>
                        <span>Logged {ticket.createdAt.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                      <p className={`text-sm font-black ${
                        ticket.status === 'Resolved' ? 'text-green-600' :
                        ticket.status === 'Closed' ? 'text-slate-600' :
                        ticket.status === 'In Progress' ? 'text-amber-600' :
                        ticket.status === 'Escalated' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {ticket.status}
                      </p>
                    </div>
                    {!isReadOnly && ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        {ticket.status === 'Escalated' && (
                          <button
                            onClick={() => onUpdateStatus(ticket.id, 'Open')}
                            className="flex-1 sm:flex-none bg-blue-600 active:bg-blue-700 text-white font-black text-[10px] px-4 py-3 sm:py-2 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest min-h-[44px] sm:min-h-0"
                          >
                            Acknowledge
                          </button>
                        )}
                        {ticket.status === 'Open' && (
                          <button
                            onClick={() => onUpdateStatus(ticket.id, 'In Progress')}
                            className="flex-1 sm:flex-none bg-amber-500 active:bg-amber-600 text-white font-black text-[10px] px-4 py-3 sm:py-2 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest min-h-[44px] sm:min-h-0"
                          >
                            Start Work
                          </button>
                        )}
                        {ticket.status === 'In Progress' && (
                          <button
                            onClick={() => onUpdateStatus(ticket.id, 'Resolved')}
                            className="flex-1 sm:flex-none bg-green-600 active:bg-green-700 text-white font-black text-[10px] px-4 py-3 sm:py-2 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest min-h-[44px] sm:min-h-0"
                          >
                            Resolve
                          </button>
                        )}
                        <button
                          onClick={() => setClosingTicketId(ticket.id)}
                          className="flex-1 sm:flex-none bg-slate-800 active:bg-slate-900 text-white font-black text-[10px] px-4 py-3 sm:py-2 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest min-h-[44px] sm:min-h-0"
                        >
                          Close
                        </button>
                      </div>
                    )}
                    {(ticket.status === 'Resolved' || ticket.status === 'Closed') && (
                      <div className={`${ticket.status === 'Resolved' ? 'text-green-600 bg-green-50' : 'text-slate-600 bg-slate-100'} p-3 rounded-full`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Issue Description</p>
                      <p className="text-sm text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {ticket.description || "No description provided."}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Escalation Reason</p>
                      <p className="text-sm text-red-600 font-bold italic">
                        {ticket.escalationReason || "Manual escalation."}
                      </p>
                    </div>
                    {ticket.status === 'Closed' && (
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Closing Reason</p>
                        <p className="text-sm text-slate-600 font-bold italic bg-slate-100 p-3 rounded-xl border border-slate-200">
                          {ticket.closeReason || "No reason specified."}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-900 rounded-2xl p-5 text-white space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">User Information</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Name</p>
                        <p className="text-sm font-black">{ticket.userName || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Staff ID</p>
                        <p className="text-sm font-black">{ticket.staffId || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Contact</p>
                        <p className="text-sm font-black text-blue-400">{ticket.contact || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Department</p>
                        <p className="text-sm font-black">{ticket.department || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-blue-50 text-blue-200 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-black text-slate-800">No active tickets!</h4>
            <p className="text-slate-500 text-sm">Everything is running smoothly.</p>
          </div>
        )}
      </div>

      {/* Closing Reason Modal */}
      {closingTicketId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Close Ticket</h3>
                <p className="text-slate-500 font-medium">Please select a reason for closing this ticket.</p>
              </div>

              <div className="space-y-3">
                {closeReasons.map((reason, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCloseTicket(reason)}
                    className="w-full text-left p-4 rounded-2xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                  >
                    <p className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{reason}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setClosingTicketId(null)}
                className="w-full py-4 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;
