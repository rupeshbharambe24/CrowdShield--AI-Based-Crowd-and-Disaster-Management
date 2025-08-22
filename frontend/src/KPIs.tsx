interface Alert {
  type: string;
  zone?: number;
}

interface KPIsProps {
  alerts: Alert[];
}

const KPIs: React.FC<KPIsProps> = ({ alerts }) => {
  return (
    <div className="alerts">
      {alerts.map((a, idx) => (
        <p key={idx}>
          {a.type} in zone {a.zone ?? 'camera feed'}
        </p>
      ))}
    </div>
  );
};

export default KPIs;
