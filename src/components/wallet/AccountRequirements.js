// src/components/wallet/AccountRequirements.js
export function AccountRequirements({ formData }) {
    const requirements = [
      {
        text: 'Username (3-20 characters)',
        met: formData.username.length >= 3 && formData.username.length <= 20
      },
      {
        text: 'Password (min 8 characters)',
        met: formData.password.length >= 8
      },
      {
        text: 'Include numbers and special characters',
        met: /\d/.test(formData.password) && /[!@#$%^&*]/.test(formData.password)
      },
      {
        text: 'Passwords match',
        met: formData.password && formData.password === formData.confirmPassword
      }
    ];
  
    return (
      <ul className="space-y-2">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <span className={req.met ? 'text-success' : 'text-muted-foreground'}>
              {req.met ? '✓' : '○'}
            </span>
            <span className={req.met ? 'text-foreground' : 'text-muted-foreground'}>
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    );
  }