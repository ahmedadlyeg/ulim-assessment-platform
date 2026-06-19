import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { currentUser } from '@/data/mockData';
import { User, Bell, Shield, Palette, Database, Globe, CheckCircle, Save } from 'lucide-react';

const settingSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'data', label: 'Data Management', icon: Database },
  { id: 'integrations', label: 'Integrations', icon: Globe },
];

export function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-4xl font-semibold text-[#0F172A] tracking-tight">Settings</h1>
        <p className="text-sm text-[#64748B] mt-1">Manage your account and application preferences</p>
      </div>
      <div className="flex gap-6">
        <div className="w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-3 sticky top-6">
            {settingSections.map(section => (
              <button key={section.id} onClick={() => setActiveSection(section.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeSection === section.id ? 'bg-[#DBEAFE] text-[#2563EB] font-medium' : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'}`}>
                <section.icon size={18} />{section.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {activeSection === 'profile' && <ProfileSettings />}
          {activeSection === 'notifications' && <NotificationSettings />}
          {activeSection === 'security' && <SecuritySettings />}
          {activeSection === 'appearance' && <AppearanceSettings />}
          {activeSection === 'data' && <DataSettings />}
          {activeSection === 'integrations' && <IntegrationSettings />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  const { addToast } = useApp();
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [department, setDepartment] = useState(currentUser.department || '');
  const [bio, setBio] = useState('');

  const handleSave = () => {
    addToast({ type: 'success', title: 'Profile Updated', message: 'Your profile has been saved successfully.' });
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
      <h2 className="text-lg font-semibold text-[#0F172A] mb-5">Profile Settings</h2>
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#F1F5F9]">
        <div className="w-16 h-16 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-xl font-semibold">{name.split(' ').map(n => n[0]).join('')}</div>
        <div>
          <p className="text-base font-semibold text-[#0F172A]">{name}</p>
          <p className="text-sm text-[#64748B]">{currentUser.role}</p>
          <p className="text-xs text-[#94A3B8]">{email}</p>
        </div>
        <button onClick={() => addToast({ type: 'info', title: 'Coming Soon', message: 'Avatar upload will be available soon.' })} className="btn-secondary text-xs h-8 px-3 ml-auto">Change Avatar</button>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="label">Full Name</label>
          <input className="input-field w-full" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input-field w-full" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Department</label>
          <input className="input-field w-full" value={department} onChange={e => setDepartment(e.target.value)} />
        </div>
        <div>
          <label className="label">Role</label>
          <input className="input-field w-full bg-[#F8FAFC]" value={currentUser.role} readOnly />
        </div>
        <div className="col-span-2">
          <label className="label">Bio</label>
          <textarea className="input-field w-full min-h-[80px] py-2" rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." />
        </div>
      </div>
      <div className="flex justify-end mt-6 pt-4 border-t border-[#F1F5F9]">
        <button onClick={handleSave} className="btn-primary text-sm"><Save size={14} className="mr-1.5" />Save Changes</button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const { addToast } = useApp();
  const [settings, setSettings] = useState({ emailInvitations: true, emailReminders: true, emailSubmissions: true, emailCompleted: true, inAppNotifications: true, dailyDigest: false, weeklyReport: true });
  const toggle = (key: keyof typeof settings) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
      <h2 className="text-lg font-semibold text-[#0F172A] mb-5">Notification Preferences</h2>
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-medium text-[#0F172A] mb-3">Email Notifications</h3>
          <div className="space-y-3">
            {[{ key: 'emailInvitations' as const, label: 'Assessment Invitations', desc: 'Receive emails when assigned to an assessment' }, { key: 'emailReminders' as const, label: 'Due Date Reminders', desc: 'Get reminded before assessment deadlines' }, { key: 'emailSubmissions' as const, label: 'Submission Notifications', desc: 'Notified when respondents submit assessments' }, { key: 'emailCompleted' as const, label: 'Assessment Completed', desc: 'Notified when an assessment event is completed' }].map(item => (
              <label key={item.key} className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={settings[item.key]} onChange={() => toggle(item.key)} className="w-[18px] h-[18px] rounded border-2 border-[#CBD5E1] text-[#2563EB] mt-0.5" /><div><p className="text-sm text-[#0F172A]">{item.label}</p><p className="text-xs text-[#64748B]">{item.desc}</p></div></label>
            ))}
          </div>
        </div>
        <div className="border-t border-[#F1F5F9] pt-5">
          <h3 className="text-sm font-medium text-[#0F172A] mb-3">In-App & Reports</h3>
          <div className="space-y-3">
            {[{ key: 'inAppNotifications' as const, label: 'In-App Notifications', desc: 'Show notifications within the application' }, { key: 'dailyDigest' as const, label: 'Daily Digest', desc: 'Receive a daily summary of activities' }, { key: 'weeklyReport' as const, label: 'Weekly Report', desc: 'Receive a weekly analytics report' }].map(item => (
              <label key={item.key} className="flex items-start gap-3 cursor-pointer"><input type="checkbox" checked={settings[item.key]} onChange={() => toggle(item.key)} className="w-[18px] h-[18px] rounded border-2 border-[#CBD5E1] text-[#2563EB] mt-0.5" /><div><p className="text-sm text-[#0F172A]">{item.label}</p><p className="text-xs text-[#64748B]">{item.desc}</p></div></label>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6 pt-4 border-t border-[#F1F5F9]">
        <button onClick={() => addToast({ type: 'success', title: 'Saved', message: 'Notification preferences updated.' })} className="btn-primary text-sm"><Save size={14} className="mr-1.5" />Save Preferences</button>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const { addToast } = useApp();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const updatePassword = () => {
    if (!currentPw || !newPw || !confirmPw) { addToast({ type: 'error', title: 'Error', message: 'All fields are required.' }); return; }
    if (newPw !== confirmPw) { addToast({ type: 'error', title: 'Error', message: 'Passwords do not match.' }); return; }
    addToast({ type: 'success', title: 'Password Updated', message: 'Your password has been changed.' });
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-5">Change Password</h2>
        <div className="space-y-4 max-w-md">
          <div><label className="label">Current Password</label><input type="password" className="input-field w-full" placeholder="Enter current password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} /></div>
          <div><label className="label">New Password</label><input type="password" className="input-field w-full" placeholder="Enter new password" value={newPw} onChange={e => setNewPw(e.target.value)} /></div>
          <div><label className="label">Confirm New Password</label><input type="password" className="input-field w-full" placeholder="Confirm new password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} /></div>
          <button onClick={updatePassword} className="btn-primary text-sm">Update Password</button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-5">Two-Factor Authentication</h2>
        <div className="flex items-center justify-between">
          <div><p className="text-sm text-[#0F172A] font-medium">Enable 2FA</p><p className="text-xs text-[#64748B]">Add an extra layer of security</p></div>
          <button onClick={() => addToast({ type: 'info', title: 'Coming Soon', message: '2FA will be available in the next release.' })} className="btn-secondary text-sm">Enable</button>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const { addToast } = useApp();
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
      <h2 className="text-lg font-semibold text-[#0F172A] mb-5">Appearance</h2>
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-medium text-[#0F172A] mb-3">Theme</h3>
          <div className="flex gap-3">
            {[{ id: 'light', label: 'Light', bg: 'bg-white' }, { id: 'dark', label: 'Dark', bg: 'bg-[#0F172A]' }, { id: 'system', label: 'System', bg: 'bg-gradient-to-br from-white to-[#0F172A]' }].map(theme => (
              <button key={theme.id} className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 ${theme.id === 'light' ? 'border-[#2563EB]' : 'border-[#E2E8F0]'} transition-colors`}>
                <div className={`w-12 h-8 rounded ${theme.bg} border border-[#E2E8F0]`} /><span className="text-xs text-[#0F172A]">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="border-t border-[#F1F5F9] pt-5">
          <h3 className="text-sm font-medium text-[#0F172A] mb-3">Density</h3>
          <div className="flex gap-2">
            {['Comfortable', 'Compact'].map(density => <button key={density} className={`px-4 py-2 rounded-lg text-sm border transition-colors ${density === 'Comfortable' ? 'border-[#2563EB] bg-[#DBEAFE] text-[#2563EB]' : 'border-[#E2E8F0] text-[#64748B]'}`}>{density}</button>)}
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6 pt-4 border-t border-[#F1F5F9]">
        <button onClick={() => addToast({ type: 'success', title: 'Saved', message: 'Appearance preferences updated.' })} className="btn-primary text-sm"><Save size={14} className="mr-1.5" />Save Preferences</button>
      </div>
    </div>
  );
}

function DataSettings() {
  const { addToast } = useApp();
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-5">Data Export</h2>
        <p className="text-sm text-[#64748B] mb-4">Export your assessment data for backup or analysis.</p>
        <div className="flex gap-3">
          <button onClick={() => addToast({ type: 'success', title: 'Exported', message: 'Assessment data exported to JSON.' })} className="btn-secondary text-sm">Export Assessments (JSON)</button>
          <button onClick={() => addToast({ type: 'success', title: 'Exported', message: 'Results exported to CSV.' })} className="btn-secondary text-sm">Export Results (CSV)</button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
        <h2 className="text-lg font-semibold text-[#0F172A] mb-5">Data Retention</h2>
        <div className="space-y-4">
          <div><label className="label">Keep assessment history for</label><select className="input-field w-48"><option>1 year</option><option>2 years</option><option>5 years</option><option>Indefinitely</option></select></div>
          <div><label className="label">Archive inactive templates after</label><select className="input-field w-48"><option>6 months</option><option>1 year</option><option>Never</option></select></div>
        </div>
      </div>
    </div>
  );
}

function IntegrationSettings() {
  const { addToast } = useApp();
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-layer1 p-6">
      <h2 className="text-lg font-semibold text-[#0F172A] mb-5">Integrations</h2>
      <p className="text-sm text-[#64748B] mb-5">Connect Ulim with your existing tools.</p>
      <div className="space-y-4">
        {[{ name: 'Microsoft Teams', desc: 'Send notifications via Teams', connected: false }, { name: 'Slack', desc: 'Get notified in Slack', connected: true }, { name: 'Jira', desc: 'Sync tasks with Jira', connected: false }, { name: 'SharePoint', desc: 'Store documents in SharePoint', connected: false }, { name: 'Google Drive', desc: 'Link evidence from Drive', connected: true }].map(integration => (
          <div key={integration.name} className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#64748B]"><Globe size={20} /></div>
              <div><p className="text-sm font-medium text-[#0F172A]">{integration.name}</p><p className="text-xs text-[#64748B]">{integration.desc}</p></div>
            </div>
            {integration.connected ? <div className="flex items-center gap-2"><span className="flex items-center gap-1 text-xs text-[#10B981] font-medium"><CheckCircle size={14} />Connected</span><button onClick={() => addToast({ type: 'info', title: 'Disconnected', message: `${integration.name} disconnected.` })} className="btn-text text-xs h-7 px-2">Disconnect</button></div> : <button onClick={() => addToast({ type: 'success', title: 'Connected', message: `${integration.name} connected successfully.` })} className="btn-secondary text-xs h-8 px-3">Connect</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
