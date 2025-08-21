import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Check } from 'lucide-react';
import { useCrowdStore } from '../store/crowdStore';
import { Button } from './ui/button';

interface AnimatedCounterProps {
  value?: number;
  label: string;
  critical?: boolean;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value = 0,
  label,
  critical = false,
}) => (
  <motion.div
    className={`kpi-card ${critical ? 'kpi-critical' : ''}`}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <motion.div
      className={`text-3xl font-bold mb-2 ${
        critical ? 'text-crowd-critical' : 'text-crowd-electric'
      }`}
      key={value}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {Number(value || 0).toLocaleString()}
    </motion.div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </motion.div>
);

interface RightPanelProps {
  children?: React.ReactNode; // Optional children support
}

export const RightPanel: React.FC<RightPanelProps> = ({ children }) => {
  const { alerts, kpis, acknowledgeAlert } = useCrowdStore();

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-4 border-crowd-critical bg-crowd-critical/10';
      case 'high':
        return 'border-l-4 border-crowd-warning bg-crowd-warning/10';
      case 'medium':
        return 'border-l-4 border-crowd-electric bg-crowd-electric/10';
      default:
        return 'border-l-4 border-crowd-safe bg-crowd-safe/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-crowd-critical" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-crowd-warning" />;
      default:
        return <Clock className="w-4 h-4 text-crowd-electric" />;
    }
  };

  return (
    <motion.aside
      className="w-80 bg-crowd-surface border-l border-white/10 flex flex-col h-full overflow-hidden flex-shrink-0"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* KPIs Section */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-crowd-electric mb-4">
          Key Performance Indicators
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <AnimatedCounter value={kpis.totalPeople} label="Total People" />
          <AnimatedCounter
            value={kpis.zonesAbove70}
            label="Zones >70%"
            critical={kpis.zonesAbove70 > 5}
          />
          <AnimatedCounter
            value={kpis.zonesAbove90}
            label="Zones >90%"
            critical={kpis.zonesAbove90 > 0}
          />
          <AnimatedCounter
            value={kpis.alertsLast10Min}
            label="Alerts (10min)"
            critical={kpis.alertsLast10Min > 10}
          />
        </div>
      </div>

      {/* Alert Center */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-crowd-electric">Alert Center</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <motion.div
              className="text-center text-muted-foreground py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active alerts</p>
            </motion.div>
          ) : (
            alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                className={`p-3 rounded-lg ${getSeverityClass(alert.severity)} ${
                  alert.acknowledged ? 'opacity-50' : ''
                }`}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(alert.severity)}
                    <span className="font-medium text-sm">{alert.zone}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-sm mb-3">{alert.cause}</p>

                {!alert.acknowledged && (
                  <Button
                    size="sm"
                    className="btn-ack"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Acknowledge
                  </Button>
                )}

                {alert.acknowledged && (
                  <div className="flex items-center space-x-1 text-xs text-crowd-safe">
                    <Check className="w-3 h-3" />
                    <span>Acknowledged</span>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Optional children */}
      {children}
    </motion.aside>
  );
};
