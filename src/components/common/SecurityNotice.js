// src/components/common/SecurityNotice.js
export function SecurityNotice({ 
    type = 'info', 
    title, 
    icon = type === 'warning' ? '⚠️' : '🛡️',
    children,
    className = '' 
  }) {
    const colors = {
      info: 'bg-primary/5 border-primary/20 text-primary',
      warning: 'bg-warning/10 border-warning/20 text-warning',
      error: 'bg-destructive/10 border-destructive/20 text-destructive'
    };
  
    return (
      <div className={`p-4 border rounded-lg ${colors[type]} ${className}`}>
        <div className="flex items-start gap-3">
          <span>{icon}</span>
          <div>
            {title && <h3 className="font-medium mb-2">{title}</h3>}
            {children}
          </div>
        </div>
      </div>
    );
  }