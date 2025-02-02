// src/components/common/FormField.js
export function FormField({ 
    label, 
    type = 'text', 
    error, 
    showPasswordToggle,
    ...props 
  }) {
    const [showPassword, setShowPassword] = useState(false);
  
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            type={showPasswordToggle && showPassword ? "text" : type}
            className={`w-full bg-input/50 border ${
              error ? 'border-destructive' : 'border-input'
            } rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground
            focus:outline-none focus:border-primary`}
            {...props}
          />
          
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? '👁' : '👁‍🗨'}
            </button>
          )}
        </div>
  
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }