import React from 'react';
import { EnvelopeIcon, ClockIcon, ChartBarIcon } from '../../Icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


const smsData = [
    { name: 'Mon', sent: 120 },
    { name: 'Tue', sent: 150 },
    { name: 'Wed', sent: 90 },
    { name: 'Thu', sent: 200 },
    { name: 'Fri', sent: 180 },
    { name: 'Sat', sent: 50 },
    { name: 'Sun', sent: 20 },
];

const SmsCount: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[--card] p-5 rounded-xl shadow-sm border border-[--card-border]">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100">
                      <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                      <p className="text-sm text-[--text-secondary] font-medium">Sent This Month</p>
                      <p className="text-3xl font-bold text-[--text-primary]">4,520</p>
                  </div>
              </div>
          </div>
          <div className="bg-[--card] p-5 rounded-xl shadow-sm border border-[--card-border]">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100">
                      <ClockIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                      <p className="text-sm text-[--text-secondary] font-medium">Sent Today</p>
                      <p className="text-3xl font-bold text-[--text-primary]">180</p>
                  </div>
              </div>
          </div>
          <div className="bg-[--card] p-5 rounded-xl shadow-sm border border-[--card-border]">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-100">
                      <ChartBarIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                      <p className="text-sm text-[--text-secondary] font-medium">Remaining Credits</p>
                      <p className="text-3xl font-bold text-[--text-primary]">15,480</p>
                  </div>
              </div>
          </div>
      </div>
      <div className="bg-[--card] p-6 rounded-xl shadow-sm border border-[--card-border]">
        <h2 className="text-xl font-semibold text-[--text-primary] mb-4">Weekly SMS Usage</h2>
         <ResponsiveContainer width="100%" height={300}>
            <BarChart data={smsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'rgba(255, 107, 53, 0.1)'}}/>
              <Bar dataKey="sent" name="SMS Sent" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SmsCount;
