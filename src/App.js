import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, Users, Smile, Sun } from 'lucide-react';

// --- Static Data ---
const staticData = [
    { id: 'NSW_ACT', region: 'New South Wales and Australian Capital Territory', ccCount: 119, ccParticipants: 2352, ccFriends: 1725, jygCount: 35, jygParticipants: 242, jygFriends: 188, scCount: 117, scParticipants: 612, scFriends: 156 },
    { id: 'NE_AU', region: 'North Eastern Australia', ccCount: 109, ccParticipants: 867, ccFriends: 706, jygCount: 47, jygParticipants: 225, jygFriends: 161, scCount: 150, scParticipants: 643, scFriends: 147 },
    { id: 'VIC_TAS', region: 'Victoria and Tasmania', ccCount: 81, ccParticipants: 724, ccFriends: 481, jygCount: 38, jygParticipants: 225, jygFriends: 130, scCount: 83, scParticipants: 466, scFriends: 142 },
    { id: 'WC_AU', region: 'Western and Central Australia', ccCount: 106, ccParticipants: 570, ccFriends: 404, jygCount: 60, jygParticipants: 352, jygFriends: 266, scCount: 239, scParticipants: 890, scFriends: 204 },
];

// --- Reusable Components ---
const MetricCard = ({ title, value, icon: Icon, iconBgColor }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</p>
    </div>
    <div className={`p-3 rounded-full ${iconBgColor}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const ActivityChart = ({ data }) => {
    // Mapping from full region name to abbreviation
    const regionAbbreviations = {
        'New South Wales and Australian Capital Territory': 'NSW&ACT',
        'North Eastern Australia': 'NEA',
        'Victoria and Tasmania': 'VIC&TAS',
        'Western and Central Australia': 'WCA',
    };

    const chartData = data.map(d => ({
        region: regionAbbreviations[d.region] || d.region, // Use abbreviation
        childrensClasses: d.ccCount,
        juniorYouthGroups: d.jygCount,
        studyCircles: d.scCount,
    }));

    return (
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Core Activities by Region</h3>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="region" stroke="#6b7280" interval={0} />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="childrensClasses" name="Children's Classes" fill="#34d399" />
                    <Bar dataKey="juniorYouthGroups" name="Junior Youth Groups" fill="#60a5fa" />
                    <Bar dataKey="studyCircles" name="Study Circles" fill="#fbbf24" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const ActivityDataTable = ({ data }) => {
    const totals = data.reduce((acc, curr) => {
        Object.keys(curr).forEach(key => {
            if (typeof curr[key] === 'number') {
                acc[key] = (acc[key] || 0) + curr[key];
            }
        });
        return acc;
    }, {});

    const dataToDisplay = [...data, { ...totals, region: 'Total', id: 'total' }];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md col-span-1 lg:col-span-3">
            <div className="flex justify-between items-center mb-4 px-2">
                 <h3 className="text-lg font-semibold text-gray-800">Detailed Activity Data</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th rowSpan="2" className="p-3 font-semibold border-b border-gray-200 align-bottom">Region</th>
                            <th colSpan="3" className="p-3 font-semibold border-b border-gray-200 text-center">Children's Classes</th>
                            <th colSpan="3" className="p-3 font-semibold border-b border-gray-200 text-center">Junior Youth Groups</th>
                            <th colSpan="3" className="p-3 font-semibold border-b border-gray-200 text-center">Study Circles</th>
                        </tr>
                        <tr className="bg-gray-50 text-gray-500">
                            <th className="p-2 font-medium border-b border-l border-gray-200 text-center">No.</th>
                            <th className="p-2 font-medium border-b border-gray-200 text-center">Participants</th>
                            <th className="p-2 font-medium border-b border-gray-200 text-center">Friends</th>
                            <th className="p-2 font-medium border-b border-l border-gray-200 text-center">No.</th>
                            <th className="p-2 font-medium border-b border-gray-200 text-center">Participants</th>
                            <th className="p-2 font-medium border-b border-gray-200 text-center">Friends</th>
                            <th className="p-2 font-medium border-b border-l border-gray-200 text-center">No.</th>
                            <th className="p-2 font-medium border-b border-gray-200 text-center">Participants</th>
                            <th className="p-2 font-medium border-b border-gray-200 text-center">Friends</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataToDisplay.map((row) => (
                            <tr key={row.id} className={`border-b border-gray-200 ${row.region === 'Total' ? 'bg-gray-100 font-bold' : 'bg-white'}`}>
                                <td className="p-3 text-gray-700">{row.region}</td>
                                {['ccCount', 'ccParticipants', 'ccFriends', 'jygCount', 'jygParticipants', 'jygFriends', 'scCount', 'scParticipants', 'scFriends'].map(field => (
                                    <td key={field} className="p-2 text-gray-600 text-center">
                                        {row[field]?.toLocaleString() || 0}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const ParticipantDistribution = ({ data }) => {
    if (!data || data.length === 0) return null;
    const totals = data.reduce((acc, curr) => ({
        ccParticipants: (acc.ccParticipants || 0) + curr.ccParticipants,
        jygParticipants: (acc.jygParticipants || 0) + curr.jygParticipants,
        scParticipants: (acc.scParticipants || 0) + curr.scParticipants,
    }), {});

    const participantDistributionData = [
        { name: 'Children\'s Classes', value: totals.ccParticipants, fill: '#34d399' },
        { name: 'Junior Youth Groups', value: totals.jygParticipants, fill: '#60a5fa' },
        { name: 'Study Circles', value: totals.scParticipants, fill: '#fbbf24' },
    ];
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Participant Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie data={participantDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                        {participantDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
             <div className="mt-4 flex flex-col items-center space-y-2">
                {participantDistributionData.map((entry) => (
                    <div key={entry.name} className="flex items-center text-sm">
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.fill }}></span>
                        <span className="text-gray-600">{entry.name}: <span className="font-medium">{entry.value.toLocaleString()}</span></span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Header = () => (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Baha'i Activity Dashboard</h1>
        <div className="flex items-center space-x-4">
             <img src="https://placehold.co/40x40/c4b5fd/4338ca?text=B" alt="User avatar" className="w-10 h-10 rounded-full"/>
        </div>
    </header>
);

// --- Main App Component ---
export default function App() {
    const [activityData, setActivityData] = useState([]);

    useEffect(() => {
        // This ensures all Tailwind styles are available in any environment.
        const script = document.createElement('script');
        script.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(script);

        setActivityData(staticData);
    }, []);

    const totals = activityData.reduce((acc, curr) => ({
        ccCount: (acc.ccCount || 0) + curr.ccCount,
        jygCount: (acc.jygCount || 0) + curr.jygCount,
        scCount: (acc.scCount || 0) + curr.scCount,
        totalParticipants: (acc.totalParticipants || 0) + curr.ccParticipants + curr.jygParticipants + curr.scParticipants
    }), { ccCount: 0, jygCount: 0, scCount: 0, totalParticipants: 0 });


  return (
    <div className="bg-gray-50 min-h-screen font-sans">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard title="Total Participants" value={totals.totalParticipants} icon={Users} iconBgColor="bg-indigo-500" />
                <MetricCard title="Children's Classes" value={totals.ccCount} icon={Smile} iconBgColor="bg-green-500" />
                <MetricCard title="Junior Youth Groups" value={totals.jygCount} icon={Sun} iconBgColor="bg-blue-500" />
                <MetricCard title="Study Circles" value={totals.scCount} icon={BookOpen} iconBgColor="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <ActivityChart data={activityData} />
                </div>
                <div className="space-y-8">
                    <ParticipantDistribution data={activityData} />
                </div>
                 <div className="lg:col-span-3">
                    <ActivityDataTable data={activityData} />
                </div>
            </div>
        </main>
    </div>
  );
}
