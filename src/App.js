import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BookOpen, Baby, Sunrise, HandHeart, Clock, TrendingUp, LayoutDashboard } from 'lucide-react';

// --- Page Enum ---
const PAGES = {
    MAIN: 'Main Dashboard',
    SURVEY: 'Bi-Annual Survey Data',
};

// --- Data Last Updated ---
const lastUpdated = "June 16, 2025";

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


// --- Regional Static Data (Updated) ---
const staticData = [
    { id: 'NSW_ACT', region: 'New South Wales and Australia', dmCount: 932, dmParticipants: 5528, dmFriends: 1432, ccCount: 116, ccParticipants: 2316, ccFriends: 1705, jygCount: 32, jygParticipants: 213, jygFriends: 149, scCount: 116, scParticipants: 603, scFriends: 173 },
    { id: 'NE_AU', region: 'North Eastern Australia', dmCount: 445, dmParticipants: 2512, dmFriends: 684, ccCount: 112, ccParticipants: 878, ccFriends: 715, jygCount: 46, jygParticipants: 215, jygFriends: 154, scCount: 144, scParticipants: 613, scFriends: 145 },
    { id: 'VIC_TAS', region: 'Victoria and Tasmania', dmCount: 241, dmParticipants: 1475, dmFriends: 329, ccCount: 72, ccParticipants: 515, ccFriends: 262, jygCount: 39, jygParticipants: 225, jygFriends: 126, scCount: 84, scParticipants: 426, scFriends: 136 },
    { id: 'WC_AU', region: 'Western and Central Australia', dmCount: 330, dmParticipants: 1930, dmFriends: 688, ccCount: 111, ccParticipants: 603, ccFriends: 426, jygCount: 66, jygParticipants: 360, jygFriends: 266, scCount: 199, scParticipants: 728, scFriends: 208 },
];

// --- Bi-Annual Survey Data ---
const surveyData = [
  { period: 'Oct-19', sc: 716, scP: 2845, scF: 908, dm: 2130, dmP: 12989, dmF: 4112, cc: 571, ccP: 3598, ccF: 2656, jyg: 227, jygP: 1346, jygF: 976 },
  { period: 'Apr-20', sc: 701, scP: 2743, scF: 916, dm: 2152, dmP: 12104, dmF: 4069, cc: 609, ccP: 3812, ccF: 2785, jyg: 242, jygP: 1468, jygF: 1083 },
  { period: 'Oct-20', sc: 896, scP: 3749, scF: 968, dm: 2437, dmP: 14053, dmF: 4025, cc: 567, ccP: 3430, ccF: 2509, jyg: 212, jygP: 1285, jygF: 913 },
  { period: 'Apr-21', sc: 897, scP: 3726, scF: 931, dm: 2590, dmP: 14039, dmF: 4551, cc: 579, ccP: 3505, ccF: 2565, jyg: 223, jygP: 1384, jygF: 995 },
  { period: 'Oct-21', sc: 959, scP: 4240, scF: 998, dm: 2504, dmP: 13596, dmF: 4526, cc: 510, ccP: 3613, ccF: 2513, jyg: 209, jygP: 1309, jygF: 961 },
  { period: 'Apr-22', sc: 850, scP: 3657, scF: 820, dm: 2420, dmP: 12749, dmF: 4388, cc: 503, ccP: 3645, ccF: 2554, jyg: 220, jygP: 1336, jygF: 980 },
  { period: 'Oct-22', sc: 840, scP: 3658, scF: 848, dm: 2551, dmP: 13875, dmF: 4750, cc: 467, ccP: 3169, ccF: 2391, jyg: 194, jygP: 1248, jygF: 924 },
  { period: 'Apr-23', sc: 701, scP: 2872, scF: 742, dm: 2137, dmP: 13497, dmF: 4447, cc: 502, ccP: 4277, ccF: 2945, jyg: 179, jygP: 1155, jygF: 773 },
  { period: 'Oct-23', sc: 653, scP: 2575, scF: 637, dm: 2022, dmP: 12213, dmF: 3652, cc: 465, ccP: 3525, ccF: 2392, jyg: 196, jygP: 1229, jygF: 766 },
  { period: 'Apr-24', sc: 614, scP: 2572, scF: 672, dm: 2144, dmP: 12948, dmF: 3467, cc: 418, ccP: 2758, ccF: 2002, jyg: 193, jygP: 1139, jygF: 806 },
  { period: 'Oct-24', sc: 631, scP: 2794, scF: 770, dm: 1964, dmP: 12101, dmF: 3196, cc: 450, ccP: 4747, ccF: 3511, jyg: 193, jygP: 1154, jygF: 871 },
  { period: 'Apr-25', sc: 579, scP: 2552, scF: 655, dm: 1974, dmP: 11804, dmF: 3239, cc: 412, ccP: 4471, ccF: 3289, jyg: 180, jygP: 1027, jygF: 731 },
];


// --- Reusable Components ---
const NationalOverviewTable = ({ data }) => {
    const activities = [
        { name: "Devotional Meetings", data: data.devotionalMeetings, icon: HandHeart, color: 'bg-red-500' },
        { name: "Children's Classes", data: data.childrensClasses, icon: Baby, color: 'bg-green-500' },
        { name: "Junior Youth Groups", data: data.juniorYouthGroups, icon: Sunrise, color: 'bg-blue-500' },
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
        'New South Wales and Australia': 'NSW&ACT',
        'North Eastern Australia': 'NEA',
        'Victoria and Tasmania': 'VIC&TAS',
        'Western and Central Australia': 'WCA',
    };

    const chartData = data.map(d => ({
        region: regionAbbreviations[d.region] || d.region,
        devotionalMeetings: d.dmCount,
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
                    <Bar dataKey="devotionalMeetings" name="Devotional Meetings" fill="#ef4444" />
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
                            <th colSpan="3" className="p-3 font-semibold border-b border-gray-200 text-center">Devotional Meetings</th>
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
                            <th className="p-2 font-medium border-b border-l border-gray-200 text-center">No.</th>
                            <th className="p-2 font-medium border-b border-gray-200 text-center">Participants</th>
                            <th className="p-2 font-medium border-b border-gray-200 text-center">Friends</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataToDisplay.map((row) => (
                            <tr key={row.id} className={`border-b border-gray-200 ${row.region === 'Total' ? 'bg-gray-100 font-bold' : 'bg-white'}`}>
                                <td className="p-3 text-gray-700">{row.region}</td>
                                {['dmCount', 'dmParticipants', 'dmFriends', 'ccCount', 'ccParticipants', 'ccFriends', 'jygCount', 'jygParticipants', 'jygFriends', 'scCount', 'scParticipants', 'scFriends'].map(field => (
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
        dmParticipants: (acc.dmParticipants || 0) + curr.dmParticipants,
        ccParticipants: (acc.ccParticipants || 0) + curr.ccParticipants,
        jygParticipants: (acc.jygParticipants || 0) + curr.jygParticipants,
        scParticipants: (acc.scParticipants || 0) + curr.scParticipants,
    }), {});

    const participantDistributionData = [
        { name: 'Devotional Meetings', value: totals.dmParticipants, fill: '#ef4444' },
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

const Header = ({ updated, activePage, setActivePage }) => (
    <header className="bg-white shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                 <h1 className="text-xl font-bold text-gray-800">Baha'i Activity Dashboard</h1>
                 <div className="flex items-center space-x-4">
                     <div className="flex items-center text-sm text-gray-500">
                        <Clock size={16} className="mr-2" />
                        <span>Last Updated: {updated}</span>
                    </div>
                     <img src="https://placehold.co/40x40/c4b5fd/4338ca?text=B" alt="User avatar" className="w-10 h-10 rounded-full"/>
                </div>
            </div>
        </div>
         <nav className="border-t border-gray-200">
             <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-4">
                    <button onClick={() => setActivePage(PAGES.MAIN)} className={`flex items-center px-3 py-3 text-sm font-medium border-b-2 ${activePage === PAGES.MAIN ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        <LayoutDashboard size={16} className="mr-2" />
                        {PAGES.MAIN}
                    </button>
                     <button onClick={() => setActivePage(PAGES.SURVEY)} className={`flex items-center px-3 py-3 text-sm font-medium border-b-2 ${activePage === PAGES.SURVEY ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                         <TrendingUp size={16} className="mr-2" />
                        {PAGES.SURVEY}
                    </button>
                </div>
            </div>
        </nav>
    </header>
);

const TrendChart = ({ data, dataKey, name, colors }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{name} Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" interval={0} angle={-30} textAnchor="end" height={50} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={dataKey.count} name="Number" stroke={colors.count} strokeWidth={2} />
                <Line type="monotone" dataKey={dataKey.participants} name="Participants" stroke={colors.participants} strokeWidth={2} />
                <Line type="monotone" dataKey={dataKey.friends} name="Friends" stroke={colors.friends} strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);


const SurveyPage = () => {
    const trendColors = {
        count: '#8884d8',
        participants: '#82ca9d',
        friends: '#ffc658',
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">National Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <TrendChart data={surveyData} dataKey={{count: 'sc', participants: 'scP', friends: 'scF'}} name="Study Circles" colors={trendColors} />
                <TrendChart data={surveyData} dataKey={{count: 'dm', participants: 'dmP', friends: 'dmF'}} name="Devotional Meetings" colors={trendColors} />
                <TrendChart data={surveyData} dataKey={{count: 'cc', participants: 'ccP', friends: 'ccF'}} name="Children's Classes" colors={trendColors} />
                <TrendChart data={surveyData} dataKey={{count: 'jyg', participants: 'jygP', friends: 'jygF'}} name="Junior Youth Groups" colors={trendColors} />
            </div>
        </div>
    );
};

const MainPage = ({ activityData, milestoneData }) => (
    <>
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
    </>
);


// --- Main App Component ---
export default function App() {
    const [activityData, setActivityData] = useState([]);
    const [activePage, setActivePage] = useState(PAGES.MAIN);

    useEffect(() => {
        // This ensures all Tailwind styles are available in any environment.
        const script = document.createElement('script');
        script.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(script);

        setActivityData(staticData);
    }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
        <Header updated={lastUpdated} activePage={activePage} setActivePage={setActivePage} />
        <main className="p-4 sm:p-6 lg:p-8">
            {activePage === PAGES.MAIN && <MainPage activityData={activityData} milestoneData={milestoneData} />}
            {activePage === PAGES.SURVEY && <SurveyPage />}
        </main>
    </div>
  );
}
