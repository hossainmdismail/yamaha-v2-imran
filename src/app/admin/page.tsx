'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Data states
  const [bikes, setBikes] = useState<any[]>([]);
  const [rules, setRules] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);

  useEffect(() => {
    // Check auth
    fetch('/api/admin/auth/me').then(res => {
      if (!res.ok) router.push('/admin/login');
      else {
        setLoading(false);
        fetchData();
      }
    });
  }, [router]);

  const fetchData = async () => {
    Promise.all([
      fetch('/api/admin/bikes').then(r => r.json()),
      fetch('/api/admin/rules').then(r => r.json()),
      fetch('/api/admin/prompts').then(r => r.json())
    ]).then(([b, r, p]) => {
      if (b.bikes) setBikes(b.bikes);
      if (r.rules) setRules(r.rules);
      if (p.prompts) setPrompts(p.prompts);
    });
  };

  const [newBike, setNewBike] = useState({ model_name: '', type: '' });
  const handleAddBike = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/bikes', {
      method: 'POST',
      body: JSON.stringify(newBike)
    });
    setNewBike({ model_name: '', type: '' });
    fetchData();
  };

  const [newRule, setNewRule] = useState({ trait_combination: '', assigned_bike_id: '' });
  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/rules', {
      method: 'POST',
      body: JSON.stringify(newRule)
    });
    setNewRule({ trait_combination: '', assigned_bike_id: '' });
    fetchData();
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <div className={styles.brand}>Yamaha AI Admin</div>
        <button className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`${styles.navItem} ${activeTab === 'bikes' ? styles.active : ''}`} onClick={() => setActiveTab('bikes')}>Bikes</button>
        <button className={`${styles.navItem} ${activeTab === 'rules' ? styles.active : ''}`} onClick={() => setActiveTab('rules')}>Rules</button>
        <button className={`${styles.navItem} ${activeTab === 'prompts' ? styles.active : ''}`} onClick={() => setActiveTab('prompts')}>Prompts</button>
      </div>

      <div className={styles.content}>
        {activeTab === 'overview' && (
          <div>
            <h1 className={styles.header}>Dashboard Overview</h1>
            <div className={styles.statGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{bikes.length}</div>
                <div className={styles.statLabel}>Configured Bikes</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{rules.length}</div>
                <div className={styles.statLabel}>Active Rules</div>
              </div>
            </div>
            {/* Additional metrics/leads would go here in a full app */}
          </div>
        )}

        {activeTab === 'bikes' && (
          <div>
            <h1 className={styles.header}>Manage Bikes</h1>
            <form onSubmit={handleAddBike} className={styles.formGrid}>
              <input placeholder="Model Name" value={newBike.model_name} onChange={e => setNewBike({...newBike, model_name: e.target.value})} required />
              <input placeholder="Type (e.g. Sport, Scooter)" value={newBike.type} onChange={e => setNewBike({...newBike, type: e.target.value})} required />
              <button type="submit" className="primary-button" style={{ gridColumn: 'span 2' }}>Add Bike</button>
            </form>

            <table className={styles.table}>
              <thead><tr><th>ID</th><th>Model</th><th>Type</th></tr></thead>
              <tbody>
                {bikes.map(b => <tr key={b.id}><td>{b.id}</td><td>{b.model_name}</td><td>{b.type}</td></tr>)}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'rules' && (
          <div>
            <h1 className={styles.header}>Manage Rules</h1>
            <form onSubmit={handleAddRule} className={styles.formGrid}>
              <input placeholder="Traits (comma separated)" value={newRule.trait_combination} onChange={e => setNewRule({...newRule, trait_combination: e.target.value})} required />
              <select value={newRule.assigned_bike_id} onChange={e => setNewRule({...newRule, assigned_bike_id: e.target.value})} required>
                <option value="">Select Bike...</option>
                {bikes.map(b => <option key={b.id} value={b.id}>{b.model_name}</option>)}
              </select>
              <button type="submit" className="primary-button" style={{ gridColumn: 'span 2' }}>Add Rule</button>
            </form>

            <table className={styles.table}>
              <thead><tr><th>ID</th><th>Trait Combination</th><th>Assigned Bike</th></tr></thead>
              <tbody>
                {rules.map(r => <tr key={r.id}><td>{r.id}</td><td>{r.trait_combination}</td><td>{r.model_name}</td></tr>)}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'prompts' && (
          <div>
            <h1 className={styles.header}>Manage Prompts</h1>
            <table className={styles.table}>
              <thead><tr><th>ID</th><th>Template</th><th>Active</th></tr></thead>
              <tbody>
                {prompts.map(p => <tr key={p.id}><td>{p.id}</td><td>{p.prompt_template.substring(0, 50)}...</td><td>{p.is_active ? 'Yes' : 'No'}</td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
