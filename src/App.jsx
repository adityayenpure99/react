import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Bell, 
  Menu,
  Server,
  Laptop,
  Wifi,
  Activity,
  MapPin,
  AlertTriangle,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';

// --- 1. DATA SOURCE ---
const initialData = [
    { "action": "created", "number": "INC04894751", "short_description": "Password reset", "description": "Password reset request", "cmdb_ci": "MCBU", "category": "Desktop/Laptop", "assignment_group": "SURFACE APP", "priority": "Low", "opened_at": "2025-09-08 11:38:41", "region": "North America" },
    { "action": "created", "number": "INC04895000", "short_description": "Network outage Loc A", "description": "Network down", "cmdb_ci": "MCBU", "category": "Network", "assignment_group": "NETWORK SUPPORT", "priority": "2 - High", "opened_at": "2025-09-05 10:00:00", "region": "North America" },
    { "action": "created", "number": "INC04895001", "short_description": "Network outage Loc B", "description": "Network down", "cmdb_ci": "MCBU", "category": "Network", "assignment_group": "NETWORK SUPPORT", "priority": "2 - High", "opened_at": "2025-09-05 10:05:00", "region": "EMEA" },
    { "action": "created", "number": "INC04895002", "short_description": "VPN issue", "description": "VPN not connecting", "cmdb_ci": "MCBU", "category": "Network", "assignment_group": "NETWORK SUPPORT", "priority": "Low", "opened_at": "2025-09-05 10:10:00", "region": "North America" },
    { "action": "created", "number": "INC04895003", "short_description": "VPN issue", "description": "VPN not connecting", "cmdb_ci": "MCBU", "category": "Network", "assignment_group": "NETWORK SUPPORT", "priority": "Low", "opened_at": "2025-09-05 10:12:00", "region": "EMEA" },
    { "action": "created", "number": "INC04895004", "short_description": "Network latency A", "description": "Slow network", "cmdb_ci": "MCBU", "category": "Network", "assignment_group": "NETWORK SUPPORT", "priority": "Low", "opened_at": "2025-09-05 10:13:30", "region": "North America" },
    { "action": "created", "number": "INC04895005", "short_description": "Network latency B", "description": "Slow network", "cmdb_ci": "MCBU", "category": "Network", "assignment_group": "NETWORK SUPPORT", "priority": "Low", "opened_at": "2025-09-05 10:18:00", "region": "EMEA" },
    { "action": "created", "number": "INC04895006", "short_description": "SAP Login Failure", "description": "User locked out", "cmdb_ci": "SAP ERP", "category": "Software", "assignment_group": "APP SUPPORT", "priority": "1 - Critical", "opened_at": "2025-09-06 09:15:00", "region": "APAC" },
    { "action": "created", "number": "INC04895007", "short_description": "Printer Jam", "description": "Floor 2 printer", "cmdb_ci": "Canon_Fl2", "category": "Hardware", "assignment_group": "DESKSIDE", "priority": "Low", "opened_at": "2025-09-07 14:20:00", "region": "APAC" },
    { "action": "created", "number": "INC04895008", "short_description": "Wifi Signal Weak", "description": "Signal loss", "cmdb_ci": "WIFI_AP", "category": "Network", "assignment_group": "NETWORK SUPPORT", "priority": "3 - Moderate", "opened_at": "2025-09-08 08:45:00", "region": "LATAM" },
];

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

const StatCard = ({ title, value, icon: Icon, trend, color, regionLabel }) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:border-slate-600 transition-all duration-300">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-opacity-20 ${color === 'indigo' ? 'bg-indigo-500 text-indigo-400' : color === 'red' ? 'bg-red-500 text-red-400' : 'bg-emerald-500 text-emerald-400'}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="mt-4 flex items-center justify-between text-xs">
      <div className="flex items-center">
        <span className={`${trend >= 0 ? 'text-emerald-400' : 'text-red-400'} font-medium flex items-center`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
        <span className="text-slate-500 ml-2">from last week</span>
      </div>
      {regionLabel && (
         <span className="text-slate-500 font-medium px-2 py-0.5 rounded bg-slate-900/50 border border-slate-700/50">
           {regionLabel}
         </span>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const [data] = useState(initialData);
  const [selectedRegion, setSelectedRegion] = useState('All');

  const regions = useMemo(() => {
    const unique = new Set(data.map(item => item.region || 'Unknown'));
    return ['All', ...Array.from(unique)];
  }, [data]);

  // Define filteredData separately to avoid ReferenceError
  const filteredData = useMemo(() => {
    return selectedRegion === 'All' 
        ? data 
        : data.filter(item => item.region === selectedRegion);
  }, [data, selectedRegion]);

  const metrics = useMemo(() => {
    const total = filteredData.length;
    const highPriority = filteredData.filter(i => i.priority.includes('High') || i.priority.includes('Critical')).length;
    const networkIssues = filteredData.filter(i => i.category === 'Network').length;

    // Category Data
    const categoryCount = {};
    filteredData.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    const categoryData = Object.keys(categoryCount).map(key => ({
      name: key,
      count: categoryCount[key]
    }));

    // Priority Data
    const priorityCount = {};
    filteredData.forEach(item => {
      let simplePrio = item.priority;
      if(simplePrio.includes('-')) simplePrio = simplePrio.split('-')[1].trim();
      priorityCount[simplePrio] = (priorityCount[simplePrio] || 0) + 1;
    });
    const priorityData = Object.keys(priorityCount).map(key => ({
      name: key,
      value: priorityCount[key]
    }));

    // Timeline Data
    const timelineCount = {};
    filteredData.forEach(item => {
      const date = item.opened_at.split(' ')[0]; 
      timelineCount[date] = (timelineCount[date] || 0) + 1;
    });
    const timelineData = Object.keys(timelineCount)
      .sort()
      .map(date => ({
        date: date.substring(5),
        incidents: timelineCount[date]
      }));

    // Region Escalation Data (Using filteredData for consistent view)
    const regionMap = {};
    filteredData.forEach(item => {
      const region = item.region || "Unknown";
      if (!regionMap[region]) regionMap[region] = { region, critical: 0, standard: 0 };
      
      if (item.priority.includes('High') || item.priority.includes('Critical')) {
        regionMap[region].critical += 1;
      } else {
        regionMap[region].standard += 1;
      }
    });
    const regionData = Object.values(regionMap);

    // Urgent Incidents
    const urgentIncidents = filteredData
      .filter(item => item.priority.includes('Critical') || item.priority.includes('High'))
      .sort((a, b) => new Date(b.opened_at) - new Date(a.opened_at));

    return { 
      total, 
      highPriority, 
      networkIssues, 
      categoryData, 
      priorityData, 
      timelineData, 
      regionData,
      urgentIncidents 
    };
  }, [filteredData]);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex-col hidden md:flex">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-8 border-b border-slate-800">
          <Activity className="text-indigo-500 h-8 w-8" />
          <span className="ml-3 font-bold text-xl hidden lg:block tracking-tight">OpsCenter</span>
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-4">
          <div className="flex items-center px-4 py-3 bg-indigo-600/10 text-indigo-400 rounded-lg cursor-pointer">
            <LayoutDashboard size={20} />
            <span className="ml-3 font-medium hidden lg:block">Dashboard</span>
          </div>
          <div className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-slate-100 rounded-lg cursor-pointer transition-colors">
            <Server size={20} />
            <span className="ml-3 font-medium hidden lg:block">Incidents</span>
          </div>
          <div className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-slate-100 rounded-lg cursor-pointer transition-colors">
            <Laptop size={20} />
            <span className="ml-3 font-medium hidden lg:block">Assets</span>
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center justify-center lg:justify-start">
             <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">JD</div>
             <div className="ml-3 hidden lg:block">
               <p className="text-sm font-medium">Chevron Engine</p>
               <p className="text-xs text-slate-500">Analyst</p>
             </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-10">
          <div className="flex items-center md:hidden">
            <Menu className="text-slate-400" />
          </div>
          
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search incidents..." 
              className="w-full bg-slate-800 border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-indigo-400 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* DASHBOARD SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* DASHBOARD HEADER & CONTROLS */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                    Incident Overview 
                    {selectedRegion !== 'All' && <span className="ml-2 text-indigo-400 font-normal text-xl">/ {selectedRegion}</span>}
                </h1>
                <p className="text-slate-400 mt-1">Real-time updates from ServiceNow integration</p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* REGION FILTER DROPDOWN */}
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                        <MapPin size={16} />
                    </div>
                    <select 
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="appearance-none bg-slate-800 text-white pl-10 pr-10 py-2 rounded-lg border border-slate-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer text-sm font-medium transition-all shadow-lg"
                    >
                        {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                        <ChevronDown size={14} />
                    </div>
                </div>

                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20 flex items-center">
                    Export Report
                </button>
              </div>
            </div>

            {/* TOP STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Incidents" value={metrics.total} icon={LayoutDashboard} trend={12} color="indigo" regionLabel={selectedRegion !== 'All' ? selectedRegion : null} />
              <StatCard title="High Priority" value={metrics.highPriority} icon={AlertCircle} trend={-5} color="red" regionLabel={selectedRegion !== 'All' ? selectedRegion : null} />
              <StatCard title="Network Issues" value={metrics.networkIssues} icon={Wifi} trend={8} color="warning" regionLabel={selectedRegion !== 'All' ? selectedRegion : null} />
              <StatCard title="Avg Resolution" value="4.2h" icon={Clock} trend={15} color="success" regionLabel={selectedRegion !== 'All' ? selectedRegion : null} />
            </div>

            {/* --- REGIONAL & URGENT ATTENTION SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white flex items-center">
                            <MapPin size={18} className="mr-2 text-indigo-400"/>
                            Regional Escalations
                        </h3>
                        <p className="text-xs text-slate-400">
                            {selectedRegion === 'All' ? 'Comparing incidents across all regions' : `Incidents in ${selectedRegion}`}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div> Critical/High</span>
                        <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div> Standard</span>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.regionData} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="region" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip cursor={{fill: '#334155', opacity: 0.4}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                        <Bar dataKey="standard" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} barSize={40} />
                        <Bar dataKey="critical" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg flex flex-col">
                    <div className="p-6 border-b border-slate-700 bg-red-500/5">
                        <h3 className="text-lg font-semibold text-red-400 flex items-center">
                            <AlertTriangle size={18} className="mr-2"/>
                            Urgent Attention
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            {selectedRegion === 'All' ? 'Global critical issues' : `Critical issues in ${selectedRegion}`}
                        </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {metrics.urgentIncidents.length > 0 ? (
                            metrics.urgentIncidents.map((item, i) => (
                                <div key={i} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 hover:border-red-500/50 transition-colors group cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-mono text-slate-500">{item.number}</span>
                                        <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">{item.region}</span>
                                    </div>
                                    <h4 className="text-sm font-medium text-slate-200 mb-1 group-hover:text-white">{item.short_description}</h4>
                                    <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                                        <span>{item.assignment_group}</span>
                                        <ArrowUpRight size={14} className="text-slate-600 group-hover:text-indigo-400"/>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500">
                                <CheckCircle2 size={32} className="text-emerald-500 mb-2"/>
                                <p className="text-sm">No urgent issues in this view</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ORIGINAL CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-6">Incoming Incident Volume</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.timelineData}>
                      <defs>
                        <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} itemStyle={{ color: '#818cf8' }} />
                      <Area type="monotone" dataKey="incidents" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncidents)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-6">Priority Distribution</h3>
                <div className="h-64 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={metrics.priorityData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {metrics.priorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center -mt-4">
                    <span className="text-3xl font-bold text-white block">{metrics.total}</span>
                    <span className="text-xs text-slate-400">Tickets</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CATEGORY & TABLE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                 <h3 className="text-lg font-semibold text-white mb-6">Incidents by Category</h3>
                 <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.categoryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                      <XAxis type="number" stroke="#94a3b8" hide />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{fill: '#334155', opacity: 0.4}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                      <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                 </div>
              </div>

              <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                   <h3 className="text-lg font-semibold text-white">Recent Tickets</h3>
                   <span className="text-xs text-indigo-400 font-medium cursor-pointer hover:text-indigo-300">View All</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900/50 text-slate-200 uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-6 py-4">Number</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Priority</th>
                        <th className="px-6 py-4">Group</th>
                        <th className="px-6 py-4">Region</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {filteredData.slice(0, 5).map((ticket, i) => (
                        <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-indigo-400">{ticket.number}</td>
                          <td className="px-6 py-4 text-slate-300">
                            <div className="truncate max-w-[200px]" title={ticket.short_description}>{ticket.short_description}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${ticket.priority.includes('High') || ticket.priority.includes('Critical') ? 'bg-red-500/10 text-red-400 border-red-500/20' : ticket.priority.includes('Moderate') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                              {ticket.priority.replace(/[0-9] - /, '')}
                            </span>
                          </td>
                          <td className="px-6 py-4">{ticket.assignment_group}</td>
                          <td className="px-6 py-4">{ticket.region}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;