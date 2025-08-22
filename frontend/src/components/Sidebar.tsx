import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  ToggleLeft, 
  ToggleRight, 
  Flame, 
  Heart, 
  Users,
  ChevronDown,
  TrendingUp
} from 'lucide-react';
import { useCrowdStore } from '../store/crowdStore';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';



const SparklineChart: React.FC<{ data?: number[] }> = ({ data }) => {
  // Handle empty or undefined data
  if (!data || data.length === 0) {
    return (
      <div className="w-16 h-8 flex items-center justify-center text-xs text-gray-400">
        No Data
      </div>
    );
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="w-16 h-8 flex items-end space-x-0.5">
      {data.map((value, index) => (
        <motion.div
          key={index}
          className="w-1 bg-crowd-electric/60 rounded-t"
          style={{ height: `${((value - min) / range) * 100}%` }}
          initial={{ height: 0 }}
          animate={{ height: `${((value - min) / range) * 100}%` }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        />
      ))}
    </div>
  );
};

export default SparklineChart;

export const Sidebar: React.FC = () => {
  const {
    zones,
    showHeatmap,
    showTracks,
    showRoutes,
    toggleHeatmap,
    toggleTracks,
    toggleRoutes,
    sidebarCollapsed
  } = useCrowdStore();
  
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [expandedSection, setExpandedSection] = useState<string>('zones');

  const getDensityClass = (utilization: number) => {
    if (utilization >= 90) return 'density-critical';
    if (utilization >= 70) return 'density-warning';
    return 'density-safe';
  };

  const handleIncidentSimulation = (type: 'fire' | 'medical' | 'stampede') => {
    if (!selectedZone) return;
    
    console.log(`Simulating ${type} incident in zone ${selectedZone}`);
    // This would send POST /api/incidents/raise
  };

  const sidebarVariants = {
    expanded: { width: '320px' },
    collapsed: { width: '60px' }
  };

  return (
    <motion.aside
      className={`
        bg-crowd-surface border-r border-white/10 
        ${sidebarCollapsed ? 'w-16' : 'w-80'} 
        transition-all duration-300 ease-in-out
        flex flex-col h-full overflow-hidden flex-shrink-0
      `}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            className="p-4 space-y-6 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Zones Section */}
            <div className="space-y-3">
              <button
                onClick={() => setExpandedSection(expandedSection === 'zones' ? '' : 'zones')}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-semibold text-crowd-electric">Zones</h3>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform ${
                    expandedSection === 'zones' ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {expandedSection === 'zones' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    {zones.map((zone, index) => (
                      <motion.div
                        key={zone.id}
                        className={`p-3 rounded-lg border transition-all duration-200 hover:bg-crowd-surface/50 ${getDensityClass(zone.utilization)}`}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium text-sm">{zone.name}</span>
                          </div>
                          <SparklineChart data={zone.sparklineData} />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Density: {zone.density}</span>
                          <span>{zone.utilization}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-crowd-electric">Controls</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white font-medium">Show Heatmap</span>
                  <button onClick={toggleHeatmap} className="transition-colors">
                    {showHeatmap ? (
                      <ToggleRight className="w-6 h-6 text-crowd-electric toggle-active" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-white/70 hover:text-white" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white font-medium">Show Tracks</span>
                  <button onClick={toggleTracks} className="transition-colors">
                    {showTracks ? (
                      <ToggleRight className="w-6 h-6 text-crowd-electric toggle-active" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-white/70 hover:text-white" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white font-medium">Show Routes</span>
                  <button onClick={toggleRoutes} className="transition-colors">
                    {showRoutes ? (
                      <ToggleRight className="w-6 h-6 text-crowd-electric toggle-active" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-white/70 hover:text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>

          {/* Incident Simulation */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-crowd-electric">Simulate Incident</h3>
            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="bg-crowd-surface/50 border-white/20 text-foreground hover:bg-crowd-surface/70">
                <SelectValue placeholder="Select zone" className="text-foreground" />
              </SelectTrigger>
              <SelectContent className="bg-crowd-surface border-white/10">
                {zones.map((zone) => (
                  <SelectItem
                    key={zone.id}
                    value={zone.id}
                    className="text-white hover:bg-crowd-surface/50"
                  >
                    {zone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  className="border-red-400 bg-red-500/30 text-red-200 hover:bg-red-500/50 hover:border-red-300 hover:text-white justify-start transition-all duration-200 font-semibold"
                  onClick={() => handleIncidentSimulation('fire')}
                  disabled={!selectedZone}
                >
                  <Flame className="w-4 h-4 mr-2" />
                  Fire
                </Button>
                
                <Button
                  variant="outline"
                  className="border-yellow-400 bg-yellow-500/30 text-yellow-200 hover:bg-yellow-500/50 hover:border-yellow-300 hover:text-white justify-start transition-all duration-200 font-semibold"
                  onClick={() => handleIncidentSimulation('medical')}
                  disabled={!selectedZone}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Medical
                </Button>
                
                <Button
                  variant="outline"
                  className="border-blue-400 bg-blue-500/30 text-blue-200 hover:bg-blue-500/50 hover:border-blue-300 hover:text-white justify-start transition-all duration-200 font-semibold"
                  onClick={() => handleIncidentSimulation('stampede')}
                  disabled={!selectedZone}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Stampede
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed state icons */}
      {sidebarCollapsed && (
        <div className="p-2 space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-center">
            <MapPin className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-center">
            <TrendingUp className="w-5 h-5" />
          </Button>
        </div>
      )}
    </motion.aside>
  );
};
