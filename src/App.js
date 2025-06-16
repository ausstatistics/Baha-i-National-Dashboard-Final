import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, Smile, Sun, Heart } from 'lucide-react';

// --- National Data ---
const nationalData = {
    devotionalMeetings: { count: 1948, participants: 11445, friends: 3133 },
    childrensClasses: { count: 412, participants: 4321, friends: 3117 },
    juniorYouthGroups: { count: 184, participants: 1021, friends: 697 },
    studyCircles: { count: 544, participants: 2372, friends: 663 },
};

// --- Cluster Milestone Data ---
const milestoneData = [
    { title: "Total No. of Clusters", value: 68 },
    { title: "No. of Clusters with a Programme of Growth", value: 61 },
    { title: "No. of Clusters with an Intensive Programme of Growth", value: 55 },
    { title: "No. of Clusters where the Pattern of Activity Embraces Large Numbers", value: 22 },
];


// --- Regional Static Data ---
const staticData = [
    { id: 'NSW_ACT', region: 'New South Wales and Australian Capital Territory', ccCount: 119, ccParticipants: 2352, ccFriends: 1725, jygCount: 35, jygParticipants: 242, jygFriends: 188, scCount: 117, scParticipants: 612, scFriends: 156 },
    { id: 'NE_AU', region: 'North Eastern Australia', ccCount: 109, ccParticipants: 867, ccFriends: 706, jygCount: 47, jygParticipants: 225, jygFriends: 161, scCount: 150, scParticipants: 643, scFriends: 147 },
    { id: 'VIC_TAS', region: 'Victoria and Tasmania', ccCount: 81, ccParticipants: 724, ccFriends: 481, jygCount: 38, jygParticipants: 225, jygFriends: 130, scCount: 83, scParticipants: 466, scFriends: 142 },
    { id: 'WC_AU', region: 'Western and Central Australia', ccCount: 106, ccParticipants: 570, ccFriends: 404, jygCount: 60, jygParticipants: 352, jygFriends: 266, scCount: 239, scParticipants: 890, scFriends: 204 },
];

// --- Reusable Components ---
const NationalOverviewTable = ({ data }) => {
    const activities = [
        { name: "Devotional Meetings", data: data.devotionalMeetings, icon: Heart, color: 'bg-red-500' },
        { name: "Children's Classes", data: data.childrensClasses, icon: Smile, color: 'bg-green-500' },
        { name: "Junior Youth Groups", data: data.juniorYouthGroups, icon: Sun, color: 'bg-blue-500' },
        { name: "Study Circles", data: data.studyCircles, icon: BookOpen, color: 'bg-amber-500' },
    ];
    
    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 text-sm font-semibold text-gray-600">Activity</th>
                            <th className="p-3 text-sm font-semibold text-gray-600 text-center">Number</th>
                            <th className="p-3 text-sm font-semibold text-gray-600 text-center">Total Participants</th>
                            <th className="p-3 text-sm font-semibold text-gray-600 text-center">Friends of the Faith</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map(activity => (
                            <tr key={activity.name} className="border-b last:border-b-0">
                                <td className="p-3 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-full mr-3 ${activity.color}`}>
                                            <activity.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-medium text-gray-800">{activity.name}</span>
                                    </div>
                                </td>
                                <td className="p-3 text-center text-gray-700">{activity.data.count.toLocaleString()}</td>
                                <td className="p-3 text-center text-gray-700">{activity.data.participants.toLocaleString()}</td>
                                <td className="p-3 text-center text-gray-700">{activity.data.friends.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const MilestoneCard = ({ title, value }) => (
    <div className="bg-gray-100 rounded-lg shadow-inner p-4 text-center w-52 h-40 flex flex-col justify-center">
        <h4 className="text-sm font-semibold text-gray-600 flex-grow">{title}</h4>
        <p className="text-4xl font-bold text-gray-800">{value}</p>
    </div>
);

const MilestoneArrow = () => (
    <div className="text-center text-gray-400 mx-2 sm:mx-4 my-2 sm:my-0">
         <svg className="w-8 h-8 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
        </svg>
        <p className="text-xs mt-1">of these</p>
    </div>
);


const ClusterMilestones = ({data}) => {
    return (
        <div className="flex flex-col xl:flex-row items-center justify-around space-y-4 xl:space-y-0 xl:space-x-2">
            {data.map((milestone, index) => (
                <React.Fragment key={index}>
                    <MilestoneCard title={milestone.title} value={milestone.value} />
                    {index < data.length - 1 && <MilestoneArrow />}
                </React.Fragment>
            ))}
        </div>
    );
};


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
                 <h3 className="text-lg font-semibold text-gray-800">Detailed Regional Data</h3>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Regional Participant Distribution</h3>
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

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
             <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Cluster Milestone Development</h2>
                <ClusterMilestones data={milestoneData} />
            </div>

            <hr className="my-8 border-gray-300"/>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">National Overview</h2>
                <NationalOverviewTable data={nationalData} />
            </div>

            <hr className="my-8 border-gray-300"/>

            <div>
                 <h2 className="text-2xl font-bold text-gray-700 mb-4">Regional Breakdown</h2>
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
            </div>
        </main>
    </div>
  );
}
