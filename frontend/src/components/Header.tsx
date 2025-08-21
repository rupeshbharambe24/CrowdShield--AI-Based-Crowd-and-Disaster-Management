
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Wifi, WifiOff, Menu } from 'lucide-react';
import { useCrowdStore } from '../store/crowdStore';
import { Button } from './ui/button';

export const Header: React.FC = () => {
  const { wsConnected, sidebarCollapsed, setSidebarCollapsed } = useCrowdStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <motion.header 
      className="h-16 glass-card border-b border-white/10 flex items-center justify-between px-6 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hover:bg-crowd-electric/10"
        >
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-crowd-electric" />
          <h1 className="text-2xl font-bold text-gradient-electric">
            CrowdShield
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <motion.div 
          className="flex items-center space-x-2"
          animate={{ scale: wsConnected ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 2, repeat: wsConnected ? Infinity : 0 }}
        >
          {wsConnected ? (
            <Wifi className="w-5 h-5 text-crowd-safe" />
          ) : (
            <WifiOff className="w-5 h-5 text-crowd-critical" />
          )}
          <span className={wsConnected ? 'status-connected' : 'status-disconnected'}>
            {wsConnected ? 'Connected' : 'Disconnected'}
          </span>
        </motion.div>

        <motion.div 
          className="font-mono text-lg text-crowd-electric"
          key={currentTime.getSeconds()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          {formatTime(currentTime)}
        </motion.div>
      </div>
    </motion.header>
  );
};
